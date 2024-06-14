import { initializeApp} from 'firebase/app'
// import { getFirestore } from 'firebase/firestore'

export const firebaseApp = initializeApp({
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
});

// const db = getFirestore(firebaseApp)

// here we can export reusable database references
// export const todosRef = collection(db, 'todos')