// Lionel du Peloux - 2016
// Licence : MIT

// parameters are objects that store datas
// components are objects that acte on datas

// Add a SVG Circle to a GHPoint
class GHSvg_Point extends GHSvg {
  constructor(snap, id, point, r=20){
    super(snap, id, "SVGPoint", point)

    // create an alias
    this.point = this.param

    // deal with options
    var pt = proj.transformVector(this.point)
    this.svgobj = paper.circle(pt.x,pt.y,0)
                        .animate({r: r}, 800, mina.bounce)

    // mouse events
    this.svgobj.data('sender', this);
    this.svgobj.drag(dragMove, dragStart, dragEnd)
  }
}
Object.defineProperties(GHSvg_Point.prototype, {
  'refresh': {
    value: function() {
      var pt = proj.transformVector(this.point)
      this.svgobj.attr({cx:pt.x, cy:pt.y})

      // this.svgobj.attr({cx:this.point.x, cy:this.point.y})
    },
  },
})
var dragStart = function ( x,y,ev ) {
  var sender = this.data('sender')

  // store the origin at clic
  this.data('ox', sender.point.x)
  this.data('oy', sender.point.y)
}
var dragMove = function(dx, dy, x, y, e) {

        var sender = this.data('sender')
        var tdx, tdy;
        var snapInvMatrix = this.transform().diffMatrix.invert();
        snapInvMatrix.e = snapInvMatrix.f = 0;
        tdx = snapInvMatrix.x( dx,dy ); tdy = snapInvMatrix.y( dx,dy );

        // update point position
        // sender.svgobj.attr({cx:this.data('ox') + tdx, cy:this.data('oy') + tdy})
        // sender.point.setData(this.data('ox') + tdx, this.data('oy') + tdy, 0)
        sender.point.setData(this.data('ox') + tdx, this.data('oy') + tdy, 0)
}
var dragEnd = function() {}

// Add a SVG Polyline to a GHPolyline
class GHSvg_Polyline extends GHSvg {
  constructor(snap, id, polyline){
    super(snap, id, "SVGPolyline", polyline)

    // create an alias
    this.polyline = this.param

    // deal with options
    var path = this.svgPath(this.polyline.points)
    this.svgobj = paper.path(path)

    // mouse events
    this.svgobj.data('sender', this);
  }
}
Object.defineProperties(GHSvg_Polyline.prototype, {
  'refresh': {
    value: function() {
      var path = this.svgPath(this.polyline.points)
      this.svgobj.attr({d:path})
    },
  },
  'svgPath': {
    value: function(points) {
      var pt
      var svg = ""

      pt = proj.transformVector(points[0])
      svg += "M" + pt.x + " " +  pt.y
      for (var i = 1; i < points.length; i++) {
        pt = proj.transformVector(points[i])
        svg += " L" + pt.x + " " +  pt.y
      }

      // svg += "M" + points[0].x + " " +  points[0].y
      // for (var i = 1; i < points.length; i++) {
      //   svg += " L" + points[i].x + " " +  points[i].y
      // }

      return svg
    }
  }
})

// Add a SVG Circle to a GHCircle
class GHSvg_Circle extends GHSvg {
  constructor(snap, id, circle){
    super(snap, id, "SVGCircle", circle)

    // create an alias
    this.circle = circle

    // deal with options
    // var pt = proj.transformVector(this.point)
    this.svgobj = paper.circle(this.circle.plane.origin.x,this.circle.plane.origin.y,0)
                        .animate({r: this.circle.r}, 800, mina.bounce)

    // mouse events
    this.svgobj.data('sender', this);
    // this.svgobj.drag(dragMove, dragStart, dragEnd)
  }
}
Object.defineProperties(GHSvg_Circle.prototype, {
  'refresh': {
    value: function() {
      // var pt = proj.transformVector(this.point)
      this.svgobj.attr({
        cx:this.circle.plane.origin.x,
        cy:this.circle.plane.origin.y,
        r :this.circle.r
      })

      // this.svgobj.attr({cx:this.point.x, cy:this.point.y})
    },
  },
})
