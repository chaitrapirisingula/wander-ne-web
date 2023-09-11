import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc} from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, updateProfile } from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

/**
 * Logins in user and alerts if invalid.
 * 
 * @param {*} email 
 * @param {*} password 
 */
export const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

/**
 * Creates new user account.
 * 
 * @param {*} name 
 * @param {*} email 
 * @param {*} password 
 */
export const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, 'users'), {
      uid: user.uid,
      name,
      authProvider: 'local',
      email,
    });
    alert('Account created.');
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

/**
 * Sends password reset email.
 * 
 * @param {*} email 
 */
export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert('Check your email to reset your password.');
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

/**
 * Signs out user.
 */
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

/**
 * Uploads or updates profile picture for user.
 * 
 * @param {*} file 
 * @param {*} user 
 * @param {*} setLoading 
 */
export const uploadImage = async (file, user, setLoading) => {
  try {
    const fileRef = ref(storage, user.uid + '.png');
    setLoading(true);
    await uploadBytes(fileRef, file);
    const photoURL = await getDownloadURL(fileRef);
    updateProfile(user, {photoURL});
    setLoading(false);
    alert('Uploaded Image!');
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}