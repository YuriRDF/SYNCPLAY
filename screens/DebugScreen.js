import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import styles from './styles';
import { UserHelper } from './userHelper';

const isWeb = Platform.OS === 'web';

export default function DebugScreen() {
  const [debugInfo, setDebugInfo] = useState({});
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadDebugInfo();
  }, []);

  const loadDebugInfo = async () => {
    try {
      const usersRaw = await AsyncStorage.getItem('users');
      const usersList = usersRaw ? JSON.parse(usersRaw) : [];

      if (isWeb) {
        setUsers(usersList);
        setDebugInfo({
          platform: 'Web',
          documentDirectory: 'N/A (Web usa localStorage)',
          jsonPath: 'N/A',
          jsonExists: false,
          imgPath: 'N/A',
          imgDirExists: false,
          totalUsers: usersList.length,
          note: 'FileSystem não disponível na web. Dados salvos apenas no AsyncStorage (localStorage).'
        });
        return;
      }

      const jsonPath = `${FileSystem.documentDirectory}src/users.json`;
      const imgPath = `${FileSystem.documentDirectory}src/img/`;

      const jsonExists = await FileSystem.getInfo(jsonPath);
      const imgDirExists = await FileSystem.getInfo(imgPath);

      setUsers(usersList);
      setDebugInfo({
        platform: Platform.OS,
        documentDirectory: FileSystem.documentDirectory,
        jsonPath,
        jsonExists: jsonExists.exists,
        imgPath,
        imgDirExists: imgDirExists.exists,
        totalUsers: usersList.length
      });
    } catch (e) {
      console.error('Erro ao carregar debug:', e);
      Alert.alert('Erro', e.message);
    }
  };

  const viewJsonFile = async () => {
    try {
      const jsonPath = `${FileSystem.documentDirectory}src/users.json`;
      const fileInfo = await FileSystem.getInfo(jsonPath);

      if (fileInfo.exists) {
        const content = await FileSystem.readString(jsonPath);
        Alert.alert('Conteúdo do users.json', content, [
          { text: 'OK' }
        ], { cancelable: true });
      } else {
        Alert.alert('Arquivo não encontrado', 'O arquivo users.json ainda não foi criado');
      }
    } catch (e) {
      Alert.alert('Erro', e.message);
    }
  };

  const copyPathToClipboard = async () => {
    const jsonPath = `${FileSystem.documentDirectory}src/users.json`;
    Alert.alert('Caminho do arquivo', jsonPath, [
      { text: 'OK' }
    ]);
  };

  const syncToJson = async () => {
    try {
      const usersRaw = await AsyncStorage.getItem('users');
      const usersList = usersRaw ? JSON.parse(usersRaw) : [];

      if (usersList.length === 0) {
        Alert.alert('Nenhum dado', 'Não há usuários cadastrados para sincronizar');
        return;
      }

      const success = await UserHelper.saveUsersToJson(usersList);

      if (success) {
        Alert.alert('Sucesso', 'Dados sincronizados para JSON com sucesso!');
        loadDebugInfo();
      } else {
        Alert.alert('Erro', 'Falha ao sincronizar dados');
      }
    } catch (e) {
      Alert.alert('Erro', e.message);
    }
  };

  const clearAllData = async () => {
    Alert.alert(
      'Confirmar',
      'Deseja realmente apagar todos os dados?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Sucesso', 'Todos os dados foram apagados');
              loadDebugInfo();
            } catch (e) {
              Alert.alert('Erro', e.message);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.containerDark}>
      <ScrollView style={{ marginBottom: 70 }}>
        <Text style={styles.titleLarge}>Debug Info</Text>

        <View style={{ marginTop: 20 }}>
          <Text style={[styles.smallText, { marginBottom: 12 }]}>Plataforma:</Text>
          <View style={{ backgroundColor: '#121213', padding: 12, borderRadius: 8 }}>
            <Text style={{ color: '#0db8ff', fontSize: 14, fontWeight: '700' }}>
              {debugInfo.platform}
            </Text>
          </View>
        </View>

        {debugInfo.note && (
          <View style={{ marginTop: 20 }}>
            <View style={{ backgroundColor: '#ffaa00', padding: 12, borderRadius: 8 }}>
              <Text style={{ color: '#000', fontSize: 12 }}>
                ⚠️ {debugInfo.note}
              </Text>
            </View>
          </View>
        )}

        <View style={{ marginTop: 20 }}>
          <Text style={[styles.smallText, { marginBottom: 12 }]}>Diretório de Documentos:</Text>
          <View style={{ backgroundColor: '#121213', padding: 12, borderRadius: 8 }}>
            <Text style={{ color: '#0db8ff', fontSize: 11, fontFamily: 'monospace' }}>
              {debugInfo.documentDirectory}
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={[styles.smallText, { marginBottom: 12 }]}>Caminho do JSON:</Text>
          <View style={{ backgroundColor: '#121213', padding: 12, borderRadius: 8 }}>
            <Text style={{ color: '#0db8ff', fontSize: 11, fontFamily: 'monospace' }}>
              {debugInfo.jsonPath}
            </Text>
            <Text style={{ color: debugInfo.jsonExists ? '#00ff88' : '#ff4444', fontSize: 12, marginTop: 8 }}>
              Status: {debugInfo.jsonExists ? 'Existe' : 'Não existe'}
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={[styles.smallText, { marginBottom: 12 }]}>Diretório de Imagens:</Text>
          <View style={{ backgroundColor: '#121213', padding: 12, borderRadius: 8 }}>
            <Text style={{ color: '#0db8ff', fontSize: 11, fontFamily: 'monospace' }}>
              {debugInfo.imgPath}
            </Text>
            <Text style={{ color: debugInfo.imgDirExists ? '#00ff88' : '#ff4444', fontSize: 12, marginTop: 8 }}>
              Status: {debugInfo.imgDirExists ? 'Existe' : 'Não existe'}
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={[styles.smallText, { marginBottom: 12 }]}>Total de Usuários:</Text>
          <View style={{ backgroundColor: '#121213', padding: 12, borderRadius: 8 }}>
            <Text style={{ color: '#fff', fontSize: 16 }}>
              {debugInfo.totalUsers} usuário(s) cadastrado(s)
            </Text>
          </View>
        </View>

        {users.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <Text style={[styles.smallText, { marginBottom: 12 }]}>Usuários:</Text>
            {users.map((user, index) => (
              <View key={user.id} style={{ backgroundColor: '#121213', padding: 12, borderRadius: 8, marginBottom: 8 }}>
                <Text style={{ color: '#fff', fontSize: 14 }}>#{index + 1} - {user.username || user.name || 'Sem nome'}</Text>
                <Text style={{ color: '#999', fontSize: 12 }}>{user.email}</Text>
                <Text style={{ color: '#666', fontSize: 11, marginTop: 4 }}>ID: {user.id}</Text>
                {user.avatar && (
                  <Text style={{ color: '#0db8ff', fontSize: 11, marginTop: 4 }}>Foto: Sim</Text>
                )}
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity style={[styles.button, { marginTop: 24 }]} onPress={loadDebugInfo}>
          <Text style={styles.buttonText}>Atualizar Info</Text>
        </TouchableOpacity>

        {!isWeb && (
          <>
            <TouchableOpacity style={[styles.button, { marginTop: 12 }]} onPress={viewJsonFile}>
              <Text style={styles.buttonText}>Ver Conteúdo do JSON</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { marginTop: 12, backgroundColor: '#00aa44' }]}
              onPress={syncToJson}
            >
              <Text style={styles.buttonText}>Sincronizar para JSON</Text>
            </TouchableOpacity>
          </>
        )}

        {isWeb && (
          <View style={{ marginTop: 12, padding: 12, backgroundColor: '#333', borderRadius: 8 }}>
            <Text style={{ color: '#999', fontSize: 12, textAlign: 'center' }}>
              Recursos de FileSystem não disponíveis na web.{'\n'}
              Use Android/iOS para salvar arquivos JSON.
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, { marginTop: 12, backgroundColor: '#ff4444' }]}
          onPress={clearAllData}
        >
          <Text style={styles.buttonText}>Limpar Todos os Dados</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
