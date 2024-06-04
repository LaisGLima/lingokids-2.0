import React, { createContext, useState, useContext, useEffect } from 'react';
import { getDownloadURL, ref as storageRef } from 'firebase/storage';
import { database, storage } from '../database/dbConfig';
import { ref as databaseRef, get, child } from '@firebase/database';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

const normalizeLanguage = (language) => {
  return language.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const LanguageProvider = ({ children, defaultLanguage = 'portugues', defaultCategory = 'Alimentos' }) => {
  const [assets, setAssets] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState(normalizeLanguage(defaultLanguage));
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);

  const fetchAssets = async (language, category) => {
    try {
      const dbRef = databaseRef(database);
      const snapshot = await get(child(dbRef, `${language}/${category}`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        const assetPromises = Object.keys(data).map(async (key) => {
          try {
            const imgUrl = await getDownloadURL(storageRef(storage, data[key].img));
            const audioUrl = await getDownloadURL(storageRef(storage, data[key].som));
            return { [key]: { img: imgUrl, som: audioUrl } };
          } catch (error) {
            console.error("Error fetching asset URLs: ", error);
            return { [key]: { img: null, som: null } };
          }
        });
        const assetsList = await Promise.all(assetPromises);
        const assetsObj = Object.assign({}, ...assetsList);
        setAssets(assetsObj);
      } else {
        console.log("No data available");
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchAssets(selectedLanguage, selectedCategory);
  }, [selectedLanguage, selectedCategory]); 

  const changeLanguage = (language) => {
    setSelectedLanguage(normalizeLanguage(language));
  };

  const changeCategory = (category) => {
    setSelectedCategory(category);
  };

  return (
    <LanguageContext.Provider value={{ assets, selectedLanguage, changeLanguage, selectedCategory, changeCategory }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
