import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TimerComponent } from '../timer/timer.component';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.css']
})

export class OverlayComponent implements OnInit {

  @Input() timer: TimerComponent;
  hideOverlay : boolean;
  hidePause : boolean;
  hideWin : boolean;
  hideLost : boolean;

  constructor(private router: Router) {
    this.hidePause = true;
    this.hideWin = true;
    this.hideLost = true;
    this.hideOverlay = true;
  }

  ngOnInit() {
  }

  onContinueGame() {
    this.timer.startTimer();
    this.hidePause = true;
    this.hideOverlay = true;
  }

  showWin() {
    this.hideWin = false;
    this.hideOverlay = false;
  }

  showLost() {
    this.hideLost = false;
    this.hideOverlay = false;
  }

  showPause() {
    this.hidePause = false;
    this.hideOverlay = false;
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

}


