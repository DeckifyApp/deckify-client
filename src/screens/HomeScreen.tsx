import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  BookOpenText,
  ChevronRight,
  Clock3,
  Flame,
  Star,
} from 'lucide-react-native';
import type { ReactNode } from 'react';
import { useCallback, useState } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';

import { AppHeader } from '../components/AppHeader';
import { AppText } from '../components/AppText';
import { DarkScreen } from '../components/DarkScreen';
import { PrimaryButton } from '../components/PrimaryButton';
import { avatarUrl, colors } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import {
  api,
  type CommunityDeckSummary,
  type DeckSummary,
  type StudyStats,
} from '../services/api';
import type { RootNavigation } from '../types/navigation';

function DashboardMetric({
  color,
  icon,
  label,
  value,
}: {
  color: string;
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-1 rounded-[18px] bg-deck-card p-4">
      <View
        className="mb-3 h-9 w-9 items-center justify-center rounded-[12px]"
        style={{ backgroundColor: color }}
      >
        {icon}
      </View>
      <AppText className="text-[22px] leading-[26px] text-white" weight="black">
        {value}
      </AppText>
      <AppText
        className="mt-1 text-[11px] leading-[16px] text-deck-muted"
        weight="medium"
      >
        {label}
      </AppText>
    </View>
  );
}

function WeeklyProgressCard({ stats }: { stats: StudyStats | null }) {
  const accuracy = Math.round(stats?.accuracyPercentage ?? 0);
  const boxes = stats?.cardsByBox ?? {};
  const learned =
    Number(boxes['3'] ?? 0) + Number(boxes['4'] ?? 0) + Number(boxes['5'] ?? 0);

  return (
    <LinearGradient
      colors={['#262A63', '#171D2A']}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={{ borderRadius: 24, padding: 18 }}
    >
      <View className="mb-5 flex-row items-center justify-between">
        <View>
          <AppText className="text-[18px] text-white" weight="bold">
            Plano da semana
          </AppText>
          <AppText className="mt-1 text-[12px] text-white/60" weight="medium">
            {stats?.dueCards ?? 0} cards para revisar e {learned} consolidados
          </AppText>
        </View>
        <View className="rounded-full bg-white/10 px-3 py-2">
          <AppText className="text-[12px] text-white" weight="black">
            {accuracy}%
          </AppText>
        </View>
      </View>

      <View className="flex-row justify-between">
        {['1', '2', '3', '4', '5'].map((box) => {
          const count = Number(boxes[box] ?? 0);
          const active = count > 0;

          return (
            <View key={box} className="items-center">
              <AppText className="mb-2 text-[10px] text-white/55" weight="bold">
                Caixa
              </AppText>
              <View
                className="h-10 w-10 items-center justify-center rounded-[13px]"
                style={{
                  backgroundColor: active
                    ? colors.purple
                    : 'rgba(255,255,255,0.08)',
                }}
              >
                <AppText
                  className={`text-[13px] ${active ? 'text-white' : 'text-white/60'}`}
                  weight="black"
                >
                  {count}
                </AppText>
              </View>
            </View>
          );
        })}
      </View>
    </LinearGradient>
  );
}

function ContinueDeckCard({
  deck,
  stats,
}: {
  deck: DeckSummary;
  stats: StudyStats | null;
}) {
  const navigation = useNavigation<RootNavigation>();
  const progress =
    deck.cardCount > 0
      ? Math.round(
          (((stats?.totalCards ?? 0) - (stats?.dueCards ?? 0)) /
            deck.cardCount) *
            100,
        )
      : 0;

  return (
    <Pressable
      accessibilityRole="button"
      className="rounded-[24px] bg-deck-card p-5 active:opacity-90"
      onPress={() => navigation.navigate('DeckOverview', { deckId: deck.id })}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-4">
          <AppText className="text-[12px] text-deck-muted" weight="bold">
            Continuar agora
          </AppText>
          <AppText
            className="mt-2 text-[25px] leading-[30px] text-white"
            weight="black"
          >
            {deck.title}
          </AppText>
          <AppText
            className="mt-2 text-[13px] leading-[20px] text-deck-muted"
            weight="medium"
          >
            {deck.description ??
              'Deck pronto para uma sessao curta de revisao.'}
          </AppText>
        </View>
        <View className="h-12 w-12 items-center justify-center rounded-[16px] bg-deck-purple">
          <BookOpenText color="white" size={22} strokeWidth={2.2} />
        </View>
      </View>

      <View className="mb-4 mt-5 h-2 rounded-full bg-white/10">
        <View
          className="h-2 rounded-full bg-deck-green"
          style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }}
        />
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-row gap-3">
          <View>
            <AppText className="text-[18px] text-white" weight="black">
              {stats?.dueCards ?? 0}/{deck.cardCount}
            </AppText>
            <AppText className="text-[10px] text-deck-muted" weight="bold">
              cards vencidos
            </AppText>
          </View>
          <View>
            <AppText className="text-[18px] text-white" weight="black">
              {stats?.accuracyPercentage ?? 0}%
            </AppText>
            <AppText className="text-[10px] text-deck-muted" weight="bold">
              precisao
            </AppText>
          </View>
        </View>
        <ChevronRight color={colors.muted} size={22} strokeWidth={2} />
      </View>
    </Pressable>
  );
}

function RecommendationCard({ item }: { item: CommunityDeckSummary }) {
  const navigation = useNavigation<RootNavigation>();
  const rating = Math.max(1, Math.min(5, item.saveCount + 1));

  return (
    <Pressable
      accessibilityRole="button"
      className="mr-4 w-[260px] rounded-[20px] bg-deck-card p-5 active:opacity-90"
      onPress={() => navigation.navigate('DeckOverview', { deckId: item.id })}
    >
      <View className="mb-5 flex-row">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={`${item.title}-${index}`}
            color={index < rating ? colors.orange : colors.cardMuted}
            fill={index < rating ? colors.orange : 'transparent'}
            size={18}
          />
        ))}
      </View>
      <AppText className="text-[18px] leading-[24px] text-white" weight="bold">
        {item.title}
      </AppText>
      <AppText
        className="mt-2 text-[12px] leading-[18px] text-deck-muted"
        weight="medium"
      >
        {item.cardCount} cards publicos para salvar ou bifurcar
      </AppText>
      <View className="mt-5 flex-row items-center">
        <Image
          className="h-9 w-9 rounded-full"
          source={{ uri: item.owner.avatarUrl ?? avatarUrl }}
        />
        <View className="ml-3">
          <AppText className="text-[12px] text-white" weight="bold">
            {item.owner.name}
          </AppText>
          <AppText className="text-[11px] text-deck-muted" weight="medium">
            {item.saveCount} salvos
          </AppText>
        </View>
      </View>
    </Pressable>
  );
}

export function HomeScreen() {
  const navigation = useNavigation<RootNavigation>();
  const { isAuthenticated, user } = useAuth();
  const [decks, setDecks] = useState<DeckSummary[]>([]);
  const [recommendations, setRecommendations] = useState<
    CommunityDeckSummary[]
  >([]);
  const [activeStats, setActiveStats] = useState<StudyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      if (!isAuthenticated) {
        navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
        return undefined;
      }

      async function load() {
        setLoading(true);
        setError(null);

        try {
          const [library, community] = await Promise.all([
            api.decks.list(),
            api.community.list({ limit: 6, sort: 'popular' }),
          ]);
          const firstDeck = library[0] ?? null;
          const stats = firstDeck ? await api.study.stats(firstDeck.id) : null;

          if (active) {
            setDecks(library);
            setRecommendations(community.data);
            setActiveStats(stats);
          }
        } catch (currentError) {
          if (active) {
            setError(
              currentError instanceof Error
                ? currentError.message
                : 'Nao foi possivel carregar os dados.',
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
    }, [isAuthenticated, navigation]),
  );

  const activeDeck = decks[0] ?? null;

  return (
    <DarkScreen scroll>
      <AppHeader />
      <View className="mb-6 flex-row items-center justify-between">
        <View className="flex-1 pr-4">
          <AppText
            className="text-[26px] leading-[31px] text-white"
            weight="black"
          >
            Ola, {user?.name ?? 'estudante'}
          </AppText>
          <AppText className="mt-1 text-[14px] text-deck-muted" weight="medium">
            {loading
              ? 'Carregando sua biblioteca...'
              : 'Sua fila de revisao esta pronta.'}
          </AppText>
        </View>
        <Image
          className="h-12 w-12 rounded-[18px]"
          source={{ uri: user?.avatarUrl ?? avatarUrl }}
        />
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

      <View className="mb-4 flex-row gap-3">
        <DashboardMetric
          color="rgba(33,198,134,0.18)"
          icon={<Flame color={colors.green} size={19} strokeWidth={2.4} />}
          label="cards vencidos"
          value={`${activeStats?.dueCards ?? 0}`}
        />
        <DashboardMetric
          color="rgba(81,167,255,0.18)"
          icon={<Clock3 color={colors.blue} size={19} strokeWidth={2.4} />}
          label="revisoes feitas"
          value={`${activeStats?.totalReviews ?? 0}`}
        />
      </View>

      <WeeklyProgressCard stats={activeStats} />

      <View className="mb-3 mt-7 flex-row items-center justify-between">
        <AppText className="text-[19px] text-white" weight="bold">
          Proxima sessao
        </AppText>
        {activeDeck ? (
          <Pressable
            onPress={() =>
              navigation.navigate('DeckOverview', { deckId: activeDeck.id })
            }
          >
            <AppText className="text-[12px] text-deck-purple" weight="black">
              Ver deck
            </AppText>
          </Pressable>
        ) : null}
      </View>
      {activeDeck ? (
        <ContinueDeckCard deck={activeDeck} stats={activeStats} />
      ) : (
        <View className="rounded-[24px] bg-deck-card p-5">
          <AppText
            className="text-[19px] leading-[25px] text-white"
            weight="bold"
          >
            Nenhum deck na biblioteca
          </AppText>
          <AppText
            className="mt-2 text-[13px] leading-[20px] text-deck-muted"
            weight="medium"
          >
            Crie um deck ou salve um dos decks da comunidade para comecar.
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

      <View className="mb-3 mt-7 flex-row items-center justify-between">
        <AppText className="text-[19px] text-white" weight="bold">
          Recomendados
        </AppText>
        <Pressable onPress={() => navigation.navigate('Community')}>
          <AppText className="text-[12px] text-deck-purple" weight="black">
            Ver comunidade
          </AppText>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="-mr-6"
      >
        {recommendations.map((item) => (
          <RecommendationCard key={item.id} item={item} />
        ))}
      </ScrollView>

      <PrimaryButton
        className="mt-7"
        onPress={() =>
          activeDeck
            ? navigation.navigate('StudyQuestion', { deckId: activeDeck.id })
            : navigation.navigate('DeckEdit', { mode: 'create' })
        }
        weight="black"
      >
        {activeDeck ? 'Iniciar revisao de hoje' : 'Criar primeiro deck'}
      </PrimaryButton>
    </DarkScreen>
  );
}
