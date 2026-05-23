import { View } from 'react-native';

import { colors } from '../constants/theme';
import { AppText } from './AppText';

type BrandMarkProps = {
  color?: string;
  size?: number;
};

export function BrandMark({ color = colors.purple, size = 28 }: BrandMarkProps) {
  const layerRadius = size * 0.18;

  return (
    <View style={{ height: size, width: size }}>
      <View
        style={{
          backgroundColor: color,
          borderRadius: layerRadius,
          height: size * 0.7,
          left: size * 0.05,
          opacity: 0.45,
          position: 'absolute',
          top: size * 0.05,
          transform: [{ rotate: '-8deg' }],
          width: size * 0.7,
        }}
      />
      <View
        style={{
          backgroundColor: color,
          borderRadius: layerRadius,
          height: size * 0.7,
          left: size * 0.25,
          position: 'absolute',
          top: size * 0.25,
          width: size * 0.7,
        }}
      />
    </View>
  );
}

export function Brand({ dark = false }: { dark?: boolean }) {
  return (
    <View className="flex-row items-center">
      <BrandMark color={dark ? colors.black : colors.purple} size={25} />
      <AppText className={`ml-2 text-[21px] ${dark ? 'text-[#111111]' : 'text-white'}`} weight="bold">
        Deckify
      </AppText>
    </View>
  );
}
