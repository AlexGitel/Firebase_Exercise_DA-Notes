// import { ApplicationConfig, importProvidersFrom } from '@angular/core';
// import { provideRouter } from '@angular/router';

// import { routes } from './app.routes';
// import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
// import { getFirestore, provideFirestore } from '@angular/fire/firestore';

// export const appConfig: ApplicationConfig = {
//   providers: [
//   provideRouter(routes), 
//   importProvidersFrom(provideFirebaseApp(() => initializeApp({ 
//     // "projectId": "da-notes-c3414", 
//     // "appId": "1:570706323564:web:3859e834b5bfc29841d049", 
//     // "storageBucket": "da-notes-c3414.firebasestorage.app", 
//     // "apiKey": "AIzaSyCdqCViIeb1-hnZqwLsm7yDdz_U3we7aUU", 
//     // "authDomain": "da-notes-c3414.firebaseapp.com", 
//     // "messagingSenderId": "570706323564" }))),

//     "projectId":"da-notes-e649e",
//       "appId":"1:1036928432392:web:041380eff45c79837d94bd",
//       "storageBucket":"da-notes-e649e.firebasestorage.app",
//       "apiKey":"AIzaSyBlJGw3Oi5isiT8EZm95t1U4-Ap_c_2POo",
//       "authDomain":"da-notes-e649e.firebaseapp.com",
//       "messagingSenderId":"1036928432392"}))),
      
//   importProvidersFrom(provideFirestore(() => getFirestore()))]
// };


import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideFirebaseApp(() => initializeApp({
      "projectId":"da-notes-e649e",
      "appId":"1:1036928432392:web:041380eff45c79837d94bd",
      "storageBucket":"da-notes-e649e.firebasestorage.app",
      "apiKey":"AIzaSyBlJGw3Oi5isiT8EZm95t1U4-Ap_c_2POo",
      "authDomain":"da-notes-e649e.firebaseapp.com",
      "messagingSenderId":"1036928432392"})), 
      provideFirestore(() => getFirestore())
    ]
};
