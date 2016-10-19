// Lionel du Peloux - 2016
// Licence : MIT

// parameters are objects that store datas
// components are objects that acte on datas

// Generic Parameter (base class)
/**
 * Represents a book.
 * @constructor
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 */
class GHParam {
  constructor(id, type){
    this.id = id            // unique id = 0, ..., N
    this.type = type        // param type
    this.isupdated = true   // false if the value is waiting to be computed
    this.comp_out = []      // register all dependents components
  }
}
Object.defineProperties(GHParam.prototype, {
  'hasChanged': { // raise "hasChanged" event => compute new statuts and recompute solution
    value: function() {this.spreadStatut(); this.spreadRefresh()}
  },
  'refresh': {
    value: function() {}
  },
  'spreadRefresh': {
    value: function() {
      this.refresh()
      this.isupdated = true
      console.log('Param[' + this.id + '] : isupdated = ' + this.isupdated)
      this.print()
      for (var i = 0; i < this.comp_out.length; i++) {
        this.comp_out[i].spreadRefresh()
      }
    }
  },
  'spreadStatut': {
    value: function() {
      this.isupdated = false
      console.log('Param[' + this.id + '] : isupdated = ' + this.isupdated)
      for (var i = 0; i < this.comp_out.length; i++) {
        this.comp_out[i].spreadStatut()
      }
    }
  }
})

// Value Parameter

// Point Parameter
class GHPoint extends GHParam {
  constructor(id, x, y, z) {
    super(id, 'Point')
    this.point = new Vector(x,y,z)
  }
}
Object.defineProperties(GHPoint.prototype, {
  'x': {
    get: function() { return this.point.x },
    set: function(val) { this.point.x = val;
      console.log("=== STATUT ===");
      this.spreadStatut();
      console.log("=== REFRESH ===");
      this.spreadRefresh()
    }
  },
  'y': {
    get: function() { return this.point.y },
    set: function(val) { this.point.y = val; this.hasChanged()}
  },
  'z': {
    get: function() { return this.point.z },
    set: function(val) { this.point.z = val; this.hasChanged()}
  },
  'getData': {
    value: function() { return this.point; this.hasChanged()}
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
      this.spreadStatut()
      this.spreadRefresh()
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
        console.log("Point[" + i + "] : (" + this.point.x + ", " + this.point.y + ", " + this.point.z + ")")
      }
    }
  }
})














// function GHParam() {
//   this.id = -1          // unique id = 0, ..., N
//   this.type = ""        // param type
//   this.isupdated = true // false if the value is waiting to be computed
//   this.comp_out = []    // register all dependents components
// }
// Object.defineProperties(GHParam.prototype, {
//   'refresh': {
//     value: function() {}
//   },
//   'spread_refresh': {
//     value: function() {
//       this.refresh()
//       this.isupdated = true
//       for (var i = 0; i < this.comp_out.length; i++) {
//         this.comp_out[i].refresh()
//       }
//     }
//   },
//   'spread_statut': {
//     value: function() {
//       this.isupdated = false
//       console.log("Param[" + this.id + "] : isupdated = " + this.isupdated)
//       for (var i = 0; i < this.comp_out.length; i++) {
//         this.comp_out[i].spread_statut()
//       }
//     }
//   }
// })
//
// // Number Parameter
// function GHNumber(number) {
//   this.type = "Number"
//   this.value = number
// }
// GHNumber.prototype = new GHParam // Inheritence from GHParam
//
// Object.defineProperties(GHNumber.prototype, {
//   'value': {
//     get: function() { return this.value },
//     set: function(val) { this.value = val; this.spread_refresh()}
//   },
//   'print': {
//     value: function() { console.log("Number : " + this.value) }
//   }
// })
//
// // Point Parameter
// function GHPoint(x,y,z) {
//   this.type = "Point"
//   this.point = new Vector(x,y,z)
// }
// GHPoint.prototype = new GHParam // Inheritence from GHParam
//
// Object.defineProperties(GHPoint.prototype, {
//   'x': {
//     get: function() { return this.point.x },
//     set: function(val) { this.point.x = val; this.spread_statut();}
//   },
//   'y': {
//     get: function() { return this.point.y },
//     set: function(val) { this.point.y = val; this.spread_refresh()}
//   },
//   'z': {
//     get: function() { return this.point.z },
//     set: function(val) { this.point.z = val; this.spread_refresh()}
//   },
//   'value': {
//     get: function() { return this.point },
//     set: function(x,y,z) { this.point.x=x, this.point.y=y, this.point.z=z, this.spread_refresh()}
//   },
//   'print': {
//     value: function() { console.log("Point[" + this.id + "] : (" + this.point.x + ", " + this.point.y + ", " + this.point.z + ")") }
//   }
// })
