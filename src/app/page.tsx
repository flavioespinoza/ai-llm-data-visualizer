'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
// import { Textarea } from '@/components/ui/textarea'
import { Button, Textarea } from '@flavioespinoza/salsa-ui'

export default function DataVisualizerPage() {
	const [input, setInput] = useState('')
	const [loading, setLoading] = useState(false)
	const [structuredData, setStructuredData] = useState<any>(null)
	const [error, setError] = useState('')
	const [chartType] = useState('bar')
	const chartRef = useRef<SVGSVGElement | null>(null)

	const handleAnalyze = async () => {
		if (!input.trim()) return
		setLoading(true)
		setError('')

		try {
			const res = await fetch('/api/visualize', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ prompt: input })
			})

			if (!res.ok) throw new Error('Failed to fetch structured data')
			const data = await res.json()
			if (!Array.isArray(data)) throw new Error('Invalid data format')
			setStructuredData(data)
		} catch (err: any) {
			console.error('Error analyzing text:', err)
			setError(err.message || 'Unexpected error')
		} finally {
			setLoading(false)
		}
	}

	const handleExport = () => {
		if (!structuredData) return
		const blob = new Blob([JSON.stringify(structuredData, null, 2)], {
			type: 'application/json'
		})
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = 'visualization-data.json'
		a.click()
		URL.revokeObjectURL(url)
	}

	useEffect(() => {
		if (!structuredData || !Array.isArray(structuredData)) return

		const svg = d3.select(chartRef.current)
		svg.selectAll('*').remove()

		const margin = { top: 20, right: 30, bottom: 40, left: 40 }
		const width = 800 - margin.left - margin.right
		const height = 300 - margin.top - margin.bottom
		const colors = d3.schemeTableau10

		const chart = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

		if (chartType === 'bar' || chartType === 'line') {
			const x = d3
				.scaleBand()
				.domain(structuredData.map((d: any) => d.label))
				.range([0, width])
				.padding(0.1)

			const y = d3
				.scaleLinear()
				.domain([0, d3.max(structuredData, (d: any) => d.value)])
				.range([height, 0])

			chart.append('g').call(d3.axisLeft(y))
			chart.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x))

			if (chartType === 'bar') {
				chart
					.selectAll('rect')
					.data(structuredData)
					.enter()
					.append('rect')
					.attr('x', (d: any) => x(d.label)!)
					.attr('y', (d: any) => y(d.value))
					.attr('width', x.bandwidth())
					.attr('height', (d: any) => height - y(d.value))
					.attr('fill', (_d, i) => colors[i % colors.length])
			} else {
				const line = d3
					.line()
					.x((d: any) => x(d.label)! + x.bandwidth() / 2)
					.y((d: any) => y(d.value))

				chart
					.append('path')
					.datum(structuredData)
					.attr('fill', 'none')
					.attr('stroke', '#4f46e5')
					.attr('stroke-width', 2)
					.attr('d', line)
			}
		} else if (chartType === 'pie') {
			const radius = Math.min(width, height) / 2
			const pieChart = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`)

			const pie = d3.pie<any>().value((d) => d.value)
			const arc = d3.arc<any>().innerRadius(0).outerRadius(radius)

			const arcs = pieChart.selectAll('arc').data(pie(structuredData)).enter().append('g')

			arcs
				.append('path')
				.attr('d', arc)
				.attr('fill', (_d, i) => colors[i % colors.length])

			arcs
				.append('text')
				.attr('transform', (d) => `translate(${arc.centroid(d)})`)
				.attr('text-anchor', 'middle')
				.attr('font-size', '10px')
				.text((d) => d.data.label)
		}
	}, [structuredData, chartType])

	return (
		<section>
			<div className="max-w-6xl space-y-4 p-4">
				<p className="font-bold" style={{ fontSize: '2rem' }}>
					LLM Data Visualizer
				</p>
				<p className="text-muted-foreground text-base leading-relaxed">
					Converts natural language into interactive D3.js charts using OpenAI and Tailwind CSS.
				</p>
				<div className="mt-6 pb-6">
					<h3 className="text-lg font-semibold">Examples</h3>
					<ul>
						<li className="text-muted-foreground text-base leading-relaxed">
							Show me the top 5 mobile phone purchases by brand for the last year.
						</li>
						<li className="text-muted-foreground text-base leading-relaxed">
							Show me the top 5 car brands by sales for the last year.
						</li>
						<li className="text-muted-foreground text-base leading-relaxed">
							Show me the top 5 US cities to live.
						</li>
					</ul>
				</div>
				<div className="mb-4">
					<Textarea
						className="border border-solid border-zinc-300 bg-[#a1c4d8] text-black"
						rows={6}
						placeholder="Enter a prompt to analyze..."
						value={input}
						onChange={(e) => setInput(e.target.value)}
						disabled={loading}
					/>
				</div>

				<div className="mt-6 flex gap-2">
					<Button onClick={handleAnalyze} disabled={loading}>
						{loading ? 'Analyzing...' : 'Generate Visualization'}
					</Button>

					<Button onClick={handleExport} disabled={!structuredData}>
						Export JSON
					</Button>
				</div>

				{error && <p className="text-sm text-red-500">{error}</p>}

				{structuredData && (
					<svg ref={chartRef} width={800} height={300} className="rounded border" />
				)}
			</div>
		</section>
	)
}
