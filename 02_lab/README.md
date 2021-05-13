* Lab instructions for Monday (Feb 12) are in the [wiki page](https://github.gatech.edu/CS4460-Spring2018/Labs/wiki/Lab-2%3A-SVG)

### Prerequisites
* You have **read all of Chapter 3** in [D3 - Interactive Data Visualization for the Web](https://doc.lagout.org/programmation/JavaScript/Interactive%20Data%20Visualization%20for%20the%20Web_%20An%20Introduction%20to%20Designing%20with%20D3%20%5BMurray%202013-04-05%5D.pdf) by Scott Murray (the SVG section)
* You have read [Understanding SVG Coordinate Systems and Transformations (Parts 1 + 2)](http://www.sarasoueidan.com/blog/svg-transformations/) by S. Soueidan

### Additional Reading

* [HongKiat SVG Blog Series](http://www.hongkiat.com/blog/tag/scalable-vector-graphics/)
* [MDN SVG Tutorial](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Introduction)
* [Illustrated Guide to SVG "path" element](https://css-tricks.com/svg-path-syntax-illustrated-guide/)
* [w3 SVG Primer](https://www.w3.org/Graphics/SVG/IG/resources/svgprimer.html#advantages)
* [Intro to Web Technologies (SVG Section)](http://dataviscourse.net/2015/lectures/lecture-html/) by A. Lex of U. of Utah
* [Nadieh Bremer's blog on Data Art](https://www.visualcinnamon.com/category/data-art)  - great showcase of the possibilities with SVG.

## Scalable Vector Graphics (SVG)
This week, we will learn the basics of SVG and how it can be used to create data visualizations. SVG  is a subset of the HTML5 standard that will provide us with essentially all of our graphical needs. SVG is extremely powerful, broadly supported, and very easy to program for. It’s also the preferred target for D3. In the next lab, we will use D3 to add SVG elements to the SVG canvas, but for now we need to learn the ins & outs of drawing with SVG.

#### The SVG Canvas

The canvas is the space or area where the SVG content is drawn. Conceptually, this canvas is infinite in both dimensions. The SVG can therefore be of any size. However, it is rendered on the screen relative to a finite region known as the viewport. Areas of the SVG that lie beyond the boundaries of the viewport are clipped off and not visible.

The initial viewport coordinate system is a coordinate system established on the viewport, with the origin at the top left corner of the viewport at point (0, 0), the positive x-axis pointing towards the right, the positive y-axis pointing down, and one unit in the initial coordinate system equals one “pixel” in the viewport.

<p align="center">
  <img src=img/02_lab/01_coordinate_system.png>
</p>


An SVG drawing starts with an svg element, which requires width and height attributes. Note that the border is generated for the visual purpose of your canvas:

    <svg width="300" height="200" style="border: 1px solid #777;">
    </svg>

<p align="center">
  <img src=img/02_lab/01_blank_canvas.png>
</p>

> Note that pixels are the default measurement units, so we can specify dimensions of `300 and 200`, not `300px and 200px`. We could have specified px explicitly, or any number of other supported units, including *em, pt, in, cm, and mm*

This results in a blank canvas, which is kind of boring. Notice though that we have to specify a height and width attribute for an `<svg>` element, it will not grow to fit the size of its enclosed content. Note: `<svg>` elements default to a size of `300px by 150px` but don't rely on this default.

Next, you’ll learn how to add basic graphical shapes to the SVG element.

There are a number of visual elements that you can include between those svg tags, including *rect, circle, ellipse, line, path, and text.*

**Rectangle**

      <svg width="300" height="200">
        <!-- (x,y) based on left,top corner of rectangle -->
        <rect height="40" width="40" x="130" y="80"/>
      </svg>

<p align="center">
  <img src=img/02_lab/02_square.png>
</p>

**Circle**

      <svg width="300" height="200">
        <!-- (x,y) based on center of circle -->
        <circle r="20" cx="150" cy="100"/>
      </svg>

<p align="center">
  <img src=img/02_lab/02_circle.png>
</p>

#### Styling SVG Elements

SVG’s default style is a black fill with no stroke. If you want anything else, you’ll have to apply styles to your elements. Common SVG properties are as follows:

* fill - *A color value.* Just as with CSS, colors can be specified as named colors, hex values, or RGB or RGBA values.

* stroke - *A color value.*

* stroke-width - *A numeric measurement (typically in pixels).*

* opacity - *A numeric value between 0.0 (completely transparent) and 1.0 (completely opaque).*

**Ellipse**

    <svg width="300" height="200">
      <!-- similar to circle but (rx,ry) to define radii -->
      <ellipse rx="40" ry="30" cx="150" cy="100"
           style="fill: red; stroke: gray; stroke-width: 3px"/>
    </svg>

<p align="center">
  <img src=img/02_lab/02_ellipse.png>
</p>

**Line**

    <svg width="300" height="200">
      <line x1="60" y1="60" x2="240" y2="120"
          style="stroke: black; fill: none; stroke-width: 3px;"/>
      <line x1="60" y1="90" x2="240" y2="150"
          style="stroke: gray; fill: none; stroke-width: 3px; stroke-linecap: round;"/>
    </svg>

<p align="center">
  <img src=img/02_lab/02_lines.png>
</p>

**Path**

The SVG path element is how you “escape” the basic SVG shapes. In case none of the predefined shapes are good enough for you, you can draw any arbitrary shape you want using the path element. Paths are used in D3 to draw geo-shapes, glyphs and just about any creative design imaginable.

    <svg width="300" height="200">
      <path d="M40,100 m40,-42.45 l20,20 v28.3 l-20,20h-28.3 l-20,-20 v-28.3 l20,-20z"
          style="stroke: gold; fill: none; stroke-width: 2px;"/>
      <path d="M190,100 m0,-60 c20,0 20,30 0,60 c30,-20 60,-20 60,0 c0,20 -30,20 -60,0 c20,30 20,60 0,60 c-20,0 -20,-30 0,-60 c-30,20 -60,20 -60,0 c0,-20 30,-20 60,0 c-20,-30 -20,-60 0,-60z"
          style="stroke: none; fill: gold;"/>
    </svg>

<p align="center">
  <img src=img/02_lab/02_paths.png>
</p>

The path `d` attribute declares the points and line segments that define the shape of a path, its also really confusing to someone seeing if for the first time. If you ever find yourself wanting to learn how to create your own shapes, check out this [great illustrated guide to the SVG path](http://css-tricks.com/svg-path-syntax-illustrated-guide/).

**Text**

    <svg width="300" height="200">
      <!-- Text element's baseline is anchored to (x,y) point. Default is "start" (i.e. left-aligned). -->
      <text x="120" y="100" style="text-anchor: end;">Georgia Tech</text>
      <text x="120" y="122" style="text-anchor: end;">Go Jackets!</text>

      <!-- We'll get into how to translate and rotate elements in the next section. -->
      <text transform=" translate(200,100)rotate(45)"
          style="text-anchor: middle; font-weight: bold; font-size: 50px;">THWG</text>
    </svg>

<p align="center">
  <img src=img/02_lab/02_text.png>
</p>

***

#### Ordering


There are no “layers” in SVG and no concept of a depth attribute. SVG does not support CSS’s z-index property, so shapes can be arranged only within the two-dimensional x/y plane.

And yet, if we draw multiple shapes, they overlap:

    <svg width="300" height="200">
      <circle cx="60" cy="40" r="30" fill="purple"/>
      <circle cx="90" cy="60" r="30" fill="blue"/>
      <circle cx="120" cy="80" r="30" fill="green"/>
      <circle cx="150" cy="100" r="30" fill="yellow"/>
      <circle cx="180" cy="120" r="30" fill="red"/>
    </svg>

<p align="center">
  <img src=img/02_lab/03_ordering.png>
</p>

The order in which elements are coded determines their depth order. In the above figure, the purple circle appears first in the code, so it is rendered first. Then, the blue circle is rendered “on top” of the purple one, then the green circle on top of that, and so on.

Think of SVG shapes as being rendered like paint on a canvas. The pixel-paint that is applied later obscures any earlier paint, and thus appears to be “in front.”

#### Grouping

The ‘g’ in `<g>` stands for ‘group’. The group element is used for logically grouping together sets of related graphical elements. The `<g>` element groups all of its descendants into one group. Any styles you apply to the `<g>` element will also be applied to all of its descendants. This makes it easy to add styles, transformations, interactivity, and even animations to entire groups of objects.

For example, the following is an SVG version of Buzz. Buzz is made up of several shapes such as circles and paths:

<p align="center">
  <img src=img/02_lab/03_buzz.png>
</p>

Notice that we can place Buzz in different locations, or rotate Buzz using the transform attribute.

Grouping elements is a very powerful idea, and we will use it extensively when we create more complex visualizations. It is powerful because it gives us abstraction. In dynamic visualizations, this makes it possible for us to change a large number of visual elements by simply making changes to the parent `<g>` element; without groups, we would have to make changes to each individual element. Groups are very useful when creating trellis plots or small multiples.

#### Transforms

The SVG transformations that we will use are: *rotation, scaling, and translation.* The transform attribute establishes a new user space (current coordinate system) on the element it is applied to. This means that all elements that are children of that element also adopt that new coordinate system. In the example of buzz above, if we scale the entire `<g transform="scale(2)">` element then all the path and circle elements that make-up Buzz will also be scaled.

The transform attribute is used to specify one or more transformations on an element. It takes a `<transform-list>` as a value which is defined as a list of transform definitions, which are applied in the order provided. The individual transform definitions are separated by whitespace and/or a comma. An example of applying a transformation to an element may look like the following:

    <g transform="translate(20, 20) rotate(40) translate(10)"></g>

This will transform the group:
* 20 pixels in the x-direction and 20 pixels in the y-direction
* rotate the group 40 degrees clockwise
* 10 pixels along the 40 degree line

**Translation**

To translate an SVG element, you can use the translate() function. The syntax for the translation function is:

    translate(<tx>, [<ty>])

The `translate()` function takes one or two values which specify the horizontal and vertical translation values, respectively. tx represents the translation value along the x-axis; ty represents the translation value along the y-axis.

The ty value is optional; and, if omitted, it defaults to zero. The tx and ty values can be either space-separated or comma-separated, and they don’t take any units inside the function—they default to the current user coordinate system units.

The following example translates an element by 100 user units to the right, and 300 user units to the bottom:


    <circle cx="0" cy="0" r="100" transform="translate(100, 300)" />

**Scaling**

You can resize an SVG element by scaling it up or down using the scale() function transformation. The syntax for the scale transformation is:

    scale(<sx>, [<sy>])

The `scale()` function takes one or two values which specify the horizontal and vertical scaling values, respectively. sx represents the scaling value along the x-axis, used to stretch or shrink the element horizontally; sy represents the scaling value along the y-axis, used to stretch or shrink the element vertically.

The sy value is optional; and, if omitted, it is assumed to be equal to sx. The sx and sy values can be either space-separated or comma-separated, and they are unitless numbers.

**Rotation**

You can rotate an SVG element using the rotate() function. The syntax for the function is:

    rotate(<rotate-angle>, [<cx>, <cy>])

The `rotate()` function specifies a rotation by rotate-angle degrees about a given point. Unlike rotation transformations in CSS, you cannot specify an angle unit other than degrees. The angle value is specified unitless, and is considered a degrees value by default.

The optional cx and cy values represent the unitless coordinates of the point used as a center of rotation. If cx and cy are not provided, the rotation is about the origin of the current user coordinate system.

***
### Activity 0 - Drawing a Slope Graph



For today's lab exercises we will be using a dataset covering the historical performance of World Cup Soccer teams. **For now we are only going to deal with 4 countries**, but we'll add all **77 countries for the second exercise**.

For your reference here is a sample of the overall data table (the csv file for this data table is located in the 2nd exercise files):

<p align="center">
  <img src=img/02_lab/01_world_cup_data_table.png>
</p>

In this exercise we will create a slope graph. Slope graphs are useful for comparing the correlation between two quantitative data variables, especially when it makes sense to normalize the variables.

For this exercise we will only be using the following *4 countries*. We want to compare the number of wins for each team to their number of losses. To normalize this data, and to support better comparison on teams that have played a lot of games vs. teams that haven't played many, we will **compare the win and loss percentages.**

| Country	    | Total Played | Win % | Win y-value | Loss % | Loss y-value|
|---------------|--------------|-------|-------------|--------|-------------|
| Brazil	    | 104          | 67%   | 251         | 16%    | 578         |
| Germany	    | 106          | 62%   | 283         | 10%    | 616         |
| United States | 33           | 24%   | 526         | 58%    | 309         |
| Mexico        | 53           | 25%   | 514         | 47%    | 379         |


The goal of this exercise is to create the following slope graph:

<p align="center">
  <img src=img/02_lab/01_final_slope_graph.png>
</p>

You will be directly editing the HTML file in `02_lab\01_slope_graph\index.html`. Notice that we have already added axes for your slope graph in the SVG element. You will add new SVG elements to the bottom of the `<svg>` (before the closing tag `</svg>`. Also, we have already computed a "scaled value" for each country's win and loss percentages. You will use these `y-values` when making your graph.

##### 1. Create a Slope Graph

To create a slope graph you will need to make the following SVG elements for each country:

* 1 line element - with the start point @ (x=80, y=`Win y-value`) and the end point @ (x=260, y=`Loss y-value`)
* 2 circle elements - each centered on the start and end points of the above line
* 1 text element - the content should be the country name, and positioned to the right of the end point

Check to make sure your slope graph looks like the above example.

##### 2. Style a Slope Graph

Feel free to edit the linked CSS file at `02_lab\01_slope_graph\style.css` to style your chart. Or you can add styling directly in-line within your SVG elements (e.g. `<circle style="fill: red;"/>`

Next, style the lines and circles for each Country. Color the team's in the following two categories:

* blue = a higher `Win %` than `Loss %`
* red = a higher `Loss %` than `Win %`

You will need to use the `fill` and `stroke` SVG style properties to add color to your circles and lines.

#### 3. Submission

Change the text of `<p>` tag right before the closing of </div> on index.html file located in `02_lab\01_slope_graph\index.html` with your name.

Take a screenshot of the slope graph from the activity. (Note that this is required for you to receive the grade for this activity!)**

> **Reload Page** Remember to do a hard reload of your page after changing JS or CSS files. This can be done in Chrome with `cmd+shift+R` or `ctrl+shift+R`

***

**This pre-lab is based on the following material:**

* [Intro to Web Technologies (SVG Section)](http://dataviscourse.net/2015/lectures/lecture-html/) by Alex Lex of U. of Utah
* [Understanding SVG Coordinate Systems and Transformations (Parts 1 + 2)](http://www.sarasoueidan.com/blog/svg-transformations/) by S. Soueidan
* Hanspeter Pfister's CS171 Lab Material (Harvard)
* [D3 - Interactive Data Visualization for the Web](https://doc.lagout.org/programmation/JavaScript/Interactive%20Data%20Visualization%20for%20the%20Web_%20An%20Introduction%20to%20Designing%20with%20D3%20%5BMurray%202013-04-05%5D.pdf) by Scott Murray
