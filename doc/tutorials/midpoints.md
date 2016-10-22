This is a draggable point.

<div id='example'></div>

```
var s = new GHSolution()
var p1 = s.Point(-100,50,0)
var p2 = s.Point(0,50,0)
var p3 = s.Point(100,-100,0)
var cp1 = s.MidPoint(p1,p2)
var cp2 = s.MidPoint(p2,p3)
var cp3 = s.MidPoint(cp1.midpoint,cp2.midpoint)

var cp4 = s.PolylineFromPts([p1,p2,p3])
var cp5 = s.PolylineFromPts([cp1.midpoint,cp2.midpoint, cp3.midpoint])


var r = new GHRender(600,400)

var svgply1 = r.Polyline(cp4.polyline).addClass('line')
var svgply2 = r.Polyline(cp5.polyline).addClass('line')

var svgp1 = r.Point(p1, 20).addClass('node-red')
var svgp2 = r.Point(p2, 20).addClass('node-red')
var svgp3 = r.Point(p3, 20).addClass('node-red')
var svgp4 = r.Point(cp1.midpoint, 10).addClass('node-blue')
var svgp5 = r.Point(cp2.midpoint, 10).addClass('node-blue')
var svgp4 = r.Point(cp3.midpoint, 5).addClass('line')


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

  var s = new GHSolution()
  var p1 = s.Point(-100,50,0)
  var p2 = s.Point(0,50,0)
  var p3 = s.Point(100,-100,0)
  var cp1 = s.MidPoint(p1,p2)
  var cp2 = s.MidPoint(p2,p3)
  var cp3 = s.MidPoint(cp1.midpoint,cp2.midpoint)

  var cp4 = s.PolylineFromPts([p1,p2,p3])
  var cp5 = s.PolylineFromPts([cp1.midpoint,cp2.midpoint, cp3.midpoint])


  var r = new GHRender(600,400, '#example')

  var svgply1 = r.Polyline(cp4.polyline).addClass('line')
  var svgply2 = r.Polyline(cp5.polyline).addClass('line')

  var svgp1 = r.Point(p1, 20).addClass('node-red')
  var svgp2 = r.Point(p2, 20).addClass('node-red')
  var svgp3 = r.Point(p3, 20).addClass('node-red')
  var svgp4 = r.Point(cp1.midpoint, 10).addClass('node-blue')
  var svgp5 = r.Point(cp2.midpoint, 10).addClass('node-blue')
  var svgp4 = r.Point(cp3.midpoint, 5).addClass('line')

</script>
