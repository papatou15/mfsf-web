import React from "react";
import { createThemeProvider, makeTheme } from "@/app/providers/Theme";
import typography from "./Typography";

const BaseTheme = makeTheme({
    typography: (props) => typography(props),
})

export default React.memo(createThemeProvider(BaseTheme))