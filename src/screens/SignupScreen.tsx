import { useNavigation } from '@react-navigation/native';
import { Check, ChevronDown, X } from 'lucide-react-native';
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import type { TextInputProps } from 'react-native';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '../components/AppText';
import { Brand } from '../components/Brand';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../constants/theme';
import type { RootNavigation } from '../types/navigation';

const fields: Array<TextInputProps & { label: string }> = [
  {
    autoCapitalize: 'none',
    keyboardType: 'email-address',
    label: 'Email',
    placeholder: 'renata@email.com',
    textContentType: 'emailAddress',
  },
  {
    label: 'Senha',
    placeholder: 'Crie uma senha segura',
    secureTextEntry: true,
    textContentType: 'newPassword',
  },
  {
    label: 'Nome',
    placeholder: 'Renata',
    textContentType: 'givenName',
  },
  {
    label: 'Sobrenome',
    placeholder: 'Oliveira',
    textContentType: 'familyName',
  },
  {
    keyboardType: 'numbers-and-punctuation',
    label: 'Data de nascimento',
    placeholder: '22/05/2001',
  },
];

function SignupField({ label, ...inputProps }: TextInputProps & { label: string }) {
  return (
    <View className="mb-4">
      <AppText className="mb-2 text-[13px] text-[#4B5565]" weight="bold">
        {label}
      </AppText>
      <TextInput
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
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked }} className="mb-4 flex-row gap-3" onPress={onPress}>
      <View
        className={`mt-[2px] h-6 w-6 items-center justify-center rounded-[7px] border ${
          checked ? 'border-deck-purple bg-deck-purple' : 'border-[#A8B0BE] bg-white'
        }`}
      >
        {checked ? <Check color="white" size={15} strokeWidth={3} /> : null}
      </View>
      <AppText className="flex-1 text-[13px] leading-[20px] text-[#5F6978]" weight="medium">
        {children}
      </AppText>
    </Pressable>
  );
}

export function SignupScreen() {
  const navigation = useNavigation<RootNavigation>();
  const [acceptsUpdates, setAcceptsUpdates] = useState(true);
  const [acceptsTerms, setAcceptsTerms] = useState(true);

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

          <AppText className="text-[31px] leading-[36px] text-[#111111]" weight="black">
            Crie sua conta
          </AppText>
          <AppText className="mt-3 text-[16px] leading-[24px] text-[#667085]" weight="medium">
            Monte decks, acompanhe revisões e mantenha um plano de estudo que cabe na sua rotina.
          </AppText>

          <View className="mt-8 rounded-[24px] bg-white p-5">
            {fields.map((field) => (
              <SignupField key={field.label} {...field} />
            ))}

            <View className="mb-5">
              <AppText className="mb-2 text-[13px] text-[#4B5565]" weight="bold">
                País de origem
              </AppText>
              <Pressable className="h-[54px] flex-row items-center justify-between rounded-[14px] border border-[#DADFE8] bg-white px-4">
                <AppText className="text-[16px] text-[#111111]" weight="semibold">
                  Brasil
                </AppText>
                <ChevronDown color="#8C95A3" size={22} strokeWidth={2} />
              </Pressable>
            </View>

            <CheckboxRow checked={acceptsUpdates} onPress={() => setAcceptsUpdates((value) => !value)}>
              Quero receber lembretes e novidades de estudo da Deckify.
            </CheckboxRow>
            <CheckboxRow checked={acceptsTerms} onPress={() => setAcceptsTerms((value) => !value)}>
              Li e aceito a Política de Privacidade e os Termos de Uso da Deckify.
            </CheckboxRow>

            <PrimaryButton
              className="mt-2 bg-[#111111]"
              disabled={!acceptsTerms}
              labelClassName="text-[16px] text-white"
              onPress={() => navigation.navigate('Home')}
              weight="black"
            >
              Criar conta
            </PrimaryButton>
          </View>

          <Pressable className="mt-7" onPress={() => navigation.navigate('Home')}>
            <AppText className="text-center text-[14px] text-[#667085]" weight="medium">
              Já tem conta?{' '}
              <AppText className="text-[14px] text-[#111111]" weight="black">
                Entrar
              </AppText>
            </AppText>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
