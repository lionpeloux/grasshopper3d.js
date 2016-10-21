// Lionel du Peloux - 2016
// Licence : MIT

// parameters are objects that store datas
// components are objects that acte on datas

// global variables to trace refresh
var debug_register  = true
var debug_statut    = true
var debug_refresh   = true

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
    this.svg_out = []       // register all dependents svgobj
  }
}
Object.defineProperties(GHParam.prototype, {
  'register_comp': { // register an output parameter no needs to bind
    configurable: false,
    value: function(comp) {
      this.comp_out.push(comp)
      return comp
    }
  },
  'register_svg': { // register an svg parameter no needs to bind
    configurable: false,
    value: function(svg) {
      this.svg_out.push(svg)
      return svg
    }
  },
  'hasChanged': { // raise "hasChanged" event => compute new statuts and recompute solution
    value: function() {console.log("==== STATUT ==== "); this.spreadStatut(); console.log("==== REFERSH ==== "); this.spreadRefresh()}
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
      for (var i = 0; i < this.svg_out.length; i++) {
        this.svg_out[i].spreadRefresh()
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
      for (var i = 0; i < this.svg_out.length; i++) {
        this.svg_out[i].spreadStatut()
      }
    }
  }
})

// Generic Component (base class)
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
    value: function(param) {
      param.register_svg(this)
      return param
    }
  },
  'attr': {
    value: function(options) {this.svgobj.attr(options); console.log("atttrr");console.log(options);return this}
  },
  'addClass': {
    value: function(str) {this.svgobj.addClass(str); return this}
  },
  'toGroup': {
    value: function(grp) { grp.add(this.svgobj); return this}
  },
  'svg': {
    get: function() { return this.svgobj },
    set: function(val) { return this.svgobj = val },
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

// Solution class
/**
 * Represents a book.
 * @constructor
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 */
class GHSolution {
  constructor(){
    this.param_root = []    // solution's root parameters - have no parents - may have 0 to N childs
    this.param_comp = []    // solution's not-root parameters - auto generated by components - must not be edited
    this.comp       = []    // register all dependent components

    this.isupdated = true   // false if the solution needs to be recomputed
  }
}
// GHParameters Methodes
Object.defineProperties(GHSolution.prototype, {
  'Point': { // register an output parameter no needs to bind
    value: function(x, y, z) {
      var param = new GHPoint(this.param_root.length, x, y, z)
      this.param_root.push(param)
      return param
    }
  },
  'register_svg': { // register an svg parameter no needs to bind
    configurable: false,
    value: function(svg) {
      this.svg_out.push(svg)
      return svg
    }
  },
  'hasChanged': { // raise "hasChanged" event => compute new statuts and recompute solution
    value: function() {console.log("==== STATUT ==== "); this.spreadStatut(); console.log("==== REFERSH ==== "); this.spreadRefresh()}
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
      for (var i = 0; i < this.svg_out.length; i++) {
        this.svg_out[i].spreadRefresh()
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
      for (var i = 0; i < this.svg_out.length; i++) {
        this.svg_out[i].spreadStatut()
      }
    }
  }
})
// GHComponents Methodes
Object.defineProperties(GHSolution.prototype, {

})

// Render class
/**
 * Represents a book.
 * @constructor
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 */
class GHRender {
  constructor(){
    this.mproj  =  Matrix.identity()  // global transformation matrix to apply for drawing 3D to 2D
    this.ghsvg  = []                  // register all ghsvg instances in the current render

    this.isupdated = true   // false if the render needs to be redrawn
  }
}
