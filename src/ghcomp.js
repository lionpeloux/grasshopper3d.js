// Lionel du Peloux - 2016
// Licence : MIT

// parameters are objects that store datas
// components are objects that acte on datas

// Mid point from two GHPoints
class GHComp_Pts_Mid extends GHComp {
  constructor(id, ghp1, ghp2){
    super(id, "MidPoint")

    // register input parameters
    this.ghp1 = this.register_in(ghp1)
    this.ghp2 = this.register_in(ghp2)

    // register output parameters
    this.ghpmid = this.register_out(new GHPoint(0,0,0))

    // trigger computation
    this.refresh()
  }
}
Object.defineProperties(GHComp_Pts_Mid.prototype, {
  'midpoint': {
    get: function() { return this.ghpmid },
  },
  'refresh': {
    value: function() {
      this.ghpmid._setData((this.ghp1.x + this.ghp2.x)/2, (this.ghp1.y + this.ghp2.y)/2, (this.ghp1.z + this.ghp2.z)/2)
    },
  },
})

// Mid point from two GHPoints
class GHComp_Circle_3pts extends GHComp {
  constructor(id, ghp1, ghp2, ghp3){
    super(id, "Circle3pts")

    // register input gh parameters
    this.ghp1 = this.register_in(ghp1)
    this.ghp2 = this.register_in(ghp2)
    this.ghp3 = this.register_in(ghp3)

    // register output gh parameters
    var res = Circle3pts(this.ghp1.point, this.ghp2.point, this.ghp3.point) // [k, c, t, t1, t2]
    var r = 1/res.k
    var xaxis = this.ghp1.point.subtract(res.c)
    var yaxis = res.kb.cross(xaxis)
    var plane = new Plane(res.c, xaxis, yaxis)
    this._circle = this.register_out(new GHCircle(plane, r))
    this._center = this.register_out(new GHPoint(plane.origin))

    // trigger computation needed ??
    this.refresh()
  }
}
Object.defineProperties(GHComp_Circle_3pts.prototype, {
  'circle': {
    get: function() { return this._circle },
  },
  'center': {
    get: function() { return this._center },
  },
  'refresh': {
    value: function() {
      var res = Circle3pts(this.ghp1.point, this.ghp2.point, this.ghp3.point) // [k, c, t, t1, t2]
      var r = 1/res.k
      var xaxis = this.ghp1.point.subtract(res.c)
      var yaxis = res.kb.cross(xaxis)
      var plane = new Plane(res.c, xaxis, yaxis)
      this._circle._setData(plane, r)
      this._center._setData(plane.origin.x, plane.origin.y, plane.origin.z)
    },
  },
})

// Mid point from two GHPoints
class GHComp_Arc_3pts extends GHComp {
  constructor(id, ghps, ghpc, ghpe){
    super(id, "Arc3pts")

    // register input gh parameters
    this.ghps = this.register_in(ghps)
    this.ghpc = this.register_in(ghpc)
    this.ghpe = this.register_in(ghpe)

    // register output gh parameters
    var res = Circle3pts(this.ghps.point, this.ghpc.point, this.ghpe.point) // [k, c, t, t1, t2]
    this._arc = this.register_out(new GHArc(res.plane, 1/res.k, res.a1, res.a2))
    this._center = this.register_out(new GHPoint(res.plane.origin))

    // trigger computation needed ??
    this.refresh()
  }
}
Object.defineProperties(GHComp_Arc_3pts.prototype, {
  'arc': {
    get: function() { return this._arc },
  },
  'center': {
    get: function() { return this._center },
  },
  'refresh': {
    value: function() {
      var res = Circle3pts(this.ghps.point, this.ghpc.point, this.ghpe.point) // [k, c, t, t1, t2]
      this._arc._setData(res.plane, 1/res.k, res.a1, res.a2)
      this._center._setData(res.plane.origin.x, res.plane.origin.y, res.plane.origin.z)
    },
  },
})


// Polyline from several GHPoints
class GHComp_Polyline extends GHComp {
  constructor(id, points){
    super(id, "PolylineFromPoints")

    // register input parameters
    for (var i = 0; i < points.length; i++) { this.register_in(points[i]) }

    // register output parameters
    var points_tmp = []
    for (var i = 0; i < points.length; i++) { points_tmp.push(new Vector(0,0,0))}
    this._polyline = this.register_out(new GHPolyline(points_tmp))

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
