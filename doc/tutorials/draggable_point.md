# CODE

This is a draggable point.

<div id='example'></div>

```
// Define the paper sheet
var width = 250;
var height = 125;
var paper = Snap(width,height);
paper.attr({style:'display:block; margin:auto'})
Snap('#main').append(paper)

// create a master group to switch to cartesian coordinates
var g = paper.g();
g.attr({id:'cartesian'});
g.attr({transform:'translate('+width/2+','+height/2+') scale(1,-1)'});

// draw svg border box as a rectangle
var box = paper.rect(-width/2, -height/2, width, height)
               .attr({strokeWidth:'1px', stroke:'black', fill:'none'})
g.add(box)

// Create new Point parameter
var p1 = new GHPoint('Point A', 0,0,0)

// Attach an SVG circle to this point
var p1_svg = new GHSvg_Point(paper, 'PointA',p1, {grp:g, r:20, cl:'node'})

// move p1 to (100, 0, 0)
p1.x = 100
p1.print()

// move p1 to (100, 50, 0)
p1.y = 50
p1.print()

```


<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/snap.svg/0.4.1/snap.svg.js'></script>
<script type='text/javascript' src='dist/lib/lib/matrix.js'></script>
<script type='text/javascript' src='dist/lib/vector.js'></script>
<script type='text/javascript' src='dist/src/ghparam.js'></script>
<script type='text/javascript' src='dist/src/ghcomp.js'></script>
<script type='text/javascript' src='dist/src/ghsvg.js'></script>
<link rel='stylesheet' type='text/css' href='dist/css/tutorials.css'>
<script>
  // Define the paper sheet
  var width = 250;
  var height = 125;
  var paper = Snap(width,height);
  paper.attr({style:'display:block; margin:auto'})
  Snap('#example').append(paper)

  // create a master group to switch to cartesian coordinates
  var g = paper.g();
  g.attr({id:'cartesian'});
  g.attr({transform:'translate('+width/2+','+height/2+') scale(1,-1)'});

  // draw svg border box as a rectangle
  var box = paper.rect(-width/2, -height/2, width, height)
                 .attr({strokeWidth:'1px', stroke:'black', fill:'none'})
  g.add(box)

  // Create new Point parameter
  var p1 = new GHPoint('Point A', 0,0,0)

  // Attach an SVG circle to this point
  var p1_svg = new GHSvg_Point(paper, 'PointA',p1, {grp:g, r:20, cl:'node'})

  // move p1 to (100, 0, 0)
  p1.x = 100
  p1.print()

  // move p1 to (100, 50, 0)
  p1.y = 50
  p1.print()
</script>
