// Lionel du Peloux - 2016
// Licence : MIT

// parameters are objects that store datas
// components are objects that acte on datas

// global variables to trace refresh
var debug           = false
var log_register    = false
var log_statut      = false
var log_refresh     = false
var display_decimal = 3
var arc_as_cbcurve  = false // if true, arc and circles are approximated as Cubic Bezier Curves

// =============================================================================
//  BASE CLASSES
// =============================================================================

// Generic Parameter (base class)
/**
 * Represents a book.
 * @constructor
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 */
class GHParam {
  constructor(type){
    this.id = -1            // unique id = 0, ..., N
    this.type = type        // param type
    this.isupdated = true   // false if the value is waiting to be computed
    this.isroot = false     // true if this is a root parameter (default to false)
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
    value: function() {
      if (log_statut || log_refresh) {
        console.log("===============================")
        console.log("  RECOMPUTE SOLUTION           ")
        console.log("")
      }
      if (log_statut) {
        console.log("*** broadcast statut ***")
      }
      this.spreadStatut();
      if (log_refresh) {
        console.log("")
        console.log("*** broadcast refresh ***")

      }
      this.spreadRefresh()}
  },
  'refresh': {
    value: function() {}
  },
  'spreadRefresh': {
    value: function() {
      this.refresh()
      this.isupdated = true
      if (log_refresh) { console.log("Param[" + this.type + '-' + this.id + "] : isupdated = " + this.isupdated) }
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
      if (log_statut) { console.log("Param[" + this.type + '-' + this.id + "] : isupdated = " + this.isupdated) }
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
    value: function() {} // to be overrided in components
  },
  'spreadRefresh': {
    configurable: false,
    value: function() {

      // wait till all input parameters have been refreshed
      for (var i = 0; i < this.param_in.length; i++) {
        if (this.param_in[i].isupdated == false) { return }
      }

      // refresh should not be propagated more than once
      if (this.isupdated == true) { return }

      // otherwise, the component is ready to be refreshed
      this.refresh()
      this.isupdated = true
      if (log_refresh) { console.log("Comp[" + this.id + "] : isupdated = " + this.isupdated) }
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
      if (log_statut) { console.log("Comp[" + this.id + "] : isupdated = " + this.isupdated) }
      for (var i = 0; i < this.param_out.length; i++) {
        this.param_out[i].spreadStatut()
      }
    }
  }
})

// Generic SVG (base class)
class GHSvg {
  constructor(paper, viewport, id, name){
    this.id = id              // unique id = 0, ..., N
    this.name = name          // component name
    this.paper = paper          // reference to snap object
    this.isupdated = true     // false if the value is waiting to be computed
    this.viewport = viewport  // global transformation matrix to apply for drawing 3D to 2D
    this.param_in = []        // register all input parameters
    this.svgobj = []          // a coolection of snapsvg elements

    this.grp = undefined    // if several svgobj they should be grouped ?
    // put generic logic here for drag&drop
    // and animation callbacks on load
  }
}
Object.defineProperties(GHSvg.prototype, {
  'register_in': { // resgister an input parameter and bind it to the component
    configurable: false,
    value: function(param) {
      this.param_in.push(param)
      param.register_svg(this)
      return param
    }
  },
  'register_svg': { // resgister a snap cvg element
    configurable: false,
    value: function(svg) {
      this.svgobj.push(svg)
      return svg
    }
  },
  'refresh': {
    configurable: true,
    value: function() {} // to be overrided in components
  },
  'spreadRefresh': {
    configurable: false,
    value: function() {

      // wait till all input parameters have been refreshed
      for (var i = 0; i < this.param_in.length; i++) {
        if (this.param_in[i].isupdated == false) { return}
      }

      // refresh should not be propagated more than once
      if (this.isupdated == true) { return }

      // otherwise, the component is ready to be refreshed
      this.refresh()
      this.isupdated = true
      if (log_refresh) { console.log("Svg[" + this.id + "] : isupdated = " + this.isupdated) }
    }
  },
  'spreadStatut': {
    configurable: false,
    value: function() {
      // statut should not be propagated more than once
      if (this.isupdated == false) { return }

      // otherwise, the component is hit by a statut switch and must propagate the spreadStatut process
      this.isupdated = false
      if (log_statut) { console.log("Svg[" + this.id + "] : isupdated = " + this.isupdated) }
    }
  },
  'group': {  // group all svgobj
    value: function(options) {
      if (this.grp === undefined) {this.grp = this.paper.group()}
      for (var i = 0; i < this.svgobj.length; i++) {
        this.grp.add(this.svgobj[i])
      }
      return this
    }
  },
  'attr': {
    value: function(options) {
      for (var i = 0; i < this.svgobj.length; i++) {
        this.svgobj[i].attr(options)
      }
      return this
    }
  },
  'addClass': {
    value: function(str) {
      if (this.grp === undefined) { // add attr to all elements
        for (var i = 0; i < this.svgobj.length; i++) {
          this.svgobj[i].addClass(str)
        }
      }
      else { // a group exists, add it to the grp
        this.grp.addClass(str)
      }
      return this
    }
  },
  'toGroup': {
    value: function(grp) {
      if (this.grp === undefined) { // add all elements to grp
        for (var i = 0; i < this.svgobj.length; i++) {
          grp.add(this.svgobj[i])
        }
      }
      else { // a group exists, add it to the grp
        grp.add(this.grp)
      }
      return this
    }
  },
  'svg': {
    get: function() { return this.svgobj },
    set: function(val) { return this.svgobj = val },
  },
})

// =============================================================================
//  SOLUTION
// =============================================================================

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
  'RegisterRootParam': {
    value: function(param) {
      param.id = this.param_root.length
      this.param_root.push(param)
      param.isroot = true
      return param
    }
  },
  'Number': {
    value: function(num) {
      return this.RegisterRootParam(new GHNumber(num))
    }
  },
  'Point': {
    value: function(x, y, z) {
      return this.RegisterRootParam(new GHPoint(x, y, z))
    }
  },
  'Vector': {
    value: function(x, y, z) {
      return this.RegisterRootParam(new GHVector(x, y, z))
    }
  },
  'Plane': {
    value: function(origin, xaxis, yaxis) {
      return this.RegisterRootParam(new GHPlane(origin, xaxis, yaxis))
    }
  },
  'Circle': {
    value: function(plane, r) {
      return this.RegisterRootParam(new GHCircle(plane, r))
    }
  },
  'Arc': {
    value: function(plane, r, a1, a2) {
      return this.RegisterRootParam(new GHArc(plane, r, a1, a2))
    }
  },
  'Polyline': {
    value: function(points) {
      this.RegisterRootParam(new GHPolyline(points))
    }
  },
})
// GHComponents Methodes
Object.defineProperties(GHSolution.prototype, {
  'RegisterComp': {
    value: function(comp) {
      // register comp newly created param_out parameters
      for (var i = 0; i < comp.param_out.length; i++) {
        var param = comp.param_out[i]
        param.id = this.param_comp.length
        this.param_comp.push(param)
      }
      // register comp
      this.comp.push(comp)
    }
  },
  'MidPoint': {
    value: function(ghp1, ghp2) {
      var comp = new GHComp_Pts_Mid(this.comp.length, ghp1, ghp2)
      this.RegisterComp(comp)
      return comp
    }
  },
  'Circle3pts': {
    value: function(ghps, ghpc, ghpe) {
      var comp = new GHComp_Circle_3pts(this.comp.length, ghps, ghpc, ghpe)
      this.RegisterComp(comp)
      return comp
    }
  },
  'Arc3pts': {
    value: function(ghps, ghpc, ghpe) {
      var comp = new GHComp_Arc_3pts(this.comp.length, ghps, ghpc, ghpe)
      this.RegisterComp(comp)
      return comp
    }
  },
  'PolylineFromPts': {
    value: function(pts) {
      var comp = new GHComp_Polyline(this.comp.length, pts)
      this.RegisterComp(comp)
      return comp
    }
  },
})

// =============================================================================
//  RENDER
// =============================================================================

// Render class
/**
 * Represents a book.
 * @constructor
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 */
class GHRender {
  constructor(width=710, height=400, htmltag){
    this.viewport   =  Matrix.identity()  // global transformation matrix to apply for drawing 3D to 2D
    this.comp_svg = []                   // register all ghsvg instances in the current render
    this.isupdated  = true                // false if the render needs to be redrawn

    // create cartesian centered snap paper with a border

    this.width      = width
    this.height     = height
    this.paper      = Snap(this.width,this.height)
    this.mastergrp  = this.paper.g()
                                .attr({id:"cartesian"})
                                .attr({transform:"translate("+this.width/2+","+this.height/2+") scale(1,-1)"})
    this.borderbox  = this.paper.rect(-this.width/2, -this.height/2, this.width, this.height)
                           .attr({strokeWidth:"1px", stroke:"black", fill:"none"})
    this.mastergrp.add(this.borderbox)

    // append the paper to the given htmltag
    if (htmltag === undefined) {} else {
      this.paper.attr({style:'display:block; margin:auto'})
      Snap(htmltag).append(this.paper)
    }

    // how to deal with groups ?
    // how to deal with markers ?
    // how to deal with defs ?
  }
}
// GHRender Methodes
Object.defineProperties(GHRender.prototype, {
  'registerSvg': {
    value: function(ghsvg) {
      ghsvg.toGroup(this.mastergrp)
      this.comp_svg.push(ghsvg)
    }
  },
  'redraw': { // to be called after a change of viewport
    value: function() {
      for (var i = 0; i < this.comp_svg.length; i++) {
        this.comp_svg[i].refresh()
      }
    }
  },
  'setViewport': {
    value: function(viewport) {
      this.viewport._setData(viewport)
      this.redraw()
    }
  },
  'Point': {
    value: function(ghpoint, r) {
      var ghsvg = new GHSvg_Point(this.paper, this.viewport, this.comp_svg.length, ghpoint, r)
      this.registerSvg(ghsvg)
      return ghsvg
    }
  },
  'Polyline': {
    value: function(ghpolyline) {
      var ghsvg = new GHSvg_Polyline(this.paper, this.viewport, this.comp_svg.length, ghpolyline)
      this.registerSvg(ghsvg)
      return ghsvg
    }
  },
  'Circle': {
    value: function(ghcircle) {
      var ghsvg = new GHSvg_Circle(this.paper, this.viewport, this.comp_svg.length, ghcircle)
      this.registerSvg(ghsvg)
      return ghsvg
    }
  },
  'Arc': {
    value: function(gharc) {
      var ghsvg = new GHSvg_Arc(this.paper, this.viewport, this.comp_svg.length, gharc)
      this.registerSvg(ghsvg)
      return ghsvg
    }
  },
})
