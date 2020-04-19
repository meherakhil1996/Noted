import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { INoted} from './noted';
import { throwError as obsThrowError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class NoteService {

  // private _url:string = "/assets/data/notedata.json";
  // private _url:string = "https://my-json-server.typicode.com/meherakhil1996/Noted/records";
  private _url:string = "http://localhost:3000/records";

  constructor(private http: HttpClient, private firestore: AngularFirestore) { }

  public getNotes():Observable<INoted[]>{
    return this.http.get<INoted[]>(this._url).pipe(catchError(this.errorHandler));
  }

  public errorHandler(error: HttpErrorResponse){
    return obsThrowError(error.message||"Server Error");
  }

  public setNotes(note:INoted){
    return this.http.post<INoted>(this._url,note).pipe(catchError(this.errorHandler));
  }

  public updateNotes(note:INoted){
    let url = this._url+"/"+note.id;
    return this.http.put(url,note).pipe(catchError(this.errorHandler));
  }

  public deleteNote(id:number){
    let url = this._url+"/"+id;
    return this.http.delete(url).pipe(catchError(this.errorHandler));
  }
}
