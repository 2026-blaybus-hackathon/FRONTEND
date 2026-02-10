import { useState, useCallback } from "react"
import axios from '../libs/axios'

interface ApiResponse<T> {
  data: T | null;
  status: number;
  error: Error | null;
}

// 기존 useApi와 호환성을 위한 래퍼
export function useApi() {
  const [isLoading, setIsLoading] = useState(false)

  const apiCall = useCallback(
    async <T>(
        url: string,
        method: string,
        data: object | null = null
    ): Promise<ApiResponse<T>> => {
        setIsLoading(true)
        try {
        const response = await axios.request({
            method,
            url,
            data
        })
        return {
            data: response.data,
            status: response.status,
            error: null
        }
        } catch (err: any) {
            return {
                data: err.response?.data || null,
                status: err.response?.status || 500,
                error: err
            }
        } finally {
            setIsLoading(false)
        }
    }, [])

  return { apiCall, isLoading }
}