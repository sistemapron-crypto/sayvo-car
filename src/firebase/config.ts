import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBJFrMrZ7XdBpn1jJqtPz1eC2IKvcQYrrc",
  authDomain: "catalogo-modelo-3ba73.firebaseapp.com",
  projectId: "catalogo-modelo-3ba73",
  storageBucket: "catalogo-modelo-3ba73.firebasestorage.app",
  messagingSenderId: "380760744772",
  appId: "1:380760744772:web:c992400bdbcf840845ad11"
};

export const firebaseApp = initializeApp(firebaseConfig);