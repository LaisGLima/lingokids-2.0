import { TouchableOpacity, Image, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import VoltarScreen from './VoltarScreen';
import * as Animatable from 'react-native-animatable';
import { useLanguage } from '../context/LanguageContext'; // Adjust the path as necessary

const LinguagensScreen = ({ navigation }) => {
  const { changeLanguage } = useLanguage();

  const linguas = [
    { name: 'Português', image: require('../../assets/imagens/portugues.png') },
    { name: 'Inglês', image: require('../../assets/imagens/ingles.png') },
    { name: 'Espanhol', image: require('../../assets/imagens/espanhol.png') },
  ];

  const linguagemPress = async (linguagem) => {
    try {
      await changeLanguage(linguagem);
      navigation.navigate('Categorias');
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  return (
    <LinearGradient 
      colors={['#E9971D', '#F6F89A', '#E9971D']} 
      style={styles.container}>
      <VoltarScreen />
      
      <View style={styles.liguagemContainer}>
        <Image
          style={styles.backgroud}
          source={require('../../assets/imagens/card.png')}
        />
        
        <View style={styles.linguasContainer}>
          {linguas.map((linguagem, index) => (
            <Animatable.View 
              key={index}
              animation="rubberBand"
              direction="normal"
              easing="ease-out"
              duration={2100}
              delay={index * 500} 
              useNativeDriver
              style={styles.linguagemButtonAnimacao}>
              <TouchableOpacity
                style={styles.linguagemButton}
                onPress={() => linguagemPress(linguagem.name)}>
                <Image
                  style={styles.linguagemIcon}
                  source={linguagem.image}
                />
              </TouchableOpacity>

            </Animatable.View>
          ))}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  liguagemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
    marginLeft: 15,
  },
  backgroud: {
    position: 'absolute',
    width: 370,
    height: 446.09,
  },
  linguasContainer: {
    marginTop: 10, 
  },
  linguagemButton: {
    marginBottom: 10, 
  },
  linguagemButtonAnimacao: {
    alignItems: 'center',
  },
  linguagemIcon: {
    width: 290, 
    height: 85,
    marginTop: 10,
    marginBottom: 20,
  },
});

export default LinguagensScreen;
