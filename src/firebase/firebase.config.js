import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore/lite";


const env = import.meta.env;
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASURE_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para obtener documentos de una colección
const getCollectionData = async () => {
  const snapshot = await getDocs(collection(db, "0001"));
  return snapshot;
};

export { getCollectionData };
