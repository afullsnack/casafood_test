'use client'

import { NavigationGuardProvider } from 'next-navigation-guard'

export const NavGuardProvider = ({ children }: { children: React.ReactNode }) => (
  <NavigationGuardProvider>{children}</NavigationGuardProvider>
)
