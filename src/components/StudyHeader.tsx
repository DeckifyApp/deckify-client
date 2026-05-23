import { View } from 'react-native';

import { colors } from '../constants/theme';
import { deck } from '../data/appData';
import { AppText } from './AppText';

function Score({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <View className="items-center">
      <AppText className="text-[24px] leading-[28px]" style={{ color }} weight="black">
        {value}
      </AppText>
      <AppText className="text-[10px] text-deck-muted" weight="bold">
        {label}
      </AppText>
    </View>
  );
}

export function StudyHeader() {
  return (
    <View className="mb-6">
      <View className="mb-5 flex-row items-start justify-between">
        <View className="flex-1 pr-4">
          <AppText className="text-[31px] leading-[36px] text-white" weight="black">
            {deck.shortTitle}
          </AppText>
          <AppText className="mt-1 text-[12px] text-deck-muted" weight="medium">
            {deck.subtitle}
          </AppText>
        </View>
        <View className="items-center rounded-[16px] bg-deck-card px-4 py-3">
          <AppText className="text-[24px] leading-[27px] text-white" weight="black">
            {deck.cardsTotal}
          </AppText>
          <AppText className="text-[10px] text-deck-muted" weight="bold">
            cards
          </AppText>
        </View>
      </View>

      <View className="mb-5 flex-row items-center">
        <View className="h-2 flex-1 rounded-full bg-white/10">
          <View className="h-2 rounded-full bg-deck-purple" style={{ width: `${deck.progress}%` }} />
        </View>
        <AppText className="ml-3 text-[12px] text-deck-purple" weight="black">
          {deck.progress}%
        </AppText>
      </View>

      <View className="flex-row justify-around rounded-[20px] bg-deck-card px-5 py-4">
        <Score color={colors.green} label="Acertos" value={`${deck.stats.correct}`} />
        <Score color={colors.orange} label="Parcial" value={`${deck.stats.partial}`} />
        <Score color={colors.red} label="Errados" value={`${deck.stats.missed}`} />
      </View>
    </View>
  );
}
