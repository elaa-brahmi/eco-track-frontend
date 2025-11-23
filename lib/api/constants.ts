export const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
export const isServer = typeof window === 'undefined'

export enum ApiErrorType {
  AUTH = 'AUTH',
  NETWORK = 'NETWORK',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
  VALIDATION = 'VALIDATION',
}
