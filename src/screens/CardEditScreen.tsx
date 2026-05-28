import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { ArrowLeft, Save } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { AppHeader } from '../components/AppHeader';
import { AppText } from '../components/AppText';
import { DarkScreen } from '../components/DarkScreen';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../constants/theme';
import { api, type Card, type CardDifficulty } from '../services/api';
import type { RootNavigation, RootRoute } from '../types/navigation';

const difficulties: Array<{ label: string; value: CardDifficulty }> = [
  { label: 'Facil', value: 'EASY' },
  { label: 'Medio', value: 'MEDIUM' },
  { label: 'Dificil', value: 'HARD' },
];

function EditBox({
  accent,
  onChangeText,
  placeholder,
  title,
  value,
}: {
  accent: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  title: string;
  value: string;
}) {
  return (
    <View className="mb-4 rounded-[24px] bg-deck-card p-5">
      <View className="mb-4">
        <AppText className="text-[17px] text-white" weight="bold">
          {title}
        </AppText>
        <View
          className="mt-2 h-1 w-12 rounded-full"
          style={{ backgroundColor: accent }}
        />
      </View>
      <TextInput
        className="min-h-[132px] rounded-[18px] bg-deck-soft px-4 py-4 text-[16px] leading-[25px] text-white"
        multiline
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedStrong}
        selectionColor={colors.purple}
        style={{
          fontFamily: 'Montserrat_600SemiBold',
          textAlignVertical: 'top',
        }}
        value={value}
      />
    </View>
  );
}

export function CardEditScreen() {
  const navigation = useNavigation<RootNavigation>();
  const route = useRoute<RootRoute<'CardEdit'>>();
  const { cardId, deckId } = route.params;
  const isEditing = Boolean(cardId);
  const [card, setCard] = useState<Card | null>(null);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [explanation, setExplanation] = useState('');
  const [difficulty, setDifficulty] = useState<CardDifficulty>('MEDIUM');
  const [position, setPosition] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSave = useMemo(
    () => front.trim().length > 0 && back.trim().length > 0 && !saving,
    [back, front, saving],
  );

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function load() {
        setLoading(true);
        setError(null);

        try {
          if (cardId) {
            const cardData = await api.cards.get(cardId);
            if (active) {
              setCard(cardData);
              setFront(cardData.front);
              setBack(cardData.back);
              setExplanation(cardData.explanation ?? '');
              setDifficulty(cardData.difficulty);
              setPosition(cardData.position);
            }
          } else {
            const deckCards = await api.cards.listByDeck(deckId);
            if (active) {
              setCard(null);
              setFront('');
              setBack('');
              setExplanation('');
              setDifficulty('MEDIUM');
              setPosition(deckCards.length + 1);
            }
          }
        } catch (currentError) {
          if (active) {
            setError(
              currentError instanceof Error
                ? currentError.message
                : 'Nao foi possivel carregar o card.',
            );
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      }

      void load();

      return () => {
        active = false;
      };
    }, [cardId, deckId]),
  );

  async function saveCard() {
    setSaving(true);
    setError(null);

    try {
      const payload = {
        back: back.trim(),
        difficulty,
        explanation: explanation.trim() ? explanation.trim() : null,
        front: front.trim(),
        position: position || 0,
      };

      const saved = cardId
        ? await api.cards.update(cardId, payload)
        : await api.cards.create(deckId, payload);
      navigation.navigate('CardDetails', { cardId: saved.id, deckId });
    } catch (currentError) {
      setError(
        currentError instanceof Error
          ? currentError.message
          : 'Nao foi possivel salvar o card.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <DarkScreen activeTab="plus" scroll>
      <AppHeader />
      <View className="mb-6 flex-row items-center justify-between">
        <Pressable
          className="flex-row items-center gap-2"
          onPress={() =>
            navigation.navigate('DeckEdit', { deckId, mode: 'edit' })
          }
        >
          <ArrowLeft color={colors.muted} size={18} strokeWidth={2.2} />
          <AppText className="text-[13px] text-deck-muted" weight="bold">
            Cancelar
          </AppText>
        </Pressable>
        <AppText className="text-[13px] text-deck-muted" weight="bold">
          {card
            ? `Card ${String(card.position || 1).padStart(2, '0')}`
            : 'Novo card'}
        </AppText>
      </View>

      <View className="mb-5">
        <AppText
          className="text-[29px] leading-[34px] text-white"
          weight="black"
        >
          {isEditing ? 'Editar card' : 'Novo card'}
        </AppText>
        <AppText className="mt-2 text-[13px] text-deck-muted" weight="medium">
          Mantenha pergunta e resposta curtas para revisoes rapidas.
        </AppText>
      </View>

      {error ? (
        <View className="mb-5 rounded-[18px] bg-deck-card p-4">
          <AppText
            className="text-[13px] leading-[20px] text-deck-muted"
            weight="bold"
          >
            {error}
          </AppText>
        </View>
      ) : null}

      {loading ? (
        <View className="rounded-[24px] bg-deck-card p-5">
          <AppText className="text-[13px] text-deck-muted" weight="bold">
            Carregando card...
          </AppText>
        </View>
      ) : (
        <>
          <EditBox
            accent={colors.purple}
            onChangeText={setFront}
            placeholder="Digite a pergunta"
            title="Pergunta"
            value={front}
          />
          <EditBox
            accent={colors.green}
            onChangeText={setBack}
            placeholder="Digite a resposta"
            title="Resposta"
            value={back}
          />
          <EditBox
            accent={colors.blue}
            onChangeText={setExplanation}
            placeholder="Opcional: adicione uma explicacao curta"
            title="Explicacao"
            value={explanation}
          />

          <View className="mb-4 rounded-[24px] bg-deck-card p-5">
            <AppText className="mb-3 text-[17px] text-white" weight="bold">
              Dificuldade
            </AppText>
            <View className="flex-row gap-2">
              {difficulties.map((option) => {
                const active = option.value === difficulty;

                return (
                  <Pressable
                    key={option.value}
                    className={`flex-1 rounded-[15px] px-3 py-3 ${active ? 'bg-deck-purple' : 'bg-deck-soft'}`}
                    onPress={() => setDifficulty(option.value)}
                  >
                    <AppText
                      className={`text-center text-[12px] ${active ? 'text-white' : 'text-deck-muted'}`}
                      weight="black"
                    >
                      {option.label}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <PrimaryButton
            className="mt-2"
            disabled={!canSave}
            onPress={saveCard}
            weight="black"
          >
            <View className="flex-row items-center gap-2">
              <Save color="white" size={18} strokeWidth={2.3} />
              <AppText className="text-[16px] text-white" weight="black">
                {saving ? 'Salvando...' : 'Salvar alteracoes'}
              </AppText>
            </View>
          </PrimaryButton>
        </>
      )}
    </DarkScreen>
  );
}
