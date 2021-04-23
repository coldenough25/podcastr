import { createContext, ReactNode, useContext, useState } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isShuffling: boolean;
    isLooping: boolean;
    play: (episode: Episode) => void;
    playNext: () => void;
    playPrevious: () => void;
    playList: (list: Episode[], index: number) => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    setPlayingState: (state: boolean) => void;
    clearPlayerState: () => void;
    hasPrevious: boolean;
    hasNext: boolean;
}

type PlayerContextProviderProps = {
    children: ReactNode;
}

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    const hasPrevious = currentEpisodeIndex > 0;
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;
    
    function play(episode: Episode) {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    function playList(list, index) {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    function togglePlay() {
        setIsPlaying(!isPlaying);
    }
    
    function toggleShuffle() {
        setIsShuffling(!isShuffling);
        
    }

    function toggleLoop() {
        setIsLooping(!isLooping);
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state);
    }
    
    function clearPlayerState() {
        setEpisodeList([]);
        setCurrentEpisodeIndex(0);
    }

    function playNext() {
        const nextEpisodeIndex = currentEpisodeIndex + 1;

        if(isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
            setCurrentEpisodeIndex(nextRandomEpisodeIndex)
        }

        else if (hasNext) {
            setCurrentEpisodeIndex(nextEpisodeIndex);
        }
    }
    
    function playPrevious() {
        const previousEpisodeIndex = currentEpisodeIndex - 1;

        if (hasPrevious) {
            setCurrentEpisodeIndex(previousEpisodeIndex);
        }
    }



    return (
        <PlayerContext.Provider value={{
            episodeList,
            currentEpisodeIndex,
            play,
            playNext,
            playPrevious,
            playList,
            isPlaying,
            isLooping,
            isShuffling,
            togglePlay,
            toggleLoop,
            toggleShuffle,
            setPlayingState,
            clearPlayerState,
            hasNext,
            hasPrevious
        }}>
            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
    return useContext(PlayerContext)
}