3D cube with projection and rotation viewport.

<div id='example'></div>

```
// SET UP THE PARAMETRIC MODEL
var s = new GHSolution()

var l = 100/2

var vertices = [
  s.Point(-l, -l, -l), // Front-Bottom-Left
  s.Point( l, -l, -l), // Front-Bottom-Right
  s.Point(-l, -l,  l), // Rear-Bottom-Left
  s.Point( l, -l,  l), // Rear-Bottom-Right
  s.Point(-l,  l, -l), // Front-Top-Left
  s.Point( l,  l, -l), // Front-Top-Right
  s.Point(-l,  l,  l), // Rear-Top-Left
  s.Point( l,  l,  l)  // Rear-Top-Right
];

var faces = [
  s.PolylineFromPts([vertices[0], vertices[1], vertices[5], vertices[4], vertices[0]]), // Front
  s.PolylineFromPts([vertices[2], vertices[3], vertices[7], vertices[6], vertices[2]]), // Rear
  s.PolylineFromPts([vertices[0], vertices[1], vertices[3], vertices[2], vertices[0]]), // Bottom
  s.PolylineFromPts([vertices[4], vertices[5], vertices[7], vertices[6], vertices[4]]), // Top
  s.PolylineFromPts([vertices[0], vertices[2], vertices[6], vertices[4], vertices[0]]), // Left
  s.PolylineFromPts([vertices[1], vertices[3], vertices[7], vertices[5], vertices[1]])  // Right
];

// SET UP THE RENDER
var r = new GHRender(600,350,'#example')
var angle, a, b, proj, rot, view

svgfaces = []
for (var i = 0; i < faces.length; i++) {
  svgfaces.push(r.Polyline(faces[i].polyline).addClass('cube'))
}

// isometric perspective matrix
angle = 30 * 3.14/180
a = Math.cos(angle);
b = Math.sin(angle);
proj = new Matrix([
  a , 0, a, 0,
  -b, 1, b, 0,
  0 , 0, 0, 0,
  0 , 0, 0, 0,
]);

// ANIMATE WITH GSAP
var param = {val:0}
rot = Matrix.rotate(param.val, 0, 0, 1)
view = Matrix.multiply(proj, rot)

TweenMax.to(param, 2, {
  val:180,
  repeat: 5,
  yoyo: true,
  onUpdate:applyValue,
  onUpdateParams:[param.val]
})
  function applyValue (val){
    // rotate the object around z axis
    angle = param.val * 3.14/180
    Matrix.rotate(param.val, 0, 0, 1, rot)
    Matrix.multiply(proj, rot, view)
    r.setViewport(view)
}


```


<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/snap.svg/0.4.1/snap.svg.js'></script>
<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.0/TweenLite.min.js'></script>
<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.0/TweenMax.min.js'></script>
<script type='text/javascript' src='../../lib/matrix.js'></script>
<script type='text/javascript' src='../../lib/vector.js'></script>
<script type='text/javascript' src='../../lib/plane.js'></script>
<script type='text/javascript' src='../../src/interpolation.js'></script>
<script type='text/javascript' src='../../src/base.js'></script>
<script type='text/javascript' src='../../src/ghparam.js'></script>
<script type='text/javascript' src='../../src/ghcomp.js'></script>
<script type='text/javascript' src='../../src/ghsvg.js'></script>
<link rel='stylesheet' type='text/css' href='../../css/tutorials.css'>
<script>

  // SET UP THE PARAMETRIC MODEL
  var s = new GHSolution()

  var l = 100/2

  var vertices = [
    s.Point(-l, -l, -l), // Front-Bottom-Left
    s.Point( l, -l, -l), // Front-Bottom-Right
    s.Point(-l, -l,  l), // Rear-Bottom-Left
    s.Point( l, -l,  l), // Rear-Bottom-Right
    s.Point(-l,  l, -l), // Front-Top-Left
    s.Point( l,  l, -l), // Front-Top-Right
    s.Point(-l,  l,  l), // Rear-Top-Left
    s.Point( l,  l,  l)  // Rear-Top-Right
  ];

  var faces = [
    s.PolylineFromPts([vertices[0], vertices[1], vertices[5], vertices[4], vertices[0]]), // Front
    s.PolylineFromPts([vertices[2], vertices[3], vertices[7], vertices[6], vertices[2]]), // Rear
    s.PolylineFromPts([vertices[0], vertices[1], vertices[3], vertices[2], vertices[0]]), // Bottom
    s.PolylineFromPts([vertices[4], vertices[5], vertices[7], vertices[6], vertices[4]]), // Top
    s.PolylineFromPts([vertices[0], vertices[2], vertices[6], vertices[4], vertices[0]]), // Left
    s.PolylineFromPts([vertices[1], vertices[3], vertices[7], vertices[5], vertices[1]])  // Right
  ];

  // SET UP THE RENDER
  var r = new GHRender(600,350,'#example')
  var angle, a, b, proj, rot, view

  svgfaces = []
  for (var i = 0; i < faces.length; i++) {
    svgfaces.push(r.Polyline(faces[i].polyline).addClass('cube'))
  }

  // isometric perspective matrix
  angle = 30 * 3.14/180
  a = Math.cos(angle);
  b = Math.sin(angle);
  proj = new Matrix([
    a , 0, a, 0,
    -b, 1, b, 0,
    0 , 0, 0, 0,
    0 , 0, 0, 0,
  ]);

  // ANIMATE WITH GSAP
  var param = {val:0}
  rot = Matrix.rotate(param.val, 0, 0, 1)
  view = Matrix.multiply(proj, rot)

  TweenMax.to(param, 2, {
    val:180,
    repeat: 5,
    yoyo: true,
    onUpdate:applyValue,
    onUpdateParams:[param.val]
  })
    function applyValue (val){
      // rotate the object around z axis
      angle = param.val * 3.14/180
      Matrix.rotate(param.val, 0, 0, 1, rot)
      Matrix.multiply(proj, rot, view)
      r.setViewport(view)
  }

</script>
