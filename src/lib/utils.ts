import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageSrc(url: string): string {
  if (!url) return ''
  if (url.startsWith('blob:') || url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url
  }
  let base = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
  base = base.replace(/\/api\/?$/, '')
  return base ? `${base}${url.startsWith('/') ? url : `/${url}`}` : url
}
