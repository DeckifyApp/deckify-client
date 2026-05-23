import { useNavigation } from '@react-navigation/native';
import { Bell, LogOut, ShieldCheck, UserRound } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Image, Pressable, View } from 'react-native';

import { AppHeader } from '../components/AppHeader';
import { AppText } from '../components/AppText';
import { DarkScreen } from '../components/DarkScreen';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../constants/theme';
import { deck, user } from '../data/appData';
import type { RootNavigation } from '../types/navigation';

function PreferenceRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View className="mb-3 flex-row items-center justify-between rounded-[18px] bg-deck-card px-4 py-4">
      <View className="flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-[14px] bg-deck-soft">{icon}</View>
        <AppText className="text-[14px] text-white" weight="bold">
          {label}
        </AppText>
      </View>
      <AppText className="text-[12px] text-deck-muted" weight="black">
        {value}
      </AppText>
    </View>
  );
}

export function ProfileScreen() {
  const navigation = useNavigation<RootNavigation>();

  return (
    <DarkScreen activeTab="profile" scroll>
      <AppHeader />

      <View className="items-center rounded-[28px] bg-deck-card p-6">
        <Image className="h-24 w-24 rounded-[32px]" source={{ uri: user.avatarUrl }} />
        <AppText className="mt-4 text-[28px] leading-[32px] text-white" weight="black">
          {user.name} Oliveira
        </AppText>
        <AppText className="mt-2 text-center text-[13px] leading-[20px] text-deck-muted" weight="medium">
          Estudando {deck.title} com meta diária de {user.dailyGoal} cards.
        </AppText>
      </View>

      <View className="mt-4 flex-row gap-3">
        <View className="flex-1 rounded-[18px] bg-deck-card p-4">
          <AppText className="text-[25px] text-white" weight="black">
            {user.streakDays}
          </AppText>
          <AppText className="text-[11px] text-deck-muted" weight="bold">
            dias em sequência
          </AppText>
        </View>
        <View className="flex-1 rounded-[18px] bg-deck-card p-4">
          <AppText className="text-[25px] text-white" weight="black">
            {user.focusMinutes}
          </AppText>
          <AppText className="text-[11px] text-deck-muted" weight="bold">
            minutos hoje
          </AppText>
        </View>
      </View>

      <AppText className="mb-3 mt-6 text-[19px] text-white" weight="bold">
        Preferências
      </AppText>
      <PreferenceRow icon={<Bell color={colors.purpleSoft} size={19} strokeWidth={2.2} />} label="Lembretes" value="18:30" />
      <PreferenceRow icon={<ShieldCheck color={colors.green} size={19} strokeWidth={2.2} />} label="Privacidade" value="Ativa" />
      <PreferenceRow icon={<UserRound color={colors.blue} size={19} strokeWidth={2.2} />} label="Plano" value="Estudante" />

      <PrimaryButton className="mt-3" onPress={() => navigation.navigate('DeckOverview')} weight="black">
        Continuar estudando
      </PrimaryButton>
      <Pressable className="mt-5 flex-row items-center justify-center gap-2" onPress={() => navigation.navigate('Welcome')}>
        <LogOut color={colors.muted} size={17} strokeWidth={2.2} />
        <AppText className="text-[13px] text-deck-muted" weight="bold">
          Sair da conta
        </AppText>
      </Pressable>
    </DarkScreen>
  );
}
