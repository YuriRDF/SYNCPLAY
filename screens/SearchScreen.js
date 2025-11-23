import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';

export default function SearchScreen({ navigation }){
  const [userData, setUserData] = useState(null);
  const [searchText, setSearchText] = useState('');

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

        <Text style={localStyles.headerTitle}>Buscar</Text>

        <TouchableOpacity style={localStyles.messageButton}>
          <Ionicons name="mail-outline" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={localStyles.searchContainer}>
        <View style={localStyles.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={localStyles.searchInput}
            placeholder="Encontre seus amigos"
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
            textAlign="center"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={{ marginBottom: 70 }}>
        <View style={localStyles.categoriesContainer}>
          <View style={localStyles.categoryRow}>
            <TouchableOpacity style={localStyles.categorySquare}>
              <Ionicons name="musical-notes" size={60} color="#0db8ff" />
              <View style={localStyles.categoryTitleContainer}>
                <Text style={localStyles.categoryTitle}>Músicas</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[localStyles.categorySquare, { backgroundColor: '#1a1a2e' }]}>
              <Ionicons name="book" size={60} color="#ff6b6b" />
              <View style={localStyles.categoryTitleContainer}>
                <Text style={localStyles.categoryTitle}>Livros</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={localStyles.categoryRow}>
            <TouchableOpacity style={[localStyles.categorySquare, { backgroundColor: '#1e3a2e' }]}>
              <Ionicons name="film" size={60} color="#4ecdc4" />
              <View style={localStyles.categoryTitleContainer}>
                <Text style={localStyles.categoryTitle}>Filmes</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[localStyles.categorySquare, { backgroundColor: '#3e2a1a' }]}>
              <Ionicons name="game-controller" size={60} color="#ffe66d" />
              <View style={localStyles.categoryTitleContainer}>
                <Text style={localStyles.categoryTitle}>Jogos</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={localStyles.followersSection}>
          <Text style={localStyles.sectionTitle}>Seus seguidores</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={localStyles.followerItem}>
              <View style={localStyles.followerAvatar}>
                <Ionicons name="person" size={30} color="#fff" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={localStyles.followerItem}>
              <View style={[localStyles.followerAvatar, { backgroundColor: '#ff6b6b' }]}>
                <Ionicons name="person" size={30} color="#fff" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={localStyles.followerItem}>
              <View style={[localStyles.followerAvatar, { backgroundColor: '#4ecdc4' }]}>
                <Ionicons name="person" size={30} color="#fff" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={localStyles.followerItem}>
              <View style={[localStyles.followerAvatar, { backgroundColor: '#ffe66d' }]}>
                <Ionicons name="person" size={30} color="#333" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={localStyles.followerItem}>
              <View style={[localStyles.followerAvatar, { backgroundColor: '#9b59b6' }]}>
                <Ionicons name="person" size={30} color="#fff" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={localStyles.followerItem}>
              <View style={[localStyles.followerAvatar, { backgroundColor: '#e74c3c' }]}>
                <Ionicons name="person" size={30} color="#fff" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={localStyles.followerItem}>
              <View style={[localStyles.followerAvatar, { backgroundColor: '#3498db' }]}>
                <Ionicons name="person" size={30} color="#fff" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={localStyles.followerItem}>
              <View style={[localStyles.followerAvatar, { backgroundColor: '#2ecc71' }]}>
                <Ionicons name="person" size={30} color="#fff" />
              </View>
            </TouchableOpacity>
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121213',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  categorySquare: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#121213',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  categoryTitleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 16,
    alignItems: 'center',
  },
  categoryTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  followersSection: {
    paddingLeft: 16,
    paddingTop: 32,
    paddingBottom: 20,
  },
  sectionTitle: {
    color: '#0db8ff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    paddingRight: 16,
  },
  followerItem: {
    marginRight: 12,
  },
  followerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0db8ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0db8ff',
  },
});