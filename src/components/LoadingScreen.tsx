import { useEffect, useState } from 'react'

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 100)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
      <div className="space-y-8 max-w-md text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Vibe Coding Game Jam
        </h1>
        
        <div className="w-full bg-primary/20 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-primary to-accent h-3 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="relative">
          <p className="text-white text-lg font-light">Loading experience... {progress}%</p>
          
          <div className="mt-4 absolute left-1/2 -translate-x-1/2 w-32 h-32">
            {Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={i}
                className="absolute h-3 w-3 bg-accent rounded-full animate-pulse"
                style={{
                  top: `${Math.sin(i * Math.PI / 4) * 50 + 50}%`,
                  left: `${Math.cos(i * Math.PI / 4) * 50 + 50}%`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen 