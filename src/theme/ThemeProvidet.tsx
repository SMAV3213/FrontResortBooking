import React from 'react'

export type Theme = 'dark' | 'light'
const KEY = 'theme'

type Ctx = {
    theme: Theme
    setTheme: (t: Theme) => void
    toggleTheme: () => void
}

const ThemeContext = React.createContext<Ctx | null>(null)

const getInitialTheme = (): Theme => {
    const saved = localStorage.getItem(KEY)
    if (saved === 'dark' || saved === 'light') return saved
    const prefersLight = window.matchMedia?.('(prefers-color-scheme: light)')?.matches
    return prefersLight ? 'light' : 'dark'
}

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [theme, setThemeState] = React.useState<Theme>(() => getInitialTheme())

    const setTheme = (t: Theme) => {
        setThemeState(t)
        localStorage.setItem(KEY, t)
        document.documentElement.dataset.theme = t
    }

    React.useEffect(() => {
        document.documentElement.dataset.theme = theme
    }, [theme])

    const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const ctx = React.useContext(ThemeContext)
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
    return ctx
}