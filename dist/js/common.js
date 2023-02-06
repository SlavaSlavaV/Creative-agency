$(function () {

	// form validation

	$("#subscribe").validate({
		rules: {
			usmail: {
				required: true,
				email: true,
			}
		},
		messages: {
			usmail: {
				required: "Email - required!",
				email: "name@domain.com"
			}
		},
		submitHandler: function(form) {
			$.ajax({
				type: "POST",
				url: "php/mail.php",
				data: $(form).serialize(),
				success: function() {
						$('#submit').magnificPopup({
						type: 'inline',
						preloader: false,
						modal: true
					});
					$(document).on('click', '.popup-valid__dismiss', function (e) {
						e.preventDefault();
						$.magnificPopup.close();
					});
					setTimeout(function() {
						$(form).trigger("reset");
					}, 1000);
				}
			});	
		},	
		focusCleanup: true,
	});
	
	$.validator.methods.email = function( value, element ) {
		var regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return this.optional( element ) || regexp.test(value);
	};

	// scroll up

	$(window).scroll(function () {
		if ($(this).scrollTop() > 300) {
			$('#scrollup').fadeIn();
		} else {
			$('#scrollup').fadeOut();
		}
	});

	$('#scrollup').click(function () {
		$("html, body").animate({ scrollTop: 0 }, 1500);
		return false;
	});

	//preloader 

	$("#preloader").introLoader({

		animation: {
				name: 'simpleLoader',
				options: {
					exitFx:'slideUp',
					ease: "easeOutSine",
					style: 'light',
					delayBefore: 1500, //delay time in milliseconds
					exitTime: 500,
					onBefore: function() {
							$('#onAfterExample').hide();
					},
					onAfter: function() {
							$('#onAfterExample').fadeIn();
					}
				}
		},
		spinJs: {
				lines: 12, // The number of lines to draw
				length: 20, // The length of each line
				radius: 20, // The radius of the inner circle
				width: 4, // The line thickness
				color: '#f38181', // Spiner colory
		}

	});
	
	// stop preloader in firefox, IE
	
	var loader = $('#preloader').data('introLoader');
			loader.stop();
	
	// Menu toggle

	$('.top-line').on('click', function (event) {
		event.preventDefault();
		if (event.target.closest('.menu-toggle')) {
			$(this).toggleClass('menu-open');
			$('.top-menu').toggleClass('open-list');
		}
		else if (event.target.closest('.top-menu__link')) {
			$(this).removeClass('menu-open');
			$('.top-menu').removeClass('open-list');
		}
	});

	//Smooth page scrolling by anchors

	$('.top-menu').on('click', 'a', function (event) {
		event.preventDefault();
		var id = $(this).attr('href');
		var	top = $(id).offset().top;
		$('body, html').animate({scrollTop: top}, 1000);
	});

	//Open search form

	$('.search').on('click',function(){
		$('.search-form').addClass('open');
		$('.close, .search-form__input').fadeIn(500);
	});
	
	$('.close').on('click',function(){
		$('.search-form').removeClass('open');
		$('.close, .search-form__input').fadeOut(500);
	});

	// Owl-carousel	

	// top slider	

	$('.header-carousel').owlCarousel({
		loop: true,
		autoWidth: true,
		items: 1,
		center: true,
		responsiveClass: true,
		smartSpeed: 700,
		animateOut: 'fadeOut',
		autoplay: true,
		autoplayTimeout: 5000,
		autoplayHoverPause: true	
	});

	// quotes slider	
	
	var owl = $('#owl-quotes'),
			prev = $('.owl-controls__angle_prev'),
			next = $('.owl-controls__angle_next');
			
	owl.owlCarousel({
		loop: true,
		items: 1,
		center: true,
		dots: false,
	});

	next.on('click', function () {
		owl.trigger('next.owl.carousel', [700]);
	});
	
	prev.on('click', function () {
		owl.trigger('prev.owl.carousel', [700]);
	});

	// testimonials slider

	var owlTsm = $('#owl-testimonials'),
		prevTsm = $('.owlTsm-controls__angle_prev'),
		nextTsm = $('.owlTsm-controls__angle_next');
			
	owlTsm.owlCarousel({
		loop: true,
		items: 1,
		center: true,
		dots: false,
	});

	nextTsm.on('click', function () {
		owlTsm.trigger('next.owl.carousel', [700]);
	});
	
	prevTsm.on('click', function () {
		owlTsm.trigger('prev.owl.carousel', [700]);
	});

	//Animate number, jQuery-spincrement plugin
	
	function countup(className) {
		var countBlockTop = $('.' + className).offset().top;
		var windowHeight = window.innerHeight;
		var show = true;
	
		$(window).scroll(function () {
			if (show && (countBlockTop < $(window).scrollTop() + windowHeight)) {
				show = false;
	
				$('.' + className).spincrement({
					from: 0,
					duration: 4000,
					easing: 'easeOutExpo'
				});
			}
		})
	}
	
	$(function () {
		countup("count-1", $(".count-1").text());
		countup("count-2", $(".count-2").text());
		countup("count-3", $(".count-3").text());
		countup("count-4", $(".count-4").text());
		countup("count-5", $(".count-5").text());
	});
	
	
	//Accordion slider

	$('#slidorion').slidorion({
		autoPlay: false,
		effect: 'overRandom',
	});

	//Srollbar plugin jQuery.Nicescroll

	$('.content').niceScroll({
		cursorcolor: "#95e1d3",
		cursorwidth: 7,
		cursoropacitymin: 1,
		cursorminheight: 15,
		railpadding: {top:14,right:14,left:0,bottom:14},
		touchbehavior: true,
		mousescrollstep: 30,
		horizrailenabled: false
	});

//Magnific popap gallery
	
	// $('#work').width(document.documentElement.clientWidth); 

	$('.gallery').magnificPopup({
		mainClass: 'mfp-zoom-in mfp-img-mobile',
		delegate: 'a',
		type: 'image',
		tLoading: '',
		fixedContentPos: false, // если true-posit: fixed, уйдет полоса прокрутки
		closeBtnInside: false, // положение кнопки закрытия
		closeOnBgClick: true, // закрывает окно, при нажатии на темное наложение
		gallery:{
			enabled:true,
			preload: [0, 1]
		},
		zoom: {
			enabled: true,
			duration: 300, // don't foget to change the duration also in CSS
			opener: function(openerElement) {
				return openerElement.is('a') ? openerElement : openerElement.find('a');
			}
		},
		image: {
			verticalFit: true,
			tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
			titleSrc: function(item) {
				return item.el.attr('title') + '<small>by Creative Agency Tajam</small>';
			}
		},
		removalDelay: 300,
		callbacks: {
			beforeChange: function() {
				this.items[0].src = this.items[0].src + '?=' + Math.random(); 
			},
			open: function() {
				$.magnificPopup.instance.next = function() {
					var self = this;
					self.wrap.removeClass('mfp-image-loaded');
					setTimeout(function() { $.magnificPopup.proto.next.call(self); }, 300);
				}
				$.magnificPopup.instance.prev = function() {
					var self = this;
					self.wrap.removeClass('mfp-image-loaded');
					setTimeout(function() { $.magnificPopup.proto.prev.call(self); }, 300);
				}
			},
			imageLoadComplete: function() { 
				var self = this;
				setTimeout(function() { self.wrap.addClass('mfp-image-loaded'); }, 16);
			}
		}
		
	});

	// parallax bg

	initParalaxBg();

	// WOW init

	new WOW().init();

});