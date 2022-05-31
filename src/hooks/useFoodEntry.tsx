import {
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  doc,
  query,
  where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase-config';
import { FirebaseCollections } from '../enums';
import { FoodEntryType } from '../types';
import { useAuth, useFirebase } from '.';

const foodEntriesCollection = collection(db, FirebaseCollections.FOOD_ENTRIES);

export const useFoodEntry = () => {
  const { user } = useAuth();

  const { getCollection, getDocument } = useFirebase();
  const [foodEntries, setFoodEntries] = useState<FoodEntryType[]>([]);

  useEffect(() => {
    const loadFoodEntries = async () => {
      const collection = getCollection(FirebaseCollections.FOOD_ENTRIES);

      const getFoodQuery = () => {
        if (user.isAdmin) {
          return query(collection);
        }
        const createdByDoc = doc(db, FirebaseCollections.USERS, user.id);
        return query(collection, where('createdBy', '==', createdByDoc));
      };

      const foodData = await getDocs(getFoodQuery());
      const entries = foodData.docs.map(foodDoc => ({
        ...foodDoc.data(),
        id: foodDoc.id,
      })) as FoodEntryType[];

      setFoodEntries(entries);
    };

    loadFoodEntries();
  }, []);

  const addFoodEntry = async (newFoodEntry: FoodEntryType) => {
    try {
      const { id } = await addDoc(foodEntriesCollection, newFoodEntry);
      setFoodEntries(prev => [...prev, { ...newFoodEntry, id }]);
    } catch (error) {
      console.error(error);
    }
  };

  const updateFoodEntry = async (
    id: string,
    updatedFoodEntry: FoodEntryType,
  ) => {
    try {
      const foodEntryDoc = doc(db, FirebaseCollections.FOOD_ENTRIES, id);
      await updateDoc(foodEntryDoc, updatedFoodEntry);
      setFoodEntries(prev =>
        prev.map(foodEntry =>
          foodEntry.id === id ? updatedFoodEntry : foodEntry,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const deleteFoodEntry = async (entryId: string) => {
    try {
      const document = getDocument({
        firebaseCollection: FirebaseCollections.FOOD_ENTRIES,
        documentId: entryId,
      });
      await deleteDoc(document);
      setFoodEntries(prev => prev.filter(entry => entry.id !== entryId));
    } catch (error) {
      console.error(error);
    }
  };

  return {
    foodEntries,
    addFoodEntry,
    updateFoodEntry,
    deleteFoodEntry,
  };
};
