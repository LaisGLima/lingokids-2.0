import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Audio } from 'expo-av';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';

import ControleParentalScreen from './components/abas/ControleParentalScreen';
import LinguagensScreen from './components/abas/LinguagensScreen';
import HomeScreen from './components/abas/HomeScreen';
import ConfiguracaoScreen from './components/abas/ConfiguracaoScreen';
import CategoriasScreen from './components/abas/CategoriasScreen';
import AnimaisScreen from './components/abas/AnimaisScreen';
import LetrasScreen from './components/abas/LetrasScreen';
import NumerosScreen from './components/abas/NumerosScreen';
import PartesDoCorpoScreen from './components/abas/PartesDoCorpoScreen';
import CoresScreen from './components/abas/CoresScreen';
import AlimentosScreen from './components/abas/AlimentosScreen';

import { OptionProvider } from './components/abas/OptionContext';
import LockScreen from './components/abas/LockScreen';
import { LockProvider, useLock } from './components/abas/LockContext';
import LanguageProvider from './components/context/LanguageContext';

import firebaseApp, { storage, database } from './components/database/dbConfig';
import { ref, onValue } from '@firebase/database';

const Stack = createStackNavigator();

const App = () => {
  const [sound, setSound] = useState();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    
    let soundObject = null;

    const playSound = async () => {
      try {
        soundObject = new Audio.Sound();
        await soundObject.loadAsync(require('./assets/sons/trilha.wav'), { isLooping: true });
        setSound(soundObject);
        await soundObject.playAsync();
      } catch (error) {
        console.error('Error playing alarm:', error);
      }
    };

    playSound();

    return () => {
      if (soundObject) {
        soundObject.stopAsync();
        soundObject.unloadAsync();
      }
    };
  }, []);

  const stopAlarm = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  };

  useEffect(() => {
    const dataRef = ref(database, 'bancodedados');
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      setData(data);
      setIsLoading(false); // Dados carregados, desabilita o carregamento
      SplashScreen.hideAsync();
    }, (error) => {
      console.error("Error fetching data: ", error);
    });
  }, []);

  const cacheResourcesAsync = async () => {
    const images = [
      require('./assets/icon.png'),
    ];

    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    });

    const cacheFonts = Font.loadAsync({
    });

    await Promise.all([...cacheImages, cacheFonts]);
  };

  if (isLoading) {
    return null;
  }

  return (
    <LanguageProvider>
      <LockProvider>
        <OptionProvider>
          <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
              <NavigationContainer>
                <Navigation stopAlarm={stopAlarm} />
                <ConfiguracaoScreen soundObject={sound} toggleSound={stopAlarm} />
              </NavigationContainer>
            </SafeAreaView>
          </SafeAreaProvider>
        </OptionProvider>
      </LockProvider>
    </LanguageProvider>
  );
};

const Navigation = ({ stopAlarm }) => {
  const { isLocked } = useLock();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      {isLocked ? (
        <Stack.Screen name="LockScreen" component={LockScreen} />
      ) : (
        <>
          <Stack.Screen name="Controle Parental" component={ControleParentalScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Linguagens" component={LinguagensScreen} />
          <Stack.Screen name="Categorias" component={CategoriasScreen} />
          <Stack.Screen name="Animais" component={AnimaisScreen} />
          <Stack.Screen name="Letras" component={LetrasScreen} />
          <Stack.Screen name="Cores" component={CoresScreen} />
          <Stack.Screen name="Numeros" component={NumerosScreen} />
          <Stack.Screen name="ParteDoCorpo" component={PartesDoCorpoScreen} />
          <Stack.Screen name="Alimentos" component={AlimentosScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default App;
