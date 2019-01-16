import { Component, OnInit } from '@angular/core';

declare var $: any;
declare var timer: any;

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.css']
})

export class OverlayComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onContinueGame() {
    $('#solitaire-timer').timer('resume');
    $("#overlay").addClass("hidden");
    $("#overlay-rules").addClass("hidden");
    $("#overlay-content").addClass("hidden");
    $("#overlay-pause").addClass("hidden");
  }

}


