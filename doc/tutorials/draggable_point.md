This is a draggable point.

<div id='example'></div>

```
// define a new Solution and add 2 points
var s = new GHSolution()
var p1 = s.Point(0,0,0)
var p2 = s.Point(100,-50,0)

// define a new Render 400x400px and add 2 svg circles two each points
var r = new GHRender(400,400, '#example')
var svg1 = r.Point(p1, 10).addClass('node-red')
var svg2 = r.Point(p2, 50).addClass('node-blue')

```


<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/snap.svg/0.4.1/snap.svg.js'></script>
<script type='text/javascript' src='./dist/lib/matrix.js'></script>
<script type='text/javascript' src='./dist/lib/vector.js'></script>
<script type='text/javascript' src='./dist/lib/plane.js'></script>
<script type='text/javascript' src='./dist/src/interpolation.js'></script>
<script type='text/javascript' src='./dist/src/base.js'></script>
<script type='text/javascript' src='./dist/src/ghparam.js'></script>
<script type='text/javascript' src='./dist/src/ghcomp.js'></script>
<script type='text/javascript' src='./dist/src/ghsvg.js'></script>
<link rel='stylesheet' type='text/css' href='./dist/css/tutorials.css'>

<script>

  // define a new Solution and add 2 points
  var s = new GHSolution()
  var p1 = s.Point(0,0,0)
  var p2 = s.Point(100,-50,0)

  // define a new Render 400x400px and add 2 svg circles two each points
  var r = new GHRender(400,400, '#example')
  var svg1 = r.Point(p1, 10).addClass('node-red')
  var svg2 = r.Point(p2, 50).addClass('node-blue')

</script>
