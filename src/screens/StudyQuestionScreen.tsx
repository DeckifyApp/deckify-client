import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { ArrowLeft, Eye } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Pressable, View } from 'react-native';

import { AppHeader } from '../components/AppHeader';
import { AppText } from '../components/AppText';
import { DarkScreen } from '../components/DarkScreen';
import { PrimaryButton } from '../components/PrimaryButton';
import { StudyHeader } from '../components/StudyHeader';
import { colors } from '../constants/theme';
import { useStudySession } from '../context/StudySessionContext';
import { api, type DeckDetail } from '../services/api';
import type { RootNavigation, RootRoute } from '../types/navigation';

export function StudyQuestionScreen() {
  const navigation = useNavigation<RootNavigation>();
  const route = useRoute<RootRoute<'StudyQuestion'>>();
  const {
    againCount,
    currentCard,
    deckId: sessionDeckId,
    goodCount,
    loading,
    reviewedCount,
    startSession,
    totalCards,
  } = useStudySession();
  const [deck, setDeck] = useState<DeckDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function load() {
        setError(null);

        try {
          let targetDeckId = route.params?.deckId ?? sessionDeckId;

          if (!targetDeckId) {
            const library = await api.decks.list();
            targetDeckId = library[0]?.id;
          }

          if (!targetDeckId) {
            return;
          }

          if (sessionDeckId !== targetDeckId || totalCards === 0) {
            await startSession(targetDeckId);
          }

          const deckData = await api.decks.get(targetDeckId);
          if (active) {
            setDeck(deckData);
          }
        } catch (currentError) {
          if (active) {
            setError(
              currentError instanceof Error
                ? currentError.message
                : 'Nao foi possivel iniciar a revisao.',
            );
          }
        }
      }

      void load();

      return () => {
        active = false;
      };
    }, [route.params?.deckId, sessionDeckId, startSession, totalCards]),
  );

  const activeDeckId = deck?.id ?? sessionDeckId ?? route.params?.deckId;
  const progress =
    totalCards > 0 ? Math.round((reviewedCount / totalCards) * 100) : 0;

  return (
    <DarkScreen activeTab="library" scroll>
      <AppHeader />
      <StudyHeader
        againCount={againCount}
        goodCount={goodCount}
        progress={progress}
        subtitle={deck?.title ? 'Revisao ativa' : 'Preparando sessao'}
        title={deck?.title ?? 'Deckify'}
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

      {loading ? (
        <View className="rounded-[28px] bg-[#F6F7FB] p-5">
          <AppText className="text-[14px] text-[#697386]" weight="bold">
            Carregando cards...
          </AppText>
        </View>
      ) : currentCard ? (
        <>
          <View className="rounded-[28px] bg-[#F6F7FB] p-5">
            <View className="mb-8 flex-row items-center justify-between">
              <View>
                <AppText className="text-[12px] text-[#697386]" weight="bold">
                  Pergunta
                </AppText>
                <AppText
                  className="mt-1 text-[13px] text-[#111111]"
                  weight="black"
                >
                  Card{' '}
                  {String(
                    currentCard.card.position || reviewedCount + 1,
                  ).padStart(2, '0')}
                </AppText>
              </View>
              <View className="rounded-full bg-[#E9EAFD] px-3 py-2">
                <AppText
                  className="text-[11px] text-deck-purple"
                  weight="black"
                >
                  Caixa {currentCard.leitnerBox}
                </AppText>
              </View>
            </View>

            <View className="min-h-[230px] justify-center">
              <AppText
                className="text-[29px] leading-[38px] text-[#111111]"
                weight="black"
              >
                {currentCard.card.front}
              </AppText>
            </View>

            <View className="mt-8 flex-row flex-wrap">
              {(deck?.tags ?? []).map((tag) => (
                <View
                  key={tag}
                  className="mb-2 mr-2 rounded-full bg-[#E9EEF7] px-3 py-2"
                >
                  <AppText className="text-[11px] text-[#546173]" weight="bold">
                    {tag}
                  </AppText>
                </View>
              ))}
            </View>
          </View>

          <PrimaryButton
            className="mt-6"
            onPress={() =>
              activeDeckId &&
              navigation.navigate('StudyAnswer', { deckId: activeDeckId })
            }
            weight="black"
          >
            <View className="flex-row items-center gap-2">
              <Eye color="white" size={18} strokeWidth={2.3} />
              <AppText className="text-[16px] text-white" weight="black">
                Mostrar resposta
              </AppText>
            </View>
          </PrimaryButton>
        </>
      ) : (
        <View className="rounded-[28px] bg-[#F6F7FB] p-5">
          <AppText
            className="text-[24px] leading-[31px] text-[#111111]"
            weight="black"
          >
            Nenhum card vencido agora
          </AppText>
          <AppText
            className="mt-3 text-[14px] leading-[22px] text-[#697386]"
            weight="medium"
          >
            Inicie novamente mais tarde ou adicione novos cards ao deck.
          </AppText>
        </View>
      )}

      <Pressable
        className="mt-5 flex-row items-center justify-center gap-2"
        onPress={() =>
          navigation.navigate(
            'DeckOverview',
            activeDeckId ? { deckId: activeDeckId } : undefined,
          )
        }
      >
        <ArrowLeft color={colors.muted} size={17} strokeWidth={2.2} />
        <AppText className="text-[13px] text-deck-muted" weight="bold">
          Voltar para o deck
        </AppText>
      </Pressable>
    </DarkScreen>
  );
}
