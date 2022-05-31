import { DocumentData, DocumentReference } from 'firebase/firestore';
import { FoodType } from './FoodType';

export type FoodEntryType = FoodType & {
  id?: string;
  createdBy: DocumentReference<DocumentData>;
};
