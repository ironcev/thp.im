jQuery(document).ready(function(){
		
	// Slide Up
	$(function () {
	  $.scrollUp({
		scrollName: 'scrollUp',
		topDistance: '300', 
		topSpeed: 300,
		animation: 'fade', 
		animationInSpeed: 200,
		animationOutSpeed: 200,
		scrollText: 'Scroll to top',
		activeOverlay: false,
	  });
	});
	
}); // end document


