import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';

export default function NotificationScreen({ navigation }) {
  const [notifications] = useState([
    {
      id: 1,
      type: 'follow',
      user: 'Maria Silva',
      username: '@mariasilva',
      message: 'começou a seguir você',
      time: '5 min atrás',
      avatar: null,
      avatarColor: '#0db8ff',
      read: false
    },
    {
      id: 2,
      type: 'like',
      user: 'João Santos',
      username: '@joaosantos',
      message: 'curtiu sua playlist "Rock Classics"',
      time: '1 hora atrás',
      avatar: null,
      avatarColor: '#ff6b6b',
      read: false
    },
    {
      id: 3,
      type: 'comment',
      user: 'Ana Costa',
      username: '@anacosta',
      message: 'comentou: "Que música incrível!"',
      time: '2 horas atrás',
      avatar: null,
      avatarColor: '#4ecdc4',
      read: false
    },
    {
      id: 4,
      type: 'share',
      user: 'Pedro Lima',
      username: '@pedrolima',
      message: 'compartilhou sua música favorita',
      time: '5 horas atrás',
      avatar: null,
      avatarColor: '#ffe66d',
      read: true
    },
    {
      id: 5,
      type: 'follow',
      user: 'Carla Mendes',
      username: '@carlamendes',
      message: 'começou a seguir você',
      time: '1 dia atrás',
      avatar: null,
      avatarColor: '#9b59b6',
      read: true
    },
    {
      id: 6,
      type: 'like',
      user: 'Lucas Oliveira',
      username: '@lucasoliveira',
      message: 'curtiu seu álbum "Sunset Boulevard"',
      time: '2 dias atrás',
      avatar: null,
      avatarColor: '#e74c3c',
      read: true
    },
    {
      id: 7,
      type: 'comment',
      user: 'Beatriz Souza',
      username: '@beatrizsouza',
      message: 'comentou: "Adorei essa seleção!"',
      time: '3 dias atrás',
      avatar: null,
      avatarColor: '#3498db',
      read: true
    }
  ]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'follow':
        return { name: 'person-add', color: '#0db8ff' };
      case 'like':
        return { name: 'heart', color: '#ff4444' };
      case 'comment':
        return { name: 'chatbubble', color: '#4ecdc4' };
      case 'share':
        return { name: 'share-social', color: '#ffe66d' };
      default:
        return { name: 'notifications', color: '#0db8ff' };
    }
  };

  return (
    <View style={styles.containerDark}>
      <View style={localStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={localStyles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={localStyles.headerTitle}>Notificações</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={{ marginBottom: 70 }} showsVerticalScrollIndicator={false}>
        <View style={localStyles.content}>
          {notifications.map((notification) => {
            const icon = getNotificationIcon(notification.type);
            return (
              <TouchableOpacity
                key={notification.id}
                style={[
                  localStyles.notificationItem,
                  !notification.read && localStyles.unreadNotification
                ]}
              >
                <View style={localStyles.notificationContent}>
                  <View style={[localStyles.avatar, { backgroundColor: notification.avatarColor }]}>
                    {notification.avatar ? (
                      <Image source={{ uri: notification.avatar }} style={localStyles.avatarImage} />
                    ) : (
                      <Text style={localStyles.avatarText}>
                        {notification.user[0].toUpperCase()}
                      </Text>
                    )}
                  </View>

                  <View style={localStyles.notificationInfo}>
                    <Text style={localStyles.notificationText}>
                      <Text style={localStyles.userName}>{notification.user}</Text>
                      {' '}
                      <Text style={localStyles.message}>{notification.message}</Text>
                    </Text>
                    <Text style={localStyles.time}>{notification.time}</Text>
                  </View>

                  <View style={[localStyles.iconBadge, { backgroundColor: icon.color + '20' }]}>
                    <Ionicons name={icon.name} size={20} color={icon.color} />
                  </View>
                </View>

                {!notification.read && <View style={localStyles.unreadDot} />}
              </TouchableOpacity>
            );
          })}
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
  notificationItem: {
    backgroundColor: '#121213',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    position: 'relative',
  },
  unreadNotification: {
    backgroundColor: '#1a1a2e',
    borderLeftWidth: 3,
    borderLeftColor: '#0db8ff',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  notificationInfo: {
    flex: 1,
  },
  notificationText: {
    marginBottom: 4,
  },
  userName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  message: {
    color: '#cfcfcf',
    fontSize: 14,
  },
  time: {
    color: '#999',
    fontSize: 12,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0db8ff',
  },
});
