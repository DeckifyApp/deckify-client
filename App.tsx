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
import { CommunityScreen } from './src/screens/CommunityScreen';
import { DeckEditScreen } from './src/screens/DeckEditScreen';
import { DeckOverviewScreen } from './src/screens/DeckOverviewScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SignupScreen } from './src/screens/SignupScreen';
import { StudyAnswerScreen } from './src/screens/StudyAnswerScreen';
import { StudyQuestionScreen } from './src/screens/StudyQuestionScreen';
import { StudyResultsScreen } from './src/screens/StudyResultsScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { colors } from './src/constants/theme';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { StudySessionProvider } from './src/context/StudySessionContext';
import type { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { initialized, isAuthenticated } = useAuth();

  if (!initialized) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        key={isAuthenticated ? 'authenticated' : 'anonymous'}
        initialRouteName={isAuthenticated ? 'Home' : 'Welcome'}
        screenOptions={{
          animation: 'fade_from_bottom',
          contentStyle: { backgroundColor: colors.black },
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Library" component={LibraryScreen} />
            <Stack.Screen name="Community" component={CommunityScreen} />
            <Stack.Screen name="DeckOverview" component={DeckOverviewScreen} />
            <Stack.Screen
              name="StudyQuestion"
              component={StudyQuestionScreen}
            />
            <Stack.Screen name="StudyAnswer" component={StudyAnswerScreen} />
            <Stack.Screen name="StudyResults" component={StudyResultsScreen} />
            <Stack.Screen name="DeckEdit" component={DeckEditScreen} />
            <Stack.Screen name="CardDetails" component={CardDetailsScreen} />
            <Stack.Screen name="CardEdit" component={CardEditScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

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
      <AuthProvider>
        <StudySessionProvider>
          <AppNavigator />
        </StudySessionProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
