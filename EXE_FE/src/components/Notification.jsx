import { useUi } from '../context/UiContext'
export default function Notification(){ const { toast } = useUi(); if (!toast) return null; return <div className="toast">{toast}</div> }
