Reference - JAVA Script and JQuery interactive front end- Jon Duckett

jQuery doesn't do anything you cannot achieve with pure JavaScript.
It is just a JavaScript file but estimates show it has been used on over a quarter of the sites on the web, because it makes coding simpler.

. html()
This method gives every element in the matched set the same new content. The new content may include HTML.
.replaceWith()
This method replaces every element in a matched set with new content. It also returns the replaced elements.
. text()
This method gives every element in the matched set the same new text content. Any markup would be shown as text.
. remove()
This method removes all of the
elements in the matched set.

For an exhaustive list of the functionality
provided in jQuery, visit http ://api .j query .com


Youcanusethe .noConflict() methodatthestart of your script, to tell jQuery to release the$ shortcut so that other scripts can use it. Then you can use the full name rather than the shortcut:
jQuery.noConflict(); jQuery(function() {
jQuery('div') . hide();
}) ;