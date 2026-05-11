import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';

export interface BlogUser {
  uid: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: 'user' | 'staff' | 'client' | 'admin';
  isVerified: boolean;
  isIncoded: boolean;
  createdAt: any;
}

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getBlogUserProfile = async (uid: string): Promise<BlogUser | null> => {
  const userDoc = await getDoc(doc(db, 'blog_users', uid));
  if (userDoc.exists()) {
    return userDoc.data() as BlogUser;
  }
  return null;
};

export const registerBlogUser = async (uid: string, email: string, fullName: string, phoneNumber: string) => {
  const profile: BlogUser = {
    uid,
    email,
    fullName,
    phoneNumber,
    role: 'user',
    isVerified: false,
    isIncoded: false,
    createdAt: serverTimestamp(),
  };

  await setDoc(doc(db, 'blog_users', uid), profile);
  return profile;
};

export const subscribeToAuthChanges = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
