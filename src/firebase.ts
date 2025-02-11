import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCtWDjMT2kzjEutVfMDbiZNDTvFQDO6QV8",
  authDomain: "waggle-cda91.firebaseapp.com",
  projectId: "waggle-cda91",
  storageBucket: "waggle-cda91.firebasestorage.app",
  messagingSenderId: "310621612787",
  appId: "1:310621612787:web:d30d981fe97eb921bce586"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)