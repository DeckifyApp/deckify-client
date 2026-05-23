import { Bell, Settings2 } from 'lucide-react-native';
import { View } from 'react-native';

import { colors } from '../constants/theme';
import { Brand } from './Brand';
import { IconButton } from './IconButton';

export function AppHeader() {
  return (
    <View className="mb-7 flex-row items-center justify-between">
      <Brand />
      <View className="flex-row items-center gap-3">
        <IconButton accessibilityLabel="Notificações" className="h-10 w-10 bg-deck-soft">
          <Bell color={colors.text} size={20} strokeWidth={2.2} />
        </IconButton>
        <IconButton accessibilityLabel="Configurações" className="h-10 w-10 bg-deck-soft">
          <Settings2 color={colors.muted} size={20} strokeWidth={2.1} />
        </IconButton>
      </View>
    </View>
  );
}
