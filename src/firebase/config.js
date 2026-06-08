import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCjeLoRpOUrmitaCmqCvhZCw-WVTj0zHoE",
  authDomain: "binge-hub-faa63.firebaseapp.com",
  projectId: "binge-hub-faa63",
  storageBucket: "binge-hub-faa63.firebasestorage.app",
  messagingSenderId: "550943947808",
  appId: "1:550943947808:web:b51cea4cd8f917e8b45045",
  measurementId: "G-85349KB3KL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
