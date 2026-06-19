import type { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from './BottomNav';

type DarkScreenProps = {
  activeTab?: 'home' | 'library' | 'plus' | 'community' | 'profile';
  children: ReactNode;
  contentClassName?: string;
  scroll?: boolean;
};

function BackgroundPattern() {
  return (
    <View className="absolute inset-0 overflow-hidden bg-deck-black">
      <LinearGradient
        colors={['#090C13', '#111827', '#0B0F17']}
        end={{ x: 0.85, y: 1 }}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        style={{ flex: 1 }}
      />
      <LinearGradient
        className="absolute inset-0"
        colors={[
          'rgba(108,99,255,0.14)',
          'rgba(108,99,255,0.025)',
          'rgba(81,167,255,0.05)',
          'transparent',
        ]}
        end={{ x: 0.15, y: 1 }}
        locations={[0, 0.28, 0.7, 1]}
        start={{ x: 1, y: 0 }}
      />
      <View
        className="absolute rounded-full border border-deck-purple/10"
        style={{
          backgroundColor: 'rgba(108,99,255,0.035)',
          height: 520,
          right: -300,
          top: -285,
          width: 520,
        }}
      />
      <View
        className="absolute rounded-full border border-white/5"
        style={{
          height: 300,
          right: -180,
          top: -130,
          width: 300,
        }}
      />
      <View
        className="absolute rounded-full border border-deck-blue/5"
        style={{
          backgroundColor: 'rgba(81,167,255,0.025)',
          bottom: 40,
          height: 420,
          left: -330,
          width: 420,
        }}
      />
    </View>
  );
}

export function DarkScreen({
  activeTab = 'home',
  children,
  contentClassName = '',
  scroll = false,
}: DarkScreenProps) {
  const content = (
    <View
      className={`px-6 pb-[132px] pt-3 ${scroll ? '' : 'flex-1'} ${contentClassName}`}
    >
      {children}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-deck-black">
      <StatusBar style="light" />
      <BackgroundPattern />
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
      <BottomNav active={activeTab} />
    </SafeAreaView>
  );
}
