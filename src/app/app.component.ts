import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NoteService } from './note.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  title = 'Noted';
  public noteTitle = new FormControl('', [Validators.required]);
  public noteList = [];
  private _url:string = "http://localhost:3000/records";
  public hideDiv:boolean = true;
  public selectedId:number=null;
  public success:string="";
  public titleNote:string = "";
  public description:string = ""; 
  public titleNoteE:string = "";
  public descriptionE:string = ""; 
  public errorMsg:string = "";
  public titleErr:boolean=false;

  constructor(private _noteD: NoteService, private http: HttpClient){}

  ngOnInit() {
    this.getNote();

  }

  //To get error message in case of failed validation 
  getError(){
    if(this.noteTitle.hasError('required')){
      return 'You must enter a value';
    }
  }

  public getNote(){
   this._noteD.getNotes().subscribe(data =>{
      this.noteList = data;
      this.noteList.sort((a,b)=> {return b.favourite-a.favourite});
    },
      error => this.errorMsg = error
    );
  }

  public favoriteBtn(id:number){
    let updateNote:any={};
    updateNote = this.noteList.find(item => item.id == id);
    updateNote.favourite = !this.noteList.find(item => item.id == id).favourite;
    this._noteD.updateNotes(updateNote).subscribe(data =>{
      this.getNote();
    });
  }

  public saveNote(){
    let newNote:any = {};
    this.titleNote.trim();
    this.description.trim();
    if(this.titleNote){
      newNote.id = Math.floor(1000+Math.random()*2000);
      newNote.title = this.titleNote;
      newNote.description = this.description;
      newNote.favourite = false;
      newNote.created = Date.now();
      this._noteD.setNotes(newNote).subscribe(
        data => {
        this.success="Saved successfully!";
        this.getNote();},
        error => this.errorMsg = error);
      this.titleNote=" ";
      this.description="";
      this.titleErr=false;
    }
    else{
      this.titleErr=true;
    }
  }

  public saveNoteE(){
    let editNote:any={};
    this.titleNoteE.trim();
    this.descriptionE.trim();
    if(this.titleNoteE){
      editNote = this.noteList.find(item => item.id == this.selectedId);;
      editNote.title = this.titleNoteE;
      editNote.description = this.descriptionE;
      editNote.created = Date.now();
      this._noteD.updateNotes(editNote).subscribe(data=>{
        this.success="Saved successfully!";
        this.getNote();
      },
        error => this.errorMsg = error);
        this.titleErr=false;
    }
    else{
      this.titleErr=true;
    }
    
  }

  public newNote(){
    this.success="";
    this.hideDiv=true;
  }

  public noteSelect(id:number){
    this.hideDiv=false;
    this.success="";
    let selectedNote=this.noteList.find(note => note.id == id);
    this.selectedId=id;
    this.titleNoteE = selectedNote.title;
    this.descriptionE = selectedNote.description;
  }

  public deleteN(id:number){
    this._noteD.deleteNote(id).subscribe(data =>{
      this.getNote();
    })
  }
}
