import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import { useAuth } from '../App';
import { useFocusEffect } from '@react-navigation/native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = SCREEN_HEIGHT * 0.4;

export default function ProfileScreen({ navigation }){
  const { logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const usersRaw = await AsyncStorage.getItem('users');
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      const user = users.find(u => u.id === userToken);
      setUserData(user);
    } catch (e) {
      console.error('Erro ao carregar dados do usuário:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.containerDark, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0db8ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0b0b0c' }}>
      <ScrollView
        style={{ flex: 1, marginBottom: 70 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={localStyles.headerContainer}>
          {userData?.avatar ? (
            <>
              <Image
                source={{ uri: userData.avatar }}
                style={localStyles.profileImageFull}
                resizeMode="cover"
              />

              <View style={localStyles.editButtonContainer}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('EditProfile')}
                  style={localStyles.editButton}
                >
                  <Ionicons name="create-outline" size={20} color="#fff" />
                </TouchableOpacity>
              </View>

              <LinearGradient
                colors={['transparent', 'rgba(11, 11, 12, 0.8)', '#0b0b0c']}
                style={localStyles.gradient}
              >
                <View style={localStyles.userInfoContainer}>
                  <Text style={localStyles.username}>
                    @{userData?.username || 'usuario'}
                  </Text>
                </View>
              </LinearGradient>
            </>
          ) : (
            <View style={localStyles.headerImage}>
              <View style={localStyles.noImageContainer}>
                <View style={localStyles.avatarPlaceholder}>
                  <Text style={localStyles.avatarPlaceholderText}>
                    {userData?.username?.[0]?.toUpperCase() || '?'}
                  </Text>
                </View>
              </View>

              <View style={localStyles.editButtonContainer}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('EditProfile')}
                  style={localStyles.editButton}
                >
                  <Ionicons name="create-outline" size={20} color="#fff" />
                </TouchableOpacity>
              </View>

              <LinearGradient
                colors={['transparent', 'rgba(11, 11, 12, 0.8)', '#0b0b0c']}
                style={localStyles.gradient}
              >
                <View style={localStyles.userInfoContainer}>
                  <Text style={localStyles.username}>
                    @{userData?.username || 'usuario'}
                  </Text>
                </View>
              </LinearGradient>
            </View>
          )}
        </View>

        <View style={localStyles.content}>
          <View style={localStyles.statsContainer}>
            <Text style={localStyles.statsText}>
              <Text style={localStyles.statsBold}>1,234</Text> seguidores • <Text style={localStyles.statsBold}>567</Text> seguindo
            </Text>
          </View>

          <TouchableOpacity
            style={localStyles.editProfileButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={localStyles.editProfileButtonText}>Editar perfil</Text>
          </TouchableOpacity>

          <View style={localStyles.section}>
            <View style={localStyles.sectionHeader}>
              <Text style={localStyles.sectionTitle}>Bibliotecas</Text>
              <TouchableOpacity>
                <Text style={localStyles.seeAllText}>Ver todas</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={localStyles.libraryItem}>
                <View style={localStyles.librarycover}>
                  <Ionicons name="musical-notes" size={40} color="#0db8ff" />
                </View>
                <Text style={localStyles.libraryTitle}>Favoritos</Text>
                <Text style={localStyles.libraryDescription}>45 músicas</Text>
              </View>
              <View style={localStyles.libraryItem}>
                <View style={[localStyles.librarycover, { backgroundColor: '#1a1a2e' }]}>
                  <Ionicons name="headset" size={40} color="#ff6b6b" />
                </View>
                <Text style={localStyles.libraryTitle}>Relaxar</Text>
                <Text style={localStyles.libraryDescription}>28 músicas</Text>
              </View>
              <View style={localStyles.libraryItem}>
                <View style={[localStyles.librarycover, { backgroundColor: '#2a2a3e' }]}>
                  <Ionicons name="mic" size={40} color="#4ecdc4" />
                </View>
                <Text style={localStyles.libraryTitle}>Rock</Text>
                <Text style={localStyles.libraryDescription}>67 músicas</Text>
              </View>
              <View style={localStyles.libraryItem}>
                <View style={[localStyles.librarycover, { backgroundColor: '#1e1e2e' }]}>
                  <Ionicons name="radio" size={40} color="#ffe66d" />
                </View>
                <Text style={localStyles.libraryTitle}>Eletrônica</Text>
                <Text style={localStyles.libraryDescription}>92 músicas</Text>
              </View>
            </ScrollView>
          </View>

          <View style={localStyles.section}>
            <View style={localStyles.sectionHeader}>
              <Text style={localStyles.sectionTitle}>Músicas Populares</Text>
              <TouchableOpacity>
                <Text style={localStyles.seeAllText}>Ver todas</Text>
              </TouchableOpacity>
            </View>

            <View style={localStyles.musicItem}>
              <View style={localStyles.musicNumber}>
                <Text style={localStyles.musicNumberText}>1</Text>
              </View>
              <View style={localStyles.musicCover}>
                <Ionicons name="disc" size={30} color="#0db8ff" />
              </View>
              <View style={localStyles.musicInfo}>
                <Text style={localStyles.musicTitle}>Blinding Lights</Text>
                <Text style={localStyles.musicArtist}>The Weeknd</Text>
              </View>
              <Ionicons name="play-circle" size={32} color="#0db8ff" />
            </View>

            <View style={localStyles.musicItem}>
              <View style={localStyles.musicNumber}>
                <Text style={localStyles.musicNumberText}>2</Text>
              </View>
              <View style={[localStyles.musicCover, { backgroundColor: '#2a1a3e' }]}>
                <Ionicons name="disc" size={30} color="#ff6b6b" />
              </View>
              <View style={localStyles.musicInfo}>
                <Text style={localStyles.musicTitle}>Levitating</Text>
                <Text style={localStyles.musicArtist}>Dua Lipa</Text>
              </View>
              <Ionicons name="play-circle" size={32} color="#0db8ff" />
            </View>

            <View style={localStyles.musicItem}>
              <View style={localStyles.musicNumber}>
                <Text style={localStyles.musicNumberText}>3</Text>
              </View>
              <View style={[localStyles.musicCover, { backgroundColor: '#1e3a2e' }]}>
                <Ionicons name="disc" size={30} color="#4ecdc4" />
              </View>
              <View style={localStyles.musicInfo}>
                <Text style={localStyles.musicTitle}>Peaches</Text>
                <Text style={localStyles.musicArtist}>Justin Bieber</Text>
              </View>
              <Ionicons name="play-circle" size={32} color="#0db8ff" />
            </View>

            <View style={localStyles.musicItem}>
              <View style={localStyles.musicNumber}>
                <Text style={localStyles.musicNumberText}>4</Text>
              </View>
              <View style={[localStyles.musicCover, { backgroundColor: '#3e2a1a' }]}>
                <Ionicons name="disc" size={30} color="#ffe66d" />
              </View>
              <View style={localStyles.musicInfo}>
                <Text style={localStyles.musicTitle}>Good 4 U</Text>
                <Text style={localStyles.musicArtist}>Olivia Rodrigo</Text>
              </View>
              <Ionicons name="play-circle" size={32} color="#0db8ff" />
            </View>

            <View style={localStyles.musicItem}>
              <View style={localStyles.musicNumber}>
                <Text style={localStyles.musicNumberText}>5</Text>
              </View>
              <View style={[localStyles.musicCover, { backgroundColor: '#1a2a3e' }]}>
                <Ionicons name="disc" size={30} color="#9b59b6" />
              </View>
              <View style={localStyles.musicInfo}>
                <Text style={localStyles.musicTitle}>Montero</Text>
                <Text style={localStyles.musicArtist}>Lil Nas X</Text>
              </View>
              <Ionicons name="play-circle" size={32} color="#0db8ff" />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, { marginTop: 20, backgroundColor: '#333' }]}
            onPress={() => navigation.navigate('Debug')}
          >
            <Text style={styles.buttonText}>Ver Dados (Debug)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { marginTop: 12, marginBottom: 20 }]}
            onPress={logout}
          >
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    height: HEADER_HEIGHT,
    backgroundColor: '#0b0b0c',
    overflow: 'hidden',
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  profileImageFull: {
    width: '100%',
    height: HEADER_HEIGHT,
    backgroundColor: '#0b0b0c',
  },
  noImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1c',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0db8ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    color: '#fff',
    fontSize: 50,
    fontWeight: '700',
  },
  editButtonContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 3,
  },
  editButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
    borderRadius: 20,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: HEADER_HEIGHT * 0.6,
    justifyContent: 'flex-end',
    paddingBottom: 20,
    paddingHorizontal: 16,
    zIndex: 2,
  },
  userInfoContainer: {
    alignItems: 'flex-start',
  },
  username: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  content: {
    padding: 16,
  },
  statsContainer: {
    marginBottom: 16,
  },
  statsText: {
    color: '#999',
    fontSize: 14,
  },
  statsBold: {
    color: '#fff',
    fontWeight: '700',
  },
  editProfileButton: {
    backgroundColor: '#121213',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333',
  },
  editProfileButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#0db8ff',
    fontSize: 20,
    fontWeight: '700',
  },
  seeAllText: {
    color: '#999',
    fontSize: 14,
  },
  libraryItem: {
    marginRight: 12,
    width: 140,
  },
  librarycover: {
    width: 140,
    height: 140,
    backgroundColor: '#121213',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  libraryTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  libraryDescription: {
    color: '#999',
    fontSize: 12,
  },
  musicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  musicNumber: {
    width: 24,
    alignItems: 'center',
  },
  musicNumberText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '700',
  },
  musicCover: {
    width: 50,
    height: 50,
    backgroundColor: '#121213',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  musicInfo: {
    flex: 1,
  },
  musicTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  musicArtist: {
    color: '#999',
    fontSize: 13,
  },
});
