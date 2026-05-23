import './global.css';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  Montserrat_900Black,
} from '@expo-google-fonts/montserrat';

import { CardDetailsScreen } from './src/screens/CardDetailsScreen';
import { CardEditScreen } from './src/screens/CardEditScreen';
import { DeckEditScreen } from './src/screens/DeckEditScreen';
import { DeckOverviewScreen } from './src/screens/DeckOverviewScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SignupScreen } from './src/screens/SignupScreen';
import { StudyAnswerScreen } from './src/screens/StudyAnswerScreen';
import { StudyQuestionScreen } from './src/screens/StudyQuestionScreen';
import { StudyResultsScreen } from './src/screens/StudyResultsScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { colors } from './src/constants/theme';
import type { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            animation: 'fade_from_bottom',
            contentStyle: { backgroundColor: colors.black },
            headerShown: false,
          }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="DeckOverview" component={DeckOverviewScreen} />
          <Stack.Screen name="StudyQuestion" component={StudyQuestionScreen} />
          <Stack.Screen name="StudyAnswer" component={StudyAnswerScreen} />
          <Stack.Screen name="StudyResults" component={StudyResultsScreen} />
          <Stack.Screen name="DeckEdit" component={DeckEditScreen} />
          <Stack.Screen name="CardDetails" component={CardDetailsScreen} />
          <Stack.Screen name="CardEdit" component={CardEditScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
