import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  Bell,
  LogOut,
  Save,
  ShieldCheck,
  UserRound,
} from 'lucide-react-native';
import type { ReactNode } from 'react';
import { useCallback, useState } from 'react';
import { Image, Pressable, TextInput, View } from 'react-native';

import { AppHeader } from '../components/AppHeader';
import { AppText } from '../components/AppText';
import { DarkScreen } from '../components/DarkScreen';
import { PrimaryButton } from '../components/PrimaryButton';
import { avatarUrl, colors } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { api, type DeckSummary, type StudyStats } from '../services/api';
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
        <View className="h-10 w-10 items-center justify-center rounded-[14px] bg-deck-soft">
          {icon}
        </View>
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
  const { logout, updateProfile, user } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [decks, setDecks] = useState<DeckSummary[]>([]);
  const [stats, setStats] = useState<StudyStats | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function load() {
        try {
          const library = await api.decks.list();
          const firstDeck = library[0];
          const firstStats = firstDeck
            ? await api.study.stats(firstDeck.id)
            : null;

          if (active) {
            setDecks(library);
            setStats(firstStats);
            setName(user?.name ?? '');
          }
        } catch (currentError) {
          if (active) {
            setError(
              currentError instanceof Error
                ? currentError.message
                : 'Nao foi possivel carregar o perfil.',
            );
          }
        }
      }

      void load();

      return () => {
        active = false;
      };
    }, [user?.name]),
  );

  async function saveProfile() {
    if (!name.trim()) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await updateProfile({ name: name.trim() });
    } catch (currentError) {
      setError(
        currentError instanceof Error
          ? currentError.message
          : 'Nao foi possivel salvar o perfil.',
      );
    } finally {
      setSaving(false);
    }
  }

  async function signOut() {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
  }

  const firstDeck = decks[0];

  return (
    <DarkScreen activeTab="profile" scroll>
      <AppHeader />

      <View className="items-center rounded-[28px] bg-deck-card p-6">
        <Image
          className="h-24 w-24 rounded-[32px]"
          source={{ uri: user?.avatarUrl ?? avatarUrl }}
        />
        <AppText
          className="mt-4 text-[28px] leading-[32px] text-white"
          weight="black"
        >
          {user?.name ?? 'Perfil'}
        </AppText>
        <AppText
          className="mt-2 text-center text-[13px] leading-[20px] text-deck-muted"
          weight="medium"
        >
          {firstDeck
            ? `Estudando ${firstDeck.title} com ${firstDeck.cardCount} cards.`
            : 'Crie um deck para iniciar seus estudos.'}
        </AppText>
      </View>

      <View className="mt-4 flex-row gap-3">
        <View className="flex-1 rounded-[18px] bg-deck-card p-4">
          <AppText className="text-[25px] text-white" weight="black">
            {decks.length}
          </AppText>
          <AppText className="text-[11px] text-deck-muted" weight="bold">
            decks na biblioteca
          </AppText>
        </View>
        <View className="flex-1 rounded-[18px] bg-deck-card p-4">
          <AppText className="text-[25px] text-white" weight="black">
            {stats?.totalReviews ?? 0}
          </AppText>
          <AppText className="text-[11px] text-deck-muted" weight="bold">
            revisoes feitas
          </AppText>
        </View>
      </View>

      {error ? (
        <View className="mt-5 rounded-[18px] bg-deck-card p-4">
          <AppText
            className="text-[13px] leading-[20px] text-deck-muted"
            weight="bold"
          >
            {error}
          </AppText>
        </View>
      ) : null}

      <View className="mt-6 rounded-[22px] bg-deck-card p-5">
        <AppText className="mb-3 text-[17px] text-white" weight="bold">
          Dados da conta
        </AppText>
        <TextInput
          className="h-[52px] rounded-[18px] bg-deck-soft px-4 text-[15px] text-white"
          onChangeText={setName}
          placeholder="Nome"
          placeholderTextColor={colors.mutedStrong}
          selectionColor={colors.purple}
          style={{ fontFamily: 'Montserrat_600SemiBold' }}
          value={name}
        />
        <AppText className="mt-3 text-[12px] text-deck-muted" weight="bold">
          {user?.email}
        </AppText>
      </View>

      <AppText className="mb-3 mt-6 text-[19px] text-white" weight="bold">
        Preferencias
      </AppText>
      <PreferenceRow
        icon={<Bell color={colors.purpleSoft} size={19} strokeWidth={2.2} />}
        label="Lembretes"
        value="Ativo"
      />
      <PreferenceRow
        icon={<ShieldCheck color={colors.green} size={19} strokeWidth={2.2} />}
        label="Privacidade"
        value="Ativa"
      />
      <PreferenceRow
        icon={<UserRound color={colors.blue} size={19} strokeWidth={2.2} />}
        label="Plano"
        value="Estudante"
      />

      <PrimaryButton
        className="mt-3"
        disabled={saving || !name.trim()}
        onPress={saveProfile}
        weight="black"
      >
        <View className="flex-row items-center gap-2">
          <Save color="white" size={18} strokeWidth={2.3} />
          <AppText className="text-[16px] text-white" weight="black">
            {saving ? 'Salvando...' : 'Salvar perfil'}
          </AppText>
        </View>
      </PrimaryButton>
      <PrimaryButton
        className="mt-3 bg-deck-soft"
        onPress={() =>
          navigation.navigate(
            'DeckOverview',
            firstDeck ? { deckId: firstDeck.id } : undefined,
          )
        }
        weight="black"
      >
        Continuar estudando
      </PrimaryButton>
      <Pressable
        className="mt-5 flex-row items-center justify-center gap-2"
        onPress={() => void signOut()}
      >
        <LogOut color={colors.muted} size={17} strokeWidth={2.2} />
        <AppText className="text-[13px] text-deck-muted" weight="bold">
          Sair da conta
        </AppText>
      </Pressable>
    </DarkScreen>
  );
}
