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

  subscribeToNotes() {
    return onSnapshot(this.getNotesCollection(), (list) => {
      this.allNotes = [];
      list.forEach((element) => {
        this.allNotes.push(this.createNoteFromData(element.data(), element.id));
      });
    });
  }

  subscribeToTrashNotes() {
    return onSnapshot(this.getTrashCollection(), (list) => {
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

  // beende
  ngOnDestroy() {
    this.unsubscribeNotes();
    this.unsubscribeTrash();
  }

  // gib mir zurück vom Firebase meine collection unter Notes
  getNotesCollection() {
    return collection(this.firestore, 'Notes');
  }

  getTrashCollection() {
    return collection(this.firestore, 'Trash');
  }

  // damit neue Notiz in Firebase Collection erstellen
  async addNewNote(item: Note) {
    await addDoc(this.getNotesCollection(), item).catch((err) => {
      console.error(err);
    });

    // um in der console zu zeigen welche ID
    // .then((docRef) => {
    //   console.log('Document written by ID:', docRef?.id);
    // });
  }
}
