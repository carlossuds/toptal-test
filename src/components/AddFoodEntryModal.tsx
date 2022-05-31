import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  FormControlLabel,
  Switch,
} from '@mui/material';
import React, { useCallback, useState } from 'react';
import { Input } from '.';
import { FirebaseCollections } from '../enums';
import { useAuth, useBoolean, useFirebase } from '../hooks';
import { FoodEntryType } from '../types';

type Props = {
  editingFoodEntry?: FoodEntryType;
  isEditing?: boolean;
  onClose: () => void;
  onCreate: (foodEntry: FoodEntryType) => void;
  onUpdate: (id: string, updatedFoodEntry: FoodEntryType) => void;
};

export function AddFoodEntryModal({
  editingFoodEntry = {} as FoodEntryType,
  isEditing = false,
  onClose,
  onCreate,
  onUpdate,
}: Props) {
  const { user } = useAuth();
  const { getDocument } = useFirebase();
  const [foodEntry, setFoodEntry] = useState<FoodEntryType>(editingFoodEntry);

  const { value: isCheatMode, toggle: toggleCheatMode } = useBoolean(
    Boolean(editingFoodEntry.cheat),
  );

  const createFoodEntry = useCallback(() => {
    const createdBy = getDocument({
      firebaseCollection: FirebaseCollections.USERS,
      documentId: user.id,
    });

    onCreate({ ...foodEntry, createdBy, cheat: isCheatMode });
    onClose();
  }, [getDocument, user.id, onCreate, foodEntry, isCheatMode, onClose]);

  const isAddButtonDisabled = () => {
    const { calories, consumedAt, foodName } = foodEntry;
    if (!calories || !consumedAt || !foodName) {
      return true;
    }
    return false;
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Add Food Entry</DialogTitle>

      <Box display="flex" flexDirection="column" gap={4} p={4}>
        <Input
          label="Food"
          value={foodEntry.foodName}
          onChange={e =>
            setFoodEntry(prev => ({ ...prev, foodName: e.target.value }))
          }
        />
        <Input
          label="Consumed at"
          type="datetime-local"
          value={foodEntry.consumedAt}
          onChange={e =>
            setFoodEntry(prev => ({ ...prev, consumedAt: e.target.value }))
          }
        />
        <Box gap={2}>
          <Input
            label="Calories"
            type="number"
            value={foodEntry.calories}
            onChange={e =>
              setFoodEntry(prev => ({
                ...prev,
                calories: Number(e.target.value),
              }))
            }
          />

          <FormControlLabel
            control={
              <Switch
                value={isCheatMode}
                checked={isCheatMode}
                onChange={toggleCheatMode}
              />
            }
            label="Cheat?"
          />
        </Box>

        {isEditing ? (
          <Button
            onClick={() =>
              onUpdate(foodEntry.id!, { ...foodEntry, cheat: isCheatMode })
            }
            disabled={isAddButtonDisabled()}
          >
            Update
          </Button>
        ) : (
          <Button onClick={createFoodEntry} disabled={isAddButtonDisabled()}>
            Add
          </Button>
        )}
      </Box>
    </Dialog>
  );
}
