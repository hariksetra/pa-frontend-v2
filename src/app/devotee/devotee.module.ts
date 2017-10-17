import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { DevoteeProfileComponent } from './devotee-profile.component';
import { HistoryComponent } from './history.component'
import { WriteCommentComponent } from './write-comment.component'

import { DevoteeRoutingModule } from './devotee-routing.module';

@NgModule({
    imports: [
        NgbModule,
        DevoteeRoutingModule,
        FormsModule,
        BrowserModule,
    ],
    exports: [],
    declarations: [
        DevoteeProfileComponent,
        HistoryComponent,
        WriteCommentComponent,
    ],
    providers: [],
})

export class DevoteeModule { }