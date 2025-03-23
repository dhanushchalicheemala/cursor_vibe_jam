import { useState } from 'react'

interface UIProps {
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

const UI = ({ currentSection, setCurrentSection }: UIProps) => {
  const [showContent, setShowContent] = useState(true)

  const handleNavigate = (section: string) => {
    setCurrentSection(section)
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Navigation buttons */}
      <nav className="fixed top-8 right-8 flex flex-col gap-4 pointer-events-auto">
        <button
          onClick={() => setShowContent(!showContent)}
          className="flex items-center justify-center w-12 h-12 bg-primary/20 backdrop-blur-md rounded-full hover:bg-primary/40 transition-all duration-300"
        >
          <span className="sr-only">Toggle UI</span>
          {showContent ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>

        <div className={`flex flex-col gap-2 transition-all duration-300 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
          {['welcome', 'about', 'judges', 'sponsors', 'submission'].map((section) => (
            <button
              key={section}
              onClick={() => handleNavigate(section)}
              className={`w-12 h-12 rounded-full backdrop-blur-md uppercase font-bold text-xs transition-all duration-300 ${
                currentSection === section
                  ? 'bg-accent text-white'
                  : 'bg-primary/20 hover:bg-primary/40 text-white/80'
              }`}
            >
              {section.slice(0, 1)}
            </button>
          ))}
        </div>
      </nav>

      {/* Content overlays */}
      {showContent && (
        <div className="absolute left-8 bottom-8 max-w-lg pointer-events-auto">
          <div className="bg-background/60 backdrop-blur-lg p-6 rounded-xl border border-primary/30">
            {currentSection === 'welcome' && (
              <div className="space-y-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  2025 Vibe Coding Game Jam
                </h1>
                <p className="text-xl font-light">The first game jam for AI vibecoded games</p>
                <div className="mt-6">
                  <a
                    href="http://jam.pieter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-accent hover:bg-accent/80 text-white px-6 py-3 rounded-full font-medium transition-all duration-300"
                  >
                    Enter the Jam
                  </a>
                </div>
              </div>
            )}

            {currentSection === 'about' && (
              <div className="space-y-4">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  About the Jam
                </h2>
                <p className="text-white/90">
                  Join the first-ever game jam dedicated to AI-assisted game development.
                  Create unique experiences leveraging the power of AI to write 80% of your code.
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80">
                  <li>80% AI-written code</li>
                  <li>Web accessible without login</li>
                  <li>No loading screens</li>
                  <li>Instant gameplay</li>
                </ul>
              </div>
            )}

            {currentSection === 'judges' && (
              <div className="space-y-4">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Judges
                </h2>
                <p className="text-white/90">
                  Your submissions will be evaluated by these industry legends:
                </p>
                <ul className="space-y-3 text-white/80">
                  <li><span className="font-bold text-accent">Andrej Karpathy</span> - AI researcher and former Tesla AI Director</li>
                  <li><span className="font-bold text-accent">Tim Soret</span> - Game developer and creator of The Last Night</li>
                  <li><span className="font-bold text-accent">Mr. Doob</span> - Creator of Three.js</li>
                  <li><span className="font-bold text-accent">s13k</span> - Renowned game developer and programmer</li>
                  <li><span className="font-bold text-accent">levelsio</span> - Serial indie maker and founder of Nomad List</li>
                </ul>
              </div>
            )}

            {currentSection === 'sponsors' && (
              <div className="space-y-4">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Sponsors
                </h2>
                <p className="text-white/90">
                  This game jam is proudly sponsored by:
                </p>
                <div className="flex flex-wrap gap-6 mt-4">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-primary/30 rounded-lg flex items-center justify-center mb-2">
                      <span className="font-bold text-white">Bolt.new</span>
                    </div>
                    <p className="text-sm text-white/70">Bolt.new</p>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-24 bg-primary/30 rounded-lg flex items-center justify-center mb-2">
                      <span className="font-bold text-white">CodeRabbit</span>
                    </div>
                    <p className="text-sm text-white/70">CodeRabbit AI</p>
                  </div>
                </div>
                <p className="mt-4 font-bold text-accent">
                  $5,000 Prize Pool
                </p>
              </div>
            )}

            {currentSection === 'submission' && (
              <div className="space-y-4">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Submit Your Game
                </h2>
                <p className="text-white/90">
                  Ready to showcase your creation? Submit your game before the deadline!
                </p>
                <div className="space-y-2 text-white/80">
                  <p><span className="font-semibold">Submission Link:</span> <a href="http://jam.pieter.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">jam.pieter.com</a></p>
                  <p><span className="font-semibold">Deadline:</span> April 1, 2025</p>
                  <p><span className="font-semibold">Hashtag:</span> #vibejam</p>
                </div>
                <div className="mt-6">
                  <a
                    href="http://jam.pieter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-accent hover:bg-accent/80 text-white px-6 py-3 rounded-full font-medium transition-all duration-300"
                  >
                    Submit Now
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default UI 