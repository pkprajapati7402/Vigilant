import React from 'react'

export interface FlaticonProps extends React.HTMLAttributes<HTMLElement> {
    name: string
    type?: 'rr' | 'sr' | 'br' // regular rounded (default), solid rounded, bold rounded
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
    className?: string
}

export function Flaticon({
    name,
    type = 'rr',
    size,
    className = '',
    style,
    ...props
}: FlaticonProps) {
    const sizeClass = size ? {
        xs: 'text-[11px]',
        sm: 'text-[13px]',
        md: 'text-[15px]',
        lg: 'text-[18px]',
        xl: 'text-[22px]',
        '2xl': 'text-[28px]',
        '3xl': 'text-[36px]',
    }[size] : ''

    return (
        <i
            className={`fi fi-${type}-${name} ${sizeClass} ${className} inline-flex items-center justify-center leading-none select-none`}
            style={style}
            aria-hidden="true"
            {...props}
        />
    )
}

export default Flaticon
