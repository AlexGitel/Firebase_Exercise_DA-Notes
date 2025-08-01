import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { Firestore, collection, doc, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {
  notes: Note[] = [];
  trashNotes: Note[] = [];

  unsubNotes;
  unsubTrash;

  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubNotes = this.subNotesList();
    this.unsubTrash = this.subTrashList();
  }

  ngOnDestroy() {
    this.unsubNotes();
    this.unsubTrash();
  }

  subNotesList() {
    return onSnapshot(this.getNotesRef(), (list) => {
      this.notes = [];
      list.forEach(element => {
        this.notes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  subTrashList() {
    return onSnapshot(this.getTrashNotesRef(), (list) => {
      this.trashNotes = [];
      list.forEach(element => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  setNoteObject(obj: any, id: string): Note {
    return {
      id: id,
      type: obj.type || "note",
      title: obj.title || "",
      content: obj.content || "",
      marked: obj.marked || false
    }
  }

  getNotesRef() {
    return collection(this.firestore, 'Notes');
  }

  getTrashNotesRef() {
    return collection(this.firestore, 'Trash');
  }

  getSingleDocRef(collecId: string, docId: string) {
    return doc(collection(this.firestore, collecId), docId);
  }
}
