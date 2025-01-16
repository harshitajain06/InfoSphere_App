import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCyCuEaFez7vZ_vRipQj0DqiLHKgouIxhc",
  authDomain: "fire-939bf.firebaseapp.com",
  projectId: "fire-939bf",
  storageBucket: "fire-939bf.firebasestorage.app",
  messagingSenderId: "604833156758",
  appId: "1:604833156758:web:0c9f9a7dd6b302546d3cb7",
  measurementId: "G-8J698RYJ0D"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
})

export const db = getFirestore(app);

export const usersRef = collection(db,'users');