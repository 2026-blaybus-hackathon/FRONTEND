import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// className 병합 함수
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 프로필/이미지 URL 정규화.
 * - 스킴 없음: blaybus-cdn.jayden-bin.cc/... → https://blaybus-cdn.jayden-bin.cc/...
 * - 프로토콜 상대: //host/path → https://host/path
 * - 이미 http(s)면 그대로 반환. 빈 값이면 ''.
 */
export function getProfileImageUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return ''
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  if (trimmed.startsWith('//')) return `https:${trimmed}`
  return `https://${trimmed}`
}