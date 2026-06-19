import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { ArrowLeft, Edit3, Trash2 } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Alert, Pressable, View } from 'react-native';

import { AppHeader } from '../components/AppHeader';
import { AppText } from '../components/AppText';
import { DarkScreen } from '../components/DarkScreen';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../constants/theme';
import { api, type Card, type DeckDetail } from '../services/api';
import type { RootNavigation, RootRoute } from '../types/navigation';

function DetailBox({
  accent,
  body,
  title,
}: {
  accent: string;
  body: string;
  title: string;
}) {
  return (
    <View className="mb-4 rounded-[24px] bg-deck-card p-5">
      <View className="mb-8 flex-row items-center justify-between">
        <View>
          <AppText className="text-[12px] text-deck-muted" weight="bold">
            {title}
          </AppText>
          <View
            className="mt-2 h-1 w-12 rounded-full"
            style={{ backgroundColor: accent }}
          />
        </View>
      </View>
      <AppText className="text-[23px] leading-[33px] text-white" weight="bold">
        {body || 'Sem conteudo.'}
      </AppText>
    </View>
  );
}

export function CardDetailsScreen() {
  const navigation = useNavigation<RootNavigation>();
  const route = useRoute<RootRoute<'CardDetails'>>();
  const { cardId, deckId } = route.params;
  const [card, setCard] = useState<Card | null>(null);
  const [deck, setDeck] = useState<DeckDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function load() {
        setLoading(true);
        setError(null);

        try {
          const [cardData, deckData] = await Promise.all([
            api.cards.get(cardId),
            api.decks.get(deckId),
          ]);
          if (active) {
            setCard(cardData);
            setDeck(deckData);
          }
        } catch (currentError) {
          if (active) {
            setError(
              currentError instanceof Error
                ? currentError.message
                : 'Nao foi possivel carregar o card.',
            );
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      }

      void load();

      return () => {
        active = false;
      };
    }, [cardId, deckId]),
  );

  async function archiveCard() {
    setError(null);

    try {
      await api.cards.archive(cardId);
      navigation.navigate('DeckEdit', { deckId, mode: 'edit' });
    } catch (currentError) {
      setError(
        currentError instanceof Error
          ? currentError.message
          : 'Nao foi possivel arquivar o card.',
      );
    }
  }

  function confirmArchiveCard() {
    Alert.alert('Arquivar card?', 'O card deixara de aparecer neste deck.', [
      { style: 'cancel', text: 'Cancelar' },
      {
        style: 'destructive',
        text: 'Arquivar',
        onPress: () => void archiveCard(),
      },
    ]);
  }

  return (
    <DarkScreen activeTab="library" scroll>
      <AppHeader />
      <View className="mb-6 flex-row items-center justify-between">
        <Pressable
          className="flex-row items-center gap-2"
          onPress={() => navigation.navigate('DeckOverview', { deckId })}
        >
          <ArrowLeft color={colors.muted} size={18} strokeWidth={2.2} />
          <AppText className="text-[13px] text-deck-muted" weight="bold">
            Voltar
          </AppText>
        </Pressable>
        <AppText className="text-[13px] text-deck-muted" weight="bold">
          {card
            ? `Card ${String(card.position || 1).padStart(2, '0')}`
            : 'Card'}
        </AppText>
      </View>

      <View className="mb-5">
        <AppText
          className="text-[29px] leading-[34px] text-white"
          weight="black"
        >
          {deck?.title ?? 'Detalhes do card'}
        </AppText>
        <AppText className="mt-2 text-[13px] text-deck-muted" weight="medium">
          Revise o conteudo antes de editar.
        </AppText>
      </View>

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

      {loading || !card ? (
        <View className="rounded-[24px] bg-deck-card p-5">
          <AppText className="text-[13px] text-deck-muted" weight="bold">
            Carregando card...
          </AppText>
        </View>
      ) : (
        <>
          <DetailBox
            accent={colors.purple}
            body={card.front}
            title="Pergunta"
          />
          <DetailBox accent={colors.green} body={card.back} title="Resposta" />
          {card.explanation ? (
            <DetailBox
              accent={colors.blue}
              body={card.explanation}
              title="Explicacao"
            />
          ) : null}

          {deck?.isOwner ? (
            <>
              <PrimaryButton
                className="mt-2"
                onPress={() =>
                  navigation.navigate('CardEdit', {
                    cardId,
                    deckId,
                    mode: 'edit',
                  })
                }
                weight="black"
              >
                <View className="flex-row items-center gap-2">
                  <Edit3 color="white" size={18} strokeWidth={2.3} />
                  <AppText className="text-[16px] text-white" weight="black">
                    Editar card
                  </AppText>
                </View>
              </PrimaryButton>
              <Pressable
                className="mt-5 flex-row items-center justify-center gap-2"
                onPress={confirmArchiveCard}
              >
                <Trash2 color={colors.red} size={17} strokeWidth={2.2} />
                <AppText className="text-[13px] text-deck-muted" weight="bold">
                  Arquivar card
                </AppText>
              </Pressable>
            </>
          ) : null}
        </>
      )}
    </DarkScreen>
  );
}
