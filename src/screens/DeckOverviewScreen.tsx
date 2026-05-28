import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { CalendarClock, Layers3, TimerReset } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { useCallback, useState } from 'react';
import { Pressable, View } from 'react-native';

import { AppHeader } from '../components/AppHeader';
import { AppText } from '../components/AppText';
import { DarkScreen } from '../components/DarkScreen';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import {
  api,
  type Card,
  type DeckDetail,
  type StudyStats,
} from '../services/api';
import type { RootNavigation, RootRoute } from '../types/navigation';

const difficultyMeta: Record<
  Card['difficulty'],
  { background: string; color: string; label: string }
> = {
  EASY: {
    background: 'rgba(33,198,134,0.16)',
    color: colors.green,
    label: 'Facil',
  },
  HARD: {
    background: 'rgba(255,92,92,0.16)',
    color: colors.red,
    label: 'Dificil',
  },
  MEDIUM: {
    background: 'rgba(245,180,75,0.16)',
    color: colors.orange,
    label: 'Medio',
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
      <AppText
        className="mt-3 text-[22px] leading-[25px] text-white"
        weight="black"
      >
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
    <View className="mb-2 mr-2 rounded-full bg-deck-soft px-3 py-2">
      <AppText className="text-[11px] text-deck-muted" weight="bold">
        {label}
      </AppText>
    </View>
  );
}

function MiniCard({ card, deckId }: { card: Card; deckId: string }) {
  const navigation = useNavigation<RootNavigation>();
  const meta = difficultyMeta[card.difficulty];

  return (
    <Pressable
      accessibilityRole="button"
      className="mb-3 w-[48%] rounded-[20px] bg-deck-card p-4 active:opacity-90"
      onPress={() =>
        navigation.navigate('CardDetails', { cardId: card.id, deckId })
      }
    >
      <View className="mb-4 flex-row items-center justify-between">
        <AppText className="text-[11px] text-deck-muted" weight="bold">
          Card {String(card.position || 1).padStart(2, '0')}
        </AppText>
        <View
          className="rounded-full px-2 py-1"
          style={{ backgroundColor: meta.background }}
        >
          <AppText
            className="text-[9px]"
            style={{ color: meta.color }}
            weight="black"
          >
            {meta.label}
          </AppText>
        </View>
      </View>
      <AppText
        className="min-h-[82px] text-[15px] leading-[21px] text-white"
        numberOfLines={4}
        weight="bold"
      >
        {card.front}
      </AppText>
    </Pressable>
  );
}

export function DeckOverviewScreen() {
  const navigation = useNavigation<RootNavigation>();
  const route = useRoute<RootRoute<'DeckOverview'>>();
  const { isAuthenticated } = useAuth();
  const [deck, setDeck] = useState<DeckDetail | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [stats, setStats] = useState<StudyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let deckId = route.params?.deckId;

      if (!deckId) {
        const library = await api.decks.list();
        deckId = library[0]?.id;
      }

      if (!deckId) {
        setDeck(null);
        setCards([]);
        setStats(null);
        return;
      }

      const [deckData, cardData, statsData] = await Promise.all([
        api.decks.get(deckId),
        api.cards.listByDeck(deckId),
        api.study.stats(deckId),
      ]);

      setDeck(deckData);
      setCards(cardData);
      setStats(statsData);
    } catch (currentError) {
      setError(
        currentError instanceof Error
          ? currentError.message
          : 'Nao foi possivel carregar o deck.',
      );
    } finally {
      setLoading(false);
    }
  }, [route.params?.deckId]);

  useFocusEffect(
    useCallback(() => {
      if (!isAuthenticated) {
        navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
        return undefined;
      }

      void load();
      return undefined;
    }, [isAuthenticated, load, navigation]),
  );

  async function toggleSave() {
    if (!deck) {
      return;
    }

    setActionLoading(true);
    try {
      if (deck.isSaved) {
        await api.community.unsave(deck.id);
      } else {
        await api.community.save(deck.id);
      }
      await load();
    } catch (currentError) {
      setError(
        currentError instanceof Error
          ? currentError.message
          : 'Nao foi possivel salvar o deck.',
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function forkDeck() {
    if (!deck) {
      return;
    }

    setActionLoading(true);
    try {
      const forked = await api.community.fork(deck.id);
      navigation.navigate('DeckOverview', { deckId: forked.id });
    } catch (currentError) {
      setError(
        currentError instanceof Error
          ? currentError.message
          : 'Nao foi possivel bifurcar o deck.',
      );
    } finally {
      setActionLoading(false);
    }
  }

  const progress =
    stats && deck && deck.cardCount > 0
      ? Math.round(((stats.totalCards - stats.dueCards) / deck.cardCount) * 100)
      : 0;

  return (
    <DarkScreen activeTab="library" scroll>
      <AppHeader />
      {loading ? (
        <View className="rounded-[22px] bg-deck-card p-5">
          <AppText className="text-[15px] text-deck-muted" weight="bold">
            Carregando deck...
          </AppText>
        </View>
      ) : deck ? (
        <>
          <View className="mb-5">
            <AppText
              className="text-[34px] leading-[39px] text-white"
              weight="black"
            >
              {deck.title}
            </AppText>
            <AppText
              className="mt-2 text-[13px] text-deck-muted"
              weight="medium"
            >
              {deck.isOwner ? 'Feito por voce' : `Feito por ${deck.owner.name}`}
            </AppText>
            <AppText
              className="mt-4 text-[14px] leading-[22px] text-deck-muted"
              weight="medium"
            >
              {deck.description ?? 'Sem descricao.'}
            </AppText>
          </View>

          <View className="mb-5 flex-row flex-wrap">
            {deck.tags.length > 0 ? (
              deck.tags.map((tag) => <Tag key={tag} label={tag} />)
            ) : (
              <Tag label="sem tags" />
            )}
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

          <View className="mb-5 flex-row gap-3">
            <DeckStat
              icon={
                <Layers3
                  color={colors.purpleSoft}
                  size={21}
                  strokeWidth={2.2}
                />
              }
              label="cards"
              value={`${deck.cardCount}`}
            />
            <DeckStat
              icon={
                <TimerReset color={colors.green} size={21} strokeWidth={2.2} />
              }
              label="vencidos"
              value={`${stats?.dueCards ?? 0}`}
            />
            <DeckStat
              icon={
                <CalendarClock
                  color={colors.orange}
                  size={21}
                  strokeWidth={2.2}
                />
              }
              label="revisoes"
              value={`${stats?.totalReviews ?? 0}`}
            />
          </View>

          <View className="mb-5 rounded-[22px] bg-deck-card p-5">
            <View className="mb-3 flex-row items-center justify-between">
              <AppText className="text-[17px] text-white" weight="bold">
                Progresso do deck
              </AppText>
              <AppText className="text-[13px] text-deck-purple" weight="black">
                {Math.max(0, Math.min(progress, 100))}%
              </AppText>
            </View>
            <View className="h-2 rounded-full bg-white/10">
              <View
                className="h-2 rounded-full bg-deck-purple"
                style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }}
              />
            </View>
            <View className="mt-4 flex-row justify-between">
              <AppText className="text-[12px] text-deck-muted" weight="bold">
                Precisao
              </AppText>
              <AppText className="text-[12px] text-white" weight="black">
                {stats?.accuracyPercentage ?? 0}%
              </AppText>
            </View>
          </View>

          <View className="mb-3 flex-row items-center justify-between">
            <AppText className="text-[19px] text-white" weight="bold">
              Cards principais
            </AppText>
            {deck.isOwner ? (
              <Pressable
                onPress={() =>
                  navigation.navigate('DeckEdit', {
                    deckId: deck.id,
                    mode: 'edit',
                  })
                }
              >
                <AppText
                  className="text-[12px] text-deck-purple"
                  weight="black"
                >
                  Editar
                </AppText>
              </Pressable>
            ) : null}
          </View>
          <View className="flex-row flex-wrap justify-between">
            {cards.map((card) => (
              <MiniCard key={card.id} card={card} deckId={deck.id} />
            ))}
          </View>

          <View className="mt-2 flex-row gap-3">
            <PrimaryButton
              className="flex-1"
              onPress={() =>
                navigation.navigate('StudyQuestion', { deckId: deck.id })
              }
              weight="black"
            >
              Iniciar
            </PrimaryButton>
            {deck.isOwner ? (
              <PrimaryButton
                className="flex-1 border border-deck-purple bg-transparent"
                labelClassName="text-[16px] text-deck-purple"
                onPress={() =>
                  navigation.navigate('DeckEdit', {
                    deckId: deck.id,
                    mode: 'edit',
                  })
                }
                weight="black"
              >
                Editar
              </PrimaryButton>
            ) : (
              <PrimaryButton
                className="flex-1 border border-deck-purple bg-transparent"
                disabled={actionLoading}
                labelClassName="text-[16px] text-deck-purple"
                onPress={toggleSave}
                weight="black"
              >
                {deck.isSaved ? 'Remover' : 'Salvar'}
              </PrimaryButton>
            )}
          </View>

          {!deck.isOwner ? (
            <PrimaryButton
              className="mt-3 bg-deck-soft"
              disabled={actionLoading}
              onPress={forkDeck}
              weight="black"
            >
              Bifurcar para minha biblioteca
            </PrimaryButton>
          ) : null}
        </>
      ) : (
        <View className="rounded-[22px] bg-deck-card p-5">
          <AppText className="text-[19px] text-white" weight="bold">
            Nenhum deck encontrado
          </AppText>
          <AppText
            className="mt-2 text-[13px] leading-[20px] text-deck-muted"
            weight="medium"
          >
            Crie um deck para comecar a cadastrar cards.
          </AppText>
          <PrimaryButton
            className="mt-5"
            onPress={() => navigation.navigate('DeckEdit', { mode: 'create' })}
            weight="black"
          >
            Criar deck
          </PrimaryButton>
        </View>
      )}
    </DarkScreen>
  );
}
