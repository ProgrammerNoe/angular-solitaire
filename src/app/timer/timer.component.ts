import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OverlayComponent } from '../overlay/overlay.component';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})

export class TimerComponent implements OnInit {

  @Input() overlay: OverlayComponent;
  timeString: string;
  timeLeft: number;
  interval;

  constructor(private router: Router) {
    this.timeLeft = 600;
  }

  ngOnInit() {
    this.startTimer();
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.overlay.showLost();
      }
      let minutes = Math.floor(this.timeLeft/60);
      let seconds = this.timeLeft - (minutes * 60);
      seconds = Math.round(seconds * 100) / 100

      let minuteString = minutes.toString();
      let secondString = seconds.toString();
      if (minuteString.length == 1) {
        minuteString = "0" + minuteString;
      }
      if (secondString.length == 1) {
        secondString = "0" + secondString;
      }

      this.timeString = minuteString + ":" + secondString;
    }, 1000);
  }

  pauseGame() {
    clearInterval(this.interval);
    this.overlay.showPause();
  }

  goToHome() {
    if (confirm("Restart game?")) {
      this.router.navigate(['/home']);
    }    
  }

}
