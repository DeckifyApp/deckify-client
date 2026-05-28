import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { Check, Clock3, RotateCcw, Trophy } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { View } from 'react-native';

import { AppHeader } from '../components/AppHeader';
import { AppText } from '../components/AppText';
import { DarkScreen } from '../components/DarkScreen';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../constants/theme';
import { useStudySession } from '../context/StudySessionContext';
import { api, type DeckDetail, type StudyStats } from '../services/api';
import type { RootNavigation, RootRoute } from '../types/navigation';

function MetricTile({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-1 rounded-[18px] bg-deck-card p-4">
      <AppText
        className="text-[25px] leading-[29px]"
        style={{ color }}
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

function BoxRow({ count, label }: { count: number; label: string }) {
  return (
    <View className="mb-3 flex-row items-center justify-between rounded-[16px] bg-deck-soft px-4 py-3">
      <View className="flex-1 pr-3">
        <AppText
          className="text-[13px] text-white"
          numberOfLines={1}
          weight="bold"
        >
          {label}
        </AppText>
        <AppText className="mt-1 text-[11px] text-deck-muted" weight="medium">
          Leitner
        </AppText>
      </View>
      <AppText className="text-[16px] text-white" weight="black">
        {count}
      </AppText>
    </View>
  );
}

export function StudyResultsScreen() {
  const navigation = useNavigation<RootNavigation>();
  const route = useRoute<RootRoute<'StudyResults'>>();
  const {
    againCount,
    deckId: sessionDeckId,
    goodCount,
    reviewedCount,
    totalCards,
  } = useStudySession();
  const deckId = route.params?.deckId ?? sessionDeckId;
  const [deck, setDeck] = useState<DeckDetail | null>(null);
  const [stats, setStats] = useState<StudyStats | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function load() {
        if (!deckId) {
          return;
        }

        const [deckData, statsData] = await Promise.all([
          api.decks.get(deckId),
          api.study.stats(deckId),
        ]);
        if (active) {
          setDeck(deckData);
          setStats(statsData);
        }
      }

      void load();

      return () => {
        active = false;
      };
    }, [deckId]),
  );

  const sessionAccuracy =
    reviewedCount > 0 ? Math.round((goodCount / reviewedCount) * 100) : 0;

  return (
    <DarkScreen activeTab="chart" scroll>
      <AppHeader />

      <View className="mb-5">
        <AppText
          className="text-[31px] leading-[36px] text-white"
          weight="black"
        >
          Sessao concluida
        </AppText>
        <AppText
          className="mt-2 text-[14px] leading-[21px] text-deck-muted"
          weight="medium"
        >
          {deck
            ? `Voce fechou a revisao de ${deck.title}.`
            : 'Sua fila de revisao foi atualizada.'}
        </AppText>
      </View>

      <View className="rounded-[28px] bg-deck-purple p-5">
        <View className="mb-6 flex-row items-center justify-between">
          <View className="h-12 w-12 items-center justify-center rounded-[17px] bg-white/15">
            <Trophy color="white" size={24} strokeWidth={2.2} />
          </View>
          <View className="rounded-full bg-white/15 px-3 py-2">
            <AppText className="text-[11px] text-white" weight="black">
              {reviewedCount}/{totalCards} cards
            </AppText>
          </View>
        </View>
        <AppText
          className="text-[48px] leading-[52px] text-white"
          weight="black"
        >
          {sessionAccuracy}%
        </AppText>
        <AppText className="mt-1 text-[15px] text-white/80" weight="bold">
          de acerto nesta sessao
        </AppText>
        <View className="mt-6 h-2 rounded-full bg-white/20">
          <View
            className="h-2 rounded-full bg-white"
            style={{ width: `${sessionAccuracy}%` }}
          />
        </View>
      </View>

      <View className="mt-4 flex-row gap-3">
        <MetricTile
          color={colors.green}
          label="acertos"
          value={`${goodCount}`}
        />
        <MetricTile
          color={colors.orange}
          label="pendentes"
          value={`${stats?.dueCards ?? 0}`}
        />
        <MetricTile color={colors.red} label="erros" value={`${againCount}`} />
      </View>

      <View className="mt-4 rounded-[22px] bg-deck-card p-5">
        <View className="mb-4 flex-row items-center justify-between">
          <View>
            <AppText className="text-[17px] text-white" weight="bold">
              Progresso geral
            </AppText>
            <AppText
              className="mt-1 text-[12px] text-deck-muted"
              weight="medium"
            >
              {stats?.totalReviews ?? 0} revisoes registradas
            </AppText>
          </View>
          <RotateCcw color={colors.purpleSoft} size={22} strokeWidth={2.2} />
        </View>
        <View className="flex-row justify-between">
          {['1', '2', '3', '4', '5'].map((box) => (
            <View
              key={box}
              className="h-10 w-10 items-center justify-center rounded-[13px]"
              style={{
                backgroundColor:
                  Number(stats?.cardsByBox[box] ?? 0) > 0
                    ? colors.purple
                    : colors.cardMuted,
              }}
            >
              <AppText className="text-[12px] text-white" weight="black">
                {stats?.cardsByBox[box] ?? 0}
              </AppText>
            </View>
          ))}
        </View>
      </View>

      <View className="mt-5 flex-row gap-3">
        <View className="flex-1 rounded-[22px] bg-deck-card p-4">
          <View className="mb-4 flex-row items-center gap-2">
            <Check color={colors.green} size={17} strokeWidth={2.4} />
            <AppText className="text-[15px] text-white" weight="bold">
              Hoje
            </AppText>
          </View>
          <BoxRow count={goodCount} label="Cards lembrados" />
          <BoxRow count={againCount} label="Cards para reforcar" />
        </View>
        <View className="flex-1 rounded-[22px] bg-deck-card p-4">
          <View className="mb-4 flex-row items-center gap-2">
            <Clock3 color={colors.blue} size={17} strokeWidth={2.4} />
            <AppText className="text-[15px] text-white" weight="bold">
              Deck
            </AppText>
          </View>
          <BoxRow count={stats?.correctReviews ?? 0} label="Acertos totais" />
          <BoxRow count={stats?.incorrectReviews ?? 0} label="Erros totais" />
        </View>
      </View>

      <PrimaryButton
        className="mt-6"
        onPress={() =>
          navigation.navigate('DeckOverview', deckId ? { deckId } : undefined)
        }
        weight="black"
      >
        Ver detalhes do deck
      </PrimaryButton>
    </DarkScreen>
  );
}
