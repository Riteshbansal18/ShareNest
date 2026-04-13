let auth = null;
let googleProvider = null;

const getFirebaseConfig = () => ({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
});

const isFirebaseConfigured = () => {
  const config = getFirebaseConfig();
  return config.apiKey && config.apiKey !== 'your_firebase_api_key' && config.apiKey.length > 10;
};

const initFirebase = async () => {
  if (auth) return { auth, googleProvider };

  const { initializeApp, getApps } = await import('firebase/app');
  const { getAuth, GoogleAuthProvider } = await import('firebase/auth');

  const config = getFirebaseConfig();
  const app = getApps().length === 0 ? initializeApp(config) : getApps()[0];
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  return { auth, googleProvider };
};

export const signInWithGoogle = async () => {
  if (!isFirebaseConfigured()) {
    throw new Error('Google Sign-In is not configured yet. Please add Firebase credentials to .env file.');
  }

  const { signInWithPopup } = await import('firebase/auth');
  const { auth: firebaseAuth, googleProvider: provider } = await initFirebase();

  const result = await signInWithPopup(firebaseAuth, provider);
  const user = result.user;
  return {
    fullName: user.displayName,
    email: user.email,
    profileImage: user.photoURL,
    googleId: user.uid,
    idToken: await user.getIdToken()
  };
};
