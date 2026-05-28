import { useNavigation } from '@react-navigation/native';
import {
  BarChart3,
  BookOpenCheck,
  Home,
  Plus,
  UserRound,
} from 'lucide-react-native';
import { Image, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { avatarUrl, colors } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import type { RootNavigation } from '../types/navigation';
import { AppText } from './AppText';

type BottomNavProps = {
  active?: 'home' | 'library' | 'plus' | 'chart' | 'profile';
};

export function BottomNav({ active = 'home' }: BottomNavProps) {
  const navigation = useNavigation<RootNavigation>();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const iconColor = colors.muted;
  const profileImageUrl = user?.avatarUrl ?? avatarUrl;

  const itemClass =
    'h-[56px] min-w-[44px] items-center justify-center rounded-[18px] px-1';
  const labelClass = 'mt-1 text-[9px]';

  return (
    <View
      className="absolute left-4 right-4 z-20 h-[74px] flex-row items-center justify-between rounded-[28px] border border-white/5 bg-[#151B25] px-2 shadow-2xl"
      style={{ bottom: Math.max(insets.bottom, 18) + 16 }}
    >
      <Pressable
        accessibilityLabel="Início"
        accessibilityRole="button"
        className={`${itemClass} ${active === 'home' ? 'bg-deck-soft' : ''}`}
        onPress={() => navigation.navigate('Home')}
      >
        <Home
          color={active === 'home' ? colors.white : iconColor}
          size={20}
          strokeWidth={2.4}
        />
        <AppText
          className={`${labelClass} ${active === 'home' ? 'text-white' : 'text-deck-muted'}`}
          weight="bold"
        >
          Início
        </AppText>
      </Pressable>
      <Pressable
        accessibilityLabel="Biblioteca"
        accessibilityRole="button"
        className={`${itemClass} ${active === 'library' ? 'bg-deck-soft' : ''}`}
        onPress={() => navigation.navigate('DeckOverview')}
      >
        <BookOpenCheck
          color={active === 'library' ? colors.white : iconColor}
          size={20}
          strokeWidth={2.2}
        />
        <AppText
          className={`${labelClass} ${active === 'library' ? 'text-white' : 'text-deck-muted'}`}
          weight="bold"
        >
          Decks
        </AppText>
      </Pressable>
      <Pressable
        accessibilityLabel="Novo deck"
        accessibilityRole="button"
        className="h-[56px] w-[56px] items-center justify-center rounded-[22px] bg-deck-purple shadow-xl"
        onPress={() => navigation.navigate('DeckEdit')}
      >
        <Plus color="white" size={28} strokeWidth={2} />
      </Pressable>
      <Pressable
        accessibilityLabel="Insights"
        accessibilityRole="button"
        className={`${itemClass} ${active === 'chart' ? 'bg-deck-soft' : ''}`}
        onPress={() => navigation.navigate('StudyResults')}
      >
        <BarChart3
          color={active === 'chart' ? colors.white : iconColor}
          size={20}
          strokeWidth={2.2}
        />
        <AppText
          className={`${labelClass} ${active === 'chart' ? 'text-white' : 'text-deck-muted'}`}
          weight="bold"
        >
          Dados
        </AppText>
      </Pressable>
      <Pressable
        accessibilityLabel="Perfil"
        accessibilityRole="button"
        className={`${itemClass} ${active === 'profile' ? 'bg-deck-soft' : ''}`}
        onPress={() => navigation.navigate('Profile')}
      >
        {active === 'profile' ? (
          <UserRound color={colors.white} size={20} strokeWidth={2.2} />
        ) : (
          <Image
            className="h-6 w-6 rounded-full"
            source={{ uri: profileImageUrl }}
          />
        )}
        <AppText
          className={`${labelClass} ${active === 'profile' ? 'text-white' : 'text-deck-muted'}`}
          weight="bold"
        >
          Perfil
        </AppText>
      </Pressable>
    </View>
  );
}
