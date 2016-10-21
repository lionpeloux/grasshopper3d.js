// Lionel du Peloux - 2016
// Licence : MIT

// parameters are objects that store datas
// components are objects that acte on datas

// Generic Parameter (base class)
/**
 * Represents a GHComp.
 * @constructor
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 */
class GHComp {
  constructor(id, name){
    this.id = id              // unique id = 0, ..., N
    this.name = name          // component name
    this.isupdated = true     // false if the value is waiting to be computed
    this.param_in = []        // register all input parameters
    this.param_out = []       // register all output parameters
  }
}
Object.defineProperties(GHComp.prototype, {
  'register_in': { // resgister an input parameter and bind it to the component
    configurable: false,
    value: function(param) {
      this.param_in.push(param)
      param.register_comp(this)
      return param
    }
  },
  'register_out': { // resgister an output parameter no needs to bind
    configurable: false,
    value: function(param) {
      this.param_out.push(param)
      return param
    }
  },
  'refresh': {
    configurable: true,
    value: function() {return ""} // to be overrided in components
  },
  'spreadRefresh': {
    configurable: false,
    value: function() {

      // wait till all input parameters have been refreshed
      for (var i = 0; i < this.param_in.length; i++) {
        if (this.param_in[i].isupdated == false) { console.log("------ NON "); return}
      }

      // refresh should not be propagated more than once
      if (this.isupdated == true) { return }

      // otherwise, the component is ready to be refreshed
      this.refresh()
      this.isupdated = true
      console.log("Comp[" + this.id + "] : isupdated = " + this.isupdated)
      for (var i = 0; i < this.param_out.length; i++) {
        this.param_out[i].spreadRefresh()
      }
    }
  },
  'spreadStatut': {
    configurable: false,
    value: function() {
      // statut should not be propagated more than once
      if (this.isupdated == false) { return }

      // otherwise, the component is hit by a statut switch and must propagate the spreadStatut process
      this.isupdated = false
      console.log("Comp[" + this.id + "] : isupdated = " + this.isupdated)
      for (var i = 0; i < this.param_out.length; i++) {
        this.param_out[i].spreadStatut()
      }
    }
  }
})

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

    // register input parameters
    this.p1 = this.register_in(p1)
    this.p2 = this.register_in(p2)
    this.p2 = this.register_in(p3)

    // register output parameters
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
      console.log(res);
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
      // this.pmid._setData((this.p1.x + this.p2.x)/2, (this.p1.y + this.p2.y)/2, (this.p1.z + this.p2.z)/2)
    },
  },
})
