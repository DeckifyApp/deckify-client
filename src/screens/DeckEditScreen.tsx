import { useNavigation } from '@react-navigation/native';
import { ChevronRight, Edit3, Plus, Save, X } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { AppHeader } from '../components/AppHeader';
import { AppText } from '../components/AppText';
import { DarkScreen } from '../components/DarkScreen';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../constants/theme';
import { deck } from '../data/appData';
import type { RootNavigation } from '../types/navigation';

function Tag({ label }: { label: string }) {
  return (
    <View className="mb-2 mr-2 flex-row items-center gap-1 rounded-full bg-deck-soft px-3 py-2">
      <AppText className="text-[11px] text-deck-muted" weight="bold">
        {label}
      </AppText>
      <X color={colors.muted} size={12} strokeWidth={2.2} />
    </View>
  );
}

function CardRow({ card }: { card: (typeof deck.cards)[number] }) {
  const navigation = useNavigation<RootNavigation>();

  return (
    <Pressable
      accessibilityRole="button"
      className="mb-3 flex-row items-center justify-between rounded-[18px] bg-deck-card px-4 py-4 active:opacity-85"
      onPress={() => navigation.navigate('CardDetails')}
    >
      <View className="flex-1 pr-3">
        <AppText className="text-[11px] text-deck-muted" weight="bold">
          Card {card.index}
        </AppText>
        <AppText className="mt-1 text-[15px] leading-[20px] text-white" numberOfLines={2} weight="bold">
          {card.title}
        </AppText>
      </View>
      <ChevronRight color={colors.muted} size={22} strokeWidth={1.8} />
    </Pressable>
  );
}

export function DeckEditScreen() {
  const navigation = useNavigation<RootNavigation>();

  return (
    <DarkScreen activeTab="plus" scroll>
      <AppHeader />

      <View className="mb-5 flex-row items-start justify-between">
        <View className="flex-1 pr-4">
          <AppText className="text-[29px] leading-[34px] text-white" weight="black">
            {deck.title}
          </AppText>
          <AppText className="mt-2 text-[13px] text-deck-muted" weight="medium">
            Organize cartões, tags e contexto do seu plano.
          </AppText>
        </View>
        <Pressable
          accessibilityLabel="Editar título"
          accessibilityRole="button"
          className="h-11 w-11 items-center justify-center rounded-[16px] bg-deck-soft"
          onPress={() => navigation.navigate('CardEdit')}
        >
          <Edit3 color="white" size={20} strokeWidth={2.1} />
        </Pressable>
      </View>

      <View className="mb-5 rounded-[22px] bg-deck-card p-5">
        <View className="mb-4 flex-row items-center justify-between">
          <AppText className="text-[17px] text-white" weight="bold">
            Tags do deck
          </AppText>
          <Pressable className="h-8 w-8 items-center justify-center rounded-full bg-deck-purple">
            <Plus color="white" size={18} strokeWidth={2.3} />
          </Pressable>
        </View>
        <View className="flex-row flex-wrap">
          {deck.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </View>
      </View>

      <View className="mb-4 flex-row items-center justify-between">
        <AppText className="text-[19px] text-white" weight="bold">
          Cards
        </AppText>
        <Pressable className="flex-row items-center gap-2" onPress={() => navigation.navigate('CardEdit')}>
          <Plus color={colors.purple} size={17} strokeWidth={2.4} />
          <AppText className="text-[12px] text-deck-purple" weight="black">
            Novo card
          </AppText>
        </Pressable>
      </View>

      {deck.cards.map((card) => (
        <CardRow key={card.index} card={card} />
      ))}

      <View className="mt-2 rounded-[22px] bg-deck-card p-5">
        <AppText className="text-[17px] text-white" weight="bold">
          Contexto de estudo
        </AppText>
        <View className="mt-4 rounded-[16px] bg-deck-soft px-4 py-3">
          <AppText className="text-[11px] text-deck-muted" weight="bold">
            Tópico
          </AppText>
          <AppText className="mt-1 text-[14px] text-white" weight="bold">
            {deck.topic}
          </AppText>
        </View>
        <View className="mt-3 rounded-[16px] bg-deck-soft px-4 py-3">
          <AppText className="text-[11px] text-deck-muted" weight="bold">
            Roadmap
          </AppText>
          <AppText className="mt-1 text-[14px] text-white" weight="bold">
            {deck.roadmap}
          </AppText>
        </View>
      </View>

      <PrimaryButton className="mt-6" onPress={() => navigation.navigate('DeckOverview')} weight="black">
        <View className="flex-row items-center gap-2">
          <Save color="white" size={18} strokeWidth={2.3} />
          <AppText className="text-[16px] text-white" weight="black">
            Salvar deck
          </AppText>
        </View>
      </PrimaryButton>
    </DarkScreen>
  );
}
