import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { SampleComponent } from './sample/sample.component';
import { ClarityModule } from "@clr/angular";

@NgModule({
  imports:      [ BrowserModule, FormsModule, ClarityModule, ReactiveFormsModule ],
  declarations: [ AppComponent, HelloComponent, SampleComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
