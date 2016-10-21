// Provides a simple 3D plane class. A valid plane is such that xaxis, yaxis,
// zaxis are unit vectors and xaxis x yaxis = zaxis <> 0
//Plane operations can be done using member
// functions, which return new planes/vector, or static functions, which reuse
// existing planes/vectors to avoid generating garbage.
function Plane(origin, xaxis, yaxis) {
  this.origin = origin.clone() || new Vector(0,0,0)
  this.xaxis = xaxis.unit() || new Vector(1,0,0)
  this.yaxis = yaxis.unit() || new Vector(0,1,0)
  this.zaxis = xaxis.cross(yaxis)
}

// ### Instance Methods
// The methods `add()`, `subtract()`, `multiply()`, and `divide()` can all
// take either a vector or a number as an argument.
Plane.prototype = {
  str: function() {
    return  'origin:' + this.origin.str() + '\n' +
            'xaxis:' + this.xaxis.str() + '\n' +
            'yaxis:' + this.yaxis.str() + '\n' +
            'zaxis:' + this.zaxis.str()
  },
  equals: function(p) {
    return this.origin.equals(p.origin) && this.xaxis.equals(p.xaxis) && this.yaxis.equals(p.yaxis);
  },
  clone: function() {
    return new Plane(this.origin, this.xaxis, this.yaxis);
  },
}

// ### Static Methods
// `Vector.randomDirection()` returns a vector with a length of 1 and a
// statistically uniform direction. `Vector.lerp()` performs linear
// interpolation between two vectors.
Plane.XY = function() {
  return new Plane(new Vector(0,0,0), new Vector(1,0,0), new Vector(0,1,0), new Vector(0,0,1))
};
