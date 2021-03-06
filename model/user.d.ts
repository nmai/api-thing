
export interface User {
  id: string,
  username: string,
  passwordHash: string,
  fullname?: string,
  notes?: string,
}

export interface UserRef {
  id: string,
  username: string,
}

export interface LoginResponse {
  user: UserRef,
  token: string,
}
