# CODE

This is a draggable point.

<div id='example'></div>

```
// Set Up the grasshopper3d.js parametric model
var a = 100

var vertices = [
  new Vector(-a, -a, -a), // Front-Bottom-Left
  new Vector( a, -a, -a), // Front-Bottom-Right
  new Vector(-a, -a,  a), // Rear-Bottom-Left
  new Vector( a, -a,  a), // Rear-Bottom-Right
  new Vector(-a,  a, -a), // Front-Top-Left
  new Vector( a,  a, -a), // Front-Top-Right
  new Vector(-a,  a,  a), // Rear-Top-Left
  new Vector( a,  a,  a)  // Rear-Top-Right
];

var faces = [
  [vertices[0], vertices[1], vertices[5], vertices[4]], // Front
  [vertices[2], vertices[3], vertices[7], vertices[6]], // Rear
  [vertices[0], vertices[1], vertices[3], vertices[2]], // Bottom
  [vertices[4], vertices[5], vertices[7], vertices[6]], // Top
  [vertices[0], vertices[2], vertices[6], vertices[4]], // Left
  [vertices[1], vertices[3], vertices[7], vertices[5]]  // Right
];

var ghpolylines = []
for (var i = 0; i < faces.length; ++i) {
  faces[i].push(faces[i][0])
  ghpolylines.push(new GHPolyline('F['+i+']', faces[i]))
}

var ghpts = []
for (var i = 0; i < vertices.length; ++i) {
  ghpts.push(new GHPoint('F['+i+']', vertices[i].x, vertices[i].y, vertices[i].z))
}

// Set Up the SVG Viewport
var width = 1080;
var height = 720;
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

// set up the projection Viewport
var angle = 30 * 3.14/180
var a = Math.cos(angle);
var b = Math.sin(angle);
var proj = new Matrix([
  a , 0, a, 0,
  -b, 1, b, 0,
  0 , 0, 0, 0,
  0 , 0, 0, 0,
]);

// Set up the svg elements attached to the parametric model
var svgfaces = []
for (var i = 0; i < faces.length; ++i) {
  svgfaces.push(new GHSvg_Polyline(paper, 'SVG Polyline',ghpolylines[i]).toGroup(g).addClass('cube'))
}

var svgpts = []
for (var i = 0; i < vertices.length; ++i) {
  svgpts.push(new GHSvg_Point(paper, 'SVG Point',ghpts[i]).toGroup(g).addClass('node'))
}

```


<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/snap.svg/0.4.1/snap.svg.js'></script>
<script type='text/javascript' src='dist/lib/matrix.js'></script>
<script type='text/javascript' src='dist/lib/vector.js'></script>
<script type='text/javascript' src='dist/src/ghparam.js'></script>
<script type='text/javascript' src='dist/src/ghcomp.js'></script>
<script type='text/javascript' src='dist/src/ghsvg.js'></script>
<link rel='stylesheet' type='text/css' href='dist/css/tutorials.css'>
<script>

  // Set Up the grasshopper3d.js parametric model
  var a = 40

  var vertices = [
    new Vector(-a, -a, -a), // Front-Bottom-Left
    new Vector( a, -a, -a), // Front-Bottom-Right
    new Vector(-a, -a,  a), // Rear-Bottom-Left
    new Vector( a, -a,  a), // Rear-Bottom-Right
    new Vector(-a,  a, -a), // Front-Top-Left
    new Vector( a,  a, -a), // Front-Top-Right
    new Vector(-a,  a,  a), // Rear-Top-Left
    new Vector( a,  a,  a)  // Rear-Top-Right
  ];

  var faces = [
    [vertices[0], vertices[1], vertices[5], vertices[4]], // Front
    [vertices[2], vertices[3], vertices[7], vertices[6]], // Rear
    [vertices[0], vertices[1], vertices[3], vertices[2]], // Bottom
    [vertices[4], vertices[5], vertices[7], vertices[6]], // Top
    [vertices[0], vertices[2], vertices[6], vertices[4]], // Left
    [vertices[1], vertices[3], vertices[7], vertices[5]]  // Right
  ];

  var ghpolylines = []
  for (var i = 0; i < faces.length; ++i) {
    faces[i].push(faces[i][0])
    ghpolylines.push(new GHPolyline('F['+i+']', faces[i]))
  }

  var ghpts = []
  for (var i = 0; i < vertices.length; ++i) {
    ghpts.push(new GHPoint('F['+i+']', vertices[i].x, vertices[i].y, vertices[i].z))
  }

  // Set Up the SVG Viewport
  var width = 500;
  var height = 200;
  var paper = Snap(width,height);
  paper.attr({style:'display:block; margin:auto'})
  Snap('#example').append(paper)

  // create a master group to switch to cartesian coordinates
  var g = paper.g();
  g.attr({id:'cartesian'});
  g.attr({transform:'translate('+width/2+','+height/2+') scale(1,-1)'});

  // set up the projection Viewport
  var angle = 30 * 3.14/180
  var a = Math.cos(angle);
  var b = Math.sin(angle);
  var proj = new Matrix([
    a , 0, a, 0,
    -b, 1, b, 0,
    0 , 0, 0, 0,
    0 , 0, 0, 0,
  ]);

  // Set up the svg elements attached to the parametric model
  console.log(ghpolylines.length);
  console.log(faces.length);

  var svgfaces = []
  for (var i = 0; i < faces.length; ++i) {
    svgfaces.push(new GHSvg_Polyline(paper, 'SVG Polyline',ghpolylines[i]).toGroup(g).addClass('cube'))
  }

  var svgpts = []
  for (var i = 0; i < vertices.length; ++i) {
    svgpts.push(new GHSvg_Point(paper, 'SVG Point',ghpts[i], 5).toGroup(g).addClass('node'))
  }

</script>