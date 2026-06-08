'use client'

import React, { useEffect, useCallback } from 'react'
import { X } from 'lucide-react'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleEscape])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className="absolute inset-0 bg-background/95 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-card border border-border max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border flex items-center justify-between p-6">
          {title && (
            <h2 id="modal-title" className="font-serif text-lg font-light tracking-wide">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="ml-auto p-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
