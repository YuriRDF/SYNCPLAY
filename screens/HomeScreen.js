import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';

export default function HomeScreen({ navigation }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

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

        <Image
          source={require('../src/img/logo.png')}
          style={localStyles.logo}
          resizeMode="contain"
        />

        <TouchableOpacity
          style={localStyles.notificationButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Ionicons name="notifications-outline" size={26} color="#fff" />
          <View style={localStyles.badge}>
            <Text style={localStyles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ marginBottom: 70 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
          <Text style={[styles.smallText, { marginBottom: 4 }]}>
            Bem-vindo de volta, {userData?.username || 'Usuário'}!
          </Text>
        </View>

        <View style={localStyles.section}>
          <Text style={localStyles.sectionTitle}>Salvos recentemente</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={localStyles.savedItem}>
              <View style={localStyles.savedCover}>
                <Ionicons name="musical-notes" size={40} color="#0db8ff" />
              </View>
              <Text style={localStyles.savedTitle}>Playlist Chill</Text>
            </View>
            <View style={localStyles.savedItem}>
              <View style={[localStyles.savedCover, { backgroundColor: '#1a1a2e' }]}>
                <Ionicons name="headset" size={40} color="#ff6b6b" />
              </View>
              <Text style={localStyles.savedTitle}>Top 50 Brasil</Text>
            </View>
            <View style={localStyles.savedItem}>
              <View style={[localStyles.savedCover, { backgroundColor: '#2a2a3e' }]}>
                <Ionicons name="mic" size={40} color="#4ecdc4" />
              </View>
              <Text style={localStyles.savedTitle}>Rock Classics</Text>
            </View>
            <View style={localStyles.savedItem}>
              <View style={[localStyles.savedCover, { backgroundColor: '#1e1e2e' }]}>
                <Ionicons name="radio" size={40} color="#ffe66d" />
              </View>
              <Text style={localStyles.savedTitle}>Mix do Dia</Text>
            </View>
          </ScrollView>
        </View>

        <View style={localStyles.section}>
          <Text style={localStyles.sectionTitle}>Novos lançamentos</Text>
          <View style={localStyles.releaseItem}>
            <View style={localStyles.releaseNumber}>
              <Text style={localStyles.releaseNumberText}>1</Text>
            </View>
            <View style={localStyles.releaseCover}>
              <Ionicons name="disc" size={30} color="#0db8ff" />
            </View>
            <View style={localStyles.releaseInfo}>
              <Text style={localStyles.releaseTitle}>Starlight Dreams</Text>
              <Text style={localStyles.releaseArtist}>The Midnight Echo</Text>
            </View>
            <Ionicons name="play-circle" size={32} color="#0db8ff" />
          </View>

          <View style={localStyles.releaseItem}>
            <View style={localStyles.releaseNumber}>
              <Text style={localStyles.releaseNumberText}>2</Text>
            </View>
            <View style={[localStyles.releaseCover, { backgroundColor: '#2a1a3e' }]}>
              <Ionicons name="disc" size={30} color="#ff6b6b" />
            </View>
            <View style={localStyles.releaseInfo}>
              <Text style={localStyles.releaseTitle}>Neon Nights</Text>
              <Text style={localStyles.releaseArtist}>Electric Soul</Text>
            </View>
            <Ionicons name="play-circle" size={32} color="#0db8ff" />
          </View>

          <View style={localStyles.releaseItem}>
            <View style={localStyles.releaseNumber}>
              <Text style={localStyles.releaseNumberText}>3</Text>
            </View>
            <View style={[localStyles.releaseCover, { backgroundColor: '#1e3a2e' }]}>
              <Ionicons name="disc" size={30} color="#4ecdc4" />
            </View>
            <View style={localStyles.releaseInfo}>
              <Text style={localStyles.releaseTitle}>Ocean Waves</Text>
              <Text style={localStyles.releaseArtist}>Coastal Breeze</Text>
            </View>
            <Ionicons name="play-circle" size={32} color="#0db8ff" />
          </View>

          <View style={localStyles.releaseItem}>
            <View style={localStyles.releaseNumber}>
              <Text style={localStyles.releaseNumberText}>4</Text>
            </View>
            <View style={[localStyles.releaseCover, { backgroundColor: '#3e2a1a' }]}>
              <Ionicons name="disc" size={30} color="#ffe66d" />
            </View>
            <View style={localStyles.releaseInfo}>
              <Text style={localStyles.releaseTitle}>Sunset Boulevard</Text>
              <Text style={localStyles.releaseArtist}>Golden Hour</Text>
            </View>
            <Ionicons name="play-circle" size={32} color="#0db8ff" />
          </View>

          <View style={localStyles.releaseItem}>
            <View style={localStyles.releaseNumber}>
              <Text style={localStyles.releaseNumberText}>5</Text>
            </View>
            <View style={[localStyles.releaseCover, { backgroundColor: '#1a2a3e' }]}>
              <Ionicons name="disc" size={30} color="#9b59b6" />
            </View>
            <View style={localStyles.releaseInfo}>
              <Text style={localStyles.releaseTitle}>Purple Rain</Text>
              <Text style={localStyles.releaseArtist}>Thunder Storm</Text>
            </View>
            <Ionicons name="play-circle" size={32} color="#0db8ff" />
          </View>
        </View>

        <View style={[localStyles.section, { paddingBottom: 20 }]}>
          <Text style={localStyles.sectionTitle}>Seus artistas favoritos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={localStyles.artistItem}>
              <View style={localStyles.artistAvatar}>
                <Ionicons name="person" size={40} color="#0db8ff" />
              </View>
              <Text style={localStyles.artistName}>The Weeknd</Text>
            </View>
            <View style={localStyles.artistItem}>
              <View style={[localStyles.artistAvatar, { backgroundColor: '#ff6b6b' }]}>
                <Ionicons name="person" size={40} color="#fff" />
              </View>
              <Text style={localStyles.artistName}>Ariana Grande</Text>
            </View>
            <View style={localStyles.artistItem}>
              <View style={[localStyles.artistAvatar, { backgroundColor: '#4ecdc4' }]}>
                <Ionicons name="person" size={40} color="#fff" />
              </View>
              <Text style={localStyles.artistName}>Ed Sheeran</Text>
            </View>
            <View style={localStyles.artistItem}>
              <View style={[localStyles.artistAvatar, { backgroundColor: '#ffe66d' }]}>
                <Ionicons name="person" size={40} color="#333" />
              </View>
              <Text style={localStyles.artistName}>Billie Eilish</Text>
            </View>
            <View style={localStyles.artistItem}>
              <View style={[localStyles.artistAvatar, { backgroundColor: '#9b59b6' }]}>
                <Ionicons name="person" size={40} color="#fff" />
              </View>
              <Text style={localStyles.artistName}>Drake</Text>
            </View>
          </ScrollView>
        </View>
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
  logo: {
    width: 120,
    height: 40,
  },
  notificationButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0b0b0c',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  section: {
    marginTop: 24,
    marginBottom: 12,
    paddingLeft: 16,
  },
  sectionTitle: {
    color: '#0db8ff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  savedItem: {
    marginRight: 12,
    width: 140,
  },
  savedCover: {
    width: 140,
    height: 140,
    backgroundColor: '#121213',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  savedTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  releaseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
    paddingVertical: 10,
    gap: 12,
  },
  releaseNumber: {
    width: 24,
    alignItems: 'center',
  },
  releaseNumberText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '700',
  },
  releaseCover: {
    width: 50,
    height: 50,
    backgroundColor: '#121213',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  releaseInfo: {
    flex: 1,
  },
  releaseTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  releaseArtist: {
    color: '#999',
    fontSize: 13,
  },
  artistItem: {
    marginRight: 16,
    alignItems: 'center',
    width: 100,
  },
  artistAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#121213',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  artistName: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
