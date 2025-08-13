import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import {
  Firestore, collection, doc, updateDoc, onSnapshot,
  addDoc, deleteDoc, query, orderBy, limit, where
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class NoteListService {
  allNotes: Note[] = [];
  trashedNotes: Note[] = [];
  markedNotes: Note[] = [];

  unsubscribeNotes;
  unsubscribeTrash;
  unsubscribeMarkedNotes;

  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubscribeNotes = this.subscribeToNotes();
    this.unsubscribeTrash = this.subscribeToTrashNotes();

    // durch den code, werden markierte als erste nach Alphabet
    // und Große Buchstabe aussortiert und gezeigt
    this.unsubscribeMarkedNotes = this.subscribeMarkedNotes();
  }

  subscribeToNotes() {
    const q = query(this.getNotesCollection(), orderBy('title'), limit(7));
    // orderBy('title') -> funktioniert zusammen mit where("", "==", "") nicht.
    // sortiert zwar nach Alphabet, aber GROßE Buchstabe wird zuerst gestellt
    //  auch wenn es keine Alphabet reihe nach ist!!!!
    return onSnapshot(q, (list) => {
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

  subscribeMarkedNotes() {
    const q = query(this.getNotesCollection(), where("marked", "==", true), limit(20));
    // wo Limit - wieviel Notizen darstellen, where - zeigt markierte Notizen
    return onSnapshot(q, (list) => {
      this.markedNotes = [];
      list.forEach((element) => {
        this.markedNotes.push(this.createNoteFromData(element.data(), element.id));
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
    this.unsubscribeMarkedNotes();
  }

  // gib mir zurück vom Firebase meine collection unter Notes
  getNotesCollection() {
    return collection(this.firestore, 'Notes');
  }

  getTrashCollection() {
    return collection(this.firestore, 'Trash');
  }

  async deleteNote(collId: "Notes" | "Trash", docId: string) {
    await deleteDoc(this.getSingleDocument(collId, docId)).catch(
      (err) => { console.log(err) })
  }

  // damit neue Notiz in Firebase Collection erstellen
  async createNewNote(item: Note, collId: "Notes" | "Trash") {
    if (collId === "Notes") {
      await addDoc(this.getNotesCollection(), item).catch((err) => {
        console.error(err);
      });
    } else {
      await addDoc(this.getTrashCollection(), item).catch((err) => {
        console.error(err);
      });
    }
  }

  async updateNote(note: Note) {
    if (note.id) {
      let docRef = this.getSingleDocument(this.getCollectionIdFromNote(note), note.id)
      await updateDoc(docRef, this.getCleanJson(note)).catch(
        (err) => {
          console.log(err);
        })
    }
  }

  // Hilfsfunktion
  getCleanJson(note: Note): {} {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
    }
  }

  // Hilfsfunktion
  getCollectionIdFromNote(note: Note) {
    if (note.type == 'note') {
      return 'Notes'
    } else {
      return 'Trash'
    }
  }

  getSingleDocument(collId: string, docId: string) {
    return doc(collection(this.firestore, collId), docId);
  }
}