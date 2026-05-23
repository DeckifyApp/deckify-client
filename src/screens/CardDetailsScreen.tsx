import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Edit3 } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { AppHeader } from '../components/AppHeader';
import { AppText } from '../components/AppText';
import { DarkScreen } from '../components/DarkScreen';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../constants/theme';
import { deck } from '../data/appData';
import type { RootNavigation } from '../types/navigation';

function DetailBox({ accent, body, title }: { accent: string; body: string; title: string }) {
  const navigation = useNavigation<RootNavigation>();

  return (
    <View className="mb-4 rounded-[24px] bg-deck-card p-5">
      <View className="mb-8 flex-row items-center justify-between">
        <View>
          <AppText className="text-[12px] text-deck-muted" weight="bold">
            {title}
          </AppText>
          <View className="mt-2 h-1 w-12 rounded-full" style={{ backgroundColor: accent }} />
        </View>
        <Pressable
          accessibilityLabel={`Editar ${title}`}
          accessibilityRole="button"
          className="h-10 w-10 items-center justify-center rounded-[14px] bg-deck-soft"
          onPress={() => navigation.navigate('CardEdit')}
        >
          <Edit3 color="white" size={18} strokeWidth={2} />
        </Pressable>
      </View>
      <AppText className="text-[23px] leading-[33px] text-white" weight="bold">
        {body}
      </AppText>
    </View>
  );
}

export function CardDetailsScreen() {
  const navigation = useNavigation<RootNavigation>();
  const card = deck.cards[0];

  return (
    <DarkScreen activeTab="plus" scroll>
      <AppHeader />
      <View className="mb-6 flex-row items-center justify-between">
        <Pressable className="flex-row items-center gap-2" onPress={() => navigation.navigate('DeckEdit')}>
          <ArrowLeft color={colors.muted} size={18} strokeWidth={2.2} />
          <AppText className="text-[13px] text-deck-muted" weight="bold">
            Voltar
          </AppText>
        </Pressable>
        <AppText className="text-[13px] text-deck-muted" weight="bold">
          Card {card.index}
        </AppText>
      </View>

      <View className="mb-5">
        <AppText className="text-[29px] leading-[34px] text-white" weight="black">
          {deck.shortTitle}
        </AppText>
        <AppText className="mt-2 text-[13px] text-deck-muted" weight="medium">
          Revise o conteúdo antes de editar.
        </AppText>
      </View>

      <DetailBox accent={colors.purple} body={card.title} title="Pergunta" />
      <DetailBox accent={colors.green} body={card.answer} title="Resposta" />

      <PrimaryButton className="mt-2" onPress={() => navigation.navigate('CardEdit')} weight="black">
        Editar card
      </PrimaryButton>
    </DarkScreen>
  );
}
