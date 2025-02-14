import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import Slider from 'rc-slider'

import { usePlayer } from '../../contexts/PlayerContext';

import 'rc-slider/assets/index.css';
import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0)

    const { 
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        isLooping,
        isShuffling,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setPlayingState,
        clearPlayerState,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious,
    } = usePlayer();

    useEffect(() => {
        if (!audioRef.current) {
            return;
        }
        

        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying])

    function setupProgressListener() {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime));
        })
    }

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount;
        setProgress(amount)

    }
    
    function handleEpisodeEnded() {
        if(hasNext){
            playNext();
        } else {
            clearPlayerState();
        }

    }

    const episode = episodeList[currentEpisodeIndex];

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora" />
                <strong>Tocando agora</strong>
            </header>

            {episode ? (
                <div className={styles.currentEpisode}>
                    <Image
                        height={592}
                        width={592}
                        src={episode.thumbnail}
                        objectFit="cover"
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )}

            <footer className={!episode ? styles.empty : ""}>
                <div className={styles.progress}>
                <span>{convertDurationToTimeString(progress ?? 0)}</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                                onEnded={handleEpisodeEnded}
                                trackStyle={{ backgroundColor: "#04D361" }}
                                railStyle={{ backgroundColor: "#9F75FF" }}
                                handleStyle={{ borderColor: "#04D361", borderWidth: 4 }}
                            />
                        ) : (
                            <div className={styles.emptySlider}></div>
                        )
                        }

                    </div>

                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                {episode && (
                    <audio
                        src={episode.url}
                        autoPlay
                        loop={isLooping}
                        ref={audioRef}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onLoadedMetadata={() => setupProgressListener()}
                    />
                )}

                <div className={styles.buttons}>
                    <button
                        type="button"
                        disabled={(!episode) || (episodeList.length === 1)}
                        className={isShuffling ? (styles.isActive) : ("")}
                        onClick={toggleShuffle}
                    >
                        <img src="/shuffle.svg" alt="Aleatório" />
                    </button>
                    <button type="button" disabled={(!episode) || (!hasPrevious)} onClick={playPrevious}>
                        <img src="/play-previous.svg" alt="Anterior" />
                    </button>
                    <button
                        type="button"
                        className={styles.playButton}
                        disabled={(!episode)}
                        onClick={togglePlay}
                    >
                        {isPlaying ? <img src="/pause.svg" alt="Tocar" /> : <img src="/play.svg" alt="Tocar" />}                    </button>

                    <button type="button" disabled={(!episode) || (!hasNext)} onClick={playNext}>
                        <img src="/play-next.svg" alt="Próximo" />
                    </button>
                    <button
                        type="button"
                        disabled={(!episode)}
                        className={isLooping ? (styles.isActive) : ("")}
                        onClick={toggleLoop}
                    >
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                </div>
            </footer>
        </div>
    );
}

<div></div>