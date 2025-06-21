import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Decode the base64 encoded service account key
const serviceAccountString = Buffer.from(
  process.env.FIREBASE_ADMIN_SDK_CONFIG_BASE64 || '',
  'base64'
).toString('utf8');

let serviceAccount: admin.ServiceAccount;
try {
    if (serviceAccountString) {
        serviceAccount = JSON.parse(serviceAccountString);
    } else {
        serviceAccount = {};
    }
} catch (e) {
    console.error('Failed to parse FIREBASE_ADMIN_SDK_CONFIG_BASE64. Make sure it is a valid base64 encoded JSON string.');
    serviceAccount = {};
}

if (!admin.apps.length) {
  try {
    // Only initialize if the config is present
    if (process.env.FIREBASE_ADMIN_SDK_CONFIG_BASE64 && process.env.FIREBASE_PROJECT_ID) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    }
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

export const db = admin.apps.length > 0 ? getFirestore() : null;
