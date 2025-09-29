import { createContext, useContext, useState } from 'react'
const UiContext = createContext()
export function UiProvider({ children }){
  const [currentSection, setCurrentSection] = useState('home')
  const [toast, setToast] = useState(null)
  const [showAuth, setShowAuth] = useState(false)
  const notify = (msg) => { setToast(msg); setTimeout(()=> setToast(null), 2500) }
  return (
    <UiContext.Provider value={{ currentSection, setCurrentSection, toast, notify, showAuth, setShowAuth }}>
      {children}
    </UiContext.Provider>
  )
}
export const useUi = ()=> useContext(UiContext)