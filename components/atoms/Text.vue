<script setup lang="ts">
const props = defineProps<{
  variant?: 'header' | 'subheader' | 'text';
  tag?: string;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  weight?: 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
}>();

const Tag = props.variant === 'header' ? 'h1' : props.variant === 'subheader' ? 'h2' : 'p';

const defaultStyles = {
  header: { fontSize: '1.5rem', fontWeight: 'bold', color: 'black' },
  subheader: { fontSize: '1.25rem', fontWeight: '600', color: '#4A4A4A' },
  text: { fontSize: '1rem', fontWeight: '400', color: '#333' },
};
</script>

<template>
  <component
    :is="Tag"
    :style="{
      ...defaultStyles[variant || 'text'],
      fontSize: size ? `${size === 'xs' ?
        '0.75rem' : size === 'sm' ?
        '0.875rem' : size === 'base' ?
        '1rem' : size === 'lg' ?
        '1.125rem' : size === 'xl' ?
        '1.25rem' : size === '2xl' ?
        '1.5rem' : '1rem'}` : '1rem',
      fontWeight: weight ? (weight === 'thin' ? 
        '100' : weight === 'light' ? 
        '300' : weight === 'normal' ? 
        '400' : weight === 'medium' ? 
        '500' : weight === 'semibold' ? 
        '600' : weight === 'bold' ? 
        '700' : weight === 'extrabold' ? 
        '800' : '400') : '400',
      color: color || '',
      textAlign: align || 'left',
    }"
  >
    <slot />
  </component>
</template>
