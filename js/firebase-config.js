// /js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAzeg2ha8agdS5zKFB34Udwj2CTMJamy0E",
  authDomain: "shpi-d4e2d.firebaseapp.com",
  projectId: "shpi-d4e2d",
  storageBucket: "shpi-d4e2d.appspot.com",
  messagingSenderId: "600471884377",
  appId: "1:600471884377:web:5512544dc9dfb1fa009748"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const propertyCol = collection(db, "properties");
