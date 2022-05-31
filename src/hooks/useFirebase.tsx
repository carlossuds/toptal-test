import React from 'react';
import { collection as firestoreCollection, doc } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { FirebaseCollections } from '../enums';

type Params = {
  firebaseCollection: FirebaseCollections;
  documentId: string;
};

export const useFirebase = () => {
  const getDocument = ({ firebaseCollection, documentId }: Params) => {
    const path = `${firebaseCollection}/${documentId}`;
    const document = doc(db, path);
    return document;
  };

  const getCollection = (firebaseCollection: FirebaseCollections) => {
    return firestoreCollection(db, firebaseCollection);
  };

  return {
    getDocument,
    getCollection,
  };
};
