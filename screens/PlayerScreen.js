import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const COVER_SIZE = SCREEN_WIDTH * 0.75;
const PROGRESS_WIDTH = SCREEN_WIDTH * 0.85;

export default function PlayerScreen({ navigation }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [currentTime, setCurrentTime] = useState(45);
  const [duration] = useState(180);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const playlist = [
    {
      id: 1,
      title: 'The Spins',
      artist: 'Mc Miller',
      album: 'Empire of The Sun',
      cover: require('../src/img/mcmiller.jpg'),
      coverColor: '#2a1a3e'
    },
    {
      id: 2,
      title: 'Neon Nights',
      artist: 'Electric Soul',
      coverColor: '#1a3a2e'
    },
    {
      id: 3,
      title: 'Ocean Waves',
      artist: 'Coastal Breeze',
      coverColor: '#3a1a1a'
    }
  ];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleRepeat = () => {
    setRepeatMode((repeatMode + 1) % 3);
  };

  const handleScroll = (event) => {
    const slideSize = SCREEN_WIDTH;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentIndex(index);
  };

  const skipNext = () => {
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentIndex(nextIndex);
    scrollViewRef.current?.scrollTo({ x: nextIndex * SCREEN_WIDTH, animated: true });
  };

  const skipPrevious = () => {
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    scrollViewRef.current?.scrollTo({ x: prevIndex * SCREEN_WIDTH, animated: true });
  };

  const currentSong = playlist[currentIndex];
  const progress = currentTime / duration;

  return (
    <LinearGradient
      colors={[currentSong.coverColor, '#0b0b0c', '#0b0b0c']}
      style={localStyles.container}
    >
      <View style={localStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-down" size={28} color="#fff" />
        </TouchableOpacity>
        <View style={localStyles.headerCenter}>
          <Text style={localStyles.headerTitle}>TOCANDO AGORA</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={localStyles.carouselContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
        >
          {playlist.map((song) => (
            <View key={song.id} style={localStyles.coverSlide}>
              <View style={[localStyles.coverWrapper, { backgroundColor: song.coverColor }]}>
                {song.cover ? (
                  <Image source={song.cover} style={localStyles.coverImage} />
                ) : (
                  <Ionicons name="musical-notes" size={80} color="rgba(255,255,255,0.3)" />
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={localStyles.pageIndicators}>
        {playlist.map((_, index) => (
          <View
            key={index}
            style={[
              localStyles.indicator,
              currentIndex === index && localStyles.activeIndicator,
              { marginHorizontal: 4 }
            ]}
          />
        ))}
      </View>

      <View style={localStyles.songInfoCenter}>
        <Text style={localStyles.songTitle} numberOfLines={1}>
          {currentSong.title}
        </Text>
        <Text style={localStyles.artistName} numberOfLines={1}>
          {currentSong.artist}, {currentSong.album}
        </Text>
      </View>

      <View style={localStyles.actionIcons}>
        <TouchableOpacity onPress={() => setIsLiked(!isLiked)}>
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={28}
            color={isLiked ? '#ff4444' : '#fff'}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="paper-plane-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="share-social-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={localStyles.progressBarContainer}>
        <View style={localStyles.progressTrack}>
          <View style={[localStyles.progressFill, { width: `${progress * 100}%` }]} />
          <View style={[localStyles.progressDot, { left: `${progress * 100}%` }]} />
        </View>
      </View>

      <View style={localStyles.timeContainer}>
        <Text style={localStyles.timeText}>{formatTime(currentTime)}</Text>
        <Text style={localStyles.timeText}>{formatTime(duration)}</Text>
      </View>

      <View style={localStyles.controls}>
        <TouchableOpacity onPress={() => setIsShuffle(!isShuffle)}>
          <Ionicons
            name="shuffle"
            size={24}
            color={isShuffle ? '#0db8ff' : '#999'}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={skipPrevious}>
          <Ionicons name="play-skip-back" size={36} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={localStyles.playButton}
          onPress={() => setIsPlaying(!isPlaying)}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={32}
            color="#000"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={skipNext}>
          <Ionicons name="play-skip-forward" size={36} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleRepeat}>
          <Ionicons
            name={repeatMode === 0 ? 'repeat-outline' : 'repeat'}
            size={24}
            color={repeatMode > 0 ? '#0db8ff' : '#999'}
          />
          {repeatMode === 2 && (
            <View style={localStyles.repeatOneBadge}>
              <Text style={localStyles.repeatOneText}>1</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  carouselContainer: {
    height: COVER_SIZE + 40,
    marginBottom: 10,
  },
  coverSlide: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverWrapper: {
    width: COVER_SIZE,
    height: COVER_SIZE,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  progressBarContainer: {
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 20,
  },
  progressTrack: {
    width: PROGRESS_WIDTH,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    position: 'relative',
  },
  progressFill: {
    height: 4,
    backgroundColor: '#0db8ff',
    borderRadius: 2,
  },
  progressDot: {
    position: 'absolute',
    top: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0db8ff',
    transform: [{ translateX: -6 }],
    shadowColor: '#0db8ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  pageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#444',
  },
  activeIndicator: {
    width: 24,
    backgroundColor: '#0db8ff',
  },
  songInfoCenter: {
    alignItems: 'center',
    paddingHorizontal: SCREEN_WIDTH * 0.1,
    marginBottom: 16,
  },
  songTitle: {
    color: '#fff',
    fontSize: Math.min(28, SCREEN_WIDTH * 0.07),
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  artistName: {
    color: '#b3b3b3',
    fontSize: Math.min(18, SCREEN_WIDTH * 0.045),
    textAlign: 'center',
  },
  actionIcons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: SCREEN_WIDTH * 0.2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: PROGRESS_WIDTH,
    alignSelf: 'center',
    marginBottom: 30,
    marginTop: 4,
  },
  timeText: {
    color: '#b3b3b3',
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    marginBottom: 40,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  repeatOneBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0db8ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  repeatOneText: {
    color: '#000',
    fontSize: 8,
    fontWeight: '700',
  },
});
