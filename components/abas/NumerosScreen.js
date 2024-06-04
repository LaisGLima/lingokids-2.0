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

const NumerosScreen = ({ navigation, route }) => {
  const { selectedLanguage } = useLanguage();
  const [numeros, setNumeros] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchNumeros = async () => {
      try {
        const dbRef = databaseRef(database);
        const path = `${selectedLanguage}/numeros`;
        console.log('Fetching numeros for path:', path); // Adiciona este log
        const snapshot = await get(child(dbRef, path));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const numerosList = await Promise.all(Object.keys(data).map(async (key) => {
            const numeroData = data[key];
            const imageUrl = await getDownloadURL(storageRef(storage, numeroData.img));
            const audioUrl = await getDownloadURL(storageRef(storage, numeroData.som));
            return { id: numeroData.id, name: key, imageUrl, audioUrl };
          }));
          numerosList.sort((a, b) => a.id - b.id)
          setNumeros(numerosList);
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    if (selectedLanguage){
      fetchNumeros();
    }
  }, [selectedLanguage]);

  const totalPages = Math.ceil(numeros.length / 6);
  const startIndex = (currentPage - 1) * 6;
  const endIndex = Math.min(startIndex + 6, numeros.length);
  const numerosPaginados = numeros.slice(startIndex, endIndex);

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
  async function numeroPress(id) {
    const selectedNumero = numeros.find(numero => numero.id === id);
    if (selectedNumero && selectedNumero.audioUrl) {
      try {
        const { sound } = await Audio.Sound.createAsync({ uri: selectedNumero.audioUrl });
        await sound.playAsync();
        console.log('Playing audio for:', id);
      } catch (error) {
        console.error("Error playing audio: ", error);
      }
    }
    console.log('Numero pressionado:', id);
  }

  return (
    <LinearGradient 
      colors={['#E9971D', '#F6F89A', '#E9971D']} 
      style={styles.container}>
      <VoltarScreen navigation={navigation} />
      <ScrollView>
        <View style={styles.numerosContainer}>
          {numerosPaginados.map((numero) => (
            <Animatable.View 
              key={numero.id}
              animation="rubberBand"
              direction="normal"
              easing="ease-out"
              duration={2500}
              useNativeDriver
              style={styles.numeroButtonAnimacao}>
              <TouchableOpacity
                style={styles.numeroButton}
                onPress={() => numeroPress(numero.id)}>
                <View style={styles.cardContainer}>
                  <Image
                    style={styles.cardImage}
                    source={require('../../assets/imagens/cardPrincipal.png')}
                  />
                  <Image
                    style={styles.numeroIcon}
                    source={{ uri: numero.imageUrl }}
                  />
                  <View style={styles.numeroInfoContainer}>
                    <Text style={styles.numeroName}>{numero.name}</Text>
                    <Image
                      source={require('../../assets/imagens/start.png')}
                      style={styles.startIcon}
                    />
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
  numerosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 25,
  },
  numeroButton: {
    alignItems: 'center',
  },
  numeroButtonAnimacao: {
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
  numeroIcon: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    position: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  numeroInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numeroName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'black', 
    textShadowOffset: { width: -1, height: 1 }, 
    textShadowRadius: 2,
  },
  startIcon: {
    width: 20, // Ajuste conforme necessário
    height: 20, // Ajuste conforme necessário
    resizeMode: 'contain',
    marginLeft: 5, // Espaçamento entre o nome do número e o ícone "start"
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
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

export default NumerosScreen;