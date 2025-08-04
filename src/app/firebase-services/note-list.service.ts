import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import {
  Firestore,
  collection,
  doc,
  updateDoc,
  onSnapshot,
  addDoc,
  deleteDoc
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

  async deleteNote(collId: "Notes" | "Trash", docId: string) {
    await deleteDoc(this.getSingleDocument(collId, docId)).catch(
      (err) => { console.log(err) })
  }

  async addNewNote(item: Note, collId: "Notes" | "Trash") {
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

  // damit neue Notiz in Firebase Collection erstellen
  // async addNewNote(item: Note) {
  //   await addDoc(this.getNotesCollection(), item).catch((err) => {
  //     console.error(err);
  //   });
  //   // um in der console zu zeigen welche ID
  //   // .then((docRef) => {
  //   //   console.log('Document written by ID:', docRef?.id);
  //   // });
  // }

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

  // vereinfachste Variante ohne Hilfsfunktionen

  //   async updateNote(note: Note) {
  //   if (note.id) {
  //     const collId = note.type === 'note' ? 'Notes' : 'Trash';
  //     const docRef = doc(collection(this.firestore, collId), note.id);

  //     await updateDoc(docRef, {
  //       type: note.type,
  //       title: note.title,
  //       content: note.content,
  //       marked: note.marked,
  //     }).catch((err) => {
  //       console.log(err);
  //     });
  //   }
  // }
}