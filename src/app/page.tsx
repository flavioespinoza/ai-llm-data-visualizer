'use client'

import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useTheme } from 'next-themes'
import { Moon, Sun, Download } from 'lucide-react'

export default function DataVisualizerPage() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [structuredData, setStructuredData] = useState<any>(null)
  const [error, setError] = useState('')
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar')
  const { theme, setTheme } = useTheme()
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
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">LLM Data Visualizer</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setChartType(chartType === 'bar' ? 'line' : chartType === 'line' ? 'pie' : 'bar')}>
            {chartType === 'bar' ? 'Switch to Line Chart' : chartType === 'line' ? 'Switch to Pie Chart' : 'Switch to Bar Chart'}
          </Button>
          <Button onClick={handleExport}><Download className="h-4 w-4 mr-2" />Export</Button>
          <Button variant="outline" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} size="icon">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <Textarea
        rows={6}
        placeholder="Paste raw text or a prompt to analyze..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={loading}
      />

      <Button onClick={handleAnalyze} disabled={loading}>
        {loading ? 'Analyzing...' : 'Generate Visualization'}
      </Button>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {structuredData && (
        <svg ref={chartRef} width={500} height={300} className="border rounded" />
      )}
    </div>
  )
}
