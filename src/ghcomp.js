// Lionel du Peloux - 2016
// Licence : MIT

// parameters are objects that store datas
// components are objects that acte on datas

// Mid point from two GHPoints
class GHComp_Pts_Mid extends GHComp {
  constructor(id, p1, p2){
    super(id, "Midpoint")

    // register input parameters
    this.p1 = this.register_in(p1)
    this.p2 = this.register_in(p2)

    // register output parameters
    this.pmid = this.register_out(new GHPoint(id, 0,0,0))

    // trigger computation
    this.refresh()
  }
}
Object.defineProperties(GHComp_Pts_Mid.prototype, {
  'midpoint': {
    get: function() { return this.pmid },
  },
  'refresh': {
    value: function() {
      this.pmid._setData((this.p1.x + this.p2.x)/2, (this.p1.y + this.p2.y)/2, (this.p1.z + this.p2.z)/2)
    },
  },
})

// Mid point from two GHPoints
class GHComp_Circle_3pts extends GHComp {
  constructor(id, p1, p2, p3){
    super(id, "Circle3pts")

    // register input gh parameters
    this.p1 = this.register_in(p1)
    this.p2 = this.register_in(p2)
    this.p2 = this.register_in(p3)

    // register output gh parameters
    var res = Circle3pts(p1.point,p2.point,p3.point) // [k, c, t, t1, t2]
    var r = 1/res.k
    var xaxis = p1.point.subtract(res.c)
    var yaxis = res.kb.cross(xaxis)
    var plane = new Plane(res.c, xaxis, yaxis)
    this._circle = this.register_out(new GHCircle(id, plane, r))

    // trigger computation
    this.refresh()
  }
}
Object.defineProperties(GHComp_Circle_3pts.prototype, {
  'circle': {
    get: function() { return this._circle },
  },
  'refresh': {
    value: function() {
      var res = Circle3pts(p1.point,p2.point,p3.point) // [k, c, t, t1, t2]
      var r = 1/res.k
      var xaxis = p1.point.subtract(res.c)
      var yaxis = res.kb.cross(xaxis)
      var plane = new Plane(res.c, xaxis, yaxis)
      this._circle._setData(plane, r)
    },
  },
})

// Polyline from several GHPoints
class GHComp_Polyline extends GHComp {
  constructor(id, points){
    super(id, "Polyline from Points")

    // register input parameters
    for (var i = 0; i < points.length; i++) { this.register_in(points[i]) }

    // register output parameters
    var points_tmp = []
    for (var i = 0; i < points.length; i++) { points_tmp.push(new Vector(0,0,0))}
    this._polyline = this.register_out(new GHPolyline('id', points_tmp))

    // trigger computation
    this.refresh()
  }
}
Object.defineProperties(GHComp_Polyline.prototype, {
  'polyline': {
    get: function() { return this._polyline },
  },
  'refresh': {
    value: function() {
      for (var i = 0; i < this.param_in.length; i++) {
        var pt = this.param_in[i].getData()
        this._polyline.points[i].x = pt.x
        this._polyline.points[i].y = pt.y
        this._polyline.points[i].z = pt.z
      }
    },
  },
})
