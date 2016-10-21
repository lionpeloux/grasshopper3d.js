// Lionel du Peloux - 2016
// Licence : MIT

// parameters are objects that store datas
// components are objects that acte on datas

// Number Parameter
class GHNumber extends GHParam {
  constructor(id, num) {
    super(id, 'Number')
    this.num = num
  }
}
Object.defineProperties(GHNumber.prototype, {
  '_value': {
    set: function(val) {
      this.num = val
    }
  },
  'value': {
    get: function() { return this.num },
    set: function(val) {
      this.num = val
      this.hasChanged()
    }
  },
  'getData': {
    value: function() { return this.num }
  },
  'setData': {
    value: function(num) { this.num = num; this.hasChanged()}
  },
  '_setData': {
    value: function(num) { this.num = num; } // set data but does not raise hasChanged event
  },
  'print': {
    value: function() { console.log("Number[" + this.id + "] : " + this.num ) }
  }
})

// Point Parameter
class GHPoint extends GHParam {
  constructor(id, x, y, z) {
    super(id, 'Point')
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
      this.point.x = val
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
      this.point.y = val
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
      this.point.z = val
      this.hasChanged()
    }
  },
  'getData': {
    value: function() { return this.point }
  },
  'setData': {
    value: function(x,y,z) { this.point.x=x; this.point.y=y; this.point.z=z; this.hasChanged()}
  },
  '_setData': {
    value: function(x,y,z) { this.point.x=x; this.point.y=y; this.point.z=z;} // set data but does not raise hasChanged event
  },
  'print': {
    value: function() { console.log("Point[" + this.id + "] : (" + this.point.x + ", " + this.point.y + ", " + this.point.z + ")") }
  }
})

// Vector Parameter
class GHVector extends GHParam {
  constructor(id, x, y, z) {
    super(id, 'Vector')
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
      this.vector.x = val
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
      this.vector.y = val
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
      this.vector.z = val
      this.hasChanged()
    }
  },
  'getData': {
    value: function() { return this.vector }
  },
  'setData': {
    value: function(x,y,z) { this.vector.x=x; this.vector.y=y; this.vector.z=z; this.hasChanged()}
  },
  '_setData': {
    value: function(x,y,z) { this.vector.x=x; this.vector.y=y; this.vector.z=z;} // set data but does not raise hasChanged event
  },
  'print': {
    value: function() { console.log("Point[" + this.id + "] : (" + this.vector.x + ", " + this.vector.y + ", " + this.vector.z + ")") }
  }
})

// Plane Parameter
class GHPlane extends GHParam {
  constructor(id, origin, xaxis, yaxis) {
    super(id, 'Point')
    this.plane = new Plane(origin, xaxis, yaxis)
  }
}
Object.defineProperties(GHPlane.prototype, {
  '_xaxis': {
    set: function(val) {
      this.plane.xaxis = val
    }
  },
  'xaxis': {
    get: function() { return this.plane.xaxis },
    set: function(val) {
      this.plane.xaxis = val
      this.hasChanged()
    }
  },
  '_yaxis': {
    set: function(val) {
      this.plane.yaxis = val
    }
  },
  'yaxis': {
    get: function() { return this.plane.yaxis },
    set: function(val) {
      this.plane.yaxis = val
      this.hasChanged()
    }
  },
  '_zaxis': {
    set: function(val) {
      this.plane.zaxis = val
    }
  },
  'zaxis': {
    get: function() { return this.plane.zaxis },
    set: function(val) {
      this.plane.zaxis = val
      this.hasChanged()
    }
  },
  'getData': {
    value: function() { return this.plane }
  },
  'setData': {
    value: function(origin, xaxis, yaxis) {
      this.plane = new Plane(origin, xaxis, yaxis)
      this.hasChanged()
    }
  },
  '_setData': {
    value: function(x,y,z) {
      this.plane = new Plane(origin, xaxis, yaxis)
    } // set data but does not raise hasChanged event
  },
  'print': {
    value: function() { console.log("Plane[" + this.id + "] : " +
    "(O: " + this.plane.origin.x  + ", " + this.plane.origin.y  + ", " + this.plane.origin.z  + ")" +
    "(X: " + this.plane.xaxis.x   + ", " + this.plane.xaxis.y   + ", " + this.plane.xaxis.z   + ")" +
    "(Y: " + this.plane.yaxis.x   + ", " + this.plane.yaxis.y   + ", " + this.plane.yaxis.z   + ")" +
    "(Z: " + this.plane.zaxis.x   + ", " + this.plane.zaxis.y   + ", " + this.plane.zaxis.z   + ")"
    )}
  }
})

// Polyline Parameter (a Line is a Polyline with only 2 points)
class GHPolyline extends GHParam {
  constructor(id, points) {
    super(id, 'Polyline')
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
      this.points = []
      for (var i = 0; i < points.length; i++) {
        this.points.push(new Vector(points[i].x, points[i].y, points[i].z))
      }
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
      console.log("Polyline[" + this.count + "]")
      for (var i = 0; i < this.points.length; i++) {
        var point = this.points[i]
        console.log("Point[" + i + "] : (" + point.x + ", " + point.y + ", " + point.z + ")")
      }
    }
  }
})

// Circle Parameter
class GHCircle extends GHParam {
  constructor(id, plane, r) {
    super(id, 'Circle')
    console.log(plane);
    this.pl = plane
    this.radius = r
  }
}
Object.defineProperties(GHCircle.prototype, {
  '_plane': {
    set: function(val) {
      this.pl = val.clone()
    }
  },
  'plane': {
    get: function() { return this.pl },
    set: function(val) {
      this.pl = val.clone()
      this.hasChanged()
    }
  },
  '_r': {
    set: function(r) {
      this.radius = r
    }
  },
  'r': {
    get: function() { return this.radius },
    set: function(val) {
      this.radius = val
      this.hasChanged()
    }
  },
  'getData': {
    value: function() { return {plane:this.pl, r:this.r} }
  },
  'setData': {
    value: function(plane,r) { this.pl=plane.clone(); this.r=r; this.hasChanged()}
  },
  '_setData': {
    value: function(plane,r) { this.pl=plane.clone(); this.r=r } // set data but does not raise hasChanged event
  },
  'print': {
    value: function() { console.log("Circle[" + this.id + "] : "+
    "(O:" + this.pl.origin.x + ", " + this.pl.origin.y + ", " + this.pl.origin.z + ")" + " r = " + this.r) }
  }
})

// Arc Parameter
class GHArc extends GHParam {
  constructor(id, plane, r) {
    super(id, 'Circle')
    console.log(plane);
    this.pl = plane
    this.radius = r
  }
}
Object.defineProperties(GHArc.prototype, {
  '_plane': {
    set: function(val) {
      this.pl = val.clone()
    }
  },
  'plane': {
    get: function() { return this.pl },
    set: function(val) {
      this.pl = val.clone()
      this.hasChanged()
    }
  },
  '_r': {
    set: function(r) {
      this.radius = r
    }
  },
  'r': {
    get: function() { return this.radius },
    set: function(val) {
      this.radius = val
      this.hasChanged()
    }
  },
  'getData': {
    value: function() { return {plane:this.pl, r:this.r} }
  },
  'setData': {
    value: function(plane,r) { this.pl=plane.clone(); this.r=r; this.hasChanged()}
  },
  '_setData': {
    value: function(plane,r) { this.pl=plane.clone(); this.r=r } // set data but does not raise hasChanged event
  },
  'print': {
    value: function() { console.log("Circle[" + this.id + "] : "+
    "(O:" + this.pl.origin.x + ", " + this.pl.origin.y + ", " + this.pl.origin.z + ")" + " r = " + this.r) }
  }
})
