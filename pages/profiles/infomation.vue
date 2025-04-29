<script setup lang="ts">
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import Box from '~/components/atoms/Box.vue';
import Flex from '~/components/atoms/Flex.vue';
import SideBarProfile from '~/components/molecules/SideBarProfile.vue';

const userId = localStorage.getItem("userId");
const initialValues = ref({
    oldPassword: '1234',
    newPassword: '',
});

const isSuccess = ref(false);
const errorMessage = ref<string[]>([]);
const checkOtp = ref(false);
const formRef = ref();

const onSubmit = (data: any) => {
  checkOtp.value = false;
  errorMessage.value = [];

  const finishData = { ...data, userId };
  // verifyMutation.mutate(finishData, {
  //   onSuccess: () => {
  //     isSuccess.value = true
  //   },
  //   onError: (error :any) => {
  //     checkOtp.value = true;
  //     errorMessage.value = JSON.parse(error.message);
      
  //     nextTick(() => {
  //       formRef.value?.validate();
  //     });

  //     setTimeout(() => {
  //       checkOtp.value = false;
  //     }, 500);
  //   }
  // });
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
</script>

<template>
  <Box
    :style="{
      padding: '150px 70px 60px'
    }"
  >
    <Flex>
      <SideBarProfile />
      <Flex
        :style="{
          padding: '16px 20px'
        }"
        direction="column"
        gap="32px"
      >
        <Card :style="{ background: '#2f323c', color: '#ffffff' }">
          <template #title>
            Đổi mật khẩu hồ sơ
          </template>
          <template #content>
            <Form ref="formRef" v-slot="$form" :resolver="resolver" :initialValues="initialValues" :style="{ width: '920px', maxWidth: '920px', marginTop: '20px' }" @submit="onSubmit(initialValues)">
              <Flex direction="column" gap="20px">
                <Flex :style="{ width: '100%' }" align="center">
                  <Box :style="{ width: '25%' }">
                    <label for="oldPassword">Mật khẩu cũ: </label>
                  </Box>
                  <InputOtp name="oldPassword" v-model="initialValues.oldPassword" mask disabled/>
                  <Message v-if="$form.oldPassword?.invalid" severity="error" size="small" variant="simple">{{ $form.oldPassword.error?.message }}</Message>
                </Flex>
                <Flex :style="{ width: '100%' }" align="center">
                  <Box :style="{ width: '25%' }">
                    <label for="newPassword">Mật khẩu mới: </label>
                  </Box>
                  <InputOtp name="newPassword" v-model="initialValues.newPassword"/>
                  <Message v-if="$form.newPassword?.invalid" severity="error" size="small" variant="simple">{{ $form.newPassword.error?.message }}</Message>
                </Flex>
                <Flex justify="flex-end">
                  <Button type="submit" label="Đổi mật khẩu" :style="{ width: '25%' }" />
                </Flex>
              </Flex>
            </Form>
          </template>
        </Card>
        <Card :style="{ background: '#2f323c', color: '#ffffff' }">
          <template #title>
            Đổi mật khẩu
          </template>
          <template #content>
            <Form ref="formRef" v-slot="$form" :resolver="resolver" :initialValues="initialValues" :style="{ width: '920px', maxWidth: '920px', marginTop: '20px' }" @submit="onSubmit(initialValues)">
              <Flex direction="column" gap="20px">
                <Flex :style="{ width: '100%' }" align="center">
                    <Box :style="{ width: '25%' }">
                      <label for="oldPassword">Mật khẩu cũ: </label>
                    </Box>
                    <InputText name="oldPassword" type="text" :style="{ width: '75%' }" value="***********" placeholder="Mật khẩu cũ" disabled/>
                    <Message v-if="$form.oldPassword?.invalid" severity="error" size="small" variant="simple">{{ $form.oldPassword.error?.message }}</Message>
                </Flex>
                <Flex :style="{ width: '100%' }" align="center">
                  <Box :style="{ width: '25%' }">
                      <label for="oldPassword">Mật khẩu mới: </label>
                    </Box>
                  <InputText name="newPassword" :style="{ width: '75%' }"  type="text" placeholder="Mật khẩu mới" />
                  <Message v-if="$form.newPassword?.invalid" severity="error" size="small" variant="simple">{{ $form.newPassword.error?.message }}</Message>
                </Flex>
                <Flex justify="flex-end">
                  <Button type="submit" label="Đổi mật khẩu" :style="{ width: '25%' }" />
                </Flex>
              </Flex>
            </Form>
          </template>
        </Card>
      </Flex>
    </Flex>
  </Box>
</template>

<style scoped></style>
