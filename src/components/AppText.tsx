import type { ComponentProps } from 'react';
import { Text } from 'react-native';

type Weight = 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';

const fontFamily: Record<Weight, string> = {
  regular: 'Montserrat_400Regular',
  medium: 'Montserrat_500Medium',
  semibold: 'Montserrat_600SemiBold',
  bold: 'Montserrat_700Bold',
  extrabold: 'Montserrat_800ExtraBold',
  black: 'Montserrat_900Black',
};

type AppTextProps = ComponentProps<typeof Text> & {
  className?: string;
  weight?: Weight;
};

export function AppText({ className, weight = 'regular', style, ...props }: AppTextProps) {
  return <Text className={className} style={[{ fontFamily: fontFamily[weight] }, style]} {...props} />;
}
