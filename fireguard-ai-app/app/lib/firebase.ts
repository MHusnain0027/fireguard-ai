import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyALjoxEuLZtGzeMNWGBNolNBvnmVt1Uhvk",
  authDomain: "fireguard-ai-ec9ce.firebaseapp.com",
  projectId: "fireguard-ai-ec9ce",
  storageBucket: "fireguard-ai-ec9ce.firebasestorage.app",
  messagingSenderId: "752477039086",
  appId: "1:752477039086:web:cd396f19fa4cd85eb0c6ff"
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);