<script setup lang="ts">
import Box from './Box.vue';
defineProps<{ 
  data: {
    profile_path: string,
    name: string,
    original_name: string,
    character: string,
  } 
}>();

const config = useRuntimeConfig();
</script>

<template>
<Box 
  :style="{
    position: 'relative',
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap',
    marginBottom: '12px',
    marginRight: '10px'
  }"
>
  <NuxtLink
    :style="{
      flex: '1',
      cursor: 'pointer',
      maxWidth: '104px'
    }"
  >
    <Avatar :image="data.profile_path ? `${config.public.imageTmdbDomain}/${data.profile_path}` : 'https://s3.amazonaws.com/37assets/svn/765-default-avatar.png'" size="large" shape="circle" :style="{ width: '5rem', height: '5rem' }" />
    <h2 
      :style="{
        marginTop: '0.5rem!important',
        textAlign: 'start',
        fontWeight: 'bold',
        display: '-webkit-box',
        WebkitLineClamp: '1',
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        fontSize: '0.875rem',
        width: '100%'
      }"
    >
      {{ data.name || data.original_name }}
    </h2>
    <p 
      :style="{
        color: '#6B7280',
        fontSize: '0.875rem',
        display: '-webkit-box',
        WebkitLineClamp: '1',
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        margin: '0px!important'
      }"
    >
      {{ data.character }}
    </p>
  </NuxtLink>
</Box>

</template>

<style scoped></style>
