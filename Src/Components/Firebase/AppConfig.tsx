import firebase from "@react-native-firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAv6ls8opKV0dNCoQJ8fEHh8-g7xJgskFQ",
  authDomain: "stepcounter-aac85.firebaseapp.com",
  databaseURL:
    "https://stepcounter-aac85-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "stepcounter-aac85",
  storageBucket: "stepcounter-aac85.appspot.com",
  messagingSenderId: "531738821754",
  appId: "1:531738821754:web:4a52cc0a037b7a2eb2e7c3",
  measurementId: "G-3GWPCN0YMN",
};

const initializeFirebase = () => {
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }
};

export default initializeFirebase;
