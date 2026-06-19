import { useNavigation, useRoute } from '@react-navigation/native';
import { Check, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import type { TextInputProps } from 'react-native';
import { Linking, Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '../components/AppText';
import { Brand } from '../components/Brand';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import type { RootNavigation, RootRoute } from '../types/navigation';

function AuthField({
  label,
  ...inputProps
}: TextInputProps & { label: string }) {
  return (
    <View className="mb-4">
      <AppText className="mb-2 text-[13px] text-[#4B5565]" weight="bold">
        {label}
      </AppText>
      <TextInput
        autoCorrect={false}
        className="h-[54px] rounded-[14px] border border-[#DADFE8] bg-white px-4 text-[16px] text-[#111111]"
        placeholderTextColor="#8C95A3"
        style={{ fontFamily: 'Montserrat_600SemiBold' }}
        {...inputProps}
      />
    </View>
  );
}

function CheckboxRow({
  checked,
  children,
  onPress,
}: {
  checked: boolean;
  children: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      className="mb-4 flex-row gap-3"
      onPress={onPress}
    >
      <View
        className={`mt-[2px] h-6 w-6 items-center justify-center rounded-[7px] border ${
          checked
            ? 'border-deck-purple bg-deck-purple'
            : 'border-[#A8B0BE] bg-white'
        }`}
      >
        {checked ? <Check color="white" size={15} strokeWidth={3} /> : null}
      </View>
      <AppText
        className="flex-1 text-[13px] leading-[20px] text-[#5F6978]"
        weight="medium"
      >
        {children}
      </AppText>
    </Pressable>
  );
}

export function SignupScreen() {
  const navigation = useNavigation<RootNavigation>();
  const route = useRoute<RootRoute<'Signup'>>();
  const { error, loading, login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(
    route.params?.mode ?? 'register',
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptsTerms, setAcceptsTerms] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const isRegister = mode === 'register';
  const disabled = useMemo(() => {
    if (loading || !email.trim() || password.length < 8) {
      return true;
    }

    return isRegister && (!name.trim() || !acceptsTerms);
  }, [acceptsTerms, email, isRegister, loading, name, password]);

  async function submit() {
    setLocalError(null);

    try {
      if (isRegister) {
        await register({
          email: email.trim(),
          name: name.trim(),
          password,
        });
      } else {
        await login({
          email: email.trim(),
          password,
        });
      }
    } catch (currentError) {
      setLocalError(
        currentError instanceof Error
          ? currentError.message
          : 'Nao foi possivel autenticar.',
      );
    }
  }

  async function openLegalPage(url: string | undefined) {
    if (!url) {
      setLocalError('Pagina legal ainda nao configurada.');
      return;
    }
    await Linking.openURL(url);
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F5F7FB]">
      <StatusBar style="dark" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 34 }}
      >
        <View className="px-6 pt-5">
          <View className="mb-8 flex-row items-center justify-between">
            <Brand dark />
            <Pressable
              accessibilityLabel="Fechar cadastro"
              accessibilityRole="button"
              className="h-11 w-11 items-center justify-center rounded-full bg-white"
              onPress={() => navigation.navigate('Welcome')}
            >
              <X color={colors.black} size={23} strokeWidth={2.2} />
            </Pressable>
          </View>

          <AppText
            className="text-[31px] leading-[36px] text-[#111111]"
            weight="black"
          >
            {isRegister ? 'Crie sua conta' : 'Entre na sua conta'}
          </AppText>
          <AppText
            className="mt-3 text-[16px] leading-[24px] text-[#667085]"
            weight="medium"
          >
            {isRegister
              ? 'Monte decks, acompanhe revisoes e mantenha um plano de estudo que cabe na sua rotina.'
              : 'Use seu email e senha para continuar estudando com seus decks.'}
          </AppText>

          <View className="mt-8 rounded-[24px] bg-white p-5">
            {isRegister ? (
              <AuthField
                autoCapitalize="words"
                label="Nome"
                onChangeText={setName}
                placeholder="Renata Oliveira"
                textContentType="name"
                value={name}
              />
            ) : null}
            <AuthField
              autoCapitalize="none"
              keyboardType="email-address"
              label="Email"
              onChangeText={setEmail}
              placeholder="renata@email.com"
              textContentType="emailAddress"
              value={email}
            />
            <AuthField
              label="Senha"
              onChangeText={setPassword}
              placeholder={isRegister ? 'Crie uma senha segura' : 'Sua senha'}
              secureTextEntry
              textContentType={isRegister ? 'newPassword' : 'password'}
              value={password}
            />

            {isRegister ? (
              <>
                <CheckboxRow
                  checked={acceptsTerms}
                  onPress={() => setAcceptsTerms((value) => !value)}
                >
                  Li e aceito a Politica de Privacidade e os Termos de Uso da
                  Deckify.
                </CheckboxRow>
                <View className="mb-4 flex-row gap-4 pl-9">
                  <Pressable
                    onPress={() =>
                      void openLegalPage(
                        process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL,
                      )
                    }
                  >
                    <AppText
                      className="text-[11px] text-deck-purple"
                      weight="bold"
                    >
                      Politica de Privacidade
                    </AppText>
                  </Pressable>
                  <Pressable
                    onPress={() =>
                      void openLegalPage(process.env.EXPO_PUBLIC_TERMS_URL)
                    }
                  >
                    <AppText
                      className="text-[11px] text-deck-purple"
                      weight="bold"
                    >
                      Termos de Uso
                    </AppText>
                  </Pressable>
                </View>
              </>
            ) : null}

            {localError || error ? (
              <View className="mb-4 rounded-[14px] bg-[#FFEDED] px-4 py-3">
                <AppText
                  className="text-[12px] leading-[18px] text-[#B42318]"
                  weight="bold"
                >
                  {localError ?? error}
                </AppText>
              </View>
            ) : null}

            <PrimaryButton
              className="mt-2 bg-[#111111]"
              disabled={disabled}
              labelClassName="text-[16px] text-white"
              onPress={submit}
              weight="black"
            >
              {loading ? 'Aguarde...' : isRegister ? 'Criar conta' : 'Entrar'}
            </PrimaryButton>
          </View>

          <Pressable
            className="mt-7"
            onPress={() => setMode(isRegister ? 'login' : 'register')}
          >
            <AppText
              className="text-center text-[14px] text-[#667085]"
              weight="medium"
            >
              {isRegister ? 'Ja tem conta?' : 'Ainda nao tem conta?'}{' '}
              <AppText className="text-[14px] text-[#111111]" weight="black">
                {isRegister ? 'Entrar' : 'Cadastrar'}
              </AppText>
            </AppText>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
