'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
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
		<div className="max-w-xl mx-auto p-4 space-y-4">
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
					className="border px-2 py-1 rounded text-sm"
				>
					<option value="bar">Bar</option>
					<option value="line">Line</option>
					<option value="pie">Pie</option>
				</select>
				<Button variant="default" onClick={handleEmbedLink}>Generate Visualization</Button>
			</div>
		</div>
	)
}
