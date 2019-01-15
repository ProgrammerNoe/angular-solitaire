import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Card } from '../card';

@Component({
  selector: 'app-play-area',
  templateUrl: './play-area.component.html',
  styleUrls: ['./play-area.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PlayAreaComponent implements OnInit {

  cards : Card[] = [];

  constructor() {
  }

  //create card objects then shuffle
  ngOnInit() {
	  var suitColors = {'♦': 'red', '♥': 'red', '♠': 'black', '♣': 'black'};
    var rankValues = {'13': 'K', '12': 'Q', '11': 'J', '10': '10', '9': '9', '8': '8', '7': '7', '6': '6', '5': '5', '4': '4', '3': '3', '2': '2', 'A': '1',};
    for (let rankValue of Object.keys(rankValues)) {
      for (let suit of Object.keys(suitColors)) {
        this.cards.push({
          rank: rankValues[rankValue],
          rankValue: rankValue,
          suit: suit,
          suitColor: suitColors[suit],
        });
      }
    }
    shuffle(this.cards);
  }

}

//shuffle a list of objects
function shuffle(arr) {
	var currentIndex = arr.length;
	var temporaryValue;
	var randomIndex ;

	while (currentIndex !== 0) {
		//get random element
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		//swap element with current element
		temporaryValue = arr[currentIndex];
		arr[currentIndex] = arr[randomIndex];
		arr[randomIndex] = temporaryValue;
	}

	return arr;
}
