'use client'

import { Suspense } from 'react'
import { EmbedVisualizerPage } from './visualizer'

export default function EmbedPageWrapper() {
  return (
    <Suspense fallback={<p className="p-4 text-sm text-muted-foreground">Loading chart...</p>}>
      <EmbedVisualizerPage />
    </Suspense>
  )
}
