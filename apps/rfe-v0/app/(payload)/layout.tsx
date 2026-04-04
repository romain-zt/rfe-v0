import type React from 'react'
import type { ServerFunctionClient } from 'payload'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import config from '@/payload.config'
import { importMap } from './admin/importMap'
import '@payloadcms/ui/scss/app.scss'
import './custom.css'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

export default async function Layout({ children }: Args) {
  // #region agent log
  fetch('http://127.0.0.1:7597/ingest/ea0dbd45-5599-4863-96d1-54a965227e36',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'e8e66c'},body:JSON.stringify({sessionId:'e8e66c',location:'app/(payload)/layout.tsx:22',message:'Payload layout rendered',data:{hasConfig:!!config,hasImportMap:!!importMap},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}
