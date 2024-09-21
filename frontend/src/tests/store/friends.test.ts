import { describe, beforeEach, test, expect, vi } from 'vitest'
import { useFriendsStore } from '@/stores/friends'
import { CURRENT_USER_FRIENDS } from '@/tests/mocks/friends'
import { createPinia, setActivePinia } from 'pinia'
import axios from 'axios'

describe('profile store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  test('get friends success', async () => {
    const store = useFriendsStore()

    axios.get = vi.fn().mockResolvedValue({ data: CURRENT_USER_FRIENDS })
    const spy = vi.spyOn(axios, 'get')
    await store.getFriends(CURRENT_USER_FRIENDS.user.id)
    expect(spy).toHaveBeenCalledWith(`/api/friends/${CURRENT_USER_FRIENDS.user.id}/`)
  })

  test('handle friend request success', async () => {
    const store = useFriendsStore()

    axios.post = vi.fn().mockResolvedValue({})
    const spy = vi.spyOn(axios, 'post')
    await store.handleFriendRequest('accept', CURRENT_USER_FRIENDS.requests[0].id)
    expect(spy).toHaveBeenCalledWith(
      `/api/friends/b9a67438-f0a3-48bd-9155-882cd94bddc5/accept/`
    )
  })
})
