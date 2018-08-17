import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app/app.component';
import { CurrentComponent } from './current/current.component';
import { HttpClientModule } from '@angular/common/http'
import { HttpModule } from '@angular/http';
import { JsonpModule } from '@angular/http';
import { CommunicationService } from './services/communication.service';
import { NgPipesModule } from 'ngx-pipes';

@NgModule({
  declarations: [
    AppComponent,
    CurrentComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    JsonpModule,
    NgPipesModule
  ],
  providers: [CommunicationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
