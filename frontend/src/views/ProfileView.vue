<template>
  <v-container fluid>
    <ProfileCard v-if="user" :user="user" :posts="posts" @show-snackbar="showSnackbar" />
    <PostCard class="my-4" v-for="post in posts" :key="post.id" :post="post" />
  </v-container>
  <AlertComponent :alert="appSnackbarConf" />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { Post } from '@/models/post'
import type { Notification } from '@/models/global'
import { useProfileStore } from '@/stores/profile'
import PostCard from '@/components/post/PostCard.vue'
import { ref, watch, onMounted, computed } from 'vue'
import AlertComponent from '@/components/AlertComponent.vue'
import ProfileCard from '@/components/profile/ProfileCard.vue'

const appSnackbarConf = ref<Notification>({
  message: '',
  type: undefined
})

const showSnackbar = (payload: Notification) => {
  appSnackbarConf.value.message = payload.message
  appSnackbarConf.value.type = payload.type
}

const route = useRoute()
const store = useProfileStore()
const user = computed(() => store.user)
const posts = computed<Post[]>(() => store.posts)
const userId = route.params.id as string

onMounted(() => {
  if (userId) {
    store.getFeed(userId)
  }
})

watch(
  () => route.params.id,
  async newId => {
    if (newId) {
      await store.getFeed(newId as string)
    }
  }
)
</script>

<style scoped>
.profile {
  border: 5px solid white;
  position: absolute;
  z-index: 100;
}

.list {
  padding-top: 120px;
}
</style>
