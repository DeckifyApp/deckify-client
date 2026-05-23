import { useNavigation } from '@react-navigation/native';
import { CalendarClock, Layers3, TimerReset } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { AppHeader } from '../components/AppHeader';
import { AppText } from '../components/AppText';
import { DarkScreen } from '../components/DarkScreen';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../constants/theme';
import { deck } from '../data/appData';
import type { CardStatus } from '../data/appData';
import type { RootNavigation } from '../types/navigation';

const statusMeta: Record<CardStatus, { background: string; color: string; label: string }> = {
  due: {
    background: 'rgba(255,92,92,0.16)',
    color: colors.red,
    label: 'Revisar',
  },
  learning: {
    background: 'rgba(245,180,75,0.16)',
    color: colors.orange,
    label: 'Aprendendo',
  },
  ready: {
    background: 'rgba(33,198,134,0.16)',
    color: colors.green,
    label: 'Pronto',
  },
};

function DeckStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-1 rounded-[18px] bg-deck-card p-4">
      {icon}
      <AppText className="mt-3 text-[22px] leading-[25px] text-white" weight="black">
        {value}
      </AppText>
      <AppText className="mt-1 text-[11px] text-deck-muted" weight="bold">
        {label}
      </AppText>
    </View>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <View className="mr-2 rounded-full bg-deck-soft px-3 py-2">
      <AppText className="text-[11px] text-deck-muted" weight="bold">
        {label}
      </AppText>
    </View>
  );
}

function MiniCard({ card }: { card: (typeof deck.cards)[number] }) {
  const navigation = useNavigation<RootNavigation>();
  const meta = statusMeta[card.status];

  return (
    <Pressable
      accessibilityRole="button"
      className="mb-3 w-[48%] rounded-[20px] bg-deck-card p-4 active:opacity-90"
      onPress={() => navigation.navigate('CardDetails')}
    >
      <View className="mb-4 flex-row items-center justify-between">
        <AppText className="text-[11px] text-deck-muted" weight="bold">
          Card {card.index}
        </AppText>
        <View className="rounded-full px-2 py-1" style={{ backgroundColor: meta.background }}>
          <AppText className="text-[9px]" style={{ color: meta.color }} weight="black">
            {meta.label}
          </AppText>
        </View>
      </View>
      <AppText className="min-h-[82px] text-[15px] leading-[21px] text-white" numberOfLines={4} weight="bold">
        {card.title}
      </AppText>
    </Pressable>
  );
}

export function DeckOverviewScreen() {
  const navigation = useNavigation<RootNavigation>();

  return (
    <DarkScreen activeTab="library" scroll>
      <AppHeader />
      <View className="mb-5">
        <AppText className="text-[34px] leading-[39px] text-white" weight="black">
          {deck.title}
        </AppText>
        <AppText className="mt-2 text-[13px] text-deck-muted" weight="medium">
          {deck.subtitle}
        </AppText>
        <AppText className="mt-4 text-[14px] leading-[22px] text-deck-muted" weight="medium">
          {deck.description}
        </AppText>
      </View>

      <View className="mb-5 flex-row">
        {deck.tags.map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
      </View>

      <View className="mb-5 flex-row gap-3">
        <DeckStat
          icon={<Layers3 color={colors.purpleSoft} size={21} strokeWidth={2.2} />}
          label="cards"
          value={`${deck.cardsTotal}`}
        />
        <DeckStat
          icon={<TimerReset color={colors.green} size={21} strokeWidth={2.2} />}
          label="tempo médio"
          value={deck.averageTime}
        />
        <DeckStat
          icon={<CalendarClock color={colors.orange} size={21} strokeWidth={2.2} />}
          label="perguntas"
          value={`${deck.questions}`}
        />
      </View>

      <View className="mb-5 rounded-[22px] bg-deck-card p-5">
        <View className="mb-3 flex-row items-center justify-between">
          <AppText className="text-[17px] text-white" weight="bold">
            Progresso do deck
          </AppText>
          <AppText className="text-[13px] text-deck-purple" weight="black">
            {deck.progress}%
          </AppText>
        </View>
        <View className="h-2 rounded-full bg-white/10">
          <View className="h-2 rounded-full bg-deck-purple" style={{ width: `${deck.progress}%` }} />
        </View>
        <View className="mt-4 flex-row justify-between">
          <AppText className="text-[12px] text-deck-muted" weight="bold">
            Próxima revisão
          </AppText>
          <AppText className="text-[12px] text-white" weight="black">
            {deck.nextReview}
          </AppText>
        </View>
      </View>

      <View className="mb-3 flex-row items-center justify-between">
        <AppText className="text-[19px] text-white" weight="bold">
          Cards principais
        </AppText>
        <Pressable onPress={() => navigation.navigate('DeckEdit')}>
          <AppText className="text-[12px] text-deck-purple" weight="black">
            Editar
          </AppText>
        </Pressable>
      </View>
      <View className="flex-row flex-wrap justify-between">
        {deck.cards.map((card) => (
          <MiniCard key={card.index} card={card} />
        ))}
      </View>

      <View className="mt-2 flex-row gap-3">
        <PrimaryButton className="flex-1" onPress={() => navigation.navigate('StudyQuestion')} weight="black">
          Iniciar
        </PrimaryButton>
        <PrimaryButton
          className="flex-1 border border-deck-purple bg-transparent"
          labelClassName="text-[16px] text-deck-purple"
          onPress={() => navigation.navigate('DeckEdit')}
          weight="black"
        >
          Editar
        </PrimaryButton>
      </View>
    </DarkScreen>
  );
}
