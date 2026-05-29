import React from 'react';
import { Text as RNText, TextProps } from 'react-native';

interface AppTextProps extends TextProps {
  variant?: 'title' | 'subtitle' | 'body' | 'bodySecondary' | 'caption' | 'label' | 'error';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  color?: string;
}

const variantClasses: Record<NonNullable<AppTextProps['variant']>, string> = {
  title:         'text-[34px] leading-[40px] text-brand-text dark:text-dark-text',
  subtitle:      'text-[22px] leading-[28px] text-brand-text dark:text-dark-text',
  body:          'text-[15px] leading-[20px] text-brand-text dark:text-dark-text',
  bodySecondary: 'text-[13px] leading-[18px] text-brand-text-secondary dark:text-dark-text-secondary',
  caption:       'text-[11px] leading-[14px] text-brand-text-muted dark:text-dark-text-muted',
  label:         'text-[13px] leading-[18px] text-brand-text-secondary dark:text-dark-text-secondary',
  error:         'text-[11px] leading-[14px] text-brand-error dark:text-dark-error',
};

const weightClasses: Record<NonNullable<AppTextProps['weight']>, string> = {
  regular:  'font-normal',
  medium:   'font-medium',
  semibold: 'font-semibold',
  bold:     'font-bold',
};

const alignClasses: Record<NonNullable<AppTextProps['align']>, string> = {
  left:   'text-left',
  center: 'text-center',
  right:  'text-right',
};

export const AppText: React.FC<AppTextProps> = ({
  children,
  style,
  variant = 'body',
  weight = 'regular',
  align = 'left',
  color,
  className,
  ...props
}) => {
  const classes = [
    variantClasses[variant],
    weightClasses[weight],
    alignClasses[align],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <RNText
      className={classes}
      style={[color ? { color } : null, style]}
      {...props}
    >
      {children}
    </RNText>
  );
};

export default AppText;
