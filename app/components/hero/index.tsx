'use client'
import TextSlideshow from '../text-slideshow'

import React from 'react'
import {Box, IconButton} from '@mui/material'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import {styled} from '@mui/system'

const HeroContainer = styled(Box)({
  position: 'relative',
  height: '100vh',
  overflow: 'hidden',
})

const VideoBackground = styled('video')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
})

const Overlay = styled(Box)({
  position: 'absolute',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
})

const SlideshowContainer = styled(Box)({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  textAlign: 'center',
})

const ArrowButton = styled(IconButton)({
  position: 'absolute',
  bottom: '2rem',
  left: '50%',
  transform: 'translateX(-50%)',
  color: '#fff',
  animation: 'bounce 2s infinite',
  '@keyframes bounce': {
    '0%, 20%, 50%, 80%, 100%': {transform: 'translateY(0)'},
    '40%': {transform: 'translateY(-10px)'},
    '60%': {transform: 'translateY(-5px)'},
  },
})

const scrollTo = () => {
  const aboutSection = document.getElementById('about')
  if (aboutSection) {
    aboutSection.scrollIntoView({behavior: 'smooth'})
  }
}

const textSlideshowItems = [
  'a software engineer...',
  'a Peloton employee...',
  'an NYU Alum...',
  'a Montverde Academy Alum...',
  'a tech enthusiast...',
  'a self-proclaimed economist...',
  'a competitor...',
  'an optimist...',
  'a follower of Christ...',
]

export const Hero: React.FC = (): React.ReactElement => {
  return (
    <HeroContainer>
      <Overlay />
      <VideoBackground autoPlay loop muted playsInline poster="IMG_0371.jpg">
        <source src="frank.MP4" type="video/mp4" />
      </VideoBackground>
      <SlideshowContainer>
        <TextSlideshow prefix="kevin is" items={textSlideshowItems} />
      </SlideshowContainer>
      <ArrowButton onClick={scrollTo}>
        <ArrowDownwardIcon fontSize="large" />
      </ArrowButton>
    </HeroContainer>
  )
}
