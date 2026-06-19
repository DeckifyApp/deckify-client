import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Bookmark, Check, Search, UsersRound } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { AppHeader } from '../components/AppHeader';
import { AppText } from '../components/AppText';
import { DarkScreen } from '../components/DarkScreen';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { api, type CommunityDeckSummary } from '../services/api';
import type { RootNavigation } from '../types/navigation';

type Sort = 'popular' | 'recent';

export function CommunityScreen() {
  const navigation = useNavigation<RootNavigation>();
  const { user } = useAuth();
  const [decks, setDecks] = useState<CommunityDeckSummary[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [sort, setSort] = useState<Sort>('popular');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (nextPage = 1, append = false) => {
      setLoading(true);
      setError(null);
      try {
        const [community, library] = await Promise.all([
          api.community.list({
            limit: 20,
            page: nextPage,
            search: appliedSearch || undefined,
            sort,
          }),
          api.decks.list(),
        ]);
        setDecks((current) =>
          append ? [...current, ...community.data] : community.data,
        );
        setSavedIds(
          new Set(
            library.filter((deck) => deck.isSaved).map((deck) => deck.id),
          ),
        );
        setPage(community.pagination.page);
        setTotalPages(community.pagination.totalPages);
      } catch (currentError) {
        setError(
          currentError instanceof Error
            ? currentError.message
            : 'Nao foi possivel carregar a comunidade.',
        );
      } finally {
        setLoading(false);
      }
    },
    [appliedSearch, sort],
  );

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  async function toggleSave(deckId: string) {
    const saved = savedIds.has(deckId);
    setSavingId(deckId);
    setError(null);
    try {
      if (saved) {
        await api.community.unsave(deckId);
      } else {
        await api.community.save(deckId);
      }
      setSavedIds((current) => {
        const next = new Set(current);
        saved ? next.delete(deckId) : next.add(deckId);
        return next;
      });
    } catch (currentError) {
      setError(
        currentError instanceof Error
          ? currentError.message
          : 'Nao foi possivel salvar o deck.',
      );
    } finally {
      setSavingId(null);
    }
  }

  return (
    <DarkScreen activeTab="community" scroll>
      <AppHeader />
      <AppText className="text-[30px] leading-[35px] text-white" weight="black">
        Comunidade
      </AppText>
      <AppText className="mt-2 text-[13px] text-deck-muted" weight="medium">
        Encontre decks publicos e salve os melhores na sua biblioteca.
      </AppText>

      <View className="mt-5 flex-row items-center rounded-[18px] bg-deck-card px-4">
        <Search color={colors.muted} size={19} />
        <TextInput
          className="h-[54px] flex-1 px-3 text-[14px] text-white"
          onChangeText={setSearch}
          onSubmitEditing={() => setAppliedSearch(search.trim())}
          placeholder="Buscar por titulo ou assunto"
          placeholderTextColor={colors.mutedStrong}
          returnKeyType="search"
          style={{ fontFamily: 'Montserrat_600SemiBold' }}
          value={search}
        />
        <Pressable onPress={() => setAppliedSearch(search.trim())}>
          <AppText className="text-[11px] text-deck-purple" weight="black">
            Buscar
          </AppText>
        </Pressable>
      </View>

      <View className="mb-5 mt-3 flex-row gap-2">
        {(['popular', 'recent'] as Sort[]).map((option) => (
          <Pressable
            key={option}
            className={`rounded-full px-4 py-2 ${sort === option ? 'bg-deck-purple' : 'bg-deck-card'}`}
            onPress={() => setSort(option)}
          >
            <AppText className="text-[11px] text-white" weight="black">
              {option === 'popular' ? 'Mais salvos' : 'Recentes'}
            </AppText>
          </Pressable>
        ))}
      </View>

      {error ? (
        <View className="mb-4 rounded-[18px] bg-deck-card p-4">
          <AppText className="text-[13px] text-deck-muted" weight="bold">
            {error}
          </AppText>
        </View>
      ) : null}

      {decks.map((deck) => {
        const saved = savedIds.has(deck.id);
        const isOwner = deck.ownerId === user?.id;
        return (
          <Pressable
            key={deck.id}
            className="mb-3 rounded-[22px] bg-deck-card p-5 active:opacity-85"
            onPress={() =>
              navigation.navigate('DeckOverview', { deckId: deck.id })
            }
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
                  className="mt-1 text-[11px] text-deck-muted"
                  weight="bold"
                >
                  por {deck.owner.name} · {deck.cardCount} cards ·{' '}
                  {deck.saveCount} salvos
                </AppText>
                {deck.description ? (
                  <AppText
                    className="mt-3 text-[12px] leading-[18px] text-deck-muted"
                    numberOfLines={2}
                    weight="medium"
                  >
                    {deck.description}
                  </AppText>
                ) : null}
              </View>
              <UsersRound color={colors.purpleSoft} size={21} />
            </View>
            <View className="mt-4 flex-row flex-wrap">
              {deck.tags.slice(0, 4).map((tag) => (
                <View
                  key={tag.id}
                  className="mb-2 mr-2 rounded-full bg-deck-soft px-3 py-2"
                >
                  <AppText
                    className="text-[10px] text-deck-muted"
                    weight="bold"
                  >
                    {tag.name}
                  </AppText>
                </View>
              ))}
            </View>
            {!isOwner ? (
              <Pressable
                accessibilityRole="button"
                className={`mt-2 flex-row items-center justify-center gap-2 rounded-full py-3 ${saved ? 'bg-deck-soft' : 'bg-deck-purple'}`}
                disabled={savingId === deck.id}
                onPress={(event) => {
                  event.stopPropagation();
                  void toggleSave(deck.id);
                }}
              >
                {saved ? (
                  <Check color="white" size={16} />
                ) : (
                  <Bookmark color="white" size={16} />
                )}
                <AppText className="text-[12px] text-white" weight="black">
                  {savingId === deck.id
                    ? 'Salvando...'
                    : saved
                      ? 'Salvo na biblioteca'
                      : 'Salvar deck'}
                </AppText>
              </Pressable>
            ) : null}
          </Pressable>
        );
      })}

      {!loading && decks.length === 0 ? (
        <View className="rounded-[22px] bg-deck-card p-5">
          <AppText className="text-[17px] text-white" weight="bold">
            Nenhum deck encontrado
          </AppText>
          <AppText className="mt-2 text-[12px] text-deck-muted" weight="medium">
            Tente outro termo de busca.
          </AppText>
        </View>
      ) : null}
      {loading ? (
        <AppText
          className="py-4 text-center text-[12px] text-deck-muted"
          weight="bold"
        >
          Carregando...
        </AppText>
      ) : page < totalPages ? (
        <PrimaryButton
          className="mt-3 bg-deck-soft"
          onPress={() => void load(page + 1, true)}
        >
          Carregar mais
        </PrimaryButton>
      ) : null}
    </DarkScreen>
  );
}
