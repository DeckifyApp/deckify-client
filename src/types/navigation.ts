import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Welcome: undefined;
  Signup: { mode?: 'login' | 'register' } | undefined;
  Home: undefined;
  DeckOverview: { deckId?: string } | undefined;
  StudyAnswer: { deckId: string };
  StudyQuestion: { deckId?: string } | undefined;
  StudyResults: { deckId?: string } | undefined;
  DeckEdit: { deckId?: string; mode?: 'create' | 'edit' } | undefined;
  CardDetails: { cardId: string; deckId: string };
  CardEdit: { cardId?: string; deckId: string; mode?: 'create' | 'edit' };
  Profile: undefined;
};

export type RootNavigation = NativeStackNavigationProp<RootStackParamList>;
export type RootRoute<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;
