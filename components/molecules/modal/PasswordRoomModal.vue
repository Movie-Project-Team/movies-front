<script setup lang="ts">
import { Dialog, Message } from 'primevue';
import Flex from '~/components/atoms/Flex.vue';
import Box from '~/components/atoms/Box.vue';
import { Form } from '@primevue/forms';
import { z } from 'zod';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useVerifyPasswordRoom } from '~/composables/api/room/use-verify-password-room';

const props = defineProps<{
  visible: boolean;
  roomId: number;
}>();

const router = useRouter();
const localVisible = ref(props.visible);
const emit = defineEmits(["update:visible"]);
watch(
  () => props.visible,
  (newVal) => {
    localVisible.value = newVal;
  }
);

const initialValues = ref({
    password: ''
});

const errorMessage = ref<string[]>([]);
const checkPassword = ref(false);
const formRef = ref();

const verifyMutation = useVerifyPasswordRoom();
const onSubmit = (data: any, roomId = props.roomId) => {
  checkPassword.value = false;
  errorMessage.value = [];

  const finishData = { ...data, roomId };
  verifyMutation.mutate(finishData, {
    onSuccess: (data: RoomDetailResponse) => {
      router.push({
        path: `/xem-phim/${data.data.movie.slug}`,
        query: {
          room: data.data.room_code
        }
      });
    },
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
        <Flex direction="row" gap="40px" align="center" justify="flex-start">
          <Box>
            <Button icon="pi pi-angle-left" variant="text" rounded aria-label="Cancel" @click="closeCallback()"/>
          </Box>
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
                <InputGroup>
                  <InputGroupAddon>
                    <i class="pi pi-lock" :style="{ color: '#475569' }"></i>
                  </InputGroupAddon>
                  <Password 
                    v-model="initialValues.password"
                    :feedback="false"
                    name="password" 
                    type="text" 
                    placeholder="Nhập Password" 
                    toggleMask 
                    fluid 
                    :style="{ width: '100%', padding: '12px' }"/>
                </InputGroup>
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
