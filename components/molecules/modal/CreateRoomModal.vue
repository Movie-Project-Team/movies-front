<script setup lang="ts">
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import Box from '~/components/atoms/Box.vue';
import Flex from '~/components/atoms/Flex.vue';
import { useRoom } from '~/composables/api/room/use-create-room';

const props = defineProps<{
  visible: boolean;
  onSuccess?: () => void;
}>();

const localVisible = ref(props.visible);
const emit = defineEmits(["update:visible"]);
watch(
  () => props.visible,
  (newVal) => {
    localVisible.value = newVal;
  }
);

const capacityOptions = Array.from({ length: 7 }, (_, i) => ({
  name: `${i + 2} người`,
  code: i + 2,
}));

const formRef = ref();
const initialValues = ref({
  password: '',
  name: '',
  isLocked: false,
  capacity: null
});
watch(initialValues, (newVal) => {
  console.log(newVal);
  
}, {deep: true})
const schema = computed(() =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, 'Tên phòng là bắt buộc')
      .max(100, 'Tên phòng không được vượt quá 100 ký tự'),
      
    lock: z.boolean(),

    password: z.string().optional().refine((val) => {
      const isLocked = initialValues.value.isLocked;
      if (isLocked && (!val || val.trim() === '')) {
        return false;
      }
      return true;
    }, {
      message: 'Vui lòng nhập mật khẩu khi phòng bị khóa',
    }),
  })
);

const resolver = computed(() => zodResolver(schema.value));
const roomMutation = useRoom();

const onSubmit = (data: any, closeCallback: Function) => {
  const mutation = roomMutation;
  const formattedData = {
    ...data,
    profileId: 2,
    capacity: data.capacity?.code || null,
  };
  mutation.mutate(formattedData, {
    onSuccess: () => {
      props.onSuccess?.();
      closeCallback();

      emit('update:visible', false);

    },
    onError: (error) => {

    }
  });
};
</script>

<template>
  <Box>
    <Dialog 
      v-model:visible="localVisible" 
      modal 
      header="Tạo phòng" 
      :style="{ width: '25rem' }"
      @hide="emit('update:visible', false)"
    >
      <template #container="{ closeCallback }">
        <Flex :style="{ padding: '24px' }" direction="column" gap="16px">
          <Flex justify="center" gap="10px" align="center" :style="{ width: '100%' }">
            <h5
              :style="{
                color: '#00031C',
                fontSize: '21px',
                fontWeight: '700',
                margin: '0px'
              }"
            >Tạo phòng xem phim</h5>
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
              gap: '20px'
            }"
          >
            <Flex direction="column" gap="8px">
              <label :style="{ fontWeight: '700' }">Tên phòng: </label>
              <InputText 
                v-model="initialValues.name" 
                name="name" 
                type="text" 
                placeholder="Nhập tên phòng" 
                :style="{ width: '100%', padding: '12px' }"/>
              <Message 
                v-if="$form.name?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.name?.error?.message }}
              </Message>
            </Flex>
            <Flex direction="column" gap="8px">
              <label :style="{ fontWeight: '700' }">Số lượng người: </label>
              <Select 
                v-model="initialValues.capacity"
                :options="capacityOptions"
                name="capacity.code"
                optionLabel="name"
                placeholder="Chọn số người tham gia" 
                fluid
                :style="{ width: '100%', padding: '6px 0px' }" />
              <Message 
                v-if="$form.capacity?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.capacity?.error?.message }}
              </Message>
            </Flex>
            <Flex direction="column" gap="8px">
              <label :style="{ fontWeight: '700' }">Loại phòng: </label>
              <RadioButtonGroup v-model="initialValues.isLocked" name="lock" :style="{ display: 'flex', gap: '24px' }">
                <Flex gap="8px" align="center">
                  <RadioButton inputId="publicRoom" :value="false" />
                  <label for="publicRoom"> Phòng công khai </label>
                </Flex>
                <Flex gap="8px" align="center">
                  <RadioButton inputId="privateRoom" :value="true" />
                  <label for="privateRoom"> Phòng khóa </label>
                </Flex>
              </RadioButtonGroup>
              <Message 
                v-if="$form.lock?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.lock.error?.message }}
              </Message>
            </Flex>
            <Flex
              v-if="initialValues.isLocked === true"
              direction="column"
              gap="8px"
            >
              <label :style="{ fontWeight: '700' }">Mật khẩu: </label>
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
                {{ $form.password?.error?.message }}
              </Message>
            </Flex>
            <Button type="submit" label="Tạo phòng" :style="{ padding: '15px 31px' }"/>
          </Form>
        </Flex>
      </template>
    </Dialog>
  </Box>
</template>

<style scoped></style>
