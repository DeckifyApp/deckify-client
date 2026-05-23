import { useNavigation } from '@react-navigation/native';
import { CheckCircle2, HelpCircle, XCircle } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { AppHeader } from '../components/AppHeader';
import { AppText } from '../components/AppText';
import { DarkScreen } from '../components/DarkScreen';
import { PrimaryButton } from '../components/PrimaryButton';
import { StudyHeader } from '../components/StudyHeader';
import { colors } from '../constants/theme';
import { deck } from '../data/appData';
import type { RootNavigation } from '../types/navigation';

function GradeButton({
  color,
  detail,
  icon,
  label,
}: {
  color: string;
  detail: string;
  icon: ReactNode;
  label: string;
}) {
  const navigation = useNavigation<RootNavigation>();

  return (
    <View className="flex-1">
      <PrimaryButton
        className="h-[54px] px-2"
        labelClassName="text-[12px] text-white"
        onPress={() => navigation.navigate('StudyResults')}
        style={{ backgroundColor: color }}
        weight="black"
      >
        <View className="items-center">
          {icon}
          <AppText className="mt-1 text-[11px] text-white" weight="black">
            {label}
          </AppText>
        </View>
      </PrimaryButton>
      <AppText className="mt-2 text-center text-[10px]" style={{ color }} weight="black">
        {detail}
      </AppText>
    </View>
  );
}

export function StudyAnswerScreen() {
  const card = deck.cards[0];

  return (
    <DarkScreen activeTab="library" scroll>
      <AppHeader />
      <StudyHeader />

      <View className="rounded-[24px] bg-deck-card p-5">
        <AppText className="text-[12px] text-deck-muted" weight="bold">
          Pergunta
        </AppText>
        <AppText className="mt-2 text-[18px] leading-[26px] text-white" weight="bold">
          {card.title}
        </AppText>
      </View>

      <View className="mt-4 rounded-[28px] bg-deck-purple p-5">
        <View className="mb-8 flex-row items-center justify-between">
          <View>
            <AppText className="text-[12px] text-white/75" weight="bold">
              Resposta
            </AppText>
            <AppText className="mt-1 text-[13px] text-white" weight="black">
              Card {card.index}
            </AppText>
          </View>
          <View className="rounded-full bg-white/15 px-3 py-2">
            <AppText className="text-[11px] text-white" weight="black">
              Reveja em voz alta
            </AppText>
          </View>
        </View>

        <View className="min-h-[210px] justify-center">
          <AppText className="text-[28px] leading-[37px] text-white" weight="black">
            {card.answer}
          </AppText>
        </View>
      </View>

      <AppText className="mb-3 mt-6 text-center text-[14px] text-deck-muted" weight="bold">
        Como foi sua lembrança?
      </AppText>
      <View className="flex-row gap-3">
        <GradeButton
          color={colors.green}
          detail="Mantém intervalo"
          icon={<CheckCircle2 color="white" size={18} strokeWidth={2.4} />}
          label="Acertei"
        />
        <GradeButton
          color={colors.orange}
          detail="+2 revisões"
          icon={<HelpCircle color="white" size={18} strokeWidth={2.4} />}
          label="Parcial"
        />
        <GradeButton
          color={colors.red}
          detail="+4 revisões"
          icon={<XCircle color="white" size={18} strokeWidth={2.4} />}
          label="Errei"
        />
      </View>
    </DarkScreen>
  );
}
