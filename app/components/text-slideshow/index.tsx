'use client'

import React, {useState, useEffect} from 'react'

interface TextSlideshowProps {
  prefix: string
  items: string[]
}

const TextSlideshow: React.FC<TextSlideshowProps> = ({prefix, items}) => {
  const [displayText, setDisplayText] = useState('')
  const [index, setIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const animateText = () => {
      const currentItem = items[index]
      if (!isDeleting) {
        // Typing out the current item
        if (displayText.length < currentItem.length) {
          setDisplayText(
            prevText => prevText + currentItem.charAt(prevText.length),
          )
        } else {
          setIsDeleting(true) // Start deleting once text is fully typed
          timeout = setTimeout(() => {
            setIsDeleting(false) // Stop deleting after 1 second
          }, 1000)
        }
      } else {
        // Deleting the current item
        if (displayText.length > 0) {
          setDisplayText(prevText => prevText.slice(0, -1))
        } else {
          setIsDeleting(false) // Stop deleting once text is fully deleted
          setIndex(prevIndex =>
            prevIndex === items.length - 1 ? 0 : prevIndex + 1,
          ) // Move to the next item
        }
      }
    }

    timeout = setTimeout(animateText, 100) // Start animation immediately

    return () => clearTimeout(timeout) // Cleanup function
  }, [index, items, displayText, isDeleting])

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
        {prefix} <span className="slider">{displayText}</span>
      </h2>
    </div>
  )
}

export default TextSlideshow
