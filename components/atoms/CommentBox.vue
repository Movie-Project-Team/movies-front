<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import Box from './Box.vue';
import Flex from './Flex.vue';
import { useComment } from '~/composables/api/movies/use-create-comment';
import CommentInput from "~/components/atoms/CommentInput.vue";

const props = withDefaults(
  defineProps<{
    id: number;
    avatar?: string;
    name?: string;
    time?: string;
    comment?: string;
    repliedTo?: string;
    replies?: CommentResponse[];
    level?: number;
  }>(),
  {
    level: 1,
  }
);

// Lưu trạng thái isReplying theo id của comment
const replyingState = reactive<{ [key: number]: boolean }>({});

const isReply = computed(() => !!props.repliedTo);
const showReplies = ref(false);
const selectedCommentId = ref<number | null>(null);

// get data store
const profile = useProfileStore();
const movieId = useMovieStore();

// Tính tổng số replies
const totalReplies = computed(() => {
  const countReplies = (replies: any[]) => {
    return replies.reduce((total, reply) => total + 1 + (reply.replies ? countReplies(reply.replies) : 0), 0);
  };
  return props.replies ? countReplies(props.replies) : 0;
});

// Xử lý khi nhấn "Trả lời"
const handleReplyClick = (commentId: number) => {
  replyingState[commentId] = !replyingState[commentId];

  if (!replyingState[commentId]) {
    selectedCommentId.value = null;
  } else {
    selectedCommentId.value = commentId;
  }
};
const emit = defineEmits(['update:isRefetch']);
const { mutate } = useComment();
const submitComment = (comment: string) => {
  mutate(
    {
      userId: Number(profile.user?.user_id),
      movieId: movieId.selectedMovieId,
      parentId: selectedCommentId.value || null,
      isApproved: 1,
      content: comment,
    },
    {
      onSuccess: async () => {
        if (selectedCommentId.value !== null) {
          replyingState[selectedCommentId.value] = false;
        }
        emit('update:isRefetch', true);
      },
      onError: (error: any) => {
        console.error("Lỗi gửi bình luận:", error);
      },
    }
  );
};
</script>

<template>
  <Flex gap="20px" direction="column">
    <Flex gap="12px" justify="flex-start">
      <Box>
        <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" class="mr-2" size="large" shape="circle" />
      </Box>
      <Flex direction="column" gap="10px" :style="{ fontSize: '14px' }">
        <Flex align="center" gap="12px">
          <Box :style="{ fontWeight: 'bold' }">{{ name }}</Box>
          <span :style="{ color: '#aaa', opacity: '.5', fontSize: '12px' }">{{ time }}</span>
        </Flex>
        <Flex gap="6px" align="center">
          <span v-if="isReply" :style="{ padding: '.2rem .3rem', backgroundColor: '#3e435c', borderRadius: '.2rem' }">@{{ repliedTo }} </span>
          {{ comment }}
        </Flex>
        <Flex gap="16px" :style="{ fontSize: '12px' }">
          <i class="pi pi-arrow-circle-up" style="color: #ddd; cursor: pointer"></i>
          <i class="pi pi-arrow-circle-down" style="color: #ddd; cursor: pointer"></i>
          <Flex gap="6px" align="center" @click="handleReplyClick(id)" :style="{ cursor: 'pointer', color: '#aaa' }">
            <i class="pi pi-reply" style="color: #aaa; cursor: pointer; font-size: 12px"></i>
            <span>Trả lời</span>
          </Flex>
        </Flex>
        <Flex 
          v-if="level === 1 && replies && replies.length" 
          align="center"
          gap="6px"
          @click="showReplies = !showReplies"
          :style="{ cursor: 'pointer', color: '#aaa', fontSize: '12px', marginTop: '6px' }"
        >
          <i 
            :class="showReplies ? 'pi pi-chevron-up' : 'pi pi-chevron-down'" 
            style="font-size: 14px"
          ></i>
          <span>{{ showReplies ? 'Ẩn bình luận' : `${totalReplies} bình luận` }}</span>
        </Flex>
      </Flex>
    </Flex>

    <!-- Hiển thị CommentInput khi nhấn vào nút "Trả lời" -->
    <div class="comment-wrapper">
      <CommentInput v-if="replyingState[id]" @close="replyingState[id] = false" @submitComment="submitComment"/>
      <div v-if="!profile.user && replyingState[id]" class="comment-overlay">
        <p>Đăng nhập để bình luận</p>
      </div>
    </div>

    <!-- Hiển thị danh sách replies khi showReplies = true -->
    <Flex 
      v-if="(level > 1) || showReplies" 
      direction="column" 
      gap="8px"
      :style="{ marginLeft: level === 1 ? '48px' : '0px' }" 
    >
      <CommentBox 
        v-for="reply in replies" 
        :key="reply.id"
        :id="reply.id"
        :name="reply.user.name"
        :time="reply.created_at" 
        :repliedTo="reply.parent.user.name"
        :comment="reply.content"
        :replies="reply.replies"
        :level="level + 1"
        @update:isRefetch="emit('update:isRefetch')"
      />
    </Flex>
  </Flex>
</template>

<style scoped>
.comment-wrapper {
  position: relative;
}

.comment-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
}
</style>


