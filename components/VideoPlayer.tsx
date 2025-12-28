'use client';

import { useRef, useState } from 'react';
import styles from './VideoPlayer.module.css';

interface VideoPlayerProps {
  videoUrl: string;
  posterImage: string;
  productName: string;
}

export default function VideoPlayer({ videoUrl, posterImage, productName }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  return (
    <div className={styles.videoPlaceholder}>
      {!isPlaying && (
        <>
          <div className={styles.playButton} onClick={handlePlayClick}>
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div className={styles.videoOverlay} onClick={handlePlayClick}>
            <p>Click to play product demonstration</p>
          </div>
        </>
      )}
      <video
        ref={videoRef}
        className={styles.video}
        poster={posterImage}
        controls
        onPlay={handlePlay}
        onPause={handlePause}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
