import { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import { useNavigation} from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient'; 

const ConfiguracaoScreen = ({ soundObject }) => {
  const navigation = useNavigation();
  const [currentRoute, setCurrentRoute] = useState('');
  const [mostrarOpcoes, setMostrarOpcoes] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      setCurrentRoute(navigation.getCurrentRoute().name);
      setMostrarOpcoes(false);
    });

    return unsubscribe;
  }, [navigation]);

  const toggleSound = async () => {
    if (soundObject) {
      if (isPlaying) {
        await soundObject.pauseAsync();
      } else {
        await soundObject.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (currentRoute !== 'Home' && currentRoute !== 'Linguagens') {
    return null;
  }

  return (
    <View style={styles.container}>
      
      <TouchableOpacity style={styles.button} onPress={() => setMostrarOpcoes(!mostrarOpcoes)}>
        <Image style={styles.icone} source={require('../../assets/imagens/configuracao.png')} />
      </TouchableOpacity>
      {mostrarOpcoes && (
        <LinearGradient 
          colors={['#EDBB39','#EDDB39', '#66CB76']}
          style={styles.menuContainer}
        >
          <View style={styles.opcoesMenu}>
            <TouchableOpacity style={styles.controleParental} onPress={() => navigation.navigate('Controle Parental')}>
              <Image
                style={styles.controleParentalIcone}
                source={require('../../assets/imagens/controleParental.png')}
              />
            </TouchableOpacity>
            <View style={styles.som}>
              <TouchableOpacity onPress={toggleSound}>
                <Image
                  style={styles.somIcone}
                  source={isPlaying ? require('../../assets/imagens/somA.png') : require('../../assets/imagens/somD.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.textContate}>Contate-Nos</Text>
          <Text style={styles.contate}>ajlnylingokids@gmail.com</Text>
        </LinearGradient>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 20,
    alignItems: 'flex-end',
    zIndex: 1,
  },
  icone: {
    height: 70,
    width: 70,
  },
  menuContainer: {
    borderRadius: 50,
    marginTop: 10,
    borderWidth: 3,
    borderColor: 'white',
    elevation: 10,
  },
  opcoesMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  controleParental: {
    backgroundColor: '#2277C5',
    height: 65,
    width: 190,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  controleParentalIcone: {
    marginTop: 6,
    width: 200,
    resizeMode: 'contain',
  },
  som: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    margin: 10,
  },
  somIcone: {
    height: 65,
    width: 65,
  },
  textContate: {
    color: '#67462B',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  contate: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
  },
});

export default ConfiguracaoScreen;
