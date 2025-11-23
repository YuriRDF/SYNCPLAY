import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import { useAuth } from '../App';

export default function LoginScreen({navigation}) {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const { login } = useAuth();

  const onLogin = async () => {
    try{
      const usersRaw = await AsyncStorage.getItem('users');
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      const found = users.find(u => u.email === email && u.password === password);
      if(found){
        await login(found.id);
      }else{
        Alert.alert('Erro','E-mail ou senha inválidos');
      }
    }catch(e){
      Alert.alert('Erro','Falha ao acessar armazenamento');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.containerDark} behavior={Platform.OS==='ios'?'padding':'height'}>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Text style={[styles.titleLarge, {textAlign: 'center', fontSize: 36, marginBottom: 12}]}>Faça o Login</Text>
        <Text style={[styles.smallText, {textAlign: 'center', marginBottom: 24, fontSize: 20, lineHeight: 28}]}>
          Bem-vindo de volta!{'\n'}Sentimos sua falta!
        </Text>

        <TextInput placeholder="Seu e-mail" placeholderTextColor="#666" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput placeholder="Senha" placeholderTextColor="#666" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

        <TouchableOpacity style={{alignSelf: 'flex-end', marginTop: 8, marginBottom: 16}}>
          <Text style={{color: '#0db8ff', fontSize: 14, fontWeight: '600'}}>Esqueceu sua senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>navigation.navigate('Signup')}>
          <Text style={{color:'#cfcfcf', textAlign:'center', marginTop:8}}>Criar nova conta</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}