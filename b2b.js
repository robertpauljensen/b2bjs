/*jshint devel:true */

// create functions and define global variables
var queryWidth = 850;
var viewportHeight = $(window).height();
var viewportWidth = $(window).width();

// center arrow on home page
function centerArrow(){
	var $downArrow = $('.down-arrow');
	var arrowWidth = $downArrow.innerWidth();
	var sectionWidth = $('.home-page').innerWidth();
	$downArrow.css('left', ((sectionWidth - (arrowWidth+30))/2) + "px");
}

//collapse left column for mobile view
function collapseContent(){
	jQuery('div.col-right').each(function(){
		// slide Up
		$(this).velocity({ height: 0, opacity: 0 },{duration: 0, easing : "easeInSine", visibility: "hidden"}); });
}

//vertically/horz align design elements on home page and left columns (sections)
function alignElements(){
	// home page
	var $relativeContent = $(".relative-placement");

	$relativeContent.each(function() { 
		var el=$(this);
		var parent = el.parents('.full-section');
		var id = parent.attr('id');

		if (id === 'home-section' && viewportWidth > queryWidth){
			parent.css('height',viewportHeight + 'px');
			el.css('height',viewportHeight + 'px');
		} else {
			parent.css('height',viewportHeight + 'px');
			el.css({
				'top': ( (viewportHeight - el.innerHeight() )/2) + 'px'
			});
		}
		// chapters & pages
		$('.col-left').each(function(key){
			var $img = $(this).find('img');
			var imgH = $img.innerHeight();
			var slideH= $(this).innerHeight();
			var slideHeight = viewportHeight - $('.col-middle').outerHeight();

			// adjust height for mobile
			if ( viewportWidth < queryWidth){

				$(this).css('height',viewportHeight - 100 + "px");

				// adjust images (watercolor) for mobile
				if(key !== 4){
					$img.css('top',((slideH - imgH)/3) + "px");
				} else{
					$img.css('margin-top', "10px");
				}
			}

			// slider container
			if ( viewportWidth < queryWidth){
				$('.swiper-container').css('height', slideHeight + 'px');
			}
		});
	});
}

// replace <img src="image.svg"> to inline SVG
function replaceSVG(){
	jQuery('img.svg').each(function(){
		var $img = jQuery(this);
		var imgID = $img.attr('id');
		var imgClass = $img.attr('class');
		var imgURL = $img.attr('src');

		jQuery.get(imgURL, function(data) {
        // Get the SVG tag, ignore the rest
        var $svg = jQuery(data).find('svg');

        // Add replaced image's ID to the new SVG
        if(typeof imgID !== 'undefined') {
        	$svg = $svg.attr('id', imgID);
        }
        // Add replaced image's classes to the new SVG
        if(typeof imgClass !== 'undefined') {
        	$svg = $svg.attr('class', imgClass+' replaced-svg');
        }
       // Remove any invalid XML tags as per http://validator.w3.org
       $svg = $svg.removeAttr('xmlns:a');
        // Replace image with new SVG
        $img.replaceWith($svg);
    }, 'xml');
	});
}

// scaling and adding video to the background
function scaleVideo(){
    //save window height and width
    var scale;
    var video = $('#bg-video');
    //save video height and width
    var videoNativeHeight = $(video)[0].videoHeight;
    var videoNativeWidth = $(video)[0].videoWidth;
    //make scale factors with height and width
    var heightScaleFactor = viewportHeight/videoNativeHeight;
    var widthScaleFactor = viewportWidth/videoNativeWidth;
    //which is higher?
    if(heightScaleFactor<widthScaleFactor){
    	scale = widthScaleFactor;
    }else{
    	scale= heightScaleFactor;
    }

    var scaledVideoHeight = scale*videoNativeHeight;
    var scaledVideoWidth = scale*videoNativeWidth;
    console.log("videoWidth: " +  scaledVideoWidth + " videoHeight: " + scaledVideoHeight);
    video.height(scaledVideoHeight);
    video.width(scaledVideoWidth);
}



$(document).ready(function(){

	// center arrow animation on home page
	centerArrow();
	// add event for arrow...if someone clicks it, the page scrolls down to the problem section
	$('.down-arrow').click(function() {
		$('#problem-section').velocity("scroll", { duration: 300 });
	});

	// waypoints
	if(viewportWidth>queryWidth){

		$('.col-left > img').each(function(){
			var $el = $(this);
			var $slider = $el.parents('.row').find('.swiper-container');
			$el.css({
				'opacity':0,
				'visibility':'hidden'
			});
			var waypoint = new Waypoint({
				element: $(this),
				offset: '45%',
				handler: function() {
					// show title with spring animation ( spring = [1,1] )
					$el.velocity({ opacity: 1, top: [-60, [1,1]]},{ delay : 300, visibility: "visible"});
			    	$slider.slick('slickPlay');
			    	waypoint.disable();
			    }
			});
		});
		// waypoint for navigation toggle
		var navWaypoint = new Waypoint({
			// trigger at the bottom of the homepage title: "Transform your brand with music"
			element: $('.relative-placement h2'),
			handler: function() {
				console.log('trigger');
				$('nav').toggleClass('shrink-nav');
			}
		});
	}




	// lightbox
	
	if (viewportWidth>queryWidth){



	var configuration;// = $.featherlight.defaults;
	var mediaID = ["http://player.vimeo.com/video/100126080","http://player.vimeo.com/video/115010854","http://player.vimeo.com/video/112964858"];
	$('.lightbox-targetlink').each(function(key){
		//	console.log(key);
		//console.log(key % 3);
		// 0,1,2
		if (key % 3 === 1){
			$.featherlight.defaults.artistName = "Artist 3";
			$.featherlight.defaults.artistInfo = "Artists 1 Info here...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
			configuration = $.featherlight.defaults;
			$(this).featherlight($('#video'), configuration);

		} else if (key % 3 === 2){

			$.featherlight.defaults.artistName = "Artists 1";
			$.featherlight.defaults.artistInfo = "Artists 1 Info here...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
			configuration = $.featherlight.defaults;
			$(this).featherlight($('#video'), configuration);
		} else {

			$.featherlight.defaults.artistName = "Artists 2";
			$.featherlight.defaults.artistInfo = "Artists 2 Info here...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
			configuration = $.featherlight.defaults;
			$(this).featherlight($('#video'), configuration);
		}
		$(this).click(function() {
			if (key % 3 === 1){
				$('#video').attr('src',mediaID[0]);
			} else if (key % 3 === 2){
				$('#video').attr('src',mediaID[1]);
			} else {
				$('#video').attr('src',mediaID[2]);
			}
		});
	});
} else {
	$('a.lightbox-targetlink').each(function(){
		$(this).click(function(event) {
			event.preventDefault();
		});
	});
}



	// click to expand / collapse solution list...music licensing, tech, biz models, diff
	var $expandSection = $('#solution-expanded');
	// slideUp on load
	var expandedH = $expandSection.innerHeight();
	$expandSection.velocity({height: 0},{duration: 0, easing : "easeInSine", visibility: "hidden"} );


	$( 'a.slide-toggle-btn').click(function(e) {
		e.preventDefault();

		$('#solution-page').velocity("scroll", { duration: 400 });

		$( '#solution-expanded').velocity({height: 0 },{duration: 500, delay: 600, easing : "easeInSine", visibility: "hidden"});
		
		//complete: slideToggle(1000)
		$expandSection.toggleClass('section-active');
	});

	$('.solution-list a').click(function(e){
		e.preventDefault();
		var redirect = $(this).attr('href');

		if ($expandSection.hasClass('section-active')){
			 //console.log('already active');
			} else{
				$( '#solution-expanded' ).velocity(
					{height: expandedH},
					{
						duration: 800,
						easing : "easeInSine",
						visibility: "visible",
						complete: function() {
							$(redirect).velocity("scroll", { duration: 800 });
							$expandSection.toggleClass('section-active');
						}
					});

			}
		});

	$('div.hidden-solution').click(function(){
		$(this).toggleClass('expansion-active');
		if ( $(this).hasClass('expansion-active') ) {
			$( '#solution-expanded' ).velocity({height: expandedH, opacity: 1}, {duration: 800, visibility: "visible", complete: function() {$expandSection.toggleClass('section-active'); } });
		} else {
			$( '#solution-expanded' ).velocity({height: 0, opacity: 0}, {duration: 400, visibility: "hidden", complete: function() {$expandSection.toggleClass('section-active'); } });
		}
	});



// new swiper with Slick
$('.swiper-container').each(function(){
	var $el = $(this);
	if( viewportWidth > queryWidth){
		// desktop slider options
		$( this ).slick({
		arrows: false,
		dots: true,
		infinite: true,
		adaptiveHeight: false,
		autoplay: true,
		autoplaySpeed: 3000,
	});
	} else {
		// mobile slider options
		$( this ).slick({
		arrows: false,
		dots: true,
		infinite: false,
		adaptiveHeight: true,
		autoplay: false,
	});
	}
	

	
	// slick events
	// pause all slides to start
  	$(this).slick('slickPause');
  	console.log('start!');

  	// stop auto play after swiping
  	$( this ).on('swipe', function(event,slick){
  		console.log('swiped');

  			$('.artists-slider').slick('slickPause');
  			
  			//console.log(slick)
  	});
	// On before slide change, get height of next slide
	// $( this ).on('beforeChange', function(event, slick, currentSlide, nextSlide){
	// //console.log(slick);
	//   console.log( $(this).find( "[data-slick-index='" + nextSlide + "']" ).innerHeight() );
	//   var newSlideHeight = $(this).find( "[data-slick-index='" + nextSlide + "']" ).innerHeight();
	//   	$(this).parents('div.col-right').velocity({
	// 		height: newSlideHeight + 50,
	// 	},{
	// 		duration: 300
	// 	}); // end of velocity function
	// }); // end of slick event
}); // end of each function



$('.quotes-artists').slick({
	arrows: true,
	prevArrow: '<img class="quote-arrow prev-arrow" src="img/left-arrow.png" style="inline-block">',
	nextArrow: '<img class="quote-arrow next-arrow" src="img/right-arrow.png" style="inline-block">',
	dots: false,
	infinite: true,
	draggable: true,
	autoplay: true,
	autoplaySpeed: 6000,
	adaptiveHeight: true
});
$('a.library-genre-link').click(function(e) {
	e.preventDefault();
	var linkTarget = $(this).attr('index');
	$('#library-section').find('.swiper-container').slick('slickGoTo', linkTarget);
});

$('a.slider-link').click(function(e) {
	e.preventDefault();
	var linkTarget = $(this).attr('href');
	$('#artists-section').find('.swiper-container').slick('slickGoTo', linkTarget);
});

	// adjustments: replace img.svg w inline SVG && align section witdth/heights
	replaceSVG();
	alignElements();


	// hover effect for SVG elements in footer
	$('.social-links li').hover(function() {
		var el = $(this);
		var svg = el.find('svg path, .svg polygon');
		svg.attr('fill', '#CCC');
	}, function() {
		var el = $(this);
		var svg = el.find('svg path, .svg polygon');
		svg.attr('fill', '#3A3A3A');
	});

	//video
	var $videoLayer = $('#video-placement');
	if(viewportWidth>queryWidth){
		console.log('play video');
		$videoLayer.prepend('<video id="bg-video" loop autoplay muted></video>');
		$videoLayer.find('video').prepend('<source src="video/bgVideo-converted.mp4" type="video/mp4">');
	}

	var video = $('#bg-video');
	var bg = $('#video-placement');

	if(viewportWidth>queryWidth){

		video.on('loadedmetadata', scaleVideo);
		$(window).on('resize', scaleVideo);

	} else {
			// video.attr({
			// 	alt: "jQuery"
			// });
bg.addClass('background-image');
}


	// problem animation

	var xPos = 0;
	var $item =$('#animation');
	var rules = {
		startingXpos: 0,
		resetAt: 0,
		stopAt: -2000,
		vertical: 'top'
	};
	var start;



	if (viewportWidth > queryWidth){
		setInterval(function() {
			if(start){
				xPos = rules.startingXpos;
				start = false;
			}
			xPos -= 500;

			if(xPos === rules.stopAt){
				xPos = rules.resetAt;
			}
			$item.css({
				'background-position':xPos+'px ' +rules.vertical
			});
		}, 100);
	}



	var problemText = [
	{
		title : "The Vision",
		description: "You have an idea of how to enhance your services and build stronger customer relationships through music. It should be easy to find perfectly reasonable business partners that are interested in making a deal, but it's not."},
		{
			title : "The Obstacles",
			description: "The problem is sytematic. Barriers are in every step of the process. Traditional licensing and technology solutions are time consuming and expensive. You are competing with free music content. Differentiation and sound business models seem elusive at best when it comes to music licesning and content delivery."},
			{
				title : "Our Solution",
				description: "BAMM.tv removes the barriers with a straightforward approach to licensing and distributing original music programming that provides major networks and carriers with the opportunity to dramatically transform their customer relationships. We provide a deep library of curated, one-of-a-kind content that can be made to order for your specific needs. By streamlining the process and leveraging the latest technology, BAMM.tv offers a music business model that is powerful, exciting, and logical."}
				];

				function changeProblemContent(name){
					var $title = $('.problem-title');
					var $description = $('.problem-description');
			// mobile animation
			var $animation = $('.mobile-animation');
			var $copy = $('.problem-copy');
			// targets for content swapping
			var index;
			var imageSrc;
			if (name === "Vision"){index = 0; imageSrc = "img/b2b-animation-a.gif";}
			if (name === "Obstacles"){index = 1; imageSrc = "img/b2b-animation-b.gif";}
			if (name === "Solution"){index = 2; imageSrc = "img/b2b-animation-c.gif";}
			$title.css('opacity',0);
			$description.css('opacity',0);
			$animation.css('opacity',0);
			//$copy.velocity({ height: 100 },{duration: 300, easing : "easeInSine"}); 
			setTimeout(function(){

				$title.text(problemText[index].title);
				$description.text(problemText[index].description);
				$animation.attr('src', imageSrc);
				var newHeight = $description.innerHeight();
				console.log(newHeight);
				$copy.velocity({ height: newHeight + 30},{duration: 300, easing : "easeInSine"}); 
			},500);
			setTimeout(function(){
				$title.css('opacity',1);
				$description.css('opacity',1);
				$animation.css('opacity',1);
			},800);
		}

		$('a.flash-btn').click(function() {
			$(this).removeClass('flash-btn');
		});

	// problem-list (animation)
	$('.problem-list a').click(function(e) {
		e.preventDefault();
		$(this).parent().find('.flash-btn').removeClass('flash-btn');
	});

	var $first = $('.first'),
	$second= $('.second'),
	$third = $('.third');


	$('.problem-list a').click(function(){
		var $el = $(this);
		if ($el.hasClass('active-problem-link')){
				////console.log('already active');
			} else{
				$el.parents('.problem-list').find('.active-problem-link').removeClass('active-problem-link');
				$el.addClass('active-problem-link');
				var name = $el.text();
				changeProblemContent(name);
			}
			start=true;
			return start;
		});

	if (viewportWidth > queryWidth){

		$first.on('click',function(){
			rules = {
				startingXpos: 0,
				resetAt: 0,
				stopAt: -2000,
				vertical: 'top'
			};
			return rules;
		});
		$second.click(function(){
			rules = {
				startingXpos: -2000,
				resetAt: -4000,
				stopAt: -5500,
				vertical: 'top'
			};
			return rules;
		});

		$third.click(function(){
			rules = {
				startingXpos: 0,
				resetAt: -9000,
				stopAt: -12500,
				vertical: 'bottom'
			};
			return rules;
		});
		//mobile version
	} else {
			// $first.on('click',function(){
			// 	rules = {
			// 		startingXpos: 0,
			// 		resetAt: 0,
			// 		stopAt: -2000,
			// 		vertical: 'top'
			// 	};
			//   return rules;
			// });
			// $second.click(function(){
			// 	rules = {
			// 		startingXpos: -2000,
			// 		resetAt: -4000,
			// 		stopAt: -5500,
			// 		vertical: 'top'
			// 	};
			// 	return rules;
			// });

			// $third.click(function(){
			// 	rules = {
			// 		startingXpos: 0,
			// 		resetAt: -9000,
			// 		stopAt: -12500,
			// 		vertical: 'bottom'
			// 	};
			// 	return rules;
			// });
}



	// slide toggle for mobile sections
	if(viewportWidth < queryWidth){
		collapseContent();
	}
	//var textArray= [];
	$('.col-middle').each(function(key){
		var $link = $(this).find('a');
		
		//console.log($middleSection);
		$link.parents('.col-middle').append('<span class="instruction-middle">Tap again to collapse</span>');
		var $direction = $link.parents('.col-middle').find('.instruction-middle');
		$direction.css('visibility', 'hidden');
		$link.click(function(event) {
			var $middleSection = $(this).parents('.col-middle');
			var scrollTo = $(this).parent();
			console.log(event);
			event.preventDefault();


			var $content = $(this).parents('.row').find('div.col-right');
			$content.toggleClass('mobile-expanded');

			if ( $content.hasClass('mobile-expanded') ){
					// expanding content
					$link.toggleClass('active-middle-link');

					// expand the slider below
					$content.velocity({
						height: viewportHeight,
						opacity: 1
					},{
						duration: 800,
						visibility: "visible",
						complete:function(){
							$link.velocity({ "padding-bottom" : 40},{ duration: 300});
							$direction.velocity({"opacity" : 1 },{duration: 400, visibility: "visible"});
							$content.velocity("scroll", { duration: 500 });
						}
					});

					// $content.find('div.slick-list').css('width', function(){
					// 	$(this).css('height', viewportHeight + 'px');
					// });

				} else {
					// collapsing content



					$link.toggleClass('active-middle-link');
					$content.velocity({
						height: 0,
						opacity: 0
					},{
						duration: 300,
						visibility: "hidden",
						begin: function(){scrollTo.velocity("scroll", { duration: 500 });},
						complete: function(){
							// original padding
							$link.velocity({ "padding-bottom" : 15},{ duration: 300});
							// remove direction to user
							$direction.velocity({"margin-top": "0px", "opacity" : 0 },{duration: 200, easing : "easeInSine", visibility: "hidden"} );
						}
					});

				}
			}); // end of click function
	}); // end of each function





}); // end of ready function


// window resize
$( window ).resize(function() {
	viewportHeight = $(window).height();
	viewportWidth = $(window).width();

	if (viewportWidth < queryWidth){
		////console.log('collapse');
		collapseContent();
	} else{
		jQuery('div.col-right').each(function(){
		// slide Up
		$(this).css({
			'opacity':1,
			'padding-top': 0
		});
		$(this).velocity({ height: 700},{duration: 0, visibility: "visible"}); });
		

	}

	alignElements();
	centerArrow();
});



//smooth scrolling or instant scrolling

$('a[href*=#]:not([href=#])').click(function() {
	if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') || location.hostname === this.hostname) {

		if ($(this).attr('href') === '#footer'){
				//console.log('yeah');
			} else {
				var target = $(this.hash);
				target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
				if (target.length) {
					target.velocity("scroll", { duration: 1000 });
					return false;
				}
			}
		}
	});