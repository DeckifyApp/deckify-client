import { useNavigation, useRoute } from '@react-navigation/native';
import { CheckCircle2, XCircle } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { View } from 'react-native';

import { AppHeader } from '../components/AppHeader';
import { AppText } from '../components/AppText';
import { DarkScreen } from '../components/DarkScreen';
import { PrimaryButton } from '../components/PrimaryButton';
import { StudyHeader } from '../components/StudyHeader';
import { colors } from '../constants/theme';
import { useStudySession } from '../context/StudySessionContext';
import type { ReviewResult } from '../services/api';
import type { RootNavigation, RootRoute } from '../types/navigation';

function GradeButton({
  color,
  disabled,
  detail,
  icon,
  label,
  onPress,
}: {
  color: string;
  detail: string;
  disabled: boolean;
  icon: ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <View className="flex-1">
      <PrimaryButton
        className="h-[58px] px-2"
        disabled={disabled}
        labelClassName="text-[12px] text-white"
        onPress={onPress}
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
      <AppText
        className="mt-2 text-center text-[10px]"
        style={{ color }}
        weight="black"
      >
        {detail}
      </AppText>
    </View>
  );
}

export function StudyAnswerScreen() {
  const navigation = useNavigation<RootNavigation>();
  const route = useRoute<RootRoute<'StudyAnswer'>>();
  const {
    againCount,
    currentCard,
    goodCount,
    reviewCurrent,
    reviewedCount,
    totalCards,
  } = useStudySession();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(result: ReviewResult) {
    setSaving(true);
    setError(null);

    try {
      const hasNext = await reviewCurrent(result);

      if (hasNext) {
        navigation.navigate('StudyQuestion', { deckId: route.params.deckId });
      } else {
        navigation.navigate('StudyResults', { deckId: route.params.deckId });
      }
    } catch (currentError) {
      setError(
        currentError instanceof Error
          ? currentError.message
          : 'Nao foi possivel registrar a revisao.',
      );
    } finally {
      setSaving(false);
    }
  }

  const progress =
    totalCards > 0 ? Math.round((reviewedCount / totalCards) * 100) : 0;

  return (
    <DarkScreen activeTab="library" scroll>
      <AppHeader />
      <StudyHeader
        againCount={againCount}
        goodCount={goodCount}
        progress={progress}
        subtitle="Compare sua resposta"
        title="Revisao"
        totalCards={totalCards}
      />

      {error ? (
        <View className="mb-5 rounded-[18px] bg-deck-card p-4">
          <AppText
            className="text-[13px] leading-[20px] text-deck-muted"
            weight="bold"
          >
            {error}
          </AppText>
        </View>
      ) : null}

      {currentCard ? (
        <>
          <View className="rounded-[24px] bg-deck-card p-5">
            <AppText className="text-[12px] text-deck-muted" weight="bold">
              Pergunta
            </AppText>
            <AppText
              className="mt-2 text-[18px] leading-[26px] text-white"
              weight="bold"
            >
              {currentCard.card.front}
            </AppText>
          </View>

          <View className="mt-4 rounded-[28px] bg-deck-purple p-5">
            <View className="mb-8 flex-row items-center justify-between">
              <View>
                <AppText className="text-[12px] text-white/75" weight="bold">
                  Resposta
                </AppText>
                <AppText className="mt-1 text-[13px] text-white" weight="black">
                  Card{' '}
                  {String(
                    currentCard.card.position || reviewedCount + 1,
                  ).padStart(2, '0')}
                </AppText>
              </View>
              <View className="rounded-full bg-white/15 px-3 py-2">
                <AppText className="text-[11px] text-white" weight="black">
                  Reveja em voz alta
                </AppText>
              </View>
            </View>

            <View className="min-h-[210px] justify-center">
              <AppText
                className="text-[28px] leading-[37px] text-white"
                weight="black"
              >
                {currentCard.card.back}
              </AppText>
              {currentCard.card.explanation ? (
                <AppText
                  className="mt-5 text-[14px] leading-[22px] text-white/80"
                  weight="medium"
                >
                  {currentCard.card.explanation}
                </AppText>
              ) : null}
            </View>
          </View>

          <AppText
            className="mb-3 mt-6 text-center text-[14px] text-deck-muted"
            weight="bold"
          >
            Como foi sua lembranca?
          </AppText>
          <View className="flex-row gap-3">
            <GradeButton
              color={colors.green}
              detail="Aumenta intervalo"
              disabled={saving}
              icon={<CheckCircle2 color="white" size={18} strokeWidth={2.4} />}
              label="Acertei"
              onPress={() => void submit('GOOD')}
            />
            <GradeButton
              color={colors.red}
              detail="Volta para caixa 1"
              disabled={saving}
              icon={<XCircle color="white" size={18} strokeWidth={2.4} />}
              label="Errei"
              onPress={() => void submit('AGAIN')}
            />
          </View>
        </>
      ) : (
        <View className="rounded-[24px] bg-deck-card p-5">
          <AppText className="text-[13px] text-deck-muted" weight="bold">
            Nenhum card ativo.
          </AppText>
        </View>
      )}
    </DarkScreen>
  );
}
