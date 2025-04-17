<script setup lang="ts">
import Box from '../atoms/Box.vue';
import Flex from '../atoms/Flex.vue';

const newMessage = ref('');
const showEmojiPicker = ref(false);
const messages = ref([
  {
    name: 'Sharon Lessman',
    text: 'Lorem ipsum dolor sit amet, vis erat denique in, dicunt prodesset te vix.',
    time: '2:34 am',
    fromMe: false,
    avatar: 'https://i.pravatar.cc/40?img=3'
  },
  {
    name: 'Me',
    text: 'Cum ea graeci tractatos.',
    time: '2:35 am',
    fromMe: true,
    avatar: 'https://i.pravatar.cc/40?img=5'
  },
  {
    name: 'Sharon Lessman',
    text: 'Sit meis deleniti eu, pri vidit meliore docendi ut.',
    time: '2:36 am',
    fromMe: false,
    avatar: 'https://i.pravatar.cc/40?img=3'
  }
])

// Hàm gửi tin nhắn
function sendMessage() {
  if (!newMessage.value.trim()) return

  messages.value.push({
    name: 'Me',
    text: newMessage.value,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    fromMe: true,
    avatar: 'https://i.pravatar.cc/40?img=5'
  })
  newMessage.value = ''
  showEmojiPicker.value = !showEmojiPicker.value
}

function toggleEmojiPicker() {
  showEmojiPicker.value = !showEmojiPicker.value
}

function addEmoji(emoji: any) {
  newMessage.value += emoji.i;
}
</script>

<template>
  <Flex 
    direction="column" 
    :style="{ 
      width: '500px',
      minHeight: '900px',
      border: '1px solid #272932',
      borderRadius: '6px',
      padding: '1rem',
      boxSizing: 'border-box',
      overflow: 'hidden',  
      margin: '1rem 0px'
    }"
  >
    <Flex
      v-for="(message, index) in messages"
      :key="index"
      gap="8px"
      :direction="message.fromMe ? 'row-reverse' : 'row'"
      :style="{
        marginBottom: '1rem',
        textAlign: message.fromMe ? 'right' : 'left'
      }"
    >
      <!-- Avatar người gửi -->
      <Flex direction="column" gap="10px">
        <img :src="message.avatar" alt="Avatar" :style="{ width: '40px', height: '40px', borderRadius: '50%' }" />
        <span :style="{ fontSize: '0.8rem', color: '#888' }">{{ message.time }}</span>
      </Flex>
  
      <!-- Nội dung tin nhắn -->
      <Flex
        direction="column"
        :style="{
          maxWidth: '70%',
          backgroundColor: 'rgb(40, 43, 58)',
          padding: '0.75rem 1rem',
          borderRadius: '10px'
        }"
      >
        <Flex
          align="center"
          justify="space-between"
          :style="{
            marginBottom: '0.25rem'
          }"
          gap="8px"
        >
          <span :style="{ fontWeight: '700' }">{{ message.name }}</span>
        </Flex>
        <div :style="{ fontSize: '0.95rem', color: '#ccc' }">
          {{ message.text }}
        </div>
      </Flex>
    </Flex>

    <!-- Khu vực nhập tin nhắn -->
    <Flex
      gap="0.5rem"
      :style="{
        position: 'relative',
        marginTop: 'auto',
        paddingTop: '1rem',
        borderTop: '1px solid #ddd'
      }"
    >
      <Flex gap="0.5rem" :style="{ marginTop: 'auto', paddingTop: '1rem', width: '100%' }">
        <InputGroup>
          <InputText v-model="newMessage" placeholder="Nhập tin nhắn..." @keyup.enter="sendMessage" />
          <InputGroupAddon>
            <Button icon="pi pi-face-smile" severity="secondary" variant="text" @click="toggleEmojiPicker" />
          </InputGroupAddon>
          <InputGroupAddon>
            <Button icon="pi pi-send" severity="secondary" variant="text" @click="sendMessage" />
          </InputGroupAddon>
        </InputGroup>
      </Flex>
      <Box v-show="showEmojiPicker" :style="{ position: 'absolute', bottom: '70px', right: '20px', zIndex: 1000 }">
        <NuxtEmojiPicker
          :hide-search="false"
          theme="light"
          @select="addEmoji"
        />
      </Box>
    </Flex>
  </Flex>
</template>

<style scoped></style>
