import type { ReactNode } from 'react';
import type { GestureResponderEvent, PressableProps } from 'react-native';
import { Pressable } from 'react-native';

import { AppText } from './AppText';

type PrimaryButtonProps = PressableProps & {
  children: ReactNode;
  className?: string;
  labelClassName?: string;
  onPress?: (event: GestureResponderEvent) => void;
  weight?: 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
};

export function PrimaryButton({
  children,
  className = 'bg-deck-purple',
  disabled,
  labelClassName = 'text-[16px] text-white',
  weight = 'extrabold',
  ...props
}: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className={`min-h-[52px] items-center justify-center rounded-full px-5 active:opacity-85 ${disabled ? 'opacity-50' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {typeof children === 'string' || typeof children === 'number' ? (
        <AppText className={labelClassName} weight={weight}>
          {children}
        </AppText>
      ) : (
        children
      )}
    </Pressable>
  );
}
