import { useEffect } from 'react'
import chromeAfter from './sections/chrome-after.html?raw'
import chromeBefore from './sections/chrome-before.html?raw'
import Asistencia from './components/sections/Asistencia.jsx'
import Ceremonias from './components/sections/Ceremonias.jsx'
import Dedicatorias from './components/sections/Dedicatorias.jsx'
import Hero from './components/sections/Hero.jsx'
import Musica from './components/sections/Musica.jsx'
import Recuerdos from './components/sections/Recuerdos.jsx'
import Regalos from './components/sections/Regalos.jsx'
import commonScript from './scripts/00-common.js?raw'
import dedicationsScript from './scripts/01-dedications.js?raw'
import rsvpScript from './scripts/02-rsvp.js?raw'
import galleryScript from './scripts/03-gallery.js?raw'
import playlistScript from './scripts/04-playlist.js?raw'
import ambientSoundScript from './scripts/05-ambient-sound.js?raw'
import navigationScript from './scripts/06-navigation.js?raw'
import petalsScript from './scripts/07-petals.js?raw'
import './App.css'
import './invitation.css'

const sections = [
  Hero,
  Ceremonias,
  Regalos,
  Musica,
  Dedicatorias,
  Asistencia,
  Recuerdos,
]

const invitationScripts = [
  commonScript,
  dedicationsScript,
  rsvpScript,
  galleryScript,
  playlistScript,
  ambientSoundScript,
  navigationScript,
  petalsScript,
]

function RawMarkup({ markup }) {
  return <div dangerouslySetInnerHTML={{ __html: markup }} />
}

function App() {
  useEffect(() => {
    if (window.invitationInitialized) return

    window.invitationInitialized = true
    invitationScripts.forEach((source, index) => {
      const script = document.createElement('script')
      script.dataset.invitationModule = String(index)
      script.textContent = source
      document.body.appendChild(script)
    })
  }, [])

  return (
    <>
      <RawMarkup markup={chromeBefore} />
      <main className="snap-master-container" id="snap-scroller">
        {sections.map((Section) => (
          <Section key={Section.name} />
        ))}
      </main>
      <RawMarkup markup={chromeAfter} />
    </>
  )
}

export default App
