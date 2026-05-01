'use client'

import React, { useEffect } from 'react'

const HANDLE_PX = 5
const MIN_FORM_PX = 280
const MIN_PREVIEW_PX = 300
const DEFAULT_PREVIEW_PX = 500

/**
 * Three live-preview improvements:
 *
 * 1. Default preview pane to 500px (form gets the rest via flex: 1)
 * 2. Auto-select the "Mobile" breakpoint on first load
 * 3. Resizable drag handle between form and preview
 *
 * CSS fixes:
 * - Centers iframe horizontally when narrower than pane (Mobile in 500px pane)
 * - Adds bottom margin + shadow so the iframe "screen" edge is clearly visible
 * - Makes the preview area scrollable
 */
export const LivePreviewScalerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useEffect(() => {
    const cleanups: Array<() => void> = []

    // ─── 1. Inject global CSS fixes ──────────────────────────────────────────
    if (!document.getElementById('rfe-lp-fix')) {
      const style = document.createElement('style')
      style.id = 'rfe-lp-fix'
      style.textContent = `
        /* Centre iframe when breakpoint width < pane width */
        .iframe-loader__container {
          margin: 0 auto !important;
          margin-bottom: 40px !important;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.06) !important;
        }

        /* Make preview area scrollable so bottom is always reachable */
        .live-preview-window__main {
          overflow: auto !important;
        }

        /* Drag handle */
        .rfe-resize-handle {
          width: ${HANDLE_PX}px;
          flex-shrink: 0;
          cursor: col-resize;
          background: var(--theme-elevation-100, #2a2a3e);
          transition: background 0.15s;
          position: relative;
          z-index: 10;
        }
        .rfe-resize-handle:hover,
        .rfe-resize-handle--dragging {
          background: var(--theme-elevation-300, #5a5a7e) !important;
        }
      `
      document.head.appendChild(style)
      cleanups.push(() => document.getElementById('rfe-lp-fix')?.remove())
    }

    // ─── 2. Global drag state ─────────────────────────────────────────────────
    let isDragging = false
    let startX = 0
    let startFormWidth = 0
    let activeForm: HTMLElement | null = null
    let activePreview: HTMLElement | null = null
    let activeHandle: HTMLElement | null = null

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !activeForm || !activePreview) return
      const wrapper = activeForm.parentElement
      if (!wrapper) return
      const delta = e.clientX - startX
      const max = wrapper.clientWidth - MIN_PREVIEW_PX - HANDLE_PX
      const newWidth = Math.max(MIN_FORM_PX, Math.min(startFormWidth + delta, max))
      activeForm.style.width = `${newWidth}px`
      activeForm.style.flex = 'none'
      activePreview.style.width = ''
      activePreview.style.flex = '1 1 0'
      activePreview.style.minWidth = '0'
    }

    const onMouseUp = () => {
      if (!isDragging) return
      isDragging = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      activeHandle?.classList.remove('rfe-resize-handle--dragging')
      activeHandle = null
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    cleanups.push(() => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    })

    // ─── 3. Auto-select Mobile breakpoint ────────────────────────────────────
    function trySelectMobile() {
      const trigger = document.querySelector<HTMLButtonElement>(
        '.live-preview-toolbar-controls__breakpoint .popup-button',
      )
      if (!trigger) return
      // Only switch if still on "Responsive" (respect user's explicit choice)
      const label = trigger.querySelector('span')?.textContent?.trim()
      if (!label || label !== 'Responsive') return

      trigger.click()
      setTimeout(() => {
        const mobileBtn = Array.from(
          document.querySelectorAll<HTMLButtonElement>('button'),
        ).find((btn) => btn !== trigger && btn.textContent?.trim() === 'Mobile')
        mobileBtn?.click()
      }, 80)
    }

    // ─── 4. Inject drag handle + default widths ───────────────────────────────
    const setupResizable = () => {
      const wrapper = document.querySelector<HTMLElement>('.collection-edit__main-wrapper')
      if (!wrapper || wrapper.dataset.rfeResizable) return

      const form = wrapper.querySelector<HTMLElement>(':scope > .collection-edit__main')
      const preview = wrapper.querySelector<HTMLElement>(':scope > .live-preview-window')
      if (!form || !preview) return

      wrapper.dataset.rfeResizable = 'true'

      // Default: preview gets 500px, form fills the rest
      preview.style.width = `${DEFAULT_PREVIEW_PX}px`
      preview.style.flex = 'none'
      form.style.flex = '1 1 0'
      form.style.minWidth = `${MIN_FORM_PX}px`

      const handle = document.createElement('div')
      handle.className = 'rfe-resize-handle'
      wrapper.insertBefore(handle, preview)

      handle.addEventListener('mousedown', (e: MouseEvent) => {
        isDragging = true
        startX = e.clientX
        startFormWidth = form.getBoundingClientRect().width
        activeForm = form
        activePreview = preview
        activeHandle = handle
        handle.classList.add('rfe-resize-handle--dragging')
        document.body.style.cursor = 'col-resize'
        document.body.style.userSelect = 'none'
        e.preventDefault()
      })

      trySelectMobile()

      cleanups.push(() => {
        handle.remove()
        delete wrapper.dataset.rfeResizable
        form.style.flex = ''
        form.style.minWidth = ''
        preview.style.width = ''
        preview.style.flex = ''
      })
    }

    setupResizable()

    const mo = new MutationObserver(setupResizable)
    mo.observe(document.body, { childList: true, subtree: true })
    cleanups.push(() => mo.disconnect())

    return () => cleanups.forEach((fn) => fn())
  }, [])

  return <>{children}</>
}
