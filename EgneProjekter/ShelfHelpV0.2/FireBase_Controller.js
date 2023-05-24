//Firebase import
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, setDoc, getDoc, doc, deleteDoc, addDoc } from 'firebase/firestore'
import { firebaseConfig } from './FB_Config.js'

const firebase_app = initializeApp(firebaseConfig)
const db = getFirestore(firebase_app)