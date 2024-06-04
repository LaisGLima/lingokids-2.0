import { useEffect, useRef, useCallback } from 'react';
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

const HomeScreen = ({ navigation }) => {
  const animatableRef = useRef(null); 
  const animateButton = useCallback(() => {
    if (animatableRef.current && animatableRef.current.rubberBand) {
      animatableRef.current.rubberBand(3000)
        .then(() => {
          setTimeout(animateButton, 1000);
        });
    }
  }, []);

  useEffect(() => {
    animateButton();
    return () => clearTimeout(); 
  }, [animateButton]); 

  return (
    <LinearGradient
      colors={['#E9971D', '#F6F89A', '#E9971D']}
      style={styles.container}
    >
      <Animatable.Image
        animation="zoomIn"
        duration={500}
        delay={600}
        easing="ease-out"
        style={styles.logo}
        source={require('../../assets/imagens/logo.png')}
      />
      <Animatable.View
        ref={animatableRef}
        style={styles.buttonContainer}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Linguagens')}
        >
          <Image style={styles.play} source={require('../../assets/imagens/PLAY.png')} />
        </TouchableOpacity>
      </Animatable.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 240,
    width: 370,
    marginBottom: 260,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#2277C5',
    height: 97,
    width: 244,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
    elevation: 5,
  },
  play: {
    height: 80,
    width: 230.57,
  },
});

export default HomeScreen;
