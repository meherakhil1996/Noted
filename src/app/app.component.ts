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
  public mobile:boolean = false;
  public divHide:boolean = false;

  constructor(private _noteD: NoteService, private http: HttpClient){}

  ngOnInit() {
    this.getNote();
    console.log(window.screen.width);
    if(window.screen.width<=576){
      this.mobile = true;
      this.divHide = false;
    }
    else{
      this.mobile = false;
      this.divHide = true;
    }
  }

  public toggleNotes(){
    this.divHide = !this.divHide;
  }

  //To get error message in case of failed validation 
  getError(){
    if(this.noteTitle.hasError('required')){
      return 'You must enter a value';
    }
  }

  //fetches data from noteservice
  public getNote(){
   this._noteD.getNotes().subscribe(data =>{
      this.noteList = data;
      this.noteList.sort((a,b)=> {return b.favourite-a.favourite});
    },
      error => this.errorMsg = error
    );
  }


  //to add or remove favorites
  public favoriteBtn(id:number){
    let updateNote:any={};
    updateNote = this.noteList.find(item => item.id == id);
    updateNote.favourite = !this.noteList.find(item => item.id == id).favourite;
    this._noteD.updateNotes(updateNote).subscribe(data =>{
      this.getNote();
    });
  }


  //to save new notes
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


  //to save existing notes
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


  //to display new note div
  public newNote(){
    this.success="";
    this.hideDiv=true;
  }


  //to display and start editing existing note
  public noteSelect(id:number){
    this.hideDiv=false;
    this.success="";
    let selectedNote=this.noteList.find(note => note.id == id);
    this.selectedId=id;
    this.titleNoteE = selectedNote.title;
    this.descriptionE = selectedNote.description;
  }

  //to delete note with noteservice
  public deleteN(id:number){
    this._noteD.deleteNote(id).subscribe(data =>{
      this.getNote();
    })
  }
}
