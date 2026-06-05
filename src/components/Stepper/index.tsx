'use client'

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
    <div className="w-full">
      <nav aria-label="Checkout progress" className="mb-8">
        <ol className="flex items-center justify-center gap-2">
          {steps.map((step, index) => {
            const isActive = index === currentStep
            const isCompleted = index < currentStep

            return (
              <li key={step.id} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : isCompleted
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      isActive
                        ? 'bg-primary-foreground text-primary'
                        : isCompleted
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted-foreground/20 text-muted-foreground'
                    }`}
                  >
                    {isCompleted ? '✓' : index + 1}
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-px w-8 ${
                      isCompleted ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </li>
            )
          })}
        </ol>
      </nav>

      {children}
    </div>
  )
}
