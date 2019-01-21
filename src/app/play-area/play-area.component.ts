import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Card } from '../card';
import { OverlayComponent } from '../overlay/overlay.component';

declare var $: any;

@Component({
  selector: 'app-play-area',
  templateUrl: './play-area.component.html',
  styleUrls: ['./play-area.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class PlayAreaComponent implements OnInit {

  cards : Card[];
  wastePile: Card[];
  maneuver: Card[][];
  @ViewChild(OverlayComponent) overlay :OverlayComponent;

  constructor() {
    this.cards = [];
    this.wastePile = [];
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
    loadUI();
  }

}

// ------- DRAG AND DROP -------

function loadUI() {
	//original position before dragging
	var startPos;
	//holder for z-indexes, for use in waste pile
	var zIndexes = new Object();
	
	$('#deck .card').droppable({
        disabled: true
    });
	
    $('#main .flipped').droppable({
        disabled: true
    });

    $('#main .main-stack:has(.card)').droppable({
        disabled: true
    });	
		
	//DRAGGABLE
    $('.card').draggable({
        start: function (event, ui) {
			startPos = ui.helper.position();
			
			//On drag start check each stack for an empty stack and disable dropping
            $('.main-stack').each(function () {
                if (!$(this).find('.card').length) {
                    $(this).droppable('option', 'disabled', false);
                }
            });

        },
        revert: function (event, ui) {
			//from talon
            if ($(this).hasClass('on-discard-pile')) {
				//reset z-index if from talon
				var cardString = $(this).data('number') + $(this).data('suit');		
				$(this).css('z-index', zIndexes[cardString]);
            }

			$(this).data('ui-draggable').originalPosition = {
				top : startPos.top,
				left : startPos.left
			};
			
			return !event;
        },
        scroll: false,
        stack: '#main .card',
        distance: 5,
        disabled: false,
        revertDuration: 200
    });
	
	//DROPPABLE
    $('.drop-area').droppable({
        drop: function (event, ui) {
			
            // If dropping to foundation stack
            if ($(this).hasClass('ordered-stack') && !$(ui.draggable).hasClass('flipped')) {
                
				//Check if ordered stack pile is not empty, meaning card not ace
                if ($(this).hasClass('has-cards')) {
                    // Check if it matches suit
                    if ($(this).data('top-card-suit') === ui.draggable.data('suit')) {
                        // Check if the top card number is one below the current draggable
						if (parseInt($(this).attr('data-top-card-number')) == (ui.draggable.data('number') - 1)) {
							var zIndex = $(this).data('top-index') + 1;							
							$(ui.draggable)
                                .detach()
                                .css({top: 0, left: 0, 'z-index': zIndex})
                                .appendTo($(this))
                                .removeClass('on-discard-pile')
                                .removeClass('drop-area')
                                .addClass('top-card')
								.droppable('option', 'disabled', true);
                            
                            // Update top card attributes
                            $(this).attr('data-top-card-number', ui.draggable.data('number'));
                            $(this).attr('data-top-card-suit', ui.draggable.data('suit'));
							$(this).attr('data-top-index', zIndex);
                        } else {
							$(ui.draggable).animate({top: startPos.top, left: startPos.left});
                        }
                    } else {
                        $(ui.draggable).animate({top: startPos.top, left: startPos.left});
                    }
					
				// If ordered stack is empty, the card must be an ace
                } else {
                    // Check if the current draggable is an ace
                    if (ui.draggable.data('number') === 1) {
                        // Check that we're not moving an ace from an ordered stack to an empty ordered stack
                        if (!$(ui.draggable).closest('.ordered-stack').length) {
                            $(ui.draggable)
                                .detach()
                                .css({top: 0, left: 0})
                                .appendTo($(this))
                                .removeClass('on-discard-pile')
                                .droppable('option', 'disabled', true);

                            // Update top card number and suit
                            $(this).attr('data-top-card-number', ui.draggable.data('number'));
                            $(this).attr('data-top-card-suit', ui.draggable.data('suit'));
							$(this).attr('data-top-index', $(ui.draggable).css("z-index"));
                            $(this).addClass('has-cards');
                        } else {
                            $(ui.draggable).animate({top: startPos.top, left: startPos.left});
                        }
                    } else {
                         $(ui.draggable).animate({top: startPos.top, left: startPos.left});
                    }
                }

            // If dropping to a main stack
            } else if (!$(ui.draggable).hasClass('flipped')) {

                // If dropping from an ordered stack to a main stack
                if ($(ui.draggable).closest('.ordered-stack').length && $(this).closest('.main-stack').length) {
                    // Update top card number and suit
                    $(ui.draggable).closest('.ordered-stack').attr('data-top-card-number', (ui.draggable.data('number') - 1));
                    $(ui.draggable).closest('.ordered-stack').attr('data-top-card-suit', ui.draggable.data('suit'));
                }

                // Check if not dragging a King to an empty stack
                if (ui.draggable.data('number') !== 13 && !$(this).hasClass('main-stack')) {

                    // Check if an alternate color and one card lower in value
                    if (parseInt($(this).data('number')) === (ui.draggable.data('number') + 1) && ui.draggable.data('color') !== $(this).data('color')) {

                        $(ui.draggable)
                            .detach()
                            .css({'top': '2rem', 'left': 0})
                            .appendTo($(this))
                            .removeClass('on-discard-pile')
                            .addClass('top-card')
                            .droppable('option', 'disabled', false);
                    } else {                        
						$(ui.draggable).animate({top: startPos.top, left: startPos.left});
                    }

                // Dragging a King to an empty stack
                } else if (ui.draggable.data('number') === 13 && $(this).hasClass('main-stack')) {
                     $(ui.draggable)
                        .detach()
                        .css({top: 0, left: 0})
                        .appendTo($(this))
                        .removeClass('on-discard-pile')
                        .addClass('top-card')

                    $(this).droppable('option', 'disabled', true);

                    $(ui.draggable).droppable('option', 'disabled', false);

                // Dragging any other card to an empty stack
                } else {
                    $(ui.draggable).animate({top: startPos.top, left: startPos.left}); 
                }
            } else {
                $(ui.draggable).animate({top: startPos.top, left: startPos.left});
            }
            checkForWin();
        },
        tolerance: 'intersect',
        greedy: true
    });
	
	$('#main .flipped').draggable({
        disabled: true
    });	
	
	//flip face down cards when clicked
	$('#main').on('click', '.card.flipped', function (e) {
        // if top card was clicked, flip
        if (!$(this).next().length) {
            $(this)
                .removeClass('flipped')
                .removeClass('ui-draggable-disabled')
                .removeClass('ui-droppable-disabled')
                .addClass('top-card');
            
            //if the only child in the stack
            if ($(this).is(':only-child')) {
                $(this).closest('.main-stack').droppable('option', 'disabled', true);
            }

            $(this).draggable('option', 'disabled', false);
            $(this).droppable('option', 'disabled', false);
        }
    });
	
	//flip cards in waste pile
	var z = 1;
	$('#deck .card.flipped').on('click', function(e, i) {
		i = (i === undefined) ? 2 : --i;
		if (!$(this).hasClass('dropped')) {
			$(this)
                .addClass('on-discard-pile')
                .addClass('dropped')
                .css({'z-index': z})
                .removeClass('flipped');
				
			var cardString = $(this).data('number') + $(this).data('suit');
            zIndexes[cardString] = z;		
				
			$(this).animate({left: '7rem'}, 300, function () {
				if (i > 0) {
					$('#deck .card.flipped').last().trigger("click", [i])
				}
			});
			z++;
		}
	});	
    
	//reuse waste pile
    $('.no-cards').on('click', function() {
		$('#deck .card').addClass('flipped').removeClass('dropped').addClass('on-discard-pile').css({top: 0, left: 0});
		//reset z-indexes after animation
		setTimeout(function () {
			$('#deck .card').css({'z-index': '1'});
		}, 600);
    });	

}

function checkForWin() {

	// Check if all cards have been flipped over
	if (!$('#playArea .flipped').length) {
		var gameWon = true;
		// Check until all ordered stacks have a K on top
		$('.ordered-stack').each(function (i, el) {
			if (parseInt($(el).attr('data-top-card-number'), 10) !== 13) {
				gameWon = false;
				return false;
			}
		});
		
		if (gameWon) {
			this.overlay.showWin();
		}
	}
}

// ------- DRAG AND DROP -------
