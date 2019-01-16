import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Card } from '../card';

declare var $: any;
declare var timer: any;

@Component({
  selector: 'app-play-area',
  templateUrl: './play-area.component.html',
  styleUrls: ['./play-area.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class PlayAreaComponent implements OnInit {

  cards : Card[];
  maneuver: Card[][];

  constructor() {
    this.cards = [];
    this.maneuver = [];
  }

  //create card objects then shuffle
  ngOnInit() {
	let suitColors = {'♦': 'red', '♥': 'red', '♠': 'black', '♣': 'black'};
    let rankValues = {'13': 'K', '12': 'Q', '11': 'J', '10': '10', '9': '9', '8': '8', '7': '7', '6': '6', '5': '5', '4': '4', '3': '3', '2': '2', '1': 'A',};
    for (let rankValue of Object.keys(rankValues)) {
      for (let suit of Object.keys(suitColors)) {
        this.cards.push({
          rank: rankValues[rankValue],
          rankValue: rankValue,
          suit: suit,
          suitColor: suitColors[suit],
          flipped: true
        });
      }
    }
    this.shuffle();
    this.dealCards();
  }

  //shuffle cards
  shuffle(){
    let deck = this.cards;
    let currentIndex = deck.length;
	let temporaryValue;
	let randomIndex ;

	while (currentIndex !== 0) {
		//get random element
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		//swap element with current element
		temporaryValue = deck[currentIndex];
		deck[currentIndex] = deck[randomIndex];
		deck[randomIndex] = temporaryValue;
	}

	return deck;
  }

  dealCards(){
    //add empty array place holder for maneuver
    for (let i = 0; i < 7; i++){
        this.maneuver.push([]);
    }

    let cardCount = 0;
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
            let k = this.maneuver[j].length;
            if (k <= j) {
                //Only add cards to the stack when content is less than or equal the column number
                let cardObj = this.cards.shift();
 console.log(cardObj)
                if (k == j) {
                    //Turn up the card if it's the last card for the column
                    cardObj.flipped = false;
                } 
                this.maneuver[j].push(cardObj);				
                cardCount++;
            }
        }
    }
  }

  ngAfterViewInit() {
	startTimer();
  }

}

function startTimer() {
	$('#solitaire-timer').timer('remove');
	$('#solitaire-timer').timer({
		format: '%M:%S',
		duration: '10m',
		countdown: true,
		callback: function() {			
			$("#overlay").removeClass("hidden");
			$("#overlay-times-up").removeClass("hidden");
			$("#overlay-content").addClass("hidden");
		}
	});
}