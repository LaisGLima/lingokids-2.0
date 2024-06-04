import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 

const LockScreen = () => {
  return (
    <LinearGradient 
      colors={['#E9971D', '#F6F89A', '#E9971D']} 
      style={styles.container}>
      <View style={styles.overlay} />
      <Image
        style={styles.lockedImage}
        source={require('../../assets/imagens/notificacao.png')}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  lockedImage: {
    width: 400,
    height: 250,
    marginLeft: -30,
    zIndex: 1,
  },
});

export default LockScreen;
