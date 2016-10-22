This tutorial shows a circle going through 3 points. In fact, there exists a unique circle going trough 3 non aligned points. The red points are draggables. The parametric solution is animated with GSAP but the model is still draggable.

<div id='example'></div>

```
  // SET UP THE PARAMETRIC MODEL
  var a = 200
  var angle = -60*3.14/180
  var x = a*Math.cos(angle)
  var y = a*Math.sin(angle)

  var s = new GHSolution()
  var p1 = s.Point(-a,0,0)
  var p2 = s.Point(0,0,0)
  var p3 = s.Point(x,y,0)
  var cp1 = s.PolylineFromPts([p1,p2,p3])
  var cp2 = s.Circle3pts(p1,p2,p3)

  // SET UP THE RENDER
  var r = new GHRender(600, 400, '#example')
  var svgply1 = r.Polyline(cp1.polyline).addClass('line')
  var svgcirc = r.Circle(cp2.circle)
  var svgp1 = r.Point(p1, 10).addClass('node-red')
  var svgp2 = r.Point(p2, 10).addClass('node-red')
  var svgp3 = r.Point(p3, 10).addClass('node-red')
  var svgp4 = r.Point(cp2.center, 5).addClass('line')

  // ANIMATE WITH GSAP
  var param = {val:1e-2}

  TweenMax.to(param, 2, {
    val:(180-1e-2),
    repeat: 5,
    yoyo: true,
    onUpdate:applyValue,
    onUpdateParams:[param.val]
  })

    function applyValue (val){
      var angle = param.val*3.14/180
      var x = a*Math.cos(angle)
      var y = a*Math.sin(angle)
      p3.setData(x,y,0)
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
  var a = 200
  var angle = -60*3.14/180
  var x = a*Math.cos(angle)
  var y = a*Math.sin(angle)

  var s = new GHSolution()
  var p1 = s.Point(-a,0,0)
  var p2 = s.Point(0,0,0)
  var p3 = s.Point(x,y,0)
  var cp1 = s.PolylineFromPts([p1,p2,p3])
  var cp2 = s.Circle3pts(p1,p2,p3)

  // SET UP THE RENDER
  var r = new GHRender(600, 400, '#example')
  var svgply1 = r.Polyline(cp1.polyline).addClass('line')
  var svgcirc = r.Circle(cp2.circle)
  var svgp1 = r.Point(p1, 10).addClass('node-red')
  var svgp2 = r.Point(p2, 10).addClass('node-red')
  var svgp3 = r.Point(p3, 10).addClass('node-red')
  var svgp4 = r.Point(cp2.center, 5).addClass('line')

  // ANIMATE WITH GSAP
  var param = {val:1e-2}

  TweenMax.to(param, 2, {
    val:(180-1e-2),
    repeat: 5,
    yoyo: true,
    onUpdate:applyValue,
    onUpdateParams:[param.val]
  })

    function applyValue (val){
      var angle = param.val*3.14/180
      var x = a*Math.cos(angle)
      var y = a*Math.sin(angle)
      p3.setData(x,y,0)
  }

</script>
