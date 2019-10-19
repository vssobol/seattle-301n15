Reference - 
https://css-tricks.com/dont-overthink-it-grids/
https://css-tricks.com/all-about-floats/
https://learn.shayhowe.com/advanced-html-css/responsive-web-design/




What are floats used for?
Aside from the simple example of wrapping text around images, floats can be used to create entire web layouts.


What is "Float"?
Float is a CSS positioning property. To understand its purpose and origin, we can look to print design. In a print layout, images may be set into the page such that text wraps around them as needed. This is commonly and appropriately called "text wrap". Here is an example of that.

Clearing the Float
Float's sister property is clear. An element that has the clear property set on it will not move up adjacent to the float like the float desires, but will move itself down past the float. Again an illustration probably does more good than words do.

Example -

<!--
#footer {
  clear: both;			
}

-->


Context
A block level element is as wide as the parent it's inside (width: auto;). We can think of it as 100% wide. The wrapper for a grid probably don't have much to do with semantics, it's just a generic wrapper, so a div is fine.

Example 
<!--
<div class="grid">
</div>
-->


Gutters
The hardest part about grids is gutters. So far we've made our grid flexible by using percentages for widths. We could make the math all complicated and use percentages for gutters as well, but personally I don't like percentage gutters anyway, I like fixed pixel size gutters. Plus, we're trying to keep too much thinking out of this.

The first step toward this is using box-sizing: border-box;. I like using it on absolutely everything.

Css example
*, *:after, *:before {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

Responsive Overview
Responsive web design is the practice of building a website suitable to work on every device and every screen size, no matter how large or small, mobile or desktop. Responsive web design is focused around providing an intuitive and gratifying experience for everyone. Desktop computer and cell phone users alike all benefit from responsive websites.

