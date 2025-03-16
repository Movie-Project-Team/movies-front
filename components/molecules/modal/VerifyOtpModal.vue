<script setup lang="ts">
import { Dialog, InputOtp, Message } from 'primevue';
import Flex from '~/components/atoms/Flex.vue';
import Box from '~/components/atoms/Box.vue';
import { Form } from '@primevue/forms';
import { z } from 'zod';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useVerifyOtp } from '~/composables/api/auth/use-verify-otp';

const props = defineProps<{
  visible: boolean;
}>();

const localVisible = ref(props.visible);
const emit = defineEmits(["update:visible"]);
const userId = localStorage.getItem("userId");

const initialValues = ref({
    otp: ''
});

const isSuccess = ref(false);
const errorMessage = ref<string[]>([]);
const checkOtp = ref(false);
const formRef = ref();

const verifyMutation = useVerifyOtp();
const onSubmit = (data: any) => {
  checkOtp.value = false;
  errorMessage.value = [];

  const finishData = { ...data, userId };
  verifyMutation.mutate(finishData, {
    onSuccess: () => {
      isSuccess.value = true
    },
    onError: (error) => {
      checkOtp.value = true;
      errorMessage.value = JSON.parse(error.message);
      
      nextTick(() => {
        formRef.value?.validate();
      });

      setTimeout(() => {
        checkOtp.value = false;
      }, 500);
    }
  });
};

const resolver = ref(
  zodResolver(
    z.object({
      otp: z
        .string()
        .min(1, { message: 'Vui lòng nhập mã xác thực.' })
        .refine(() => {
          return !checkOtp.value;
        }, { message: 'Sai mã xác thực.' }),
    })
  )
);

const router = useRouter();

const reloadPage = () => {
  router.go(0); // Reload trang
};
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
           >
             {{ isSuccess ? "Xác thực thành công!" : "Xác thực OTP!!" }}
           </h5>
 
           <p
             v-if="!isSuccess"
             :style="{
               color: '#666',
               fontSize: '14px',
               margin: '0px',
               textAlign: 'center'
             }"
           >
             Mã xác thực đã được gửi về email của bạn. Vui lòng kiểm tra hộp thư và nhập mã vào ô bên dưới.
           </p>
 
           <p
             v-if="isSuccess"
             :style="{
               color: '#28a745',
               fontSize: '16px',
               fontWeight: '600',
               textAlign: 'center'
             }"
           >
             ✅ Bạn đã xác thực thành công! Một hồ sơ mặc định đã được tạo bằng thông tin trong email của bạn.
             <br /> Vui lòng đăng nhập lại để tiếp tục.
           </p>
         </Flex>
 
         <Flex justify="center">
           <template v-if="!isSuccess">
             <Form ref="formRef" v-slot="$form" :resolver="resolver" :initialValues="initialValues" class="flex flex-col gap-4" @submit="onSubmit(initialValues)">
               <Flex direction="column" gap="12px">
                 <Flex gap="8px" direction="column" justify="center" align="center">
                     <InputOtp name="otp" v-model="initialValues.otp"/>
                     <Message v-if="$form.otp?.invalid" severity="error" size="small" variant="simple">{{ $form.otp.error?.message }}</Message>
                 </Flex>
                 <Button type="submit" severity="secondary" label="Submit"/>
               </Flex>
             </Form>
           </template>
 
           <template v-else>
             <Button label="Đăng nhập lại" severity="primary" @click="reloadPage" />
           </template>
         </Flex>
       </Flex>
     </template>
   </Dialog>
 </template>
 
<style scoped></style>
