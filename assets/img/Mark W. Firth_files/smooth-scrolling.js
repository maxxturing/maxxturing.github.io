// Scrolls to the selected menu item on the page
$(function() {
    $('a[href*=#]:not([href=#],[data-toggle],[data-target],[data-slide])').click(function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') || location.hostname == this.hostname) {
            var target = $(this.hash);
            var headHeight = 138; //offset the height of sticky nav
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top  - headHeight
                }, 1000); // speed?
                return false;
            }
        }
    });
});
//
// // Select all links with hashes
//     $('a[href*="#"]')
//       // Remove links that don't actually link to anything
//       .not('[href="#"]')
//       .not('[href="#0"]')
//       .click(function(event) {
//         // Grab height of fixed header
//         var headHeight = $('header').outerHeight();
//         // On-page links
//         if (
//           location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname
//         ) {
//           // Figure out element to scroll to
//           var target = $(this.hash);
//           target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
//           // Does a scroll target exist?
//           if (target.length) {
//             // Only prevent default if animation is actually gonna happen
//             event.preventDefault();
//             $('html, body').animate({
//               scrollTop: target.offset().top - headHeight - 20
//             }, 1000, function() {
//               // Callback after animation
//               // Don't scroll on focus!
//                 $.fn.focusNoScroll = function(){
//                   var x = window.scrollX, y = window.scrollY;
//                   this.focus();
//                   window.scrollTo(x, y);
//                   return this; //chainability
//
//                 };
//                 // Must change focus, but don't scroll!
//               var $target = $(target);
//               $target.focusNoScroll();
//               if ($target.is(":focus")) { // Checking if the target was focused
//                 return false;
//               } else {
//                 $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
//                 $target.focusNoScroll(); // Set focus again
//               };
//             });
//           }
//         }
//       });
