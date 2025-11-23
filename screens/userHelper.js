import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

export const UserHelper = {
  isWeb() {
    return Platform.OS === 'web';
  },

  async ensureDirectories() {
    if (this.isWeb()) {
      console.log('FileSystem não disponível na web');
      return;
    }

    try {
      const imgDir = `${FileSystem.documentDirectory}src/img/`;
      await FileSystem.makeDirectory(imgDir, { intermediates: true });
      console.log('Diretórios criados/verificados');
    } catch (e) {
      console.log('Diretórios já existem ou erro:', e.message);
    }
  },

  async saveUsersToJson(users) {
    if (this.isWeb()) {
      console.log('Salvamento em JSON não disponível na web - usando apenas AsyncStorage');
      return true;
    }

    try {
      await this.ensureDirectories();
      const userDataPath = `${FileSystem.documentDirectory}src/users.json`;
      await FileSystem.writeString(userDataPath, JSON.stringify(users, null, 2));
      console.log('JSON salvo com sucesso em:', userDataPath);
      return true;
    } catch (e) {
      console.error('Erro ao salvar JSON:', e);
      return false;
    }
  },

  async getAllUsers() {
    try {
      const usersRaw = await AsyncStorage.getItem('users');
      return usersRaw ? JSON.parse(usersRaw) : [];
    } catch (e) {
      console.error('Erro ao buscar usuários:', e);
      return [];
    }
  },

  async getCurrentUser() {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) return null;

      const users = await this.getAllUsers();
      return users.find(u => u.id === userToken) || null;
    } catch (e) {
      console.error('Erro ao buscar usuário atual:', e);
      return null;
    }
  },

  async updateUser(userId, updates) {
    try {
      const users = await this.getAllUsers();
      const userIndex = users.findIndex(u => u.id === userId);

      if (userIndex === -1) {
        throw new Error('Usuário não encontrado');
      }

      users[userIndex] = { ...users[userIndex], ...updates };

      await AsyncStorage.setItem('users', JSON.stringify(users));

      const userDataPath = `${FileSystem.documentDirectory}src/users.json`;
      await FileSystem.writeString(userDataPath, JSON.stringify(users, null, 2));

      return users[userIndex];
    } catch (e) {
      console.error('Erro ao atualizar usuário:', e);
      throw e;
    }
  },

  async updateProfileImage(userId, imageUri) {
    try {
      if (!imageUri) return null;

      if (this.isWeb()) {
        await this.updateUser(userId, { avatar: imageUri });
        return imageUri;
      }

      const imgDir = `${FileSystem.documentDirectory}src/img/`;
      await FileSystem.makeDirectory(imgDir, { intermediates: true });

      const profileImagePath = `${imgDir}perfil_${userId}.jpg`;
      await FileSystem.copy({
        from: imageUri,
        to: profileImagePath
      });

      await this.updateUser(userId, { avatar: profileImagePath });

      return profileImagePath;
    } catch (e) {
      console.error('Erro ao atualizar foto de perfil:', e);
      throw e;
    }
  },

  async deleteUser(userId) {
    try {
      const users = await this.getAllUsers();
      const filteredUsers = users.filter(u => u.id !== userId);

      await AsyncStorage.setItem('users', JSON.stringify(filteredUsers));

      const userDataPath = `${FileSystem.documentDirectory}src/users.json`;
      await FileSystem.writeString(userDataPath, JSON.stringify(filteredUsers, null, 2));

      const imgPath = `${FileSystem.documentDirectory}src/img/perfil_${userId}.jpg`;
      const fileInfo = await FileSystem.getInfo(imgPath);
      if (fileInfo.exists) {
        await FileSystem.delete(imgPath);
      }

      return true;
    } catch (e) {
      console.error('Erro ao deletar usuário:', e);
      throw e;
    }
  },

  async exportUsersToJson() {
    try {
      const users = await this.getAllUsers();
      const userDataPath = `${FileSystem.documentDirectory}src/users.json`;
      await FileSystem.writeString(userDataPath, JSON.stringify(users, null, 2));
      return userDataPath;
    } catch (e) {
      console.error('Erro ao exportar usuários:', e);
      throw e;
    }
  },

  async importUsersFromJson() {
    try {
      const userDataPath = `${FileSystem.documentDirectory}src/users.json`;
      const fileInfo = await FileSystem.getInfo(userDataPath);

      if (fileInfo.exists) {
        const jsonData = await FileSystem.readString(userDataPath);
        const users = JSON.parse(jsonData);
        await AsyncStorage.setItem('users', JSON.stringify(users));
        return users;
      }

      return [];
    } catch (e) {
      console.error('Erro ao importar usuários:', e);
      throw e;
    }
  }
};
