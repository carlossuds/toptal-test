import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Box, Tab, Tabs, Typography } from '@mui/material';
import { isSameDay, format, isBefore, isAfter, isEqual } from 'date-fns';
import { Link } from 'react-router-dom';
import {
  AddFoodEntryModal,
  FoodEntry,
  Input,
  UserNameAndBadge,
} from '../../components';
import { useAuth, useBoolean, useDates, useFoodEntry } from '../../hooks';
import { FoodEntryType } from '../../types';
import { AddFoodEntryButton, DailyCalories } from './components';

type DateRange = { from?: string; to?: string };

export function FoodEntriesPage() {
  const { user } = useAuth();
  const { addFoodEntry, foodEntries, deleteFoodEntry, updateFoodEntry } =
    useFoodEntry();
  const { TODAY, getDateString } = useDates();
  const {
    value: isOpen,
    setFalse: setModalClosed,
    setTrue: setModalOpen,
  } = useBoolean(false);

  const [selectedFoodEntry, setSelectedFoodEntry] = useState<
    FoodEntryType | undefined
  >(undefined);
  const [tab, setTab] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: TODAY,
  });

  const consumedCaloriesByDay = useCallback(
    (date: string) => {
      const dayCalories = foodEntries
        .filter(({ consumedAt }) =>
          isSameDay(new Date(consumedAt), new Date(date)),
        )
        .reduce((acc, curr) => {
          const { calories, cheat } = curr;
          if (cheat) {
            return acc;
          }
          return acc + calories;
        }, 0);

      return dayCalories;
    },
    [foodEntries],
  );

  const closeModal = () => {
    setSelectedFoodEntry(undefined);
    setModalClosed();
  };

  const onClickEdit = (foodEntry: FoodEntryType) => {
    setSelectedFoodEntry(foodEntry);
    setModalOpen();
  };

  const onCreate = (newFoodEntry: FoodEntryType) => {
    addFoodEntry(newFoodEntry);
    closeModal();
  };

  const onUpdate = (id: string, updatedFoodEntry: FoodEntryType) => {
    updateFoodEntry(id, updatedFoodEntry);
    closeModal();
  };

  const foodEntriesDays = [
    ...new Set(foodEntries.map(({ consumedAt }) => getDateString(consumedAt))),
  ];

  const caloriesConsumedByDay = useMemo(
    () =>
      foodEntries.reduce((acc, curr) => {
        const { calories, consumedAt, cheat } = curr;
        if (cheat) {
          return acc;
        }
        const date = getDateString(consumedAt);
        if (!acc[date]) {
          acc[date] = calories;
          return acc;
        }
        acc[date] += calories;
        return acc;
      }, {} as { [date: string]: number }),
    [foodEntries],
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      margin="auto"
      maxWidth={1280}
      alignItems="center"
      gap={3}
    >
      <Box width="100%" display="flex" justifyContent="space-between">
        <UserNameAndBadge />
        <AddFoodEntryButton
          consumedCaloriesToday={consumedCaloriesByDay(TODAY)}
          onClick={setModalOpen}
        />
      </Box>

      <Box display="flex" alignItems="flex-end" gap={3}>
        <Typography variant="h2">Food entries</Typography>
        <Link to="/report">
          <Typography variant="h6">Report</Typography>
        </Link>
      </Box>

      <Tabs value={tab} onChange={(_, value) => setTab(value)}>
        <Tab label="Entries" value={0} />
        <Tab label="Diet Tracking" value={1} disabled={user.isAdmin} />
      </Tabs>

      <Box display="flex" flexWrap="wrap" gap={3}>
        <>
          {tab === 0 &&
            (foodEntries.length ? (
              <Box>
                <Box mb={4} gap={4} display="flex" justifyContent="center">
                  <Input
                    label="From"
                    type="date"
                    onChange={e =>
                      setDateRange(prev => ({ ...prev, from: e.target.value }))
                    }
                  />
                  <Input
                    label="To"
                    type="date"
                    onChange={e =>
                      setDateRange(prev => ({ ...prev, to: e.target.value }))
                    }
                  />
                </Box>

                <Box display="flex" flexWrap="wrap" gap={3}>
                  {foodEntries
                    .sort((a, b) =>
                      new Date(a.consumedAt) > new Date(b.consumedAt) ? -1 : 1,
                    )
                    .filter(({ consumedAt }) => {
                      const { from } = dateRange;
                      const to = dateRange.to ?? TODAY;
                      if (!from) {
                        return true;
                      }
                      const dateConsumed = new Date(getDateString(consumedAt));
                      const dateFrom = new Date(from);
                      const dateTo = new Date(to);

                      const isBeforeOrEqualTO =
                        isBefore(dateConsumed, dateTo) ||
                        isEqual(dateConsumed, dateTo);
                      const isAfterOrEqualFROM =
                        isAfter(dateConsumed, dateFrom) ||
                        isEqual(dateConsumed, dateFrom);
                      return isBeforeOrEqualTO && isAfterOrEqualFROM;
                    })
                    .map(foodEntry => (
                      <FoodEntry
                        key={foodEntry.id}
                        {...foodEntry}
                        onClickDelete={() => deleteFoodEntry(foodEntry.id!)}
                        onClickEdit={() => onClickEdit(foodEntry)}
                      />
                    ))}
                </Box>
              </Box>
            ) : (
              <Alert severity="info">
                You haven&apos;t added any food entries yet
              </Alert>
            ))}

          {tab === 1 &&
            foodEntriesDays.map(day => (
              <DailyCalories
                key={day}
                day={day}
                calories={caloriesConsumedByDay[day]}
                hasReachedDailyLimit={
                  caloriesConsumedByDay[day] >= user.calorieLimit
                }
              />
            ))}
        </>
      </Box>

      {isOpen && (
        <AddFoodEntryModal
          onClose={closeModal}
          onCreate={onCreate}
          onUpdate={onUpdate}
          editingFoodEntry={selectedFoodEntry}
          isEditing={!!selectedFoodEntry}
        />
      )}
    </Box>
  );
}
