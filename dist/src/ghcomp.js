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
    this.id = id          // unique id = 0, ..., N
    this.name = name      // component name
    this.isupdated = true // false if the value is waiting to be computed
    this.param_in = []    // register all input parameters
    this.param_out = []   // register all output parameters
  }
}
Object.defineProperties(GHComp.prototype, {
  'refresh': {
    configurable: true,
    value: function() {return ""} // to be overrided in components
  },
  'spreadRefresh': {
    value: function() {
      this.refresh()
      this.isupdated = true
      console.log("Comp[" + this.id + "] : isupdated = " + this.isupdated)
      for (var i = 0; i < this.param_out.length; i++) {
        this.param_out[i].spreadRefresh()
      }
    }
  },
  'spreadStatut': {
    value: function() {
      this.isupdated = false
      console.log("Comp[" + this.id + "] : isupdated = " + this.isupdated)
      for (var i = 0; i < this.param_out.length; i++) {
        this.param_out[i].spreadStatut()
      }
    }
  }
})

// Mid Point
class GHComp_Pts_Mid extends GHComp {
  constructor(id, p1, p2){
    super(id, "Midpoint")
    this.p1 = p1
    this.param_in.push(p1)
    p1.comp_out.push(this)

    this.p2 = p2
    this.param_in.push(p2)
    p2.comp_out.push(this)

    this.pmid = new GHPoint('C', (p1.x + p2.x)/2, (p1.y + p2.y)/2, (p1.z + p2.z)/2)
    this.param_out.push(this.pmid)
  }
}
Object.defineProperties(GHComp_Pts_Mid.prototype, {
  'midpoint': {
    get: function() { return this.pmid },
  },
  'refresh': {
    value: function() { this.pmid._setData((this.p1.x + this.p2.x)/2, (this.p1.y + this.p2.y)/2, (this.p1.z + this.p2.z)/2) },
  },
})
