import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function getSafeHeight(value: number, fallback = 10): number {
	if (value === 0 || isNaN(value)) {
		console.warn('Data value is zero or invalid, using fallback height')
		return fallback
	}
	return 100 / value
}

export function applyHeightToElement(id: string, height: number) {
	const el = document.getElementById(id)
	if (!el) {
		console.error(`Element with ID "${id}" not found`)
		return
	}

	if (typeof height === 'number' && !isNaN(height)) {
		el.setAttribute('height', `${height}`)
	} else {
		console.error('Invalid height value, applying fallback height of 10')
		el.setAttribute('height', '10')
	}
}
