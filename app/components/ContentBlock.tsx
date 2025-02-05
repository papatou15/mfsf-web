/* eslint-disable @typescript-eslint/no-explicit-any */

import SectionRenderer from './SectionRenderer';
import { StackBlock } from '@/sanity.types';

interface ContentBlockProps extends StackBlock {
    children?: any[];
}

export default function ContentBlock({ children = [], items = [], layout = 'vertical', bgColor, _type }: ContentBlockProps) {
    return (
        <div style={{ backgroundColor: bgColor?.hex}} className={`${_type} flex ${layout === 'vertical' ? 'flex-col items-center' : 'flex-row justify-around items-center flex-wrap'} gap-4 px-12 py-7 lg:px-24 lg:py-12`}>
            {items.map((item, index) => (
                <SectionRenderer key={index} section={item} />
            ))}
            {children.map((child, index) => (
                <SectionRenderer key={index} section={child} />
            ))}
        </div>
    )
}