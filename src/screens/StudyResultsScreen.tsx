import { useNavigation } from '@react-navigation/native';
import { Check, Clock3, RotateCcw, Trophy } from 'lucide-react-native';
import { View } from 'react-native';

import { AppHeader } from '../components/AppHeader';
import { AppText } from '../components/AppText';
import { DarkScreen } from '../components/DarkScreen';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../constants/theme';
import { deck, schedule, weekPlan } from '../data/appData';
import type { RootNavigation } from '../types/navigation';

function MetricTile({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <View className="flex-1 rounded-[18px] bg-deck-card p-4">
      <AppText className="text-[25px] leading-[29px]" style={{ color }} weight="black">
        {value}
      </AppText>
      <AppText className="mt-1 text-[11px] text-deck-muted" weight="bold">
        {label}
      </AppText>
    </View>
  );
}

function TaskRow({ done, title, time }: { done: boolean; time: string; title: string }) {
  return (
    <View className="mb-3 flex-row items-center justify-between rounded-[16px] bg-deck-soft px-4 py-3">
      <View className="flex-1 pr-3">
        <AppText className="text-[13px] text-white" numberOfLines={1} weight="bold">
          {title}
        </AppText>
        <AppText className="mt-1 text-[11px] text-deck-muted" weight="medium">
          {done ? 'Concluído hoje' : 'Agendado'}
        </AppText>
      </View>
      {done ? (
        <View className="h-8 w-8 items-center justify-center rounded-full bg-deck-green">
          <Check color={colors.black} size={18} strokeWidth={3} />
        </View>
      ) : (
        <AppText className="text-[12px] text-deck-muted" weight="black">
          {time}
        </AppText>
      )}
    </View>
  );
}

export function StudyResultsScreen() {
  const navigation = useNavigation<RootNavigation>();
  const accuracy = Math.round((deck.stats.correct / deck.cardsTotal) * 100);

  return (
    <DarkScreen activeTab="chart" scroll>
      <AppHeader />

      <View className="mb-5">
        <AppText className="text-[31px] leading-[36px] text-white" weight="black">
          Sessão concluída
        </AppText>
        <AppText className="mt-2 text-[14px] leading-[21px] text-deck-muted" weight="medium">
          Você fechou a revisão de {deck.shortTitle} e já tem a próxima fila organizada.
        </AppText>
      </View>

      <View className="rounded-[28px] bg-deck-purple p-5">
        <View className="mb-6 flex-row items-center justify-between">
          <View className="h-12 w-12 items-center justify-center rounded-[17px] bg-white/15">
            <Trophy color="white" size={24} strokeWidth={2.2} />
          </View>
          <View className="rounded-full bg-white/15 px-3 py-2">
            <AppText className="text-[11px] text-white" weight="black">
              {deck.totalTime} de foco
            </AppText>
          </View>
        </View>
        <AppText className="text-[48px] leading-[52px] text-white" weight="black">
          {accuracy}%
        </AppText>
        <AppText className="mt-1 text-[15px] text-white/80" weight="bold">
          de acerto nesta sessão
        </AppText>
        <View className="mt-6 h-2 rounded-full bg-white/20">
          <View className="h-2 rounded-full bg-white" style={{ width: `${accuracy}%` }} />
        </View>
      </View>

      <View className="mt-4 flex-row gap-3">
        <MetricTile color={colors.green} label="acertos" value={`${deck.stats.correct}`} />
        <MetricTile color={colors.orange} label="parciais" value={`${deck.stats.partial}`} />
        <MetricTile color={colors.red} label="erros" value={`${deck.stats.missed}`} />
      </View>

      <View className="mt-4 rounded-[22px] bg-deck-card p-5">
        <View className="mb-4 flex-row items-center justify-between">
          <View>
            <AppText className="text-[17px] text-white" weight="bold">
              Meta diária
            </AppText>
            <AppText className="mt-1 text-[12px] text-deck-muted" weight="medium">
              Sequência preservada até sexta
            </AppText>
          </View>
          <RotateCcw color={colors.purpleSoft} size={22} strokeWidth={2.2} />
        </View>
        <View className="flex-row justify-between">
          {weekPlan.map((day) => {
            const active = day.state === 'today';
            const complete = day.state === 'done';

            return (
              <View
                key={day.date}
                className="h-10 w-10 items-center justify-center rounded-[13px]"
                style={{ backgroundColor: active ? colors.purple : complete ? colors.green : colors.cardMuted }}
              >
                {active ? (
                  <Check color="white" size={18} strokeWidth={3} />
                ) : (
                  <AppText className="text-[12px] text-white" weight="black">
                    {day.date}
                  </AppText>
                )}
              </View>
            );
          })}
        </View>
      </View>

      <View className="mt-5 flex-row gap-3">
        <View className="flex-1 rounded-[22px] bg-deck-card p-4">
          <View className="mb-4 flex-row items-center gap-2">
            <Check color={colors.green} size={17} strokeWidth={2.4} />
            <AppText className="text-[15px] text-white" weight="bold">
              Hoje
            </AppText>
          </View>
          {schedule.today.map((item) => (
            <TaskRow key={item.deck} done={item.done} time={item.time} title={item.deck} />
          ))}
        </View>
        <View className="flex-1 rounded-[22px] bg-deck-card p-4">
          <View className="mb-4 flex-row items-center gap-2">
            <Clock3 color={colors.blue} size={17} strokeWidth={2.4} />
            <AppText className="text-[15px] text-white" weight="bold">
              Amanhã
            </AppText>
          </View>
          {schedule.tomorrow.map((item) => (
            <TaskRow key={item.deck} done={item.done} time={item.time} title={item.deck} />
          ))}
        </View>
      </View>

      <PrimaryButton className="mt-6" onPress={() => navigation.navigate('DeckOverview')} weight="black">
        Ver detalhes do deck
      </PrimaryButton>
    </DarkScreen>
  );
}
