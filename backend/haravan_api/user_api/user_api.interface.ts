export interface GetUserQuery {
  userID: string
}

export interface GetUserResponse {
  user: {
    account_owner: boolean
    bio: string
    email: string
    first_name: string
    id: number
    im: string
    last_name: string
    phone: string
    receive_announcements: number
    url: string
    user_type: string
    permissions: string[]
  }
}