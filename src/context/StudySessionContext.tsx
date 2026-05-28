import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { api, type DueCard, type ReviewResult } from '../services/api';

type StudySession = {
  againCount: number;
  cards: DueCard[];
  deckId: string;
  goodCount: number;
  index: number;
};

type StudySessionContextValue = {
  againCount: number;
  cards: DueCard[];
  currentCard: DueCard | null;
  deckId: string | null;
  goodCount: number;
  loading: boolean;
  reviewedCount: number;
  startSession: (deckId: string) => Promise<void>;
  totalCards: number;
  reviewCurrent: (result: ReviewResult) => Promise<boolean>;
  resetSession: () => void;
};

const StudySessionContext = createContext<StudySessionContextValue | undefined>(
  undefined,
);

export function StudySessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<StudySession | null>(null);
  const [loading, setLoading] = useState(false);

  const startSession = useCallback(async (deckId: string) => {
    setLoading(true);
    try {
      await api.study.start(deckId);
      const dueCards = await api.study.due(deckId, 100);
      setSession({
        againCount: 0,
        cards: dueCards,
        deckId,
        goodCount: 0,
        index: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const reviewCurrent = useCallback(
    async (result: ReviewResult) => {
      if (!session) {
        return false;
      }

      const currentCard = session.cards[session.index];
      if (!currentCard) {
        return false;
      }

      await api.study.review(currentCard.cardId, result);

      const nextIndex = session.index + 1;
      const hasNext = nextIndex < session.cards.length;

      setSession({
        ...session,
        againCount: session.againCount + (result === 'AGAIN' ? 1 : 0),
        goodCount: session.goodCount + (result === 'GOOD' ? 1 : 0),
        index: nextIndex,
      });

      return hasNext;
    },
    [session],
  );

  const resetSession = useCallback(() => setSession(null), []);

  const value = useMemo<StudySessionContextValue>(() => {
    const currentCard = session?.cards[session.index] ?? null;

    return {
      againCount: session?.againCount ?? 0,
      cards: session?.cards ?? [],
      currentCard,
      deckId: session?.deckId ?? null,
      goodCount: session?.goodCount ?? 0,
      loading,
      resetSession,
      reviewCurrent,
      reviewedCount: session
        ? Math.min(session.index, session.cards.length)
        : 0,
      startSession,
      totalCards: session?.cards.length ?? 0,
    };
  }, [loading, resetSession, reviewCurrent, session, startSession]);

  return (
    <StudySessionContext.Provider value={value}>
      {children}
    </StudySessionContext.Provider>
  );
}

export function useStudySession() {
  const context = useContext(StudySessionContext);

  if (!context) {
    throw new Error('useStudySession must be used within StudySessionProvider');
  }

  return context;
}
