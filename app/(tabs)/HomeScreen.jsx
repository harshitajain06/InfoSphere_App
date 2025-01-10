import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import { db } from '../../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

const HomeScreen = () => {
  const [titles, setTitles] = useState([]);
  const [subtitles, setSubtitles] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch titles from Firestore
  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const titlesCollection = collection(db, 'titles'); // Main collection
        const titlesSnapshot = await getDocs(titlesCollection);
        const titlesData = titlesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTitles(titlesData);
      } catch (error) {
        console.error('Error fetching titles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTitles();
  }, []);

  // Fetch subtitles for a specific title
  const fetchSubtitles = async (titleId) => {
    try {
      setLoading(true);
      const subtitlesCollection = collection(db, 'titles', titleId, 'subtitles'); // Subcollection
      const subtitlesSnapshot = await getDocs(subtitlesCollection);
      const subtitlesData = subtitlesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubtitles(subtitlesData);
      setSelectedTitle(titleId);
    } catch (error) {
      console.error('Error fetching subtitles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loaderText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!selectedTitle ? (
        <>
          <Text style={styles.header}>Discover More</Text>
          <FlatList
            data={titles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => fetchSubtitles(item.id)}
              >
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      ) : (
        <>
          <TouchableOpacity onPress={() => setSelectedTitle(null)}>
            <Text style={styles.backButton}>← Back to Titles</Text>
          </TouchableOpacity>
          <FlatList
            data={subtitles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardContent}>{item.content}</Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f8fa',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f8fa',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2, // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
  },
  cardContent: {
    fontSize: 16,
    color: '#555',
    marginTop: 8,
  },
  backButton: {
    fontSize: 18,
    color: '#007BFF',
    marginBottom: 16,
  },
});

export default HomeScreen;
