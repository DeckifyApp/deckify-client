import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Eye } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { AppHeader } from '../components/AppHeader';
import { AppText } from '../components/AppText';
import { DarkScreen } from '../components/DarkScreen';
import { PrimaryButton } from '../components/PrimaryButton';
import { StudyHeader } from '../components/StudyHeader';
import { colors } from '../constants/theme';
import { deck } from '../data/appData';
import type { RootNavigation } from '../types/navigation';

export function StudyQuestionScreen() {
  const navigation = useNavigation<RootNavigation>();
  const card = deck.cards[0];

  return (
    <DarkScreen activeTab="library" scroll>
      <AppHeader />
      <StudyHeader />

      <View className="rounded-[28px] bg-[#F6F7FB] p-5">
        <View className="mb-8 flex-row items-center justify-between">
          <View>
            <AppText className="text-[12px] text-[#697386]" weight="bold">
              Pergunta
            </AppText>
            <AppText className="mt-1 text-[13px] text-[#111111]" weight="black">
              Card {card.index}
            </AppText>
          </View>
          <View className="rounded-full bg-[#E9EAFD] px-3 py-2">
            <AppText className="text-[11px] text-deck-purple" weight="black">
              Revisão ativa
            </AppText>
          </View>
        </View>

        <View className="min-h-[230px] justify-center">
          <AppText className="text-[29px] leading-[38px] text-[#111111]" weight="black">
            {card.title}
          </AppText>
        </View>

        <View className="mt-8 flex-row flex-wrap">
          {deck.tags.map((tag) => (
            <View key={tag} className="mb-2 mr-2 rounded-full bg-[#E9EEF7] px-3 py-2">
              <AppText className="text-[11px] text-[#546173]" weight="bold">
                {tag}
              </AppText>
            </View>
          ))}
        </View>
      </View>

      <PrimaryButton className="mt-6" onPress={() => navigation.navigate('StudyAnswer')} weight="black">
        <View className="flex-row items-center gap-2">
          <Eye color="white" size={18} strokeWidth={2.3} />
          <AppText className="text-[16px] text-white" weight="black">
            Mostrar resposta
          </AppText>
        </View>
      </PrimaryButton>

      <Pressable className="mt-5 flex-row items-center justify-center gap-2" onPress={() => navigation.navigate('DeckOverview')}>
        <ArrowLeft color={colors.muted} size={17} strokeWidth={2.2} />
        <AppText className="text-[13px] text-deck-muted" weight="bold">
          Voltar para o deck
        </AppText>
      </Pressable>
    </DarkScreen>
  );
}
