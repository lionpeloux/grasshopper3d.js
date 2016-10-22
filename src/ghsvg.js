// Lionel du Peloux - 2016
// Licence : MIT

// parameters are objects that store datas
// components are objects that acte on datas

// Add a SVG Circle to a GHPoint
class GHSvg_Point extends GHSvg {
  constructor(paper, viewport, id, ghpoint, r=20){
    super(paper, viewport, id, 'SVGPoint')

    // internal style variables
    this.r = r

    // register input parameters
    this.ghpoint = this.register_in(ghpoint)

    // create and register svg elements
    var pt = this.viewport.transformVector(this.ghpoint.point)
    this.svgcircle = this.register_svg(paper.circle(pt.x,pt.y,0))

    // create a sub group if contains several svgelements
    // this.group()

    if (this.ghpoint.isroot) {
      // mouse events are binded to the circle
      this.svgcircle.data('sender', this);
      this.svgcircle.drag(
        dragMove,
        dragStart,
        dragEnd
      )
    }


    this.refresh()
  }
}
Object.defineProperties(GHSvg_Point.prototype, {
  'refresh': {
    value: function() {
      var pt = this.viewport.transformVector(this.ghpoint.point)
      this.svgcircle.attr({cx:pt.x, cy:pt.y, r:this.r})
    },
  },
})
var dragStart = function ( x,y,ev ) {
  var sender = this.data('sender')
  // store the origin at clic
  this.data('ox', sender.ghpoint.x)
  this.data('oy', sender.ghpoint.y)
}
var dragMove = function(dx, dy, x, y, e) {
        var sender = this.data('sender')
        var tdx, tdy;
        var snapInvMatrix = this.transform().diffMatrix.invert();
        snapInvMatrix.e = snapInvMatrix.f = 0;
        tdx = snapInvMatrix.x( dx,dy ); tdy = snapInvMatrix.y( dx,dy );
        sender.ghpoint.setData(this.data('ox') + tdx, this.data('oy') + tdy, 0)
}
var dragEnd = function() {
}

// Add a SVG Polyline to a GHPolyline
class GHSvg_Polyline extends GHSvg {
  constructor(paper, viewport, id, ghpolyline){
    super(paper, viewport, id, 'SVGPolyline')

    // register input parameters
    this.ghpolyline = this.register_in(ghpolyline)

    // create and register svg elements
    var path = svgpathPolyline(this.ghpolyline.points, this.viewport)
    this.svgpath = this.register_svg(paper.path(path))

    // create a sub group if contains several svgelements
    // this.group()
  }
}
Object.defineProperties(GHSvg_Polyline.prototype, {
  'refresh': {
    value: function() {
      var path = svgpathPolyline(this.ghpolyline.points, this.viewport)
      this.svgpath.attr({d:path})
    },
  },
})

// Add a SVG Circle to a GHCircle
class GHSvg_Circle extends GHSvg {
  constructor(paper, viewport, id, ghcircle){
    super(paper, viewport, id, 'SVGCircle')

    // register input parameters
    this.ghcircle = this.register_in(ghcircle)

    // create and register svg elements
    this.svgelem = this.register_svg(paper.circle(this.ghcircle.origin.x, this.ghcircle.origin.y, this.ghcircle.r).addClass('line'))

    // mouse events
    if (this.ghcircle.isroot) {
      // mouse events are binded to the circle
      this.svgcircle.data('sender', this);
      this.svgcircle.drag(
        dragMove,
        dragStart,
        dragEnd
      )
    }
  }
}
Object.defineProperties(GHSvg_Circle.prototype, {
  'refresh': {
    value: function() {
      // var pt = proj.transformVector(this.point)
      this.svgelem.attr({
        cx:this.ghcircle.origin.x,
        cy:this.ghcircle.origin.y,
        r :this.ghcircle.r
      })
      // this.svgobj.attr({cx:this.point.x, cy:this.point.y})
    },
  },
})
