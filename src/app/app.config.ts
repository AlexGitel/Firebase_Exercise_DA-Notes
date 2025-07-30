import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), 
  importProvidersFrom(provideFirebaseApp(() => initializeApp({ "projectId": "da-notes-c3414", "appId": "1:570706323564:web:3859e834b5bfc29841d049", "storageBucket": "da-notes-c3414.firebasestorage.app", "apiKey": "AIzaSyCdqCViIeb1-hnZqwLsm7yDdz_U3we7aUU", "authDomain": "da-notes-c3414.firebaseapp.com", "messagingSenderId": "570706323564" }))),
  importProvidersFrom(provideFirestore(() => getFirestore()))]
};
