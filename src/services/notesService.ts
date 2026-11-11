import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface ItineraryNote {
  id: string; // format: `${tripId}_d${dayIndex}_i${itemIndex}`
  tripId: string;
  dayIndex: number;
  itemIndex: number;
  itemTitle: string;
  note: string;
  updatedAt: string;
}

const LOCAL_STORAGE_KEY = 'itinerary_notes_cache_v1';

// Read from localStorage
export function getLocalNotes(): Record<string, ItineraryNote> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Error reading notes from localStorage:', e);
    return {};
  }
}

// Write to localStorage
export function saveLocalNotes(notes: Record<string, ItineraryNote>) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {
    console.error('Error saving notes to localStorage:', e);
  }
}

// Subscribe to notes (with Firestore real-time listener and LocalStorage fallback)
export function subscribeTripNotes(
  tripId: string, 
  onUpdate: (notes: Record<string, ItineraryNote>) => void
): () => void {
  // Initial emit from localStorage
  const local = getLocalNotes();
  onUpdate(local);

  try {
    const colRef = collection(db, 'itineraryNotes');
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const updated = { ...getLocalNotes() };
      snapshot.docChanges().forEach((change) => {
        const data = change.doc.data() as ItineraryNote;
        if (change.type === 'removed') {
          delete updated[change.doc.id];
        } else if (data && data.tripId) {
          updated[change.doc.id] = data;
        }
      });
      saveLocalNotes(updated);
      onUpdate(updated);
    }, (err) => {
      console.warn('Firestore notes subscription fallback to local cache:', err);
      onUpdate(getLocalNotes());
    });

    return unsubscribe;
  } catch (err) {
    console.warn('Firestore notes initialization error, using local notes:', err);
    return () => {};
  }
}

// Save or update a note
export async function saveItineraryNote(
  tripId: string,
  dayIndex: number,
  itemIndex: number,
  itemTitle: string,
  noteText: string
): Promise<ItineraryNote> {
  const noteId = `${tripId}_d${dayIndex}_i${itemIndex}`;
  const noteData: ItineraryNote = {
    id: noteId,
    tripId,
    dayIndex,
    itemIndex,
    itemTitle,
    note: noteText.trim(),
    updatedAt: new Date().toISOString()
  };

  // Update localStorage first (optimistic)
  const local = getLocalNotes();
  local[noteId] = noteData;
  saveLocalNotes(local);

  // Sync to Firestore
  try {
    const docRef = doc(db, 'itineraryNotes', noteId);
    await setDoc(docRef, noteData);
  } catch (e) {
    console.warn('Firestore note save failed, persisted locally:', e);
  }

  return noteData;
}

// Delete a note
export async function deleteItineraryNote(noteId: string): Promise<void> {
  // Remove from localStorage
  const local = getLocalNotes();
  delete local[noteId];
  saveLocalNotes(local);

  // Delete from Firestore
  try {
    const docRef = doc(db, 'itineraryNotes', noteId);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn('Firestore note delete failed, removed locally:', e);
  }
}
