'use client'

import React from "react";
import { DefaultComponent } from "../components";

export interface TypographyProps extends DefaultComponent {
    children?: React.ReactNode
    className?: string
}

const Typography = ({children, as: Component = 'span', className}: TypographyProps) => {

    return(
        <Component className={className}>
            {children}
        </Component>
    )
}

export default Typography