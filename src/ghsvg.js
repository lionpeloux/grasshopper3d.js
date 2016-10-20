// Lionel du Peloux - 2016
// Licence : MIT

// parameters are objects that store datas
// components are objects that acte on datas

// Generic SVG (base class)
class GHSvg {
  constructor(snap, id, name, param){
    this.id = id              // unique id = 0, ..., N
    this.name = name          // component name
    this.snap = snap          // reference to snap object
    this.isupdated = true     // false if the value is waiting to be computed
    this.svgobj = undefined   // a snapsvg element
    this.param = this.register_param(param)
  }
}
Object.defineProperties(GHSvg.prototype, {
  'register_param': {           // register the binded parameter
    configurable: false,
    value: function(param) {
      param.register_svg(this)
      return param
    }
  },
  'attr': {           // register the binded parameter
    configurable: true,
    value: function(options) {}
  },
  'refresh': {
    configurable: true,
    value: function() {} // to be overrided in components
  },
  'spreadRefresh': {
    value: function() {
      this.refresh()
      this.isupdated = true
      console.log("Svg[" + this.id + "] : isupdated = " + this.isupdated)
    }
  },
  'spreadStatut': {
    value: function() {
      this.isupdated = false
      console.log("Svg[" + this.id + "] : isupdated = " + this.isupdated)
    }
  }
})

// Add a SVG Circle to a GHPoint
class GHSvg_Point extends GHSvg {
  constructor(snap, id, point, options){
    super(snap, id, "SVGPoint", point)

    // create an alias
    this.point = this.param

    // deal with options
    var r = 10
    if (options.r !== undefined) r = options.r
    this.svgobj = paper.circle(this.point.x,this.point.y,0).animate({r: r}, 500, mina.bounce)
    if (options.cl !== undefined) this.svgobj.addClass(options.cl)
    if (options.grp !== undefined) options.grp.add(this.svgobj)

    // mouse events
    this.svgobj.data('sender', this);
    this.svgobj.drag(dragMove, dragStart, dragEnd)
  }
}
Object.defineProperties(GHSvg_Point.prototype, {
  'svg': {
    get: function() { return this.svgobj },
    set: function(val) { return this.svgobj = val },
  },
  'refresh': {
    value: function() {
      this.svgobj.attr({cx:this.point.x, cy:this.point.y})
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
  constructor(snap, id, polyline, options){
    super(snap, id, "SVGPolyline", polyline)

    // create an alias
    this.polyline = this.param

    // deal with options
    var path = this.svgPath(this.polyline.points)
    this.svgobj = paper.path(path)

    // console.log(this.svgPath(this.polyline.points));
    if (options.cl !== undefined) this.svgobj.addClass(options.cl)
    if (options.grp !== undefined) options.grp.add(this.svgobj)

    // mouse events
    this.svgobj.data('sender', this);
  }
}
Object.defineProperties(GHSvg_Polyline.prototype, {
  'svg': {
    get: function() { return this.svgobj },
    set: function(val) { return this.svgobj = val },
  },
  'refresh': {
    value: function() {
      var path = this.svgPath(this.polyline.points)
      this.svgobj.attr({d:path})
    },
  },
  'svgPath': {
    value: function(points) {
      console.log("SVGVSGVSGVSGV");
      var n = points.length
      var svg = ""
      svg += "M" + points[0].x + " " +  points[0].y
        for (var i = 1; i < n; i++) {
          svg += " L" + points[i].x + " " +  points[i].y
        }
      return svg
    }
  }
})
