import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpenText, ChevronRight, Clock3, Flame, Star } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';

import { AppHeader } from '../components/AppHeader';
import { AppText } from '../components/AppText';
import { DarkScreen } from '../components/DarkScreen';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../constants/theme';
import { deck, recommendations, user, weekPlan } from '../data/appData';
import type { RootNavigation } from '../types/navigation';

function DashboardMetric({
  color,
  icon,
  label,
  value,
}: {
  color: string;
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-1 rounded-[18px] bg-deck-card p-4">
      <View className="mb-3 h-9 w-9 items-center justify-center rounded-[12px]" style={{ backgroundColor: color }}>
        {icon}
      </View>
      <AppText className="text-[22px] leading-[26px] text-white" weight="black">
        {value}
      </AppText>
      <AppText className="mt-1 text-[11px] leading-[16px] text-deck-muted" weight="medium">
        {label}
      </AppText>
    </View>
  );
}

function WeeklyProgressCard() {
  return (
    <LinearGradient
      colors={['#262A63', '#171D2A']}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={{ borderRadius: 24, padding: 18 }}
    >
      <View className="mb-5 flex-row items-center justify-between">
        <View>
          <AppText className="text-[18px] text-white" weight="bold">
            Plano da semana
          </AppText>
          <AppText className="mt-1 text-[12px] text-white/60" weight="medium">
            {deck.stats.partial} revisões parciais e {deck.stats.missed} pendentes
          </AppText>
        </View>
        <View className="rounded-full bg-white/10 px-3 py-2">
          <AppText className="text-[12px] text-white" weight="black">
            {deck.progress}%
          </AppText>
        </View>
      </View>

      <View className="flex-row justify-between">
        {weekPlan.map((item) => {
          const isToday = item.state === 'today';
          const isDone = item.state === 'done';
          const isLate = item.state === 'late';

          return (
            <View key={item.date} className="items-center">
              <AppText className="mb-2 text-[10px] text-white/55" weight="bold">
                {item.day}
              </AppText>
              <View
                className="h-10 w-10 items-center justify-center rounded-[13px]"
                style={{
                  backgroundColor: isToday
                    ? colors.purple
                    : isDone
                      ? colors.green
                      : isLate
                        ? colors.orange
                        : 'rgba(255,255,255,0.08)',
                }}
              >
                <AppText className={`text-[13px] ${isLate || isDone || isToday ? 'text-[#0E1117]' : 'text-white'}`} weight="black">
                  {item.date}
                </AppText>
              </View>
            </View>
          );
        })}
      </View>
    </LinearGradient>
  );
}

function ContinueDeckCard() {
  const navigation = useNavigation<RootNavigation>();
  const completed = `${user.completedToday}/${user.dailyGoal}`;

  return (
    <Pressable
      accessibilityRole="button"
      className="rounded-[24px] bg-deck-card p-5 active:opacity-90"
      onPress={() => navigation.navigate('DeckOverview')}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-4">
          <AppText className="text-[12px] text-deck-muted" weight="bold">
            Continuar agora
          </AppText>
          <AppText className="mt-2 text-[25px] leading-[30px] text-white" weight="black">
            {deck.title}
          </AppText>
          <AppText className="mt-2 text-[13px] leading-[20px] text-deck-muted" weight="medium">
            {deck.description}
          </AppText>
        </View>
        <View className="h-12 w-12 items-center justify-center rounded-[16px] bg-deck-purple">
          <BookOpenText color="white" size={22} strokeWidth={2.2} />
        </View>
      </View>

      <View className="mb-4 mt-5 h-2 rounded-full bg-white/10">
        <View className="h-2 rounded-full bg-deck-green" style={{ width: `${deck.progress}%` }} />
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-row gap-3">
          <View>
            <AppText className="text-[18px] text-white" weight="black">
              {completed}
            </AppText>
            <AppText className="text-[10px] text-deck-muted" weight="bold">
              cards hoje
            </AppText>
          </View>
          <View>
            <AppText className="text-[18px] text-white" weight="black">
              {deck.nextReview}
            </AppText>
            <AppText className="text-[10px] text-deck-muted" weight="bold">
              próxima revisão
            </AppText>
          </View>
        </View>
        <ChevronRight color={colors.muted} size={22} strokeWidth={2} />
      </View>
    </Pressable>
  );
}

function RecommendationCard({ item }: { item: (typeof recommendations)[number] }) {
  return (
    <View className="mr-4 w-[260px] rounded-[20px] bg-deck-card p-5">
      <View className="mb-5 flex-row">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={`${item.title}-${index}`}
            color={index < item.rating ? colors.orange : colors.cardMuted}
            fill={index < item.rating ? colors.orange : 'transparent'}
            size={18}
          />
        ))}
      </View>
      <AppText className="text-[18px] leading-[24px] text-white" weight="bold">
        {item.title}
      </AppText>
      <AppText className="mt-2 text-[12px] leading-[18px] text-deck-muted" weight="medium">
        {item.subtitle}
      </AppText>
      <View className="mt-5 flex-row items-center">
        <Image className="h-9 w-9 rounded-full" source={{ uri: user.avatarUrl }} />
        <View className="ml-3">
          <AppText className="text-[12px] text-white" weight="bold">
            {item.author}
          </AppText>
          <AppText className="text-[11px] text-deck-muted" weight="medium">
            Curadoria Deckify
          </AppText>
        </View>
      </View>
    </View>
  );
}

export function HomeScreen() {
  const navigation = useNavigation<RootNavigation>();

  return (
    <DarkScreen scroll>
      <AppHeader />
      <View className="mb-6 flex-row items-center justify-between">
        <View>
          <AppText className="text-[26px] leading-[31px] text-white" weight="black">
            Olá, {user.name}
          </AppText>
          <AppText className="mt-1 text-[14px] text-deck-muted" weight="medium">
            Sua fila de revisão está pronta.
          </AppText>
        </View>
        <Image className="h-12 w-12 rounded-[18px]" source={{ uri: user.avatarUrl }} />
      </View>

      <View className="mb-4 flex-row gap-3">
        <DashboardMetric
          color="rgba(33,198,134,0.18)"
          icon={<Flame color={colors.green} size={19} strokeWidth={2.4} />}
          label="dias de sequência"
          value={`${user.streakDays}`}
        />
        <DashboardMetric
          color="rgba(81,167,255,0.18)"
          icon={<Clock3 color={colors.blue} size={19} strokeWidth={2.4} />}
          label="minutos focados"
          value={`${user.focusMinutes}`}
        />
      </View>

      <WeeklyProgressCard />

      <View className="mb-3 mt-7 flex-row items-center justify-between">
        <AppText className="text-[19px] text-white" weight="bold">
          Próxima sessão
        </AppText>
        <Pressable onPress={() => navigation.navigate('DeckOverview')}>
          <AppText className="text-[12px] text-deck-purple" weight="black">
            Ver deck
          </AppText>
        </Pressable>
      </View>
      <ContinueDeckCard />

      <View className="mb-3 mt-7 flex-row items-center justify-between">
        <AppText className="text-[19px] text-white" weight="bold">
          Recomendados
        </AppText>
        <AppText className="text-[12px] text-deck-muted" weight="bold">
          Baseado no seu plano
        </AppText>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mr-6">
        {recommendations.map((item) => (
          <RecommendationCard key={item.title} item={item} />
        ))}
      </ScrollView>

      <PrimaryButton className="mt-7" onPress={() => navigation.navigate('StudyQuestion')} weight="black">
        Iniciar revisão de hoje
      </PrimaryButton>
    </DarkScreen>
  );
}
