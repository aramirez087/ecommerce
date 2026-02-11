'use client'

import { useEffect, useState, ReactNode, createContext, useContext } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    Tilopay?: {
      init: (config: TilopayConfig) => void
      createPayment: (options: TilopayPaymentOptions) => Promise<TilopayPaymentResult>
    }
  }
}

interface TilopayConfig {
  apiKey: string
  environment?: 'sandbox' | 'production'
}

interface TilopayPaymentOptions {
  amount: number
  currency: string
  orderId: string
  orderNumber: string
  description: string
  email: string
  callbackUrl: string
  redirectUrl: string
}

interface TilopayPaymentResult {
  success: boolean
  transactionId?: string
  error?: string
}

interface TilopayContextValue {
  isLoaded: boolean
  isLoading: boolean
  createPayment: (options: Omit<TilopayPaymentOptions, 'callbackUrl'>) => Promise<TilopayPaymentResult>
}

const TilopayContext = createContext<TilopayContextValue | null>(null)

export function useTilopay() {
  const context = useContext(TilopayContext)
  if (!context) {
    throw new Error('useTilopay must be used within TilopayProvider')
  }
  return context
}

interface TilopayProviderProps {
  children: ReactNode
}

export function TilopayProvider({ children }: TilopayProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (window.Tilopay) {
      const apiKey = process.env.NEXT_PUBLIC_TILOPAY_API_KEY
      if (apiKey) {
        window.Tilopay.init({
          apiKey,
          environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
        })
        setIsLoaded(true)
      }
      setIsLoading(false)
    }
  }, [])

  const handleScriptLoad = () => {
    const apiKey = process.env.NEXT_PUBLIC_TILOPAY_API_KEY
    if (window.Tilopay && apiKey) {
      window.Tilopay.init({
        apiKey,
        environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
      })
      setIsLoaded(true)
    }
    setIsLoading(false)
  }

  const createPayment = async (
    options: Omit<TilopayPaymentOptions, 'callbackUrl'>
  ): Promise<TilopayPaymentResult> => {
    if (!window.Tilopay || !isLoaded) {
      return { success: false, error: 'Tilopay not loaded' }
    }

    try {
      const result = await window.Tilopay.createPayment({
        ...options,
        callbackUrl: `${window.location.origin}/api/webhook`,
      })
      return result
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed',
      }
    }
  }

  return (
    <TilopayContext.Provider value={{ isLoaded, isLoading, createPayment }}>
      <Script
        src="https://app.tilopay.com/sdk/v2/sdk.min.js"
        onLoad={handleScriptLoad}
        onError={() => setIsLoading(false)}
        strategy="afterInteractive"
      />
      {children}
    </TilopayContext.Provider>
  )
}
