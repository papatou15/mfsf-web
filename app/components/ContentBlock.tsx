/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import SectionRenderer from './SectionRenderer';

interface ContentBlockProps {
    children?: any[];
    items?: any[];
    layout?: 'vertical' | 'horizontal';
}

export default function ContentBlock({ children = [], items = [], layout = 'vertical' }: ContentBlockProps) {
    return (
        <div className={`flex ${layout === 'vertical' ? 'flex-col items-center' : 'flex-row justify-around items-center flex-wrap'} gap-4 mx-12 my-7 lg:mx-24 lg:my-12`}>
            {items.map((item, index) => (
                <SectionRenderer key={index} section={item} />
            ))}
            {children.map((child, index) => (
                <SectionRenderer key={index} section={child} />
            ))}
        </div>
    )
}