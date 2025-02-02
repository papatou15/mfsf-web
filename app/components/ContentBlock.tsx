"use client"

import { ReactNode } from 'react';

export default function ContentBlock({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-col mx-12 my-7lg:mx-24 lg:my-12">
            {children}
        </div>
    )
}