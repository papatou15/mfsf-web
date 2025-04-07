'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import sanityImgUrl from '../sanityImageBuilder'
import { Contact } from '@/sanity.types'

const PageTransitionContext = createContext({
  startTransition: () => {},
})

export const usePageTransition = () => useContext(PageTransitionContext)

export function PageTransitionProvider({ children, logo }: { children: React.ReactNode, logo: Contact }) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [bgColor, setBgColor] = useState('bg-primary-blue')
  const pathname = usePathname()

  const bgColors = ["bg-primary-blue", "bg-primary-green", "bg-primary-orange", "bg-primary-red"];

  const startTransition = () => {
    if (!isTransitioning) {
      const randomBgColor = bgColors[Math.floor(Math.random() * bgColors.length)];
      setBgColor(randomBgColor)
      setIsTransitioning(true)
    }
  }

  useEffect(() => {
    if (isTransitioning) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false)
      }, 1100)
      return () => clearTimeout(timeout)
    }
  }, [pathname, isTransitioning])

  return (
    <PageTransitionContext.Provider value={{ startTransition }}>
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <motion.div
            key="page-transition"
            className={`fixed inset-0 z-[9999] ${bgColor} flex items-center justify-center`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <motion.img
              src={sanityImgUrl(logo?.footerLogo).url()}
              alt="Logo"
              className="h-36 bg-[rgba(0,0,0,0.5)] rounded-xl p-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </PageTransitionContext.Provider>
  )
}
