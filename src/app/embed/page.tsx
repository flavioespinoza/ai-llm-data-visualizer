'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

export default function EmbedVisualizerPage() {
	const chartRef = useRef<SVGSVGElement | null>(null)
	const [data, setData] = useState<any[]>([])
	const [error, setError] = useState('')
	const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar')

	useEffect(() => {
		const url = new URL(window.location.href)
		const prompt = url.searchParams.get('prompt')
		const type = url.searchParams.get('type')
		if (type === 'line' || type === 'pie') setChartType(type)
		if (!prompt) return

		const fetchData = async () => {
			try {
				const res = await fetch('/api/visualize', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ prompt })
				})
				if (!res.ok) throw new Error('Error fetching data')
				const json = await res.json()
				if (!Array.isArray(json)) throw new Error('Invalid data format')
				setData(json)
			} catch (err: any) {
				setError(err.message || 'Unexpected error')
			}
		}
		fetchData()
	}, [])

	useEffect(() => {
		if (!data || !Array.isArray(data)) return
		const svg = d3.select(chartRef.current)
		svg.selectAll('*').remove()

		const margin = { top: 20, right: 30, bottom: 40, left: 40 }
		const width = 500 - margin.left - margin.right
		const height = 300 - margin.top - margin.bottom
		const colors = d3.schemeTableau10

		const chart = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

		if (chartType === 'bar' || chartType === 'line') {
			const x = d3.scaleBand().domain(data.map((d: any) => d.label)).range([0, width]).padding(0.1)
			const y = d3.scaleLinear().domain([0, d3.max(data, (d: any) => d.value)]).range([height, 0])
			chart.append('g').call(d3.axisLeft(y))
			chart.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x))

			if (chartType === 'bar') {
				chart.selectAll('rect')
					.data(data)
					.enter()
					.append('rect')
					.attr('x', (d: any) => x(d.label)!)
					.attr('y', (d: any) => y(d.value))
					.attr('width', x.bandwidth())
					.attr('height', (d: any) => height - y(d.value))
					.attr('fill', (_d, i) => colors[i % colors.length])
			} else {
				const line = d3.line()
					.x((d: any) => x(d.label)! + x.bandwidth() / 2)
					.y((d: any) => y(d.value))

				chart.append('path')
					.datum(data)
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

			const arcs = pieChart.selectAll('arc')
				.data(pie(data))
				.enter()
				.append('g')

			arcs.append('path')
				.attr('d', arc)
				.attr('fill', (_d, i) => colors[i % colors.length])

			arcs.append('text')
				.attr('transform', (d) => `translate(${arc.centroid(d)})`)
				.attr('text-anchor', 'middle')
				.attr('font-size', '10px')
				.text((d) => d.data.label)
		}
	}, [data, chartType])

	return (
		<div className="p-4">
			{error && <p className="text-red-500 text-sm">{error}</p>}
			<svg ref={chartRef} width={500} height={300} className="border rounded" />
		</div>
	)
}
