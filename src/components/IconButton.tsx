import type { ReactNode } from 'react';
import type { PressableProps } from 'react-native';
import { Pressable } from 'react-native';

type IconButtonProps = PressableProps & {
  children: ReactNode;
  className?: string;
};

export function IconButton({ children, className = '', ...props }: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className={`h-12 w-12 items-center justify-center rounded-full active:opacity-80 ${className}`}
      {...props}
    >
      {children}
    </Pressable>
  );
}
