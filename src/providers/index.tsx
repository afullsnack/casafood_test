import { AuthProvider } from '@/providers/Auth'
import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { SonnerProvider } from '@/providers/Sonner'
import { PageCartProvider } from './PageCart'
import { NavGuardProvider } from './NavGuard'
import { CartNavigationGuard } from '@/components/CartNavigationGuard'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HeaderThemeProvider>
          <SonnerProvider />
          <PageCartProvider>
            <NavGuardProvider>
              <CartNavigationGuard />
              {children}
            </NavGuardProvider>
          </PageCartProvider>
        </HeaderThemeProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
