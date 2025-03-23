import { useEffect, useState } from 'react'

interface ScrollData {
  scrollY: number;
  direction: 'up' | 'down' | null;
  isScrolling: boolean;
}

export default function useScrollPosition() {
  const [scrollData, setScrollData] = useState<ScrollData>({
    scrollY: 0,
    direction: null,
    isScrolling: false
  })
  
  const [scrollTimeout, setScrollTimeout] = useState<number | null>(null)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const direction = currentScrollY > lastScrollY ? 'down' : 'up'
      
      setScrollData({
        scrollY: currentScrollY,
        direction,
        isScrolling: true
      })
      
      setLastScrollY(currentScrollY)
      
      // Clear previous timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
      
      // Set a timeout to detect when scrolling stops
      const timeout = setTimeout(() => {
        setScrollData(prev => ({
          ...prev,
          isScrolling: false
        }))
      }, 150)
      
      setScrollTimeout(timeout)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
    }
  }, [lastScrollY, scrollTimeout])
  
  const scrollTo = (element: HTMLElement | null, options?: ScrollToOptions) => {
    if (!element) return
    
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      ...options
    })
  }
  
  return {
    ...scrollData,
    scrollTo
  }
} 