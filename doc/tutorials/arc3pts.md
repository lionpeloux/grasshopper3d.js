This tutorial shows an arc going through 3 points. In fact, there exists a unique circle going trough 3 non aligned points. The red points are draggables. The parametric solution is animated with GSAP but the model is still draggable.

<div id='example'></div>

```
// SET UP THE PARAMETRIC MODEL
var s = new GHSolution()
var a = 100
var angle = 90*3.14/180
var x = a*Math.cos(angle)
var y = a*Math.sin(angle)
var p1 = s.Point(-1.5*a,a/2,0)
var p2 = s.Point(0,a/2,0)
var p3 = s.Point(x,a/2+y,0)
var cp3 = s.Arc3pts(p1,p2,p3)


// SET UP THE RENDER
var r = new GHRender(600,400,'#example')
var svgarc = r.Arc(cp3.arc).addClass('line')
var svgp1 = r.Point(p1, 10).addClass('node-red')
var svgp2 = r.Point(p2, 10).addClass('node-red')
var svgp3 = r.Point(p3, 10).addClass('node-red')
var svgp4 = r.Point(cp3.center, 5).addClass('line')

// ANIMATE WITH GSAP
var param = {val:1e-2}

TweenMax.to(param, 5, {
  val:(360-1e-2),
  repeat: 4,
  yoyo: true,
  onUpdate:applyValue,
  onUpdateParams:[param.val]
})
  function applyValue (val){
    var angle = param.val*3.14/180
    var x = a*Math.cos(angle)
    var y = a*Math.sin(angle)
    p3.setData(x,a/2+y,0)
};
```


<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/snap.svg/0.4.1/snap.svg.js'></script>
<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.0/TweenLite.min.js'></script>
<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.0/TweenMax.min.js'></script>
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

  // SET UP THE PARAMETRIC MODEL
  var s = new GHSolution()
  var a = 100
  var angle = 90*3.14/180
  var x = a*Math.cos(angle)
  var y = a*Math.sin(angle)
  var p1 = s.Point(-1.5*a,a/2,0)
  var p2 = s.Point(0,a/2,0)
  var p3 = s.Point(x,a/2+y,0)
  var cp3 = s.Arc3pts(p1,p2,p3)


  // SET UP THE RENDER
  var r = new GHRender(600,400,'#example')
  var svgarc = r.Arc(cp3.arc).addClass('line')
  var svgp1 = r.Point(p1, 10).addClass('node-red')
  var svgp2 = r.Point(p2, 10).addClass('node-red')
  var svgp3 = r.Point(p3, 10).addClass('node-red')
  var svgp4 = r.Point(cp3.center, 5).addClass('line')

  // ANIMATE WITH GSAP
  var param = {val:1e-2}

  TweenMax.to(param, 5, {
    val:(360-1e-2),
    repeat: 4,
    yoyo: true,
    onUpdate:applyValue,
    onUpdateParams:[param.val]
  })
    function applyValue (val){
      var angle = param.val*3.14/180
      var x = a*Math.cos(angle)
      var y = a*Math.sin(angle)
      p3.setData(x,a/2+y,0)
  };

</script>
