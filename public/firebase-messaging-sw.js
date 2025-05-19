

importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js");


firebase.initializeApp({
  apiKey: "AIzaSyB5YuJCt7U_jZEDABOZTfWpHfyjn4BSoDA",
  authDomain: "portfilio-nextjs.firebaseapp.com",
  projectId: "portfilio-nextjs",
  storageBucket: "portfilio-nextjs.appspot.com",
  messagingSenderId: "258707616929",
  appId: "1:258707616929:web:187837f9bdb34074d22ce0",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/images/timeline.webp",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
