import { getCookie } from "cookies-next";
import { ref, set } from "firebase/database";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getMessaging, getToken, onMessage } from "firebase/messaging"; 
import { getFirestore } from "firebase/firestore";
import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};


const app = initializeApp(firebaseConfig);

export const FirebaseAuth = getAuth(app);
export const realTimeDb = getDatabase(app);
export const Db = getFirestore(app); // This is Firestore
export const messaging = typeof window !== "undefined" ? getMessaging(app) : null;

let analytics = null;

if (typeof window !== 'undefined') {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, analytics, logEvent };

export default app;



const currentUserId = getCookie("USER");

export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    if (currentToken) {

      await set(ref(realTimeDb, `fcmTokens/${currentUserId}`), currentToken);
    } else {
      console.log(
        "No registration token available. Request permission to generate one."
      );
    }

    return currentToken;
  } catch (err) {
    console.error("An error occurred while retrieving token:", err);
    return null;
  }
};


export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("payload", payload);
      resolve(payload);
    });
  });


// databaseURL: "https://portfilio-nextjs-default-rtdb.firebaseio.com",