import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

export default function ImageSlider({ images = [], autoPlay = true, interval = 4500, onCta }){
  const [index, setIndex] = useState(0)
  const timerRef = useRef(null)
  const touch = useRef({ startX:0, deltaX:0 })

  const next = ()=> setIndex(i => (i+1)%images.length)
  const prev = ()=> setIndex(i => (i-1+images.length)%images.length)
  const goTo = (i)=> setIndex(i)

  useEffect(()=>{
    if (!autoPlay || images.length<=1) return
    clearInterval(timerRef.current)
    timerRef.current = setInterval(next, interval)
    return ()=> clearInterval(timerRef.current)
  }, [index, autoPlay, interval, images.length])

  useEffect(()=>{
    const onKey = (e)=>{ if(e.key==='ArrowRight') next(); if(e.key==='ArrowLeft') prev() }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  }, [])

  const onTouchStart = (e)=>{ touch.current.startX = e.touches[0].clientX; touch.current.deltaX=0 }
  const onTouchMove  = (e)=>{ touch.current.deltaX = e.touches[0].clientX - touch.current.startX }
  const onTouchEnd   = ()=>{ const d = touch.current.deltaX; if (Math.abs(d)>50){ d>0?prev():next() } touch.current.deltaX=0 }

  return (
    <div className="slider" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <div className="slides" style={{ transform:`translateX(-${index*100}%)` }}>
        {images.map((img, i)=>(
          <div className="slide" key={i} aria-hidden={i!==index}>
            <img src={img.src} alt={img.alt||''} loading="lazy" onError={(e)=>{
              e.currentTarget.style.display='none'
              e.currentTarget.parentElement.style.background='linear-gradient(135deg,#FFE55C,#FFD700)'
            }}/>
            {(img.caption || img.ctaText) && (
              <div className="slide-caption">
                {img.caption && <h2>{img.caption}</h2>}
                {img.ctaText && <button className="login-btn" onClick={onCta}>{img.ctaText}</button>}
              </div>
            )}
          </div>
        ))}
      </div>
      {images.length>1 && (
        <>
          <button className="nav prev" aria-label="Ảnh trước" onClick={prev}><i className="fas fa-chevron-left"/></button>
          <button className="nav next" aria-label="Ảnh kế" onClick={next}><i className="fas fa-chevron-right"/></button>
          <div className="dots">
            {images.map((_, i)=>(
              <button key={i} className={i===index?'active':''} onClick={()=>goTo(i)} aria-label={`Chuyển tới ảnh ${i+1}`} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
ImageSlider.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape({
    src: PropTypes.string.isRequired, alt: PropTypes.string, caption: PropTypes.string, ctaText: PropTypes.string
  })), autoPlay: PropTypes.bool, interval: PropTypes.number, onCta: PropTypes.func
}