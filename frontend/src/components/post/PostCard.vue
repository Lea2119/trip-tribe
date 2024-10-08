<template>
  <v-card>
    <template v-slot:prepend>
      <div class="d-flex justify-space-between align-center pa-2">
        <v-avatar :image="post.created_by.get_avatar" size="50" class="mr-4" />
        <a
          class="text-body-2 text-black font-weight-bold text-decoration-none"
          :href="`/profile/${post.created_by.id}`"
        >
          {{ post.created_by.name }}
        </a>
      </div>
    </template>
    <template v-slot:append>
      <p class="text-body-2">
        {{ moment(post.created_at_formatted).format('ll') }}
      </p>
    </template>
    <div class="px-4">
      <div v-if="post.attachments">
        <v-img
          v-for="image in post.attachments"
          :src="image.get_image"
          class="py-2 px-4"
          max-height="350px"
          cover
        ></v-img>
      </div>
      <v-card-text v-if="post.body" class="text-body-2 text-justify px-1">
        {{ post.body }}
      </v-card-text>
    </div>
    <v-card-actions class="px-4 pt-0">
      <v-icon class="me-2" icon="mdi-heart-outline" @click="like"></v-icon>
      <span class="subheading me-4">{{ post.likes_count }}</span>
      <v-icon
        @click="toggleComments"
        class="me-2"
        icon="mdi-comment-multiple-outline"
      ></v-icon>
      <span class="subheading me-4">{{ post.comments_count }}</span>
      <v-spacer></v-spacer>
      <v-menu v-if="post.created_by.id === userUUID()">
        <template v-slot:activator="{ props }">
          <v-btn
            icon="mdi-dots-vertical"
            variant="text"
            size="small"
            v-bind="props"
          ></v-btn>
        </template>
        <v-list>
          <v-list-item
            base-color="red"
            prepend-icon="mdi-delete"
            @click="handleDeletePost"
            >Delete
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-actions>
    <v-list
      class="bg-grey-lighten-5"
      max-height="200px"
      style="overflow-y: scroll"
      v-if="isCommentsVisible && comments.length > 0"
    >
      <v-list-item
        v-for="comment in comments"
        :key="comment.id"
        class="d-flex align-center"
      >
        <div class="d-flex justify-center align-center ga-4 text-caption">
          <v-avatar :image="comment.created_by.get_avatar ?? ''" size="40" class="mb-2" />
          <p class="font-weight-bold">{{ comment.created_by.name }}</p>
          <p>{{ comment.body }}</p>
        </div>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-card-actions class="px-4">
      <v-text-field
        color="grey-lighten-2"
        density="compact"
        v-model="body"
        hide-details
        variant="outlined"
        append-icon="mdi-send"
        @click:append="sendComment"
        outlined
      ></v-text-field>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import moment from 'moment'
import { userUUID } from '@/utils/global'
import type { Post, Comment } from '@/models/post'
import { usePostStore } from '@/stores/post'
import type { Notification } from '@/models/global'

const props = defineProps<{
  post: Post
}>()

const liked = ref(false)
const comments = ref<Comment[]>([])
const store = usePostStore()
const body = ref('')
const isCommentsVisible = ref(false)
const emit = defineEmits<(event: 'show-snackbar', payload: Notification) => void>()

onMounted(async () => {
  const postDetails = await store.fetchPost(props.post.id)
  comments.value = postDetails.comments || []
})

const like = async () => {
  await store.likePost(props.post.id)
  liked.value = !liked.value
}
const handleDeletePost = async () => {
  await store.deletePost(props.post.id)
}
const toggleComments = () => {
  isCommentsVisible.value = !isCommentsVisible.value
}
const sendComment = async () => {
  if (comments.value && body.value !== '') {
    await store.createComment(props.post.id, body.value)
    body.value = ''
    const postDetails = await store.fetchPost(props.post.id)
    comments.value = postDetails.comments || []
  }
}
</script>

<style scoped></style>
