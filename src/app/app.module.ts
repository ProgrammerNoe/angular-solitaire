import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { TimerComponent } from './timer/timer.component';
import { PlayAreaComponent } from './play-area/play-area.component';
import { OverlayComponent } from './overlay/overlay.component';
import { CardComponent } from './card/card.component';
import { MainComponent } from './main/main.component';
import { RulesComponent } from './rules/rules.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    TimerComponent,
    PlayAreaComponent,
    OverlayComponent,
    CardComponent,
    MainComponent,
    RulesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
