'use client'

import { useEffect } from 'react'
import { initPostHog } from '../lib/posthog'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog()
  }, [])

  return <>{children}</>
}