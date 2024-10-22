'use client'

import React from "react";
import { DefaultComponent } from "../components";
import { TToken } from "../../providers/Theme/interface";
import useThemeContext from "../../providers/Theme/hooks";

export interface TypographyProps<T = TToken> extends DefaultComponent {
    children?: React.ReactNode
}

const Typography = <T extends TToken>({children, as: Component = 'span', themeName = 'typography', customTheme, tokens, ...rest}: TypographyProps<T>) => {
    const theme = useThemeContext(themeName, tokens, customTheme)

    return(
        <Component {...rest} className={theme}>
            {children}
        </Component>
    )
}

export default Typography