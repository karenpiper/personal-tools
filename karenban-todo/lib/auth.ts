import { cookies } from 'next/headers'

export function isAuthenticated(): boolean {
  const cookieStore = cookies()
  const token = cookieStore.get('auth_token')?.value
  return token === process.env.AUTH_TOKEN
}

export function checkPassword(password: string): boolean {
  return password === process.env.PASSWORD
}
