<script setup lang="ts">
import { Form } from "@primevue/forms";
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { COMMON_MESSAGES } from '@/constants/messages';
import * as z from 'zod';
import { useLogin } from '~/composables/api/auth/use-login';
import { InputText, Message, Password } from "primevue";
import { ref, watch } from "vue";
import Box from "~/components/atoms/Box.vue";
import Flex from "~/components/atoms/Flex.vue";
import VerifyOtpModal from "./VerifyOtpModal.vue";
import { useRegister } from "~/composables/api/auth/use-register";

const props = defineProps<{
  visible: boolean;
}>();

const localVisible = ref(props.visible);
const isSuccess = ref(false);
const isLogin = ref(true);
const isOpenVerifyModal = ref(false);
const isActive = ref();

watch(
  () => props.visible,
  (newVal) => {
    localVisible.value = newVal;
  }
);

const emit = defineEmits(["update:visible", "authSuccess"]);

const initialValues = ref({
  username: '',
  email: '',
  password: '',
  rememberLogin: false,
});

const schema = computed(() =>
  z.object({
    email: z
      .string()
      .trim()
      .min(1, { message: COMMON_MESSAGES.required })
      .refine(() => {
          return !checkPassword.value;
      }, { message: 'Sai thông tin đăng nhập.' }),
    password: z
      .string()
      .trim()
      .min(1, { message: COMMON_MESSAGES.required })
      .refine(() => {
          return !checkPassword.value;
      }, { message: 'Sai thông tin đăng nhập.' }),
    rememberLogin: z.boolean().default(false).optional(),
  })
);

const resolver = computed(() => zodResolver(schema.value));
const loginMutation = useLogin();
const registerMutation = useRegister();
const checkPassword = ref(false);
const formRef = ref();

const onSubmit = (data: any, closeCallback: Function) => {
  const mutation = isLogin.value ? loginMutation : registerMutation;
  mutation.mutate(data, {
    onSuccess: () => {
      closeCallback();
      isSuccess.value = true;
      emit("authSuccess", isSuccess.value);

      if (!isLogin.value) {
        isOpenVerifyModal.value = true;
      } else {
        isActive.value = localStorage.getItem('isActive');
      }
    },
    onError: (error) => {
      checkPassword.value = true;
      
      nextTick(() => {
        formRef.value?.validate();
      });

      setTimeout(() => {
        checkPassword.value = false;
      }, 500);
    }
  });
};
</script>

<template>
  <Box>
    <Dialog
      v-model:visible="localVisible"
      modal
      :header="isLogin ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới'"
      :style="{ 
        maxWidth: '556px',
        minHeight: isLogin ? '580px' : '470px',
        padding: '38px 70px 45px 70px',
        width: 'calc(100% - 40px)',
      }"
      @hide="emit('update:visible', false)"
    >
      <template #container="{ closeCallback }">
        <Flex direction="column" gap="20px">
          <Flex direction="column" gap="10px" align="center">
            <NuxtImg src="https://streamvid.jwsuperthemes.com/wp-content/uploads/2023/02/logo_sin.svg" alt="" :style="{ width: '40px', height: '40px' }" />
            <h5
              :style="{
                color: '#00031C',
                fontSize: '21px',
                fontWeight: '700',
                margin: '0px'
              }"
            >{{ isLogin ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới' }}</h5>
          </Flex>
          <Flex direction="column" gap="8px" v-if="isLogin">
            <Button 
              label="Đăng nhập với Facebook" 
              icon="pi pi-facebook"
              :style="{
                background: '#1877F2',
                border: 'none',
                height: '40px'
              }"
            />
            <Button 
              label="Đăng nhập với Google" 
              icon="pi pi-google"
              :style="{
                background: '#fff',
                color: '#00031c',
                border: '1px solid rgba(0, 3, 28, .1)',
                height: '40px'
              }"
            />
            <Box class="social-line">
              <span>or</span>
            </Box>
          </Flex>
          <Form
            ref="formRef"
            v-slot="$form"
            :initialValues
            :resolver="resolver"
            @submit="onSubmit(initialValues, closeCallback)"
            :style="{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }"
          >
              <Flex direction="column" gap="8px">
                <InputText 
                  v-model="initialValues.email" 
                  name="email" 
                  type="text" 
                  placeholder="Nhập Email" 
                  :style="{ width: '100%', padding: '12px' }"/>
                <Message 
                  v-if="$form.email?.invalid"
                  severity="error"
                  size="small"
                  variant="simple"
                >
                  {{ $form.email.error?.message }}
                </Message>
              </Flex>
              <Flex direction="column" gap="8px" v-if="!isLogin">
                <InputText 
                  v-model="initialValues.username" 
                  name="username" 
                  type="text" 
                  placeholder="Nhập Tên" 
                  :style="{ width: '100%', padding: '12px' }"/>
                <Message 
                  v-if="$form.username?.invalid"
                  severity="error"
                  size="small"
                  variant="simple"
                >
                  {{ $form.email.error?.message }}
                </Message>
              </Flex>
              <Flex direction="column" gap="8px">
                <Password 
                  v-model="initialValues.password"
                  :feedback="false"
                  name="password" 
                  type="text" 
                  placeholder="Nhập Password" 
                  toggleMask 
                  fluid 
                  :style="{ width: '100%', padding: '12px' }"/>
                <Message 
                  v-if="$form.password?.invalid" 
                  severity="error" 
                  size="small" 
                  variant="simple"
                >
                  {{ $form.password.error?.message }}
                </Message>
              </Flex>
              <Flex justify="space-between" :style="{ margin: '8px 0px' }">
                <Flex gap="4px" align="center">
                  <Checkbox binary inputId="ingredient1" name="pizza" value="remember"/>
                  <label for="ingredient1"> Ghi nhớ </label>
                </Flex>
                <NuxtLink v-if="isLogin" to="/forgot-password">Quên mật khẩu?</NuxtLink>
              </Flex>
              <Button type="submit" :label="isLogin ? 'Đăng nhập' : 'Đăng ký'" :style="{ padding: '15px 31px' }"/>
              <Box :style="{ marginTop: '10px', fontSize: '14px', textAlign: 'center', color: '#ddd' }">
                <span>
                {{ isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?' }}
                <a href="#" @click.prevent="isLogin = !isLogin">
                  {{ isLogin ? 'Đăng ký' : 'Đăng nhập' }}
                </a>
              </span>
              </Box>
          </Form>
        </Flex>
      </template>
    </Dialog>
    <VerifyOtpModal 
      v-if="isOpenVerifyModal || isActive === '1'" 
      :visible="isOpenVerifyModal || isActive === '1'"
      @update:visible="isOpenVerifyModal = $event"
    />
  </Box>
</template>

<style scoped>
.social-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
  margin-bottom: 9px;
  font-size: 14px;
}

.social-line span {
  margin: 0 30px;
}

.social-line::after,
.social-line::before {
  content: "";
  flex: 1 0 0%;
  border-bottom: 1px solid rgba(113, 116, 136, .1);
}
</style>
