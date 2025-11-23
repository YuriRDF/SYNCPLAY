import { StyleSheet } from 'react-native';
export default StyleSheet.create({
  containerDark: {
    flex:1,
    backgroundColor: '#0b0b0c',
    padding:16
  },
  input: {
    backgroundColor: '#fff',
    color: '#000',
    padding:14,
    borderRadius:24,
    marginVertical:8,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  inputLabel: {
    color: '#cfcfcf',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 4
  },
  inputError: {
    borderColor: '#ff4444',
    borderWidth: 1
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 20,
    padding: 4
  },
  strengthContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6
  },
  strengthBar: {
    flex: 1,
    height: 3,
    backgroundColor: '#2a2a2c',
    borderRadius: 2
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600'
  },
  button: {
    backgroundColor: '#0db8ff',
    padding:14,
    borderRadius:24,
    marginVertical:12,
    alignItems:'center',
    minHeight: 48
  },
  buttonDisabled: {
    opacity: 0.6
  },
  buttonText: {
    color:'#081018',
    fontWeight:'700',
    fontSize: 15
  },
  titleLarge:{
    color:'#0db8ff',
    fontSize:28,
    fontWeight:'700',
    marginBottom:8
  },
  smallText:{
    color:'#cfcfcf',
    fontSize: 14
  },
  linkText: {
    color: '#999',
    textAlign: 'center',
    fontSize: 14
  },
  linkTextBold: {
    color: '#0db8ff',
    fontWeight: '700'
  }
});