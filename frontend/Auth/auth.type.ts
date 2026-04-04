export interface ICreateUserDto {
  username: string,
  email: string,
  password: string
}

export interface IUser {
  accessToken: string,
  refreshToken: string,
  expiresAt: Date,
  user: {
    id: string,
    username: string,
    email: string,
    isAdmin: boolean
  }
}