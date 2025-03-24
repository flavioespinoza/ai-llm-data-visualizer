'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function HomePage() {
	const [prompt, setPrompt] = useState('')
	const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar')
	const router = useRouter()

	const handleEmbedLink = () => {
		const encoded = encodeURIComponent(prompt)
		router.push(`/embed?prompt=${encoded}&type=${chartType}`)
	}

	return (
		<div className="mx-auto max-w-xl space-y-4 p-4">
			<h1 className="text-2xl font-bold">Embed Chart Generator</h1>
			<Textarea
				rows={4}
				value={prompt}
				onChange={(e) => setPrompt(e.target.value)}
				placeholder="Enter your visualization prompt..."
			/>
			<div className="flex items-center gap-2">
				<select
					value={chartType}
					onChange={(e) => setChartType(e.target.value as any)}
					className="rounded border px-2 py-1 text-sm"
				>
					<option value="bar">Bar</option>
					<option value="line">Line</option>
					<option value="pie">Pie</option>
				</select>
				<Button variant="default" onClick={handleEmbedLink}>
					Generate Visualization
				</Button>
			</div>
			<p className="mt-12 p-2">
				Visualize a weekly breakdown of fitness activities: running, lifting, yoga, and rest.
			</p>
		</div>
	)
}
