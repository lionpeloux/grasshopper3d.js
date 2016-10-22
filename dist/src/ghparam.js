// Lionel du Peloux - 2016
// Licence : MIT

// parameters are objects that store datas
// components are objects that acte on datas

// Number Parameter
class GHNumber extends GHParam {
  constructor(number) {
    super('Number')
    this.number = number
  }
}
Object.defineProperties(GHNumber.prototype, {
  '_value': {
    set: function(val) {
      this.number = val
    }
  },
  'value': {
    get: function() { return this.number },
    set: function(val) {
      this._value = val
      this.hasChanged()
    }
  },
  'getData': {
    value: function() { return this.number }
  },
  'setData': {
    value: function(data) { this._setData(data); this.hasChanged() }
  },
  '_setData': {
    value: function(data) { this.number = data; } // set data but does not raise hasChanged event
  },
  'print': {
    value: function() { console.log("Number[" + this.id + "] : " + Math.round10(this.number, -display_decimal)) }
  }
})

// Point Parameter
class GHPoint extends GHParam {
  constructor(x, y, z) {
    super('Point')
    this.point = new Vector(x,y,z)
  }
}
Object.defineProperties(GHPoint.prototype, {
  '_x': {
    set: function(val) {
      this.point.x = val
    }
  },
  'x': {
    get: function() { return this.point.x },
    set: function(val) {
      this._x = val
      this.hasChanged()
    }
  },
  '_y': {
    set: function(val) {
      this.point.y = val
    }
  },
  'y': {
    get: function() { return this.point.y },
    set: function(val) {
      this._y = val
      this.hasChanged()
    }
  },
  '_z': {
    set: function(val) {
      this.point.z = val
    }
  },
  'z': {
    get: function() { return this.point.z },
    set: function(val) {
      this._z = val
      this.hasChanged()
    }
  },
  'getData': {
    value: function() { return this.point }
  },
  'setData': {
    value: function(x,y,z) { this._setData(x,y,z); this.hasChanged()}
  },
  '_setData': {
    value: function(x,y,z) { this.point._setData(x,y,z) } // set data but does not raise hasChanged event
  },
  'print': {
    value: function() {
      console.log('Point[' + this.id + '] : ' + this.point.str()) }
  }
})

// Vector Parameter
class GHVector extends GHParam {
  constructor(x, y, z) {
    super('Vector')
    this.vector = new Vector(x,y,z)
  }
}
Object.defineProperties(GHVector.prototype, {
  '_x': {
    set: function(val) {
      this.vector.x = val
    }
  },
  'x': {
    get: function() { return this.vector.x },
    set: function(val) {
      this._x = val
      this.hasChanged()
    }
  },
  '_y': {
    set: function(val) {
      this.vector.y = val
    }
  },
  'y': {
    get: function() { return this.vector.y },
    set: function(val) {
      this._y = val
      this.hasChanged()
    }
  },
  '_z': {
    set: function(val) {
      this.vector.z = val
    }
  },
  'z': {
    get: function() { return this.vector.z },
    set: function(val) {
      this._z = val
      this.hasChanged()
    }
  },
  'getData': {
    value: function() { return this.vector }
  },
  'setData': {
    value: function(x,y,z) { this._setData(x,y,z); this.hasChanged() }
  },
  '_setData': {
    value: function(x,y,z) { this.vector._setData(x,y,z) } // set data but does not raise hasChanged event
  },
  'print': {
    value: function() {
      console.log('Vector[' + this.id + '] : ' + this.vector.str()) }
  }
})

// Plane Parameter
class GHPlane extends GHParam {
  constructor(origin, xaxis, yaxis) {
    super('Point')
    this.plane = new Plane(origin, xaxis, yaxis)
  }
}
Object.defineProperties(GHPlane.prototype, {
  '_origin': {
    set: function(x,y,z) {
      this.plane.origin._setData(x,y,z)
    }
  },
  'origin': {
    get: function() { return this.plane.origin },
    set: function(x,y,z) {
      this._origin(x,y,z)
      this.hasChanged()
    }
  },
  'yaxis': {
    get: function() { return this.plane.yaxis }
  },
  'zaxis': {
    get: function() { return this.plane.zaxis }
  },
  'getData': {
    value: function() { return this.plane }
  },
  'setData': {
    value: function(origin, xaxis, yaxis) {
      this._setData(origin, xaxis, yaxis) // enforce the validity of the new plane
      this.hasChanged()
    }
  },
  '_setData': {
    value: function(origin, xaxis, yaxis) {
      this.plane = new Plane(origin, xaxis, yaxis) // enforce the validity of the new plane
    } // set data but does not raise hasChanged event
  },
  'print': {
    value: function() {
      console.log("Plane[" + this.id + "] : " + this.plane.str())
    }
  }
})

// Polyline Parameter (a Line is a Polyline with only 2 points)
class GHPolyline extends GHParam {
  constructor(points) {
    super('Polyline')
    this.points = []
    for (var i = 0; i < points.length; i++) {
      this.points.push(new Vector(points[i].x, points[i].y, points[i].z))
    }
  }
}
Object.defineProperties(GHPolyline.prototype, {
  'count': {
    get: function() { return this.points.length }
  },
  'length': {
    get: function() {
      var l=0
      for (var i = 1; i < this.points.length; i++) {
        l += this.points[i].subtract(this.points[i]).length
      }
    }
  },
  'getData': {
    value: function() { return this.points }
  },
  'setData': {
    value: function(points) {
      this._setData(points)
      this.hasChanged()
    }
  },
  '_setData': {
    value: function(points) {
      this.points = []
      for (var i = 0; i < points.length; i++) {
        this.points.push(new Vector(points[i].x, points[i].y, points[i].z))
      }
    }
  },
  'print': {
    value: function() {
      var str = 'Polyline[' + this.count + '] : ['
      for (var i = 0; i < this.points.length; i++) {
        var point = this.points[i]
        str += this.points[i].str() + ', '
      }
      str += ']'
      console.log(str)
    }
  }
})

// Circle Parameter
class GHCircle extends GHParam {
  constructor(plane, r) {
    super('Circle')
    this.pl = plane
    this.radius = r
  }
}
Object.defineProperties(GHCircle.prototype, {
  '_origin': {
    set: function(x,y,z) {
      this.pl.origin._setData(x,y,z)
    }
  },
  'origin': {
    get: function() { return this.pl.origin },
    set: function(x,y,z) {
      this._origin(x,y,z)
      this.hasChanged()
    }
  },
  '_plane': {
    set: function(val) {
      this.pl = val.clone()
    }
  },
  'plane': {
    get: function() { return this.pl },
    set: function(val) {
      this._plane = val
      this.hasChanged()
    }
  },
  '_r': {
    set: function(val) {
      this.radius = val
    }
  },
  'r': {
    get: function() { return this.radius },
    set: function(val) {
      this._r = val
      this.hasChanged()
    }
  },
  'getData': {
    value: function() { return {plane:this.plane, r:this.r} }
  },
  'setData': {
    value: function(plane,r) { this._setData(plane,r); this.hasChanged()}
  },
  '_setData': {
    value: function(plane,r) { this._plane = plane; this._r = r } // set data but does not raise hasChanged event
  },
  'print': {
    value: function() {
      console.log(
        "Circle[" + this.id + "] : "+
        " O:" + this.pl.origin.str() + " & r: " + Math.round10(this.r,-display_decimal)
      )
    }
  }
})

// Arc Parameter
class GHArc extends GHParam {
  constructor(plane, r, a1, a2) {
    super('Arc')
    this.pl = plane
    this.radius = r
    this.angle_1 = a1  // oriented angle around zaxis from xaxis (pi>a1>0 )
    this.angle_2 = a2  // oriented angle around zaxis from xaxis (-pi<a2<0)
    // this definition aknowledge that the p = plane.origin + r * plane.xaxis is on the arc
  }
}
Object.defineProperties(GHArc.prototype, {
  '_origin': {
    set: function(x,y,z) {
      this.pl.origin._setData(x,y,z)
    }
  },
  'origin': {
    get: function() { return this.pl.origin },
    set: function(x,y,z) {
      this._origin(x,y,z)
      this.hasChanged()
    }
  },
  '_plane': {
    set: function(val) {
      this.pl = val.clone()
    }
  },
  'plane': {
    get: function() { return this.pl },
    set: function(val) {
      this._plane = val
      this.hasChanged()
    }
  },
  '_r': {
    set: function(val) {
      this.radius = val
    }
  },
  'r': {
    get: function() { return this.radius },
    set: function(val) {
      this._r = val
      this.hasChanged()
    }
  },
  '_a1': {
    set: function(val) {
      this.angle_1 = val
    }
  },
  'a1': {
    get: function() { return this.angle_1 },
    set: function(val) {
      this._a1 = val
      this.hasChanged()
    }
  },
  '_a2': {
    set: function(val) {
      this.angle_2 = val
    }
  },
  'a2': {
    get: function() { return this.angle_2 },
    set: function(val) {
      this._a2 = val
      this.hasChanged()
    }
  },
  'getData': {
    value: function() { return { plane:this.plane, r:this.r, ai:this.a1, a2:this.a2 } }
  },
  'setData': {
    value: function(plane,r, a1, a2) { this._setData(plane,r, a1, a2); this.hasChanged() }
  },
  '_setData': {
    value: function(plane,r, a1, a2) {
      this._plane = plane
      this._r=r
      this._a1 = a1
      this._a2 = a2
    } // set data but does not raise hasChanged event
  },
  'print': {
    value: function() {
      console.log(
        "Arc[" + this.id + "] : "+
        " O:" + this.pl.origin.str() + " & r: " + Math.round10(this.r,-display_decimal) +
        ' (' + Math.round10(this.a1*(180/3.1416),-1) + ', ' +  Math.round10(this.a2*(180/3.1416),-1) +')'
      )
    }
  }
})

// Curve Parameter (Poly Cubic Bezier)
class GHCurve extends GHParam {
  constructor(P, Q1, Q2) {
    super('Curve')
    this.p = P
    this.q1 = Q1
    this.q2 = Q2
  }
}
Object.defineProperties(GHCurve.prototype, {
  'count': {
    get: function() { return this.p.length }
  },
  'length': {
    get: function() {
      return 0
    }
  },
  'P': {
    value: function() { return this.p }
  },
  'Q1': {
    value: function() { return this.q1 }
  },
  'Q2': {
    value: function() { return this.q2 }
  },
  'getData': {
    value: function() { return {P:this.P, Q1:this.Q1, Q2:this.Q2} }
  },
  'setData': {
    value: function(P,Q1,Q2) {
      this._setData(P,Q1,Q2)
      this.hasChanged()
    }
  },
  '_setData': {
    value: function(P,Q1,Q2) {
      this.p = P
      this.q1 = Q1
      this.q2 = Q2
    }
  },
  'print': {
    value: function() {
      var str = 'Curve[' + this.count + '] : ['
      for (var i = 0; i < this.p.length; i++) {
        str += this.p[i].str() + ', '
      }
      str += ']'
      console.log(str)
    }
  }
})
