import { useNavigation } from '@react-navigation/native';
import { Settings2 } from 'lucide-react-native';
import { View } from 'react-native';

import { colors } from '../constants/theme';
import type { RootNavigation } from '../types/navigation';
import { Brand } from './Brand';
import { IconButton } from './IconButton';

export function AppHeader() {
  const navigation = useNavigation<RootNavigation>();

  return (
    <View className="mb-7 flex-row items-center justify-between">
      <Brand />
      <IconButton
        accessibilityLabel="Abrir perfil"
        className="h-10 w-10 bg-deck-soft"
        onPress={() => navigation.navigate('Profile')}
      >
        <Settings2 color={colors.muted} size={20} strokeWidth={2.1} />
      </IconButton>
    </View>
  );
}
