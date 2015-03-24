(function($) {

    /*
     * jSwipe - jQuery Plugin
     * http://plugins.jquery.com/project/swipe
     * http://www.ryanscherf.com/demos/swipe/
     *
     * Copyright (c) 2009 Ryan Scherf (www.ryanscherf.com)
     * Licensed under the MIT license
     *
     * $Date: 2009-07-14 (Tue, 14 Jul 2009) $
     * $version: 0.1.2
     * 
     * This jQuery plugin will only run on devices running Mobile Safari
     * on iPhone or iPod Touch devices running iPhone OS 2.0 or later. 
     * http://developer.apple.com/iphone/library/documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html#//apple_ref/doc/uid/TP40006511-SW5
     */

	$.fn.swipe = function(options) {
		
		// Default thresholds & swipe functions
		var defaults = {
			threshold: {
				x: 30,
				y: 10
			},
			swipeLeft: function() { alert('swiped left') },
			swipeRight: function() { alert('swiped right') }
		};
		
		var options = $.extend(defaults, options);
		
		if (!this) return false;
		
		return this.each(function() {
			
			var me = $(this)
			
			// Private variables for each element
			var originalCoord = { x: 0, y: 0 }
			var finalCoord = { x: 0, y: 0 }
			
			// Screen touched, store the original coordinate
			function touchStart(event) {
				//console.log('Starting swipe gesture...')
				originalCoord.x = event.targetTouches[0].pageX
				originalCoord.y = event.targetTouches[0].pageY
			}
			
			// Store coordinates as finger is swiping
			function touchMove(event) {
			    event.preventDefault();
				finalCoord.x = event.targetTouches[0].pageX // Updated X,Y coordinates
				finalCoord.y = event.targetTouches[0].pageY
			}
			
			// Done Swiping
			// Swipe should only be on X axis, ignore if swipe on Y axis
			// Calculate if the swipe was left or right
			function touchEnd(event) {
				//console.log('Ending swipe gesture...')
				var changeY = originalCoord.y - finalCoord.y
				if(changeY < defaults.threshold.y && changeY > (defaults.threshold.y*-1)) {
					changeX = originalCoord.x - finalCoord.x
					
					if(changeX > defaults.threshold.x) {
						defaults.swipeLeft()
					}
					if(changeX < (defaults.threshold.x*-1)) {
						defaults.swipeRight()
					}
				}
			}
			
			// Swipe was started
			function touchStart(event) {
				//console.log('Starting swipe gesture...')
				originalCoord.x = event.targetTouches[0].pageX
				originalCoord.y = event.targetTouches[0].pageY

				finalCoord.x = originalCoord.x
				finalCoord.y = originalCoord.y
			}
			
			// Swipe was canceled
			function touchCancel(event) { 
				//console.log('Canceling swipe gesture...')
			}
			
			// Add gestures to all swipable areas
			this.addEventListener("touchstart", touchStart, false);
			this.addEventListener("touchmove", touchMove, false);
			this.addEventListener("touchend", touchEnd, false);
			this.addEventListener("touchcancel", touchCancel, false);
				
		});
	};

    /*
     * HTML Slideshow
     * Author: Rob Flaherty | rob@ravelrumba.com
     * Copyright (c) 2011 Rob Flaherty 
     * MIT Licensed: http://www.opensource.org/licenses/mit-license.php
     */
   
    window.htmlSlides = {
  
      //Vars
      currentSlide: 1,
      slideHash: location.hash,
      deck: null,
      slideCount: null,
      prevButton: null,
      nextButton: null,
      slideNumber: null,
      
      init: function(options) {
        var defaultSettings = {
          displayToolbar: false,
          hideToolbar: true,
        },
  
        settings = $.extend({}, this.defaultSettings, options),
    
        base = this;

        this.deck = $('#deck');
        this.slideCount = $('#deck > section').size();
        this.prevButton = $('#prev-btn');
        this.nextButton = $('#next-btn');
        this.slideNumber = $('#slide-number');
        
        //Add ids and classes to slides
        $('#deck > section').each(function(index, el) {
          $el = $(el);
          $el.attr('id', 'slide' + (index +1));
          $el.addClass('slide');     
        });

        //Set total slide count in header
        $('#slide-total').html(this.slideCount);
      
        //Check for hash and validate value    
        if (this.slideHash && (parseInt((this.slideHash.substring(1)), 10) <= this.slideCount)) {
          this.currentSlide = parseInt(this.slideHash.replace('#', ''), 10);
        }

        if (settings.displayToolbar && settings.hideToolbar) {
          $('header').css('display', 'block'); // default is none
          setTimeout(function(){
            $('header').fadeTo(300, 0);
          }, 1500);

          $('header').hover(
            function() {
              $('header').fadeTo(300, 1);
            },
            function() {
              $('header').fadeTo(300, 0);
            }
          );
        }
      
        //Bind control events
        this.prevButton.bind('click', $.proxy(this, 'prevSlide'));
        this.nextButton.bind('click', $.proxy(this, 'showActions'));
        $('html').bind('keydown', $.proxy(this, 'keyControls'));
      
        //Set initial slide
        this.changeSlide(this.currentSlide);
    
        //Ensure focus stays on window and not embedded iframes/objects
        $(window).load(function() {
          this.focus();
        });
 
        //Swipe gestures
        $('.slide').swipe({
          threshold: {
            x: 20,
            y: 30
          },
          swipeLeft: function() {
            base.showActions.apply(base);
          },
          swipeRight: function() {
            base.prevSlide.apply(base);
          },
        });    

      },    
  
      //Change slide
      changeSlide: function(id) {
        var slideID = '#slide' + id;        
    
        //Update slide classes
        this.deck.find('.slide-selected').removeClass('slide-selected');
        $(slideID).addClass('slide-selected');
      
        //Update toolbar
        this.slideNumber.html(this.currentSlide);
    
        //Update hash      
        location.hash = id;
    
        //Trigger newSlide event
        this.newSlideEvent(id);
    
        //Hide arrows on first and last slides
        if ((id != 1) && (id != this.slideCount)) {
          this.prevButton.css('visibility', 'visible');
          this.nextButton.css('visibility', 'visible');
        } else if (id == 1) {
          this.prevButton.css('visibility', 'hidden');
        } else if (id == this.slideCount) {
          this.nextButton.css('visibility', 'hidden');
        }
      },
  
      //Next slide
      prevSlide: function() {
        if (this.currentSlide > 1) {
          this.currentSlide--;
          this.changeSlide(this.currentSlide);
        }     
      },
  
      //Previous slide
      nextSlide: function() {
        if (this.currentSlide < this.slideCount) {
          this.currentSlide++;
          this.changeSlide(this.currentSlide); 
        }
      },
  
      //Reveal actions
      showActions: function() {        
        var actions = $('.slide-selected').find('.action'),
          actionOns;
      
        //If actions exist
        if (actions.length > 0) {
          actions.first().removeClass('action').addClass('action-on').fadeIn(250);
          
          //Number of current action
          actionOns = $('.slide-selected').find('.action-on');
          
          //Trigger newAction event
          $('html').trigger("newAction", actionOns.length );
        } else {
          this.nextSlide();
        }
      },
  
      newSlideEvent: function(id) {
        $('html').trigger('newSlide', id);
      },

      resetActions: function() {
        $('.slide-selected')
            .find('.action-on')
            .removeClass('action-on')
            .addClass('action')
            .hide();
      },
        
      //Keyboard controls
      keyControls: function(event) {
        switch(event.keyCode) {
          //Right, down, spacebar, and page down keys
          case 32:
          case 34:
          case 39:
          case 40:
            this.showActions();
            break;
          //Left, up, and page up keys
          case 33:
          case 37:
          case 38:
            this.prevSlide();
            break;
          //Esc
          case 27:
            this.resetActions();
            break;
        }
      }
    };

})(jQuery);