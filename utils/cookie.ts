import { useCookie } from '#app'

export const getCookie = (cookieName: string) => {
  const cookie = useCookie(cookieName)
  return cookie.value
}

export const setCookie = (
  cookieName: string,
  data: string,
  maxAge: number = 60 * 60 * 24,
  secure: boolean = true,
  httpOnly: boolean = false
) => {
  const cookie = useCookie(cookieName, {
    maxAge,
    secure,
    httpOnly,
    path: '/',
  })
  cookie.value = data
}

export const removeCookie = (cookieName: string) => {
  const cookie = useCookie(cookieName)
  cookie.value = null 
}