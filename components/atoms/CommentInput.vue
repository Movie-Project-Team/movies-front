<script setup lang="ts">
import { ref } from "vue";
import Flex from './Flex.vue';

const comment = ref("");
const emit = defineEmits(["submitComment"]);

const submit = () => {
  if (!comment.value.trim()) return;
  emit("submitComment", comment.value.trim());
  comment.value = "";
};
</script>

<template>
  <div>
    <IftaLabel style="padding: 12px; background-color: #272932; border-radius: 8px">
      <Textarea
        id="description"
        v-model="comment"
        rows="5"
        cols="148"
        style="resize: none; background-color: #191b24; border: none; color: #ffffff; overflow:hidden"
      />
      <label style="padding: 12px; font-weight: bold;" for="description">Viết bình luận</label>
      <Flex align="center" justify="flex-end">
        <Button
          type="submit"
          icon="pi pi-send"
          label="Gửi"
          variant="text"
          :disabled="!comment.trim()"
          @click="submit"
        />
      </Flex>
    </IftaLabel>
  </div>
</template>

<style scoped></style>
