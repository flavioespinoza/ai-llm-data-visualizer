import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function POST(req: NextRequest) {
	try {
		const { prompt } = await req.json()

		const response = await openai.chat.completions.create({
			model: 'gpt-4o-2024-05-13',
			messages: [
				{
					role: 'system',
					content:
						'Return only raw JSON structured as an array of objects with "label" and numeric "value" keys. For example, { "label": "Running", "value": 4 }. Do not include strings or markdown formatting.'
				},
				{
					role: 'user',
					content: prompt
				}
			],
			temperature: 0.2
		})

		let raw = response.choices[0]?.message?.content || '{}'

		raw = raw.trim()
		if (raw.startsWith('```')) {
			raw = raw.replace(/^```json|^```|```$/g, '').trim()
		}

		const data = JSON.parse(raw)
		return NextResponse.json(data)
	} catch (err) {
		console.error('[API_VISUALIZE_ERROR]', err)
		return new NextResponse('Internal Server Error', { status: 500 })
	}
}
