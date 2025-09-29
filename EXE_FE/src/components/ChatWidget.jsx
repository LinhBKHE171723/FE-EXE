import { useEffect, useRef, useState } from 'react'
import { sendChat } from '../api/ai'
export default function ChatWidget({ onClose }){
  const [messages, setMessages] = useState([{ role:'assistant', content:'Xin chào 👋, mình là AI trợ lý. Mình có thể giúp gì cho bạn hôm nay?' }])
  const [input, setInput] = useState(''); const [loading, setLoading] = useState(false); const listRef = useRef(null)
  useEffect(()=>{ listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior:'smooth' }) }, [messages, loading])
  const send = async ()=>{
    const text = input.trim(); if (!text) return
    const userMsg = { role:'user', content: text }; setMessages(prev => [...prev, userMsg]); setInput(''); setLoading(true)
    try{ const res = await sendChat({ message: text, history: messages }); const reply = res?.reply || 'Mình đã nhận được câu hỏi của bạn.'
      setMessages(prev => [...prev, { role:'assistant', content: reply }]) }
    catch(err){ setMessages(prev => [...prev, { role:'assistant', content: `Xin lỗi, có lỗi xảy ra: ${err.message}` }]) }
    finally{ setLoading(false) }
  }
  const onKey = (e)=>{ if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }
  return (
    <div className="chat-overlay" onClick={onClose}>
      <div className="chat-window" onClick={(e)=>e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Chat AI">
        <div className="chat-header">
          <div className="title"><i className="fas fa-robot"/> Trợ lý AI</div>
          <button className="close" onClick={onClose} aria-label="Đóng"><i className="fas fa-times"/></button>
        </div>
        <div className="chat-body" ref={listRef}>
          {messages.map((m, idx)=> (<div key={idx} className={`msg ${m.role}`}><div className="bubble">{m.content}</div></div>))}
          {loading && <div className="msg assistant"><div className="bubble typing"><span/><span/><span/></div></div>}
        </div>
        <div className="chat-input">
          <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={onKey} placeholder="Nhập tin nhắn..."/>
          <button onClick={send} disabled={loading || !input.trim()} aria-label="Gửi"><i className="fas fa-paper-plane"/></button>
        </div>
      </div>
    </div>
  )
}