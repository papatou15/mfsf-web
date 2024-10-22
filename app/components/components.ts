import type React from "react";
import { TCustomTheme, TToken } from "../providers/Theme/interface";

export interface DefaultComponent<T = TToken>{
    as?: React.ElementType<any>
    customTheme?: TCustomTheme
    tokens?: T
    themeName?: string | null
    children?: React.ReactNode
}