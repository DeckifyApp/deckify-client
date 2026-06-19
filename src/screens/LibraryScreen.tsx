import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  Bookmark,
  Globe2,
  Layers3,
  LockKeyhole,
  Plus,
} from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Pressable, View } from 'react-native';

import { AppHeader } from '../components/AppHeader';
import { AppText } from '../components/AppText';
import { DarkScreen } from '../components/DarkScreen';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../constants/theme';
import { api, type DeckSummary } from '../services/api';
import type { RootNavigation } from '../types/navigation';

function DeckRow({ deck }: { deck: DeckSummary }) {
  const navigation = useNavigation<RootNavigation>();
  const privateDeck = deck.visibility === 'PRIVATE';
  const visibilityLabel =
    deck.visibility === 'PUBLIC'
      ? 'Publico'
      : privateDeck
        ? 'Privado'
        : 'Por link';

  return (
    <Pressable
      accessibilityRole="button"
      className="mb-3 rounded-[22px] bg-deck-card p-5 active:opacity-85"
      onPress={() => navigation.navigate('DeckOverview', { deckId: deck.id })}
    >
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1">
          <AppText
            className="text-[18px] leading-[24px] text-white"
            weight="bold"
          >
            {deck.title}
          </AppText>
          <AppText
            className="mt-2 text-[12px] leading-[18px] text-deck-muted"
            numberOfLines={2}
            weight="medium"
          >
            {deck.description ?? 'Sem descricao.'}
          </AppText>
        </View>
        {deck.isOwner ? (
          privateDeck ? (
            <LockKeyhole color={colors.muted} size={19} strokeWidth={2.2} />
          ) : (
            <Globe2 color={colors.green} size={19} strokeWidth={2.2} />
          )
        ) : (
          <Bookmark
            color={colors.purpleSoft}
            fill={colors.purpleSoft}
            size={19}
          />
        )}
      </View>
      <View className="mt-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Layers3 color={colors.muted} size={16} />
          <AppText className="text-[11px] text-deck-muted" weight="bold">
            {deck.cardCount} cards
          </AppText>
        </View>
        <AppText className="text-[11px] text-deck-purple" weight="black">
          {deck.isOwner ? visibilityLabel : 'Salvo'}
        </AppText>
      </View>
    </Pressable>
  );
}

export function LibraryScreen() {
  const navigation = useNavigation<RootNavigation>();
  const [decks, setDecks] = useState<DeckSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      setError(null);

      api.decks
        .list()
        .then((data) => active && setDecks(data))
        .catch((currentError: unknown) => {
          if (active) {
            setError(
              currentError instanceof Error
                ? currentError.message
                : 'Nao foi possivel carregar sua biblioteca.',
            );
          }
        })
        .finally(() => active && setLoading(false));

      return () => {
        active = false;
      };
    }, []),
  );

  const owned = decks.filter((deck) => deck.isOwner);
  const saved = decks.filter((deck) => !deck.isOwner);

  return (
    <DarkScreen activeTab="library" scroll>
      <AppHeader />
      <View className="mb-6 flex-row items-start justify-between">
        <View className="flex-1 pr-4">
          <AppText
            className="text-[30px] leading-[35px] text-white"
            weight="black"
          >
            Meus decks
          </AppText>
          <AppText className="mt-2 text-[13px] text-deck-muted" weight="medium">
            Decks criados por voce e salvos da comunidade.
          </AppText>
        </View>
        <Pressable
          accessibilityLabel="Novo deck"
          accessibilityRole="button"
          className="h-12 w-12 items-center justify-center rounded-[17px] bg-deck-purple"
          onPress={() => navigation.navigate('DeckEdit', { mode: 'create' })}
        >
          <Plus color="white" size={23} strokeWidth={2.3} />
        </Pressable>
      </View>

      {error ? (
        <View className="mb-5 rounded-[18px] bg-deck-card p-4">
          <AppText className="text-[13px] text-deck-muted" weight="bold">
            {error}
          </AppText>
        </View>
      ) : null}

      {loading ? (
        <AppText className="text-[13px] text-deck-muted" weight="bold">
          Carregando decks...
        </AppText>
      ) : decks.length === 0 ? (
        <View className="rounded-[22px] bg-deck-card p-5">
          <AppText className="text-[19px] text-white" weight="bold">
            Sua biblioteca esta vazia
          </AppText>
          <AppText
            className="mt-2 text-[13px] leading-[20px] text-deck-muted"
            weight="medium"
          >
            Crie um deck ou encontre um pronto na comunidade.
          </AppText>
          <PrimaryButton
            className="mt-5"
            onPress={() => navigation.navigate('Community')}
          >
            Explorar comunidade
          </PrimaryButton>
        </View>
      ) : (
        <>
          {owned.length > 0 ? (
            <>
              <AppText className="mb-3 text-[18px] text-white" weight="bold">
                Criados por voce
              </AppText>
              {owned.map((deck) => (
                <DeckRow key={deck.id} deck={deck} />
              ))}
            </>
          ) : null}
          {saved.length > 0 ? (
            <>
              <AppText
                className="mb-3 mt-5 text-[18px] text-white"
                weight="bold"
              >
                Salvos
              </AppText>
              {saved.map((deck) => (
                <DeckRow key={deck.id} deck={deck} />
              ))}
            </>
          ) : null}
        </>
      )}
    </DarkScreen>
  );
}
