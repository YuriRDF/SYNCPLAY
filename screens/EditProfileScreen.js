import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import styles from './styles';
import { UserHelper } from './userHelper';

export default function EditProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await UserHelper.getCurrentUser();
      if (user) {
        setUserData(user);
        setUsername(user.username);
        setBio(user.bio || '');
        setProfileImage(user.avatar);
      }
    } catch (e) {
      console.error('Erro ao carregar dados:', e);
      Alert.alert('Erro', 'Não foi possível carregar seus dados');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permissão necessária', 'É preciso permitir acesso à galeria de fotos!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const validateFields = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = 'Username é obrigatório';
    } else if (username.trim().length < 3) {
      newErrors.username = 'Username deve ter pelo menos 3 caracteres';
    } else if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      newErrors.username = 'Username pode conter apenas letras, números e _';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    setSaving(true);
    try {
      const updates = {
        username: username.trim(),
        bio: bio.trim()
      };

      if (profileImage && profileImage !== userData.avatar) {
        const newImagePath = await UserHelper.updateProfileImage(userData.id, profileImage);
        updates.avatar = newImagePath;
      }

      await UserHelper.updateUser(userData.id, updates);

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      console.error('Erro ao salvar:', e);
      Alert.alert('Erro', 'Não foi possível salvar as alterações');
    } finally {
      setSaving(false);
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
    <View style={styles.containerDark}>
      <ScrollView>
        <View style={{ marginTop: 20 }}>
          <Text style={styles.titleLarge}>Editar Perfil</Text>

          {/* Profile Image Picker */}
          <View style={{ alignItems: 'center', marginVertical: 24 }}>
            <TouchableOpacity onPress={pickImage} style={{ alignItems: 'center' }}>
              <View style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: '#121213',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 3,
                borderColor: '#0db8ff',
                overflow: 'hidden'
              }}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={{ width: '100%', height: '100%' }} />
                ) : (
                  <Text style={{ color: '#0db8ff', fontSize: 50, fontWeight: '700' }}>
                    {username?.[0]?.toUpperCase() || '?'}
                  </Text>
                )}
              </View>
              <Text style={{ color: '#0db8ff', marginTop: 12, fontSize: 14, fontWeight: '600' }}>
                Alterar Foto
              </Text>
            </TouchableOpacity>
          </View>

          {/* Username Input */}
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              placeholder="seu_username"
              placeholderTextColor="#666"
              style={[styles.input, errors.username && styles.inputError]}
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                if (errors.username) setErrors({ ...errors, username: null });
              }}
              autoCapitalize="none"
            />
            {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
          </View>

          {/* Bio Input */}
          <View style={{ marginBottom: 24 }}>
            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput
              placeholder="Conte um pouco sobre você..."
              placeholderTextColor="#666"
              style={[styles.input, { height: 100, textAlignVertical: 'top', paddingTop: 14 }]}
              value={bio}
              onChangeText={setBio}
              multiline
              maxLength={150}
            />
            <Text style={{ color: '#666', fontSize: 12, marginTop: 4, textAlign: 'right' }}>
              {bio.length}/150
            </Text>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.button, saving && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#081018" />
            ) : (
              <Text style={styles.buttonText}>Salvar Alterações</Text>
            )}
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            style={{ marginTop: 12, padding: 14, alignItems: 'center' }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: '#999', fontSize: 15 }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
