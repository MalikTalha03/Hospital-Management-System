// Import the Firebase Admin SDK
import admin from 'firebase-admin';

// Check if the Firebase app has been initialized to avoid initializing it multiple times
if (!admin.apps.length) {
    // Parse the JSON string from the environment variable directly
    const serviceAccount = JSON.parse(process.env.FIREBASE_SDK_JSON);

    // Initialize Firebase Admin with the parsed service account credentials
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });

    console.log('Firebase Admin initialized');
}

// Export Firestore and Storage instances for use in other parts of the application
export const db = admin.firestore();
export const storage = admin.storage();
