import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { ChevronRight, Plus, Save, Trash2 } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, TextInput, View } from 'react-native';

import { AppHeader } from '../components/AppHeader';
import { AppText } from '../components/AppText';
import { DarkScreen } from '../components/DarkScreen';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import {
  api,
  type Card,
  type DeckDetail,
  type DeckVisibility,
  type Tag as ApiTag,
} from '../services/api';
import type { RootNavigation, RootRoute } from '../types/navigation';

const visibilityOptions: Array<{ label: string; value: DeckVisibility }> = [
  { label: 'Privado', value: 'PRIVATE' },
  { label: 'Publico', value: 'PUBLIC' },
];

function Field({
  label,
  multiline,
  onChangeText,
  placeholder,
  value,
}: {
  label: string;
  multiline?: boolean;
  onChangeText: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <View className="mb-4">
      <AppText className="mb-2 text-[12px] text-deck-muted" weight="bold">
        {label}
      </AppText>
      <TextInput
        className={`${multiline ? 'min-h-[104px] py-4' : 'h-[52px]'} rounded-[18px] bg-deck-soft px-4 text-[15px] text-white`}
        multiline={multiline}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedStrong}
        selectionColor={colors.purple}
        style={{
          fontFamily: 'Montserrat_600SemiBold',
          textAlignVertical: multiline ? 'top' : 'center',
        }}
        value={value}
      />
    </View>
  );
}

function SuggestionTag({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      className="mb-2 mr-2 rounded-full bg-deck-soft px-3 py-2"
      onPress={onPress}
    >
      <AppText className="text-[11px] text-deck-muted" weight="bold">
        {label}
      </AppText>
    </Pressable>
  );
}

function CardRow({ card, deckId }: { card: Card; deckId: string }) {
  const navigation = useNavigation<RootNavigation>();

  return (
    <Pressable
      accessibilityRole="button"
      className="mb-3 flex-row items-center justify-between rounded-[18px] bg-deck-card px-4 py-4 active:opacity-85"
      onPress={() =>
        navigation.navigate('CardDetails', { cardId: card.id, deckId })
      }
    >
      <View className="flex-1 pr-3">
        <AppText className="text-[11px] text-deck-muted" weight="bold">
          Card {String(card.position || 1).padStart(2, '0')}
        </AppText>
        <AppText
          className="mt-1 text-[15px] leading-[20px] text-white"
          numberOfLines={2}
          weight="bold"
        >
          {card.front}
        </AppText>
      </View>
      <ChevronRight color={colors.muted} size={22} strokeWidth={1.8} />
    </Pressable>
  );
}

function parseTags(input: string): string[] {
  return input
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function DeckEditScreen() {
  const navigation = useNavigation<RootNavigation>();
  const route = useRoute<RootRoute<'DeckEdit'>>();
  const { isAuthenticated } = useAuth();
  const deckId = route.params?.deckId;
  const isEditing = Boolean(deckId);
  const [deck, setDeck] = useState<DeckDetail | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [suggestions, setSuggestions] = useState<ApiTag[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [visibility, setVisibility] = useState<DeckVisibility>('PRIVATE');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSave = useMemo(
    () => title.trim().length > 0 && !saving,
    [saving, title],
  );

  useFocusEffect(
    useCallback(() => {
      if (!isAuthenticated) {
        navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
        return undefined;
      }

      let active = true;

      async function load() {
        setLoading(true);
        setError(null);

        try {
          const tagData = await api.tags.list();

          if (deckId) {
            const [deckData, cardData] = await Promise.all([
              api.decks.get(deckId),
              api.cards.listByDeck(deckId),
            ]);

            if (active) {
              setDeck(deckData);
              setCards(cardData);
              setTitle(deckData.title);
              setDescription(deckData.description ?? '');
              setTagsInput(deckData.tags.join(', '));
              setVisibility(
                deckData.visibility === 'UNLISTED'
                  ? 'PRIVATE'
                  : deckData.visibility,
              );
            }
          } else if (active) {
            setDeck(null);
            setCards([]);
            setTitle('');
            setDescription('');
            setTagsInput('');
            setVisibility('PRIVATE');
          }

          if (active) {
            setSuggestions(tagData);
          }
        } catch (currentError) {
          if (active) {
            setError(
              currentError instanceof Error
                ? currentError.message
                : 'Nao foi possivel carregar o deck.',
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
    }, [deckId, isAuthenticated, navigation]),
  );

  function addTag(name: string) {
    const current = parseTags(tagsInput);
    if (current.includes(name)) {
      return;
    }
    setTagsInput([...current, name].join(', '));
  }

  async function saveDeck() {
    setSaving(true);
    setError(null);

    try {
      const payload = {
        description: description.trim() ? description.trim() : null,
        tags: parseTags(tagsInput),
        title: title.trim(),
        visibility,
      };

      const saved = deckId
        ? await api.decks.update(deckId, payload)
        : await api.decks.create(payload);
      navigation.navigate('DeckOverview', { deckId: saved.id });
    } catch (currentError) {
      setError(
        currentError instanceof Error
          ? currentError.message
          : 'Nao foi possivel salvar o deck.',
      );
    } finally {
      setSaving(false);
    }
  }

  async function archiveDeck() {
    if (!deckId) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await api.decks.archive(deckId);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (currentError) {
      setError(
        currentError instanceof Error
          ? currentError.message
          : 'Nao foi possivel arquivar o deck.',
      );
    } finally {
      setSaving(false);
    }
  }

  function confirmArchiveDeck() {
    Alert.alert(
      'Arquivar deck?',
      'O deck deixara de aparecer na sua biblioteca.',
      [
        { style: 'cancel', text: 'Cancelar' },
        {
          style: 'destructive',
          text: 'Arquivar',
          onPress: () => void archiveDeck(),
        },
      ],
    );
  }

  return (
    <DarkScreen activeTab="plus" scroll>
      <AppHeader />

      <View className="mb-5 flex-row items-start justify-between">
        <View className="flex-1 pr-4">
          <AppText
            className="text-[29px] leading-[34px] text-white"
            weight="black"
          >
            {isEditing ? 'Editar deck' : 'Novo deck'}
          </AppText>
          <AppText className="mt-2 text-[13px] text-deck-muted" weight="medium">
            Organize titulo, visibilidade, tags e cards.
          </AppText>
        </View>
        {deckId ? (
          <Pressable
            accessibilityLabel="Novo card"
            accessibilityRole="button"
            className="h-11 w-11 items-center justify-center rounded-[16px] bg-deck-soft"
            onPress={() =>
              navigation.navigate('CardEdit', { deckId, mode: 'create' })
            }
          >
            <Plus color="white" size={20} strokeWidth={2.1} />
          </Pressable>
        ) : null}
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

      <View className="mb-5 rounded-[22px] bg-deck-card p-5">
        <Field
          label="Titulo"
          onChangeText={setTitle}
          placeholder="Ex.: Biologia basica"
          value={title}
        />
        <Field
          label="Descricao"
          multiline
          onChangeText={setDescription}
          placeholder="Descreva o objetivo do deck"
          value={description}
        />
        <Field
          label="Tags"
          onChangeText={setTagsInput}
          placeholder="programming, math, science"
          value={tagsInput}
        />

        <AppText className="mb-2 text-[12px] text-deck-muted" weight="bold">
          Visibilidade
        </AppText>
        <View className="flex-row gap-2">
          {visibilityOptions.map((option) => {
            const active = option.value === visibility;

            return (
              <Pressable
                key={option.value}
                className={`flex-1 rounded-[15px] px-3 py-3 ${active ? 'bg-deck-purple' : 'bg-deck-soft'}`}
                onPress={() => setVisibility(option.value)}
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

      <View className="mb-5 rounded-[22px] bg-deck-card p-5">
        <View className="mb-4 flex-row items-center justify-between">
          <AppText className="text-[17px] text-white" weight="bold">
            Tags existentes
          </AppText>
          <AppText className="text-[11px] text-deck-muted" weight="bold">
            toque para adicionar
          </AppText>
        </View>
        <View className="flex-row flex-wrap">
          {suggestions.slice(0, 12).map((tag) => (
            <SuggestionTag
              key={tag.id}
              label={tag.name}
              onPress={() => addTag(tag.name)}
            />
          ))}
        </View>
      </View>

      {deckId ? (
        <>
          <View className="mb-4 flex-row items-center justify-between">
            <AppText className="text-[19px] text-white" weight="bold">
              Cards
            </AppText>
            <Pressable
              className="flex-row items-center gap-2"
              onPress={() =>
                navigation.navigate('CardEdit', { deckId, mode: 'create' })
              }
            >
              <Plus color={colors.purple} size={17} strokeWidth={2.4} />
              <AppText className="text-[12px] text-deck-purple" weight="black">
                Novo card
              </AppText>
            </Pressable>
          </View>

          {loading ? (
            <View className="mb-3 rounded-[18px] bg-deck-card px-4 py-4">
              <AppText className="text-[13px] text-deck-muted" weight="bold">
                Carregando cards...
              </AppText>
            </View>
          ) : cards.length > 0 ? (
            cards.map((card) => (
              <CardRow key={card.id} card={card} deckId={deckId} />
            ))
          ) : (
            <View className="mb-3 rounded-[18px] bg-deck-card px-4 py-4">
              <AppText className="text-[13px] text-deck-muted" weight="bold">
                Este deck ainda nao tem cards.
              </AppText>
            </View>
          )}
        </>
      ) : null}

      <PrimaryButton
        className="mt-2"
        disabled={!canSave}
        onPress={saveDeck}
        weight="black"
      >
        <View className="flex-row items-center gap-2">
          <Save color="white" size={18} strokeWidth={2.3} />
          <AppText className="text-[16px] text-white" weight="black">
            {saving ? 'Salvando...' : 'Salvar deck'}
          </AppText>
        </View>
      </PrimaryButton>

      {deck ? (
        <Pressable
          className="mt-5 flex-row items-center justify-center gap-2"
          disabled={saving}
          onPress={confirmArchiveDeck}
        >
          <Trash2 color={colors.red} size={17} strokeWidth={2.2} />
          <AppText className="text-[13px] text-deck-muted" weight="bold">
            Arquivar deck
          </AppText>
        </Pressable>
      ) : null}
    </DarkScreen>
  );
}
