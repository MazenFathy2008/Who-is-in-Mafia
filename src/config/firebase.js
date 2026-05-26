import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBfeJPmM4nv2oFtLKXv6wtBYBf3ULbLIvg",
  authDomain: "who-is-in-mafia.firebaseapp.com",
  projectId: "who-is-in-mafia",
  storageBucket: "who-is-in-mafia.firebasestorage.app",
  messagingSenderId: "865831659157",
  appId: "1:865831659157:web:7126f0c2478d3be23e1d9c",
  measurementId: "G-3RGB2TECYG"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
