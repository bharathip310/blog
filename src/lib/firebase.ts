import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  projectId: "certain-casing-xd2jw",
  appId: "1:469769987535:web:6a1d7bde85cafa4d785eba",
  apiKey: "AIzaSyD5YPUs0IBwdIqQU-VEML9zswgrQDkMVz0",
  authDomain: "certain-casing-xd2jw.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-16b81811-19a6-4610-9771-7711540a709a",
  storageBucket: "certain-casing-xd2jw.firebasestorage.app",
  messagingSenderId: "469769987535"
};

export const app = initializeApp(firebaseConfig);
