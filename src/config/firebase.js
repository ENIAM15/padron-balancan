import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ==========================================
// CONFIGURACIÓN DE FIREBASE Y VARIABLES GLOBALES
// ==========================================
export const appId = typeof __app_id !== 'undefined' ? __app_id : 'balancan-padron-app';
export const firebaseConfig =
  typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;

export let app = null;
export let auth = null;
export let db = null;

if (firebaseConfig) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}
