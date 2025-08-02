import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import {
  Firestore,
  collection,
  doc,
  onSnapshot,
  addDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoteListService {
  allNotes: Note[] = [];
  trashedNotes: Note[] = [];

  unsubscribeNotes;
  unsubscribeTrash;

  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubscribeNotes = this.subscribeToNotes();
    this.unsubscribeTrash = this.subscribeToTrashNotes();
  }

  ngOnDestroy() {
    this.unsubscribeNotes();
    this.unsubscribeTrash();
  }

  subscribeToNotes() {
    return onSnapshot(this.getNotesCollectionRef(), (list) => {
      this.allNotes = [];
      list.forEach((element) => {
        this.allNotes.push(this.createNoteFromData(element.data(), element.id));
      });
    });
  }

  subscribeToTrashNotes() {
    return onSnapshot(this.getTrashCollectionRef(), (list) => {
      this.trashedNotes = [];
      list.forEach((element) => {
        this.trashedNotes.push(
          this.createNoteFromData(element.data(), element.id)
        );
      });
    });
  }

  createNoteFromData(obj: any, id: string): Note {
    return {
      id: id,
      type: obj.type || 'note',
      title: obj.title || '',
      content: obj.content || '',
      marked: obj.marked || false,
    };
  }

  getNotesCollectionRef() {
    return collection(this.firestore, 'Notes');
  }

  getTrashCollectionRef() {
    return collection(this.firestore, 'Trash');
  }

  // um auf einzelnen Dokument zuzugreifen, nicht auf ganze Kollektion

  // getSingleDocRef(collecId: string, docId: string) {
  //   return doc(collection(this.firestore, collecId), docId);
  // }

  async addNote(item: Note) {
    await addDoc(this.getNotesCollectionRef(), item)
      .catch((err) => {
        console.error(err);
      })
      .then((docRef) => {
        console.log('Document written by ID:', docRef?.id);
      });
  }
}
