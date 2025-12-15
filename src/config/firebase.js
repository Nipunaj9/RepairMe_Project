import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// ============================================
// FIREBASE CONFIGURATION
// ============================================
// Follow these steps to get your Firebase config:
//
// 1. Go to: https://console.firebase.google.com/
// 2. Create a new project (or select existing)
// 3. Click the Web icon (</>) to add a web app
// 4. Copy the config object below
// 5. Replace the values here with your actual config
//
// For detailed instructions, see: FIREBASE_SETUP_GUIDE.md
// ============================================

const firebaseConfig = {
  apiKey: "AIzaSyDuRg2uu8WSOjipEJDMcPKA9HH8-Lb0tIk",                          // Replace with your API key
  authDomain: "repairme-13dbd.firebaseapp.com",   // Replace with your auth domain
  projectId: "repairme-13dbd",                     // Replace with your project ID
  storageBucket: "repairme-13dbd.firebasestorage.app",     // Replace with your storage bucket
  messagingSenderId: "204363667358",    // Replace with your sender ID
  appId: "1:204363667358:web:437ae14711090ea677e88f"                              // Replace with your app ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

