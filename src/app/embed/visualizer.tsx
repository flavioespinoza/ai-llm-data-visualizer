'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import * as d3 from 'd3'

export function EmbedVisualizerPage() {
  const [structuredData, setStructuredData] = useState<any>(null)
  const [error, setError] = useState('')
  const chartRef = useRef<SVGSVGElement | null>(null)

  const searchParams = useSearchParams()
  const prompt = searchParams.get('prompt') || ''
  const chartType = (searchParams.get('type') || 'bar') as 'bar' | 'line' | 'pie'

  useEffect(() => {
    if (!prompt) return

    const analyze = async () => {
      try {
        const res = await fetch('/api/visualize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        })

        if (!res.ok) throw new Error('Failed to fetch structured data')
        const data = await res.json()
        setStructuredData(data)
      } catch (err: any) {
        console.error('[API_VISUALIZE_ERROR]', err)
        setError(err.message || 'Unexpected error')
      }
    }

    analyze()
  }, [prompt])

  useEffect(() => {
    if (!structuredData || !Array.isArray(structuredData)) return

    const svg = d3.select(chartRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 20, right: 30, bottom: 40, left: 40 }
    const width = 500 - margin.left - margin.right
    const height = 300 - margin.top - margin.bottom
    const colors = d3.schemeTableau10

    const chart = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    if (chartType === 'bar' || chartType === 'line') {
      const x = d3.scaleBand()
        .domain(structuredData.map((d: any) => d.label))
        .range([0, width])
        .padding(0.1)

      const y = d3.scaleLinear()
        .domain([0, d3.max(structuredData, (d: any) => d.value)])
        .range([height, 0])

      chart.append('g').call(d3.axisLeft(y))
      chart.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x))

      if (chartType === 'bar') {
        chart.selectAll('rect')
          .data(structuredData)
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
          .datum(structuredData)
          .attr('fill', 'none')
          .attr('stroke', '#4f46e5')
          .attr('stroke-width', 2)
          .attr('d', line)
      }
    } else if (chartType === 'pie') {
      const radius = Math.min(width, height) / 2
      const pieChart = svg.append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`)

      const pie = d3.pie<any>().value((d) => d.value)
      const arc = d3.arc<any>().innerRadius(0).outerRadius(radius)

      const arcs = pieChart.selectAll('arc')
        .data(pie(structuredData))
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
  }, [structuredData, chartType])

  return (
    <div className="p-4 bg-white dark:bg-black">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <svg ref={chartRef} width={500} height={300} className="border rounded mx-auto" />
    </div>
  )
}
