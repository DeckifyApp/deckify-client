import type { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../constants/theme';
import { BottomNav } from './BottomNav';

type DarkScreenProps = {
  activeTab?: 'home' | 'library' | 'plus' | 'chart' | 'profile';
  children: ReactNode;
  contentClassName?: string;
  scroll?: boolean;
};

function BackgroundPattern() {
  return (
    <View className="absolute inset-0 overflow-hidden bg-deck-black">
      <LinearGradient
        colors={[colors.black, '#121B2A', colors.black]}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.42, 1]}
        start={{ x: 0, y: 0 }}
        style={{ flex: 1 }}
      />
      <View className="absolute left-0 right-0 top-[210px] h-[1px] bg-white/5" />
      <View className="absolute left-0 right-0 top-[460px] h-[1px] bg-white/5" />
    </View>
  );
}

export function DarkScreen({ activeTab = 'home', children, contentClassName = '', scroll = false }: DarkScreenProps) {
  const content = <View className={`px-6 pb-[132px] pt-3 ${scroll ? '' : 'flex-1'} ${contentClassName}`}>{children}</View>;

  return (
    <SafeAreaView className="flex-1 bg-deck-black">
      <StatusBar style="light" />
      <BackgroundPattern />
      {scroll ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
      <BottomNav active={activeTab} />
    </SafeAreaView>
  );
}
