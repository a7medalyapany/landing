import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'

// Placeholder homepage — replace with CMS-driven content.
export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  return (
    <div className="flex min-h-dvh flex-col items-center justify-between px-4 py-12 sm:px-12 sm:py-16">
      <div className="flex grow flex-col items-center justify-center text-center">
        <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium tracking-wide text-white/60 uppercase">
          Next.js + Payload + Tailwind
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-6xl">
          {user ? `Welcome back, ${user.email}` : 'Welcome to your new project.'}
        </h1>
        <p className="mt-4 max-w-xl text-base text-white/60 sm:text-lg">
          Manage content in the admin panel, then build pages that read it with the Payload Local
          API.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a
            className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            href={payloadConfig.routes.admin}
            rel="noopener noreferrer"
            target="_blank"
          >
            Go to admin panel
          </a>
          <a
            className="rounded-md border border-white/20 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            href="https://payloadcms.com/docs"
            rel="noopener noreferrer"
            target="_blank"
          >
            Documentation
          </a>
        </div>
      </div>
      <p className="text-center text-sm text-white/40">
        Edit <code className="font-mono text-white/70">src/app/(frontend)/page.tsx</code> to get
        started.
      </p>
    </div>
  )
}
