'use client'

import { cn } from '@/utilities/cn'
import { Check } from 'lucide-react'
import React from 'react'

type Step = {
  id: string
  label: string
}

type Props = {
  steps: Step[]
  currentStep: number
  children: React.ReactNode
}

export function Stepper({ steps, currentStep, children }: Props) {
  return (
    <div className="w-full max-w-2xl md:mx-auto">
      <nav aria-label="Checkout progress" className="mb-10">
        <ol className="flex items-center gap-4">
          {steps.map((step, index) => {
            const isActive = index === currentStep
            const isCompleted = index < currentStep
            const isReached = isActive || isCompleted

            return (
              <React.Fragment key={step.id}>
                <li className="flex items-center gap-2">
                  <span
                    aria-current={isActive ? 'step' : undefined}
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold',
                      isReached
                        ? 'bg-[#4A5A2A] text-white'
                        : 'border border-muted-foreground/40 text-muted-foreground',
                    )}
                  >
                    {isCompleted ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : index + 1}
                  </span>
                  <span
                    className={cn(
                      'text-sm',
                      isReached ? 'font-medium text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {step.label}
                  </span>
                </li>
                {index < steps.length - 1 && <span aria-hidden className="h-px w-12 bg-border" />}
              </React.Fragment>
            )
          })}
        </ol>
      </nav>

      {children}
    </div>
  )
}
