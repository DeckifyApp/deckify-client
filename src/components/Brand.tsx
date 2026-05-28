import { Image, View } from 'react-native';

import { AppText } from './AppText';

const logoAspectRatio = 212 / 264;
const blackLogo = require('../../assets/deckify-logo-black.png');
const purpleLogo = require('../../assets/deckify-logo.png');

type BrandMarkProps = {
  dark?: boolean;
  size?: number;
};

export function BrandMark({ dark = false, size = 28 }: BrandMarkProps) {
  return (
    <Image
      resizeMode="contain"
      source={dark ? blackLogo : purpleLogo}
      style={{ height: size, width: size * logoAspectRatio }}
    />
  );
}

export function Brand({ dark = false }: { dark?: boolean }) {
  return (
    <View className="flex-row items-center">
      <BrandMark dark={dark} size={25} />
      <AppText className={`ml-2 text-[21px] ${dark ? 'text-[#111111]' : 'text-white'}`} weight="bold">
        Deckify
      </AppText>
    </View>
  );
}
