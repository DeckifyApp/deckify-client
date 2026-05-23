import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Camera, Check, X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { AppHeader } from '../components/AppHeader';
import { AppText } from '../components/AppText';
import { DarkScreen } from '../components/DarkScreen';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../constants/theme';
import { deck } from '../data/appData';
import type { RootNavigation } from '../types/navigation';

function EditBox({
  accent,
  onChangeText,
  title,
  value,
}: {
  accent: string;
  onChangeText: (value: string) => void;
  title: string;
  value: string;
}) {
  const navigation = useNavigation<RootNavigation>();

  return (
    <View className="mb-4 rounded-[24px] bg-deck-card p-5">
      <View className="mb-4 flex-row items-center justify-between">
        <View>
          <AppText className="text-[17px] text-white" weight="bold">
            {title}
          </AppText>
          <View className="mt-2 h-1 w-12 rounded-full" style={{ backgroundColor: accent }} />
        </View>
        <View className="flex-row items-center gap-2">
          <Pressable className="h-9 w-9 items-center justify-center rounded-[13px] bg-deck-soft" onPress={() => navigation.navigate('CardDetails')}>
            <X color={colors.red} size={18} strokeWidth={2.2} />
          </Pressable>
          <Pressable className="h-9 w-9 items-center justify-center rounded-[13px] bg-deck-soft" onPress={() => navigation.navigate('CardDetails')}>
            <Check color={colors.green} size={19} strokeWidth={2.2} />
          </Pressable>
        </View>
      </View>
      <TextInput
        className="min-h-[132px] rounded-[18px] bg-deck-soft px-4 py-4 text-[16px] leading-[25px] text-white"
        multiline
        onChangeText={onChangeText}
        placeholderTextColor={colors.mutedStrong}
        selectionColor={colors.purple}
        style={{ fontFamily: 'Montserrat_600SemiBold', textAlignVertical: 'top' }}
        value={value}
      />
      <Pressable className="mt-4 flex-row items-center gap-2 self-start rounded-full bg-deck-soft px-3 py-2">
        <Camera color={colors.muted} size={17} strokeWidth={2.2} />
        <AppText className="text-[11px] text-deck-muted" weight="bold">
          Anexar imagem
        </AppText>
      </Pressable>
    </View>
  );
}

export function CardEditScreen() {
  const navigation = useNavigation<RootNavigation>();
  const card = deck.cards[0];
  const [question, setQuestion] = useState(card.title);
  const [answer, setAnswer] = useState(card.answer);

  return (
    <DarkScreen activeTab="plus" scroll>
      <AppHeader />
      <View className="mb-6 flex-row items-center justify-between">
        <Pressable className="flex-row items-center gap-2" onPress={() => navigation.navigate('CardDetails')}>
          <ArrowLeft color={colors.muted} size={18} strokeWidth={2.2} />
          <AppText className="text-[13px] text-deck-muted" weight="bold">
            Cancelar
          </AppText>
        </Pressable>
        <AppText className="text-[13px] text-deck-muted" weight="bold">
          Card {card.index}
        </AppText>
      </View>

      <View className="mb-5">
        <AppText className="text-[29px] leading-[34px] text-white" weight="black">
          Editar card
        </AppText>
        <AppText className="mt-2 text-[13px] text-deck-muted" weight="medium">
          Mantenha pergunta e resposta curtas para revisões rápidas.
        </AppText>
      </View>

      <EditBox accent={colors.purple} onChangeText={setQuestion} title="Pergunta" value={question} />
      <EditBox accent={colors.green} onChangeText={setAnswer} title="Resposta" value={answer} />

      <PrimaryButton className="mt-2" onPress={() => navigation.navigate('CardDetails')} weight="black">
        Salvar alterações
      </PrimaryButton>
    </DarkScreen>
  );
}
