import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Modal 
} from 'react-native';
import { WebView } from 'react-native-webview';
import { db } from '../../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

const HomeScreen = () => {
  const [titles, setTitles] = useState([]);
  const [subtitles, setSubtitles] = useState([]);
  const [subSubtitles, setSubSubtitles] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [selectedSubtitle, setSelectedSubtitle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch Titles
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

  // Fetch Subtitles
  const fetchSubtitles = async (titleId) => {
    try {
      setLoading(true);
      const subtitlesCollection = collection(db, 'titles', titleId, 'subtitles'); 
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

  // Fetch Sub-Subtitles
  const fetchSubSubtitles = async (subtitleId) => {
    try {
      setLoading(true);
      const subSubtitlesCollection = collection(db, 'titles', selectedTitle, 'subtitles', subtitleId, 'subsubtitles'); 
      const subSubtitlesSnapshot = await getDocs(subSubtitlesCollection);
      const subSubtitlesData = subSubtitlesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubSubtitles(subSubtitlesData);
      setSelectedSubtitle(subtitleId);
    } catch (error) {
      console.error('Error fetching sub-subtitles:', error);
    } finally {
      setLoading(false);
    }
  };

  // Open Video in Modal
  const openVideo = (url) => {
    setVideoUrl(url);
    setModalVisible(true);
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
          <Text style={styles.header}>Discover the Universe</Text>
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
      ) : !selectedSubtitle ? (
        <>
          <TouchableOpacity onPress={() => setSelectedTitle(null)}>
            <Text style={styles.backButton}>← Back to Titles</Text>
          </TouchableOpacity>
          <FlatList
            data={subtitles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.card} 
                onPress={() => fetchSubSubtitles(item.id)}
              >
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardContent}>{item.content}</Text>
                {item.videoUrl && (
                  <TouchableOpacity onPress={() => openVideo(item.videoUrl)}>
                    <Text style={styles.videoLink}>📺 Watch Video</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            )}
          />
        </>
      ) : (
        <>
          <TouchableOpacity onPress={() => setSelectedSubtitle(null)}>
            <Text style={styles.backButton}>← Back to Subtitles</Text>
          </TouchableOpacity>
          <FlatList
            data={subSubtitles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardContent}>{item.content}</Text>
                {item.videoUrl && (
                  <TouchableOpacity onPress={() => openVideo(item.videoUrl)}>
                    <Text style={styles.videoLink}>📺 Watch Video</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
        </>
      )}

      {/* Video Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.modalClose}>✖ Close</Text>
          </TouchableOpacity>
          <WebView source={{ uri: videoUrl }} style={styles.videoPlayer} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f8fa' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f8fa' },
  loaderText: { marginTop: 10, fontSize: 16, color: '#555' },
  header: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 16, textAlign: 'center' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  cardDescription: { fontSize: 14, color: '#555', marginTop: 8 },
  cardContent: { fontSize: 16, color: '#555', marginTop: 8 },
  videoLink: { fontSize: 16, color: '#007BFF', marginTop: 8 },
  backButton: { fontSize: 18, color: '#007BFF', marginBottom: 16 },
  modalContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
  modalClose: { color: '#FFF', fontSize: 20, textAlign: 'center', marginBottom: 10 },
  videoPlayer: { flex: 1 },
});

export default HomeScreen;
