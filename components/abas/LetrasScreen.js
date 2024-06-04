import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Image, StyleSheet, View, Text, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import VoltarScreen from './VoltarScreen';
import * as Animatable from 'react-native-animatable';
import { useLanguage } from '../context/LanguageContext';
import firebaseApp, { storage, database } from '../database/dbConfig';
import { getDownloadURL, ref as storageRef } from 'firebase/storage';
import { ref as databaseRef, get, child } from '@firebase/database';
import { Audio } from 'expo-av';

const LetrasScreen = ({ navigation }) => {
  const { selectedLanguage } = useLanguage();
  const [letras, setLetras] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchLetras = async () => {
      try {
        const dbRef = databaseRef(database);
        const path =`${selectedLanguage}/alfabeto`;
        console.log('Fetching letras for path:', path); // Adiciona este log
        const snapshot = await get(child(dbRef, path));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const letrasList = await Promise.all(Object.keys(data).map(async (key) => {
            const letraData = data[key];
            const imageUrl = await getDownloadURL(storageRef(storage, letraData.img));
            const audioUrl = await getDownloadURL(storageRef(storage, letraData.som));
            return { id: letraData.id, name: key, imageUrl, audioUrl };
          }));
          // Ordenar a lista por ID antes de definir o estado
          letrasList.sort((a, b) => a.id - b.id);
          setLetras(letrasList); 
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    if (selectedLanguage) {
      fetchLetras();
    }
  }, [selectedLanguage]);

  const totalPages = Math.ceil(letras.length / 6);
  const startIndex = (currentPage - 1) * 6;
  const endIndex = Math.min(startIndex + 6, letras.length);
  const letrasPaginadas = letras.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const letraPress = async (id) => {
    const selectedLetra = letras.find(letra => letra.id === id);
    if (selectedLetra && selectedLetra.audioUrl) {
      try {
        const { sound } = await Audio.Sound.createAsync({ uri: selectedLetra.audioUrl });
        await sound.playAsync();
        console.log('Playing audio for:', id);
      } catch (error) {
        console.error("Error playing audio: ", error);
      }
    }
    console.log('Letra pressionada:', id);
  };

  return (
    <LinearGradient 
      colors={['#E9971D', '#F6F89A', '#E9971D']} 
      style={styles.container}>
      <VoltarScreen navigation={navigation} />
      <ScrollView>
        <View style={styles.letrasContainer}>
          {letrasPaginadas.map((letra) => (
            <Animatable.View 
              key={letra.id}
              animation="rubberBand"
              direction="normal"
              easing="ease-out"
              duration={2500}
              useNativeDriver
              style={styles.letraButtonAnimacao}>
              <TouchableOpacity
                style={styles.letraButton}
                onPress={() => letraPress(letra.id)}>
                <View style={styles.cardContainer}>
                  <Image
                    style={styles.cardImage}
                    source={require('../../assets/imagens/cardPrincipal.png')}
                  />
                  <Image
                    style={styles.letraIcon}
                    source={{ uri: letra.imageUrl }}
                  />
                  <View style={styles.nameContainer}>
                    <Text style={styles.letraName}>{letra.name}</Text>
                    <View style={styles.iconContainer}>
                      <Image
                        style={styles.startIcon}
                        source={require('../../assets/imagens/start.png')} 
                      />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </Animatable.View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.paginationContainer}>
        <TouchableOpacity onPress={handlePrevPage}>
          <Image source={require('../../assets/imagens/setaesquerda.png')} style={styles.paginationImage} />
        </TouchableOpacity>
        <Text style={styles.paginationText}>{currentPage}/{totalPages}</Text>
        <TouchableOpacity onPress={handleNextPage}>
          <Image source={require('../../assets/imagens/setadireita.png')} style={styles.paginationImage} />
        </TouchableOpacity>
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
  letrasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 140,
  },
  letraButton: {
    alignItems: 'center',
  },
  letraButtonAnimacao: {
    alignItems: 'center',
    marginBottom: 15,
  },
  cardContainer: {
    width: 160,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: {
    width: 170,
    height: 170,
    resizeMode: 'contain',
    position: 'absolute',
    zIndex: -1,
  },
  letraIcon: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    position: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  letraName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'black', 
    textShadowOffset: { width: -1, height: 1 }, 
    textShadowRadius: 2,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginLeft: 5, 
  },
  startIcon: {
    width: 22, 
    height: 22, 
    resizeMode: 'contain',
  },
  paginationImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginHorizontal: 10,
  },
  paginationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: 10,
  },
});

export default LetrasScreen;
