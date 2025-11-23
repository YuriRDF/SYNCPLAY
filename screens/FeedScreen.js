import React, {useEffect, useState} from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const feedActivities = [
  {
    id: 1,
    type: 'music',
    user: {
      name: 'Maria Silva',
      username: '@mariasilva',
      avatar: null,
      avatarColor: '#ff6b6b'
    },
    music: {
      title: 'Starlight Dreams',
      artist: 'The Midnight Echo',
      coverColor: '#2a1a3e'
    },
    time: '2 horas atrás'
  },
  {
    id: 2,
    type: 'movie',
    user: {
      name: 'João Santos',
      username: '@joaosantos',
      avatar: null,
      avatarColor: '#4ecdc4'
    },
    movie: {
      title: 'Inception',
      comment: 'Que filme incrível! A cinematografia é perfeita e o roteiro é uma obra-prima. Recomendo muito! 🎬✨'
    },
    time: '5 horas atrás'
  }
];

function ActivityCard({ item }) {
  if (item.type === 'music') {
    return (
      <View style={localStyles.activityCard}>
        <View style={localStyles.cardHeader}>
          <View style={[localStyles.userAvatar, { backgroundColor: item.user.avatarColor }]}>
            <Text style={localStyles.avatarText}>
              {item.user.name[0].toUpperCase()}
            </Text>
          </View>
          <View style={localStyles.userInfo}>
            <Text style={localStyles.userName}>{item.user.username}</Text>
            <Text style={localStyles.activityText}>
              <Ionicons name="musical-notes" size={12} color="#0db8ff" /> está ouvindo
            </Text>
          </View>
          <Text style={localStyles.timeText}>{item.time}</Text>
        </View>

        <View style={localStyles.musicContent}>
          <View style={[localStyles.musicCover, { backgroundColor: item.music.coverColor }]}>
            <Ionicons name="musical-notes" size={40} color="rgba(255,255,255,0.3)" />
          </View>
          <View style={localStyles.musicInfo}>
            <Text style={localStyles.musicTitle} numberOfLines={1}>
              {item.music.title}
            </Text>
            <Text style={localStyles.musicArtist} numberOfLines={1}>
              {item.music.artist}
            </Text>
            <TouchableOpacity style={localStyles.playButton}>
              <Ionicons name="play" size={16} color="#0db8ff" />
              <Text style={localStyles.playButtonText}>Ouvir agora</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={localStyles.cardActions}>
          <TouchableOpacity style={localStyles.actionButton}>
            <Ionicons name="heart-outline" size={22} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={localStyles.actionButton}>
            <Ionicons name="chatbubble-outline" size={22} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={localStyles.actionButton}>
            <Ionicons name="share-social-outline" size={22} color="#999" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (item.type === 'movie') {
    return (
      <View style={localStyles.activityCard}>
        <View style={localStyles.cardHeader}>
          <View style={[localStyles.userAvatar, { backgroundColor: item.user.avatarColor }]}>
            <Text style={localStyles.avatarText}>
              {item.user.name[0].toUpperCase()}
            </Text>
          </View>
          <View style={localStyles.userInfo}>
            <Text style={localStyles.userName}>{item.user.username}</Text>
            <Text style={localStyles.activityText}>
              <Ionicons name="film" size={12} color="#0db8ff" /> comentou sobre {item.movie.title}
            </Text>
          </View>
          <Text style={localStyles.timeText}>{item.time}</Text>
        </View>

        <View style={localStyles.commentContent}>
          <Text style={localStyles.commentText}>{item.movie.comment}</Text>
        </View>

        <View style={localStyles.cardActions}>
          <TouchableOpacity style={localStyles.actionButton}>
            <Ionicons name="heart-outline" size={22} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={localStyles.actionButton}>
            <Ionicons name="chatbubble-outline" size={22} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={localStyles.actionButton}>
            <Ionicons name="share-social-outline" size={22} color="#999" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return null;
}

export default function FeedScreen({navigation}){
  const [userData, setUserData] = useState(null);

  useEffect(()=>{
    loadUserData();
  },[]);

  const loadUserData = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const usersRaw = await AsyncStorage.getItem('users');
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      const user = users.find(u => u.id === userToken);
      setUserData(user);
    } catch (e) {
      console.error('Erro ao carregar dados do usuário:', e);
    }
  };

  const goToProfile = () => {
    navigation.getParent()?.navigate('Perfil');
  };

  return (
    <View style={styles.containerDark}>
      <View style={localStyles.header}>
        <TouchableOpacity onPress={goToProfile} style={localStyles.profileButton}>
          {userData?.avatar ? (
            <Image source={{ uri: userData.avatar }} style={localStyles.profileImage} />
          ) : (
            <View style={localStyles.profilePlaceholder}>
              <Text style={localStyles.profilePlaceholderText}>
                {userData?.username?.[0]?.toUpperCase() || '?'}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={localStyles.headerTitle}>Feed</Text>

        <TouchableOpacity style={localStyles.messageButton}>
          <Ionicons name="mail-outline" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={localStyles.storiesSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={localStyles.storyItem}>
            <View style={localStyles.storyAvatar}>
              <Ionicons name="person" size={30} color="#fff" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={localStyles.storyItem}>
            <View style={[localStyles.storyAvatar, { backgroundColor: '#ff6b6b' }]}>
              <Ionicons name="person" size={30} color="#fff" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={localStyles.storyItem}>
            <View style={[localStyles.storyAvatar, { backgroundColor: '#4ecdc4' }]}>
              <Ionicons name="person" size={30} color="#fff" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={localStyles.storyItem}>
            <View style={[localStyles.storyAvatar, { backgroundColor: '#ffe66d' }]}>
              <Ionicons name="person" size={30} color="#333" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={localStyles.storyItem}>
            <View style={[localStyles.storyAvatar, { backgroundColor: '#9b59b6' }]}>
              <Ionicons name="person" size={30} color="#fff" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={localStyles.storyItem}>
            <View style={[localStyles.storyAvatar, { backgroundColor: '#e74c3c' }]}>
              <Ionicons name="person" size={30} color="#fff" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={localStyles.storyItem}>
            <View style={[localStyles.storyAvatar, { backgroundColor: '#3498db' }]}>
              <Ionicons name="person" size={30} color="#fff" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={localStyles.storyItem}>
            <View style={[localStyles.storyAvatar, { backgroundColor: '#2ecc71' }]}>
              <Ionicons name="person" size={30} color="#fff" />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {feedActivities.map((activity) => (
          <ActivityCard key={activity.id} item={activity} />
        ))}
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0b0b0c',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  profileButton: {
    width: 40,
    height: 40,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#0db8ff',
  },
  profilePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0db8ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0db8ff',
  },
  profilePlaceholderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  messageButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storiesSection: {
    paddingLeft: 16,
    paddingVertical: 16,
    backgroundColor: '#0b0b0c',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  storyItem: {
    marginRight: 12,
  },
  storyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0db8ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0db8ff',
  },
  activityCard: {
    backgroundColor: '#121213',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  activityText: {
    color: '#999',
    fontSize: 13,
  },
  timeText: {
    color: '#666',
    fontSize: 12,
  },
  musicContent: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1c',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  musicCover: {
    width: 80,
    height: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  musicInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  musicTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  musicArtist: {
    color: '#999',
    fontSize: 14,
    marginBottom: 8,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0db8ff20',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  playButtonText: {
    color: '#0db8ff',
    fontSize: 12,
    fontWeight: '700',
  },
  commentContent: {
    backgroundColor: '#1a1a1c',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  commentText: {
    color: '#cfcfcf',
    fontSize: 14,
    lineHeight: 20,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1a1a1c',
    gap: 20,
  },
  actionButton: {
    padding: 4,
  },
});