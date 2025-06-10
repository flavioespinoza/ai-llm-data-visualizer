'use client'

import { Suspense } from 'react'
import { EmbedVisualizerPage } from './visualizer'

export default function EmbedPageWrapper() {
	return (
		<Suspense fallback={<p className="text-muted-foreground p-4 text-sm">Loading chart...</p>}>
			<EmbedVisualizerPage />
		</Suspense>
	)
}
