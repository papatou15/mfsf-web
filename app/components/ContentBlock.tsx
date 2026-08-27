/* eslint-disable @typescript-eslint/no-explicit-any */

import SectionRenderer from './SectionRenderer';
import { StackBlock } from '@/sanity.types';

interface ContentBlockProps extends StackBlock {
    children?: any[];
}

export default function ContentBlock({ children = [], items = [], layout = 'vertical', bgColor, _type }: ContentBlockProps) {
    return (
        <div style={{ backgroundColor: bgColor?.hex}} className={`${_type} flex w-full ${layout === 'vertical' ? 'flex-col items-center' : 'flex-row flex-wrap items-stretch justify-center'} gap-6 px-4 py-8 sm:px-8 lg:gap-8 lg:px-12 lg:py-12 xl:px-16`}>
            {items.map((item, index) => (
                <SectionRenderer key={index} section={item} />
            ))}
            {children.map((child, index) => (
                <SectionRenderer key={index} section={child} />
            ))}
        </div>
    )
}
