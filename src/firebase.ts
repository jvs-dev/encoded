import { initializeApp } from 'firebase/app';
import { initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDHfIl1IqcjX2RSPEqJ8WC6QnwzGW2YyZE",
  authDomain: "encoded-9ab8f.firebaseapp.com",
  projectId: "encoded-9ab8f",
  storageBucket: "encoded-9ab8f.firebasestorage.app",
  messagingSenderId: "192062942339",
  appId: "1:192062942339:web:0b7ba36beb360f7e46bfb6",
  measurementId: "G-QNVDC8B3LT"
};

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
});
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Test connection
async function testConnection() {
  try {
    console.log("Testing Firestore connection to default database");
    await getDocFromServer(doc(db, 'site_content', 'main'));
    console.log("Firestore connection successful!");
  } catch (error) {
    console.error("Firestore connection test failed:", error);
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The database might not exist or is unreachable.");
    }
  }
}
testConnection();
