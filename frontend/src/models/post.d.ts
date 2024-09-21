export interface Post {
  id: string
  body: string
  attachments: Attachment[]
  created_by: PostCreator
  created_at_formatted: string
  likes_count: number
  comments_count: number
}

export interface PostCreator {
  id: string
  name: string
  email: string
  friends_count: number
  get_avatar: string
}

export interface Trend {
  id: string
  hashtag: string
  occurences: number
}

export interface Attachment {
  id: string
  get_image: string
}
