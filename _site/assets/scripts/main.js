jQuery(document).ready(function($){
	var timelineBlocks = $('.cd-timeline-block'),
		offset = 0.8;

	//hide timeline blocks which are outside the viewport
	hideBlocks(timelineBlocks, offset);

	//on scolling, show/animate timeline blocks when enter the viewport
	$(window).on('scroll', function(){
		(!window.requestAnimationFrame)
			? setTimeout(function(){ showBlocks(timelineBlocks, offset); }, 100)
			: window.requestAnimationFrame(function(){ showBlocks(timelineBlocks, offset); });
	});

	function hideBlocks(blocks, offset) {
		blocks.each(function(){
			( $(this).offset().top > $(window).scrollTop()+$(window).height()*offset ) && $(this).find('.cd-timeline-img, .cd-timeline-content').addClass('is-hidden');
		});
	}

	function showBlocks(blocks, offset) {
		blocks.each(function(){
			( $(this).offset().top <= $(window).scrollTop()+$(window).height()*offset && $(this).find('.cd-timeline-img').hasClass('is-hidden') ) && $(this).find('.cd-timeline-img, .cd-timeline-content').removeClass('is-hidden').addClass('bounce-in');
		});
	}

	// opacityonscroll
	var header = $('header');
	var range = 200;

	$(window).on('scroll', function () {

	  var scrollTop = $(this).scrollTop(),
	      height = header.outerHeight(),
	      offset = height / 2,
	      calc = 1 - (scrollTop - offset + range) / range;

	  header.css({ 'opacity': calc });

	  if (calc > '1') {
	    header.css({ 'opacity': 1 });
	  } else if ( calc < '0' ) {
	    header.css({ 'opacity': 0 });
	  }
	});

});
