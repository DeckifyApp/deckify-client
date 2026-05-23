import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Welcome: undefined;
  Signup: undefined;
  Home: undefined;
  DeckOverview: undefined;
  StudyAnswer: undefined;
  StudyQuestion: undefined;
  StudyResults: undefined;
  DeckEdit: undefined;
  CardDetails: undefined;
  CardEdit: undefined;
  Profile: undefined;
};

export type RootNavigation = NativeStackNavigationProp<RootStackParamList>;
