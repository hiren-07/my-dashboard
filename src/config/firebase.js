import { initializeApp } from "firebase/app";
import { getFirestore, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDyNBafj7y3pTPBX5dzSQ4NHD3b0fpt_XA",
  authDomain: "hiren-pms.firebaseapp.com",
  projectId: "hiren-pms",
  storageBucket: "hiren-pms.firebasestorage.app",
  messagingSenderId: "812364982359",
  appId: "1:812364982359:web:ccd3ab1afaccd3e9939b12"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const DATA_DOC = doc(db, "dashboard", "main");
