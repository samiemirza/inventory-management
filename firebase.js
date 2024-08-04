// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFGTmAKEhpSzLCoPvXeoOn2PGA3P7v5UM",
  authDomain: "inventory-management-158ed.firebaseapp.com",
  projectId: "inventory-management-158ed",
  storageBucket: "inventory-management-158ed.appspot.com",
  messagingSenderId: "995556405586",
  appId: "1:995556405586:web:c95d40367eb1a777000a8b",
  measurementId: "G-CL54B0XDPP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };