import * as React from 'react'

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={`bg-card text-card-foreground rounded-lg border shadow-sm ${className}`}
			{...props}
		/>
	)
)
Card.displayName = 'Card'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
)
CardContent.displayName = 'CardContent'

export { Card, CardContent }
