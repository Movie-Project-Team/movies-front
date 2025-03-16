<script setup lang="ts">
import { Dialog, InputOtp, Message } from 'primevue';
import Flex from '~/components/atoms/Flex.vue';
import Box from '~/components/atoms/Box.vue';
import { Form } from '@primevue/forms';
import { z } from 'zod';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useProfileStore } from '@/stores/profile';
import { useVerifyPasswordProfile } from '~/composables/api/profile/use-verify-password-profile';

const props = defineProps<{
  visible: boolean;
  password: string;
  profileId: number;
}>();

const localVisible = ref(props.visible);
const emit = defineEmits(["update:visible"]);

const initialValues = ref({
    password: ''
});

const profileStore = useProfileStore();
const errorMessage = ref<string[]>([]);
const checkPassword = ref(false);
const formRef = ref();

const verifyMutation = useVerifyPasswordProfile();
const onSubmit = (data: any, profileId = props.profileId) => {
  checkPassword.value = false;
  errorMessage.value = [];

  const finishData = { ...data, profileId };
  verifyMutation.mutate(finishData, {
    onError: (error) => {
      checkPassword.value = true;
      errorMessage.value = JSON.parse(error.message);
      
      nextTick(() => {
        formRef.value?.validate();
      });

      setTimeout(() => {
        checkPassword.value = false;
      }, 500);
    }
  });
};

const resolver = ref(
  zodResolver(
    z.object({
      password: z
        .string()
        .min(1, { message: 'Vui lòng nhập mật khẩu.' })
        .refine(() => {
          return !checkPassword.value;
        }, { message: 'Sai mật khẩu.' }),
    })
  )
);
</script>

<template>
 <Dialog
    v-model:visible="localVisible"
    modal
    header="Chào mừng trở lại!"
    :style="{
      minHeight: '200px',
      padding: '38px 70px 45px 70px',
      width: '480px',
    }"
    @hide="emit('update:visible', false)"
  >
    <template #container="{ closeCallback }">
      <Flex direction="column" gap="20px" :style="{ position: 'relative!important' }">
        <Box :style="{ position: 'absolute!important' }">
          <Button icon="pi pi-angle-left" variant="text" rounded aria-label="Cancel" @click="closeCallback()"/>
        </Box>
        <Flex direction="column" gap="10px" align="center">
          <h5
            :style="{
              color: '#00031C',
              fontSize: '21px',
              fontWeight: '700',
              margin: '0px'
            }"
          >Xác thực mật khẩu!!</h5>
        </Flex>
        <Flex justify="center">
          <Form ref="formRef" v-slot="$form" :resolver="resolver" :initialValues="initialValues"  class="flex flex-col gap-4" @submit="onSubmit(initialValues)">
            <Flex direction="column" gap="12px">
              <Flex gap="8px" direction="column" justify="center" align="center">
                  <InputOtp name="password" v-model="initialValues.password"/>
                  <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">{{ $form.password.error?.message }}</Message>
              </Flex>
              <Button type="submit" severity="secondary" label="Submit"/>
            </Flex>
          </Form>
        </Flex>
      </Flex>
    </template>
  </Dialog>
</template>

<style scoped></style>
