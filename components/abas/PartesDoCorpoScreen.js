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

const PartesDoCorpoScreen = ({ navigation }) => {
  const { selectedLanguage } = useLanguage();
  const [partesDoCorpo, setPartesDoCorpo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPartesDoCorpo = async () => {
      try {
        const dbRef = databaseRef(database);
        const path = `${selectedLanguage}/partes do corpo`;
        console.log('Fetching partes do corpo for path:', path);
        const snapshot = await get(child(dbRef, path));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const partesDoCorpoList = await Promise.all(Object.keys(data).map(async (key) => {
            const imageUrl = await getDownloadURL(storageRef(storage, data[key].img));
            const audioUrl = await getDownloadURL(storageRef(storage, data[key].som));
            return { id: key, name: key, imageUrl, audioUrl };
          }));
          setPartesDoCorpo(partesDoCorpoList);
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
  
    if (selectedLanguage) {
      fetchPartesDoCorpo();
    }
  }, [selectedLanguage]);

  const totalPages = Math.ceil(partesDoCorpo.length / 6);
  const startIndex = (currentPage - 1) * 6;
  const endIndex = Math.min(startIndex + 6, partesDoCorpo.length);
  const partesDoCorpoPaginados = partesDoCorpo.slice(startIndex, endIndex);

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

  const partesDoCorpoPress = async (id) => {
    const selectedParteDoCorpo = partesDoCorpo.find(parteDoCorpo => parteDoCorpo.id === id);
    if (selectedParteDoCorpo && selectedParteDoCorpo.audioUrl) {
      try {
        const { sound } = await Audio.Sound.createAsync({ uri: selectedParteDoCorpo.audioUrl });
        await sound.playAsync();
        console.log('Playing audio for:', id);
      } catch (error) {
        console.error("Error playing audio: ", error);
      }
    }
    console.log('Parte do Corpo pressionada:', id);
  };

  return (
    <LinearGradient 
      colors={['#E9971D', '#F6F89A', '#E9971D']} 
      style={styles.container}>
      <VoltarScreen navigation={navigation} />
      <ScrollView>
        <View style={styles.partesDoCorpoContainer}>
          {partesDoCorpoPaginados.map((parteDoCorpo) => (
            <Animatable.View 
              key={parteDoCorpo.id}
              animation="rubberBand"
              direction="normal"
              easing="ease-out"
              duration={2500}
              useNativeDriver
              style={styles.parteDoCorpoButtonAnimacao}>
              <TouchableOpacity
                style={styles.parteDoCorpoButton}
                onPress={() => partesDoCorpoPress(parteDoCorpo.id)}>
                <View style={styles.cardContainer}>
                  <Image
                    style={styles.cardImage}
                    source={require('../../assets/imagens/cardPrincipal.png')}
                  />
                  <Image
                    style={styles.parteDoCorpoIcon}
                    source={{ uri: parteDoCorpo.imageUrl }}
                  />
                  <View style={styles.parteDoCorpoInfoContainer}>
                    <Text style={styles.parteDoCorpoName}>{parteDoCorpo.name}</Text>
                    <Image
                      source={require('../../assets/imagens/start.png')} // Caminho da imagem do ícone "start"
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
  partesDoCorpoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 170,
  },
  parteDoCorpoButton: {
    alignItems: 'center',
  },
  parteDoCorpoButtonAnimacao: {
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
  parteDoCorpoIcon: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    position: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  parteDoCorpoInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  parteDoCorpoName: {
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
    marginLeft: 5, // Espaçamento entre o nome da parte do corpo e o ícone "start"
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

export default PartesDoCorpoScreen;
