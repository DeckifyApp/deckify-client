import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '../components/AppText';
import { Brand } from '../components/Brand';
import { PrimaryButton } from '../components/PrimaryButton';
import { welcomeImageUrl } from '../constants/theme';
import type { RootNavigation } from '../types/navigation';

export function WelcomeScreen() {
  const navigation = useNavigation<RootNavigation>();

  return (
    <ImageBackground
      className="flex-1 bg-deck-black"
      resizeMode="cover"
      source={{ uri: welcomeImageUrl }}
    >
      <StatusBar style="light" />
      <LinearGradient
        colors={[
          'rgba(7,10,18,0.18)',
          'rgba(7,10,18,0.28)',
          'rgba(7,10,18,0.78)',
          'rgba(7,10,18,0.98)',
        ]}
        end={{ x: 0.5, y: 1 }}
        locations={[0, 0.34, 0.67, 1]}
        start={{ x: 0.5, y: 0 }}
        style={{ flex: 1 }}
      >
        <SafeAreaView className="flex-1 px-6 pb-8 pt-5">
          <Brand />
          <View className="flex-1 justify-end">
            <View className="mb-5 self-start rounded-full border border-white/15 bg-white/10 px-4 py-2">
              <AppText className="text-[12px] text-white" weight="bold">
                Revisões inteligentes
              </AppText>
            </View>
            <AppText
              className="text-[42px] leading-[46px] text-white"
              weight="black"
            >
              Deckify
            </AppText>
            <AppText
              className="mt-4 max-w-[330px] text-[18px] leading-[28px] text-white/85"
              weight="medium"
            >
              Transforme seus estudos em sessões curtas, guiadas por contexto,
              prioridade e progresso real.
            </AppText>
            <View className="mt-8 flex-row gap-3">
              <PrimaryButton
                className="flex-1 bg-white"
                labelClassName="text-[16px] text-[#0E1117]"
                onPress={() =>
                  navigation.navigate('Signup', { mode: 'register' })
                }
                weight="black"
              >
                Cadastrar
              </PrimaryButton>
              <PrimaryButton
                className="flex-1 border border-white/55 bg-transparent"
                labelClassName="text-[16px] text-white"
                onPress={() => navigation.navigate('Signup', { mode: 'login' })}
                weight="black"
              >
                Entrar
              </PrimaryButton>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}
