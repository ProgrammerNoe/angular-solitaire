import { Component, OnInit } from '@angular/core';

declare var $: any;
declare var timer: any;

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})

export class TimerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  pauseGame() {
    $('#solitaire-timer').timer('pause');
    $("#overlay").removeClass("hidden");
    $("#overlay-pause").removeClass("hidden");
  }

}
