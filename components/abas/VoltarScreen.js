import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const VoltarScreen = () => {
  const navigation = useNavigation();

  const handleVoltar = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.buttonVoltar} onPress={handleVoltar}>
        <Image source={require('../../assets/imagens/voltar.png')} style={styles.buttonVoltarIcone} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  buttonVoltar: {
    alignItems: 'flex-start', 
  },
  buttonVoltarIcone: {
    width: 70,
    height: 70,
  },
});

export default VoltarScreen;
