import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import styles from './styles';
import { useAuth } from '../App';
import { UserHelper } from './userHelper';

const isWeb = Platform.OS === 'web';

export default function SignupScreen({navigation}) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const { login } = useAuth();

  const [errors, setErrors] = useState({});

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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getPasswordStrength = (pass) => {
    if (!pass) return { strength: 0, label: '', color: '#666' };

    let strength = 0;
    if (pass.length >= 8) strength++;
    if (pass.length >= 12) strength++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^a-zA-Z0-9]/.test(pass)) strength++;

    if (strength <= 1) return { strength: 1, label: 'Fraca', color: '#ff4444' };
    if (strength <= 3) return { strength: 2, label: 'Média', color: '#ffaa00' };
    return { strength: 3, label: 'Forte', color: '#00ff88' };
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

    if (!email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!validateEmail(email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!password2) {
      newErrors.password2 = 'Confirme sua senha';
    } else if (password !== password2) {
      newErrors.password2 = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const onSignup = async () => {
    console.log('Iniciando cadastro...');
    const validation = validateFields();
    console.log('Validação:', validation);

    if (!validation.isValid) {
      console.log('Erros de validação:', validation.errors);
      const firstError = Object.values(validation.errors)[0];
      if (firstError) {
        Alert.alert('Atenção', firstError);
      }
      return;
    }

    setLoading(true);
    console.log('Dados do formulário:', { username, email, profileImage });
    try {
      const usersRaw = await AsyncStorage.getItem('users');
      const users = usersRaw ? JSON.parse(usersRaw) : [];

      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        Alert.alert('Erro', 'Já existe um usuário com esse e-mail');
        setLoading(false);
        return;
      }

      if (users.find(u => u.username && u.username.toLowerCase() === username.toLowerCase())) {
        Alert.alert('Erro', 'Já existe um usuário com esse username');
        setLoading(false);
        return;
      }

      const id = 'u_' + Date.now();

      let profileImagePath = null;
      if (profileImage) {
        if (isWeb) {
          console.log('Web detectada - usando URI original da imagem');
          profileImagePath = profileImage;
        } else {
          try {
            console.log('Salvando imagem de perfil...');
            const imgDir = `${FileSystem.documentDirectory}src/img/`;
            await FileSystem.makeDirectory(imgDir, { intermediates: true });
            profileImagePath = `${imgDir}perfil_${id}.jpg`;
            await FileSystem.copy({
              from: profileImage,
              to: profileImagePath
            });
            console.log('Imagem salva em:', profileImagePath);
          } catch (imgError) {
            console.log('Erro ao salvar imagem (não crítico):', imgError);
            profileImagePath = profileImage;
          }
        }
      }

      const newUser = {
        id,
        username: username.trim(),
        email: email.toLowerCase(),
        password,
        avatar: profileImagePath,
        bio: '',
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      console.log('Salvando usuário no AsyncStorage...');
      await AsyncStorage.setItem('users', JSON.stringify(users));
      console.log('Usuário salvo com sucesso!');

      console.log('Salvando JSON...');
      const jsonSaved = await UserHelper.saveUsersToJson(users);
      if (jsonSaved) {
        console.log('JSON salvo com sucesso!');
      } else {
        console.log('Falha ao salvar JSON (não crítico)');
      }

      console.log('Fazendo login automático...');
      await login(id);
      console.log('Login realizado com sucesso!');
      setLoading(false);
    } catch(e) {
      console.error('Erro completo:', e);
      console.error('Stack:', e.stack);
      setLoading(false);
      Alert.alert('Erro', `Falha ao criar conta: ${e.message || 'Erro desconhecido'}`);
    }
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <KeyboardAvoidingView
      style={styles.containerDark}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1, justifyContent: 'center', paddingVertical: 20}}
      >
        <View style={{marginTop: 20}}>
          <Text style={[styles.titleLarge, {textAlign: 'center'}]}>Criar Uma Conta</Text>
          <Text style={[styles.smallText, {marginBottom: 24, lineHeight: 20, textAlign: 'center'}]}>
            Crie sua conta e descubra novas músicas, livros e filmes, e compartilhe suas descobertas com seus amigos.
          </Text>

          {/* Profile Image Picker */}
          <View style={{alignItems: 'center', marginBottom: 24}}>
            <TouchableOpacity onPress={pickImage} style={{alignItems: 'center'}}>
              <View style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: '#121213',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: '#0db8ff',
                overflow: 'hidden'
              }}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={{ width: '100%', height: '100%' }} />
                ) : (
                  <Text style={{ color: '#0db8ff', fontSize: 40 }}>+</Text>
                )}
              </View>
              <Text style={{ color: '#0db8ff', marginTop: 8, fontSize: 13, fontWeight: '600' }}>
                {profileImage ? 'Alterar Foto' : 'Adicionar Foto'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Username Input */}
          <View style={{marginBottom: 16}}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              placeholder="seu_username"
              placeholderTextColor="#666"
              style={[styles.input, errors.username && styles.inputError]}
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                if (errors.username) setErrors({...errors, username: null});
              }}
              autoCapitalize="none"
            />
            {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
          </View>

          {/* Email Input */}
          <View style={{marginBottom: 16}}>
            <Text style={styles.inputLabel}>E-mail</Text>
            <TextInput
              placeholder="seu@email.com"
              placeholderTextColor="#666"
              style={[styles.input, errors.email && styles.inputError]}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({...errors, email: null});
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Password Input */}
          <View style={{marginBottom: 16}}>
            <Text style={styles.inputLabel}>Senha</Text>
            <View style={{position: 'relative'}}>
              <TextInput
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#666"
                style={[styles.input, errors.password && styles.inputError]}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({...errors, password: null});
                }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={{color: '#0db8ff', fontSize: 12, fontWeight: '600'}}>
                  {showPassword ? 'OCULTAR' : 'MOSTRAR'}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <View style={{marginTop: 8}}>
                <View style={styles.strengthContainer}>
                  <View style={[styles.strengthBar, passwordStrength.strength >= 1 && {backgroundColor: passwordStrength.color}]} />
                  <View style={[styles.strengthBar, passwordStrength.strength >= 2 && {backgroundColor: passwordStrength.color}]} />
                  <View style={[styles.strengthBar, passwordStrength.strength >= 3 && {backgroundColor: passwordStrength.color}]} />
                </View>
                <Text style={[styles.strengthText, {color: passwordStrength.color}]}>
                  Senha {passwordStrength.label}
                </Text>
              </View>
            )}
          </View>

          {/* Confirm Password Input */}
          <View style={{marginBottom: 24}}>
            <Text style={styles.inputLabel}>Confirmar Senha</Text>
            <View style={{position: 'relative'}}>
              <TextInput
                placeholder="Digite a senha novamente"
                placeholderTextColor="#666"
                style={[styles.input, errors.password2 && styles.inputError]}
                value={password2}
                onChangeText={(text) => {
                  setPassword2(text);
                  if (errors.password2) setErrors({...errors, password2: null});
                }}
                secureTextEntry={!showPassword2}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword2(!showPassword2)}
              >
                <Text style={{color: '#0db8ff', fontSize: 12, fontWeight: '600'}}>
                  {showPassword2 ? 'OCULTAR' : 'MOSTRAR'}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.password2 && <Text style={styles.errorText}>{errors.password2}</Text>}
          </View>

          {/* Signup Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={onSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#081018" />
            ) : (
              <Text style={styles.buttonText}>Criar Conta</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={{marginTop: 16}}
          >
            <Text style={styles.linkText}>
              Já tem uma conta? <Text style={styles.linkTextBold}>Faça login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}