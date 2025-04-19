import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBIDtZ5Us0fEBlpDoCxjh5etfUEQqIiYRk",
  authDomain: "divi-labs-audits.firebaseapp.com",
  projectId: "divi-labs-audits",
  storageBucket: "divi-labs-audits.appspot.com",
  messagingSenderId: "983576611663",
  appId: "1:983576611663:web:d00430b9022b973ebd133a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
