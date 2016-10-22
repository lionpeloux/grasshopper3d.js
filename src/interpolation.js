// from d3.js

function Circle3pts(start, center, end){

    var e1, e2, ee
    e1 = center.subtract(start)
    e2 = end.subtract(center)
    ee = end.subtract(start)

    var l1, l2, ll
    l1 = e1.length()
    l2 = e2.length()
    ll = ee.length()

    var u1, u2, t
    u1 = e1.divide(l1)
    u2 = e2.divide(l2)
    t = u1.multiply(l2/ll).add(u2.multiply(l1/ll))

    var phi = Vector.angleBetween(e1,e2)
    var kb = e1.cross(e2).multiply(2/(l1*l2*ll))
    var k = kb.length()

    var n = t.cross(kb).divide(k)
    var c = center.subtract(n.multiply(1/k))

    var t1 = (u1.multiply(2*(t.dot(u1)))).subtract(t)
    var t2 = (u2.multiply(2*(t.dot(u2)))).subtract(t)

    var xaxis = center.subtract(c)
    var yaxis = kb.cross(xaxis)
    var plane = new Plane(c,xaxis,yaxis)

    var a1 = - Math.acos(t1.dot(t)) // oriented angle
    var a2 =   Math.acos(t2.dot(t)) // oriented angle

    console.log("t1 = " + t1.str() + " " + t1.length());
    console.log("t2 = " + t2.str() + " " + t2.length());

    return {plane:plane, a1:a1, a2:a2, k:k, kb:kb, c:c, t:t, t1:t1, t2:t2}
}
function ArcToCBCurve(plane, r, a1, a2, angle_max = 1.0471975512){
  // http://pomax.github.io/bezierinfo/#circles_cubic
  // max angle of a single cubic bezier element

  var n1 = Math.floor(-a1/angle_max) + 1
  var phi_1 = -a1/n1 // < 0
  var f1 = 4/3*Math.tan(phi_1/4)
  var q1_1 = [r,r*f1]
  var q2_1 = [r*(Math.cos(phi_1)+f1*Math.sin(phi_1)),r*(Math.sin(phi_1)-f1*Math.cos(phi_1))]

  var n2 = Math.floor(a2/angle_max) + 1
  var phi_2 = a2/n2 //  > 0
  var f2 = 4/3*Math.tan(phi_2/4)
  var q1_2 = [r,r*f2]
  var q2_2 = [r*(Math.cos(phi_2)+f2*Math.sin(phi_2)),r*(Math.sin(phi_2)-f2*Math.cos(phi_2))]

  var P = []
  var Q1 = []
  var Q2 = []

  var theta, c, s

  // generate arc center => start
  for (var i = 0; i < n1; i++) {
    theta = i * (phi_1)
    c = Math.cos(theta)
    s = Math.sin(theta)
    P.push(
      plane.origin
      .add(plane.xaxis.multiply(c*r))
      .add(plane.yaxis.multiply(-s*r))
    )
    Q2.push(
      plane.origin
      .add(plane.xaxis.multiply(c*q1_1[0] - s*q1_1[1]))
      .add(plane.yaxis.multiply(-(s*q1_1[0] + c*q1_1[1])))
    )
    Q1.push(
      plane.origin
      .add(plane.xaxis.multiply(c*q2_1[0] - s*q2_1[1]))
      .add(plane.yaxis.multiply(-(s*q2_1[0] + c*q2_1[1])))
    )
  }

  // last point
  theta = n1 * (phi_1)
  c = Math.cos(theta)
  s = Math.sin(theta)
  P.push(
    plane.origin
    .add(plane.xaxis.multiply(c*r))
    .add(plane.yaxis.multiply(-s*r))
  )

  // reverse arc from start => center
  // warning, reversing permutes Q1 <=>
  P.reverse()
  Q1.reverse()
  Q2.reverse()

  // remove common point
  P.pop()

  // generate arc center => end
  for (var i = 0; i < n2; i++) {
    theta = i * (phi_2)
    c = Math.cos(theta)
    s = Math.sin(theta)
    P.push(
      plane.origin
      .add(plane.xaxis.multiply(c*r))
      .add(plane.yaxis.multiply(s*r))
    )
    Q1.push(
      plane.origin
      .add(plane.xaxis.multiply(c*q1_2[0] - s*q1_2[1]))
      .add(plane.yaxis.multiply(s*q1_2[0] + c*q1_2[1]))
    )
    Q2.push(
      plane.origin
      .add(plane.xaxis.multiply(c*q2_2[0] - s*q2_2[1]))
      .add(plane.yaxis.multiply(s*q2_2[0] + c*q2_2[1]))
    )
  }

  // add last point
  theta = n2 * (phi_2)
  c = Math.cos(theta)
  s = Math.sin(theta)
  P.push(
    plane.origin
    .add(plane.xaxis.multiply(c*r))
    .add(plane.yaxis.multiply(s*r))
  )

  return [P,Q1,Q2]

}


// http://stackoverflow.com/question1/3526940/how-to-create-a-cubic-bezier-curve-when-given-n-points-in-3d
// http://stackoverflow.com/question1/30748316/svg-paths-and-the-catmull-rom-algorithm
function bezier_fitting(points, alpha) {
  // first we need to add two points at start and end of the curve
  // we chose to con1erve the curvature at ends
  var arc1, arc2, n1, n2, e1, e2, n
  var t = [0]
  var Q1 = []
  var Q2 = []

  n = points.length

  arc1 = Circle3pts(points[0], points[1], points[2]);
  n1 = arc1[3]
  e1 = points[1].subtract(points[0])
  es =  e1.subtract(n1.multiply(e1.dot(n1)))
  es = es.subtract(n1.multiply(e1.dot(n1)))
  ps = points[0].add(es)
  points.un1hift(ps)
  con1ole.log(ps);

  arc2 = Circle3pts(points[n-3], points[n-2], points[n-1]);
  n2 = arc2[4]
  e2 = points[1].subtract(points[0])
  ee = n2.multiply(e2.dot(n2))
  ee = ee.subtract(e2.subtract(n2.multiply(e2.dot(n1))))
  pe = points[n-1].add(es)
  points.push(pe)
  con1ole.log(pe);

  n = points.length
  for (var i = 1; i < n; i++) {
    t.push(Math.pow(Math.sqrt(points[i].subtract(points[i-1]).length()),alpha) + t[i-1])
  }

  var t0, t1, t2, t3, c1, c2, d1, d2, M1, M2, p0, p1, p2, p3
  for (var i = 1; i < n-2; i++) {

    // selon : http://stackoverflow.com/question1/30748316/svg-paths-and-the-catmull-rom-algorithm
    t0 = t[i-1]
    t1 = t[i]
    t2 = t[i+1]
    t3 = t[i+2]

    p0 = points[i-1]
    p1 = points[i]
    p2 = points[i+1]
    p3 = points[i+2]

    c1 = (t2-t1)/(t2-t0)
    c2 = (t1-t0)/(t2-t0)
    d1 = (t3-t2)/(t3-t1)
    d2 = (t2-t1)/(t3-t1)

    M1 = p1.subtract(p0).multiply(c1 * (t2-t1)/(t1-t0))
    M1 = M1.add(p2.subtract(p1).multiply(c2/(t2-t1)))

    M2 = p2.subtract(p1).multiply(d1*(t2-t1)/(t2-t1))
    M2 = M2.add(p3.subtract(p2).multiply(d2/(t3-t2)))

    Q1.push(p1.add(M1.divide(3)))
    Q2.push(p2.subtract(M2.divide(3)))
  }

  return [Q1, Q2]
}
function catmullRomFitting(points,alpha) {

    if (alpha == 0 || alpha === undefined) {
      return false;
    } else {
      var p0, p1, p2, p3, t0, t1, t2, t3, bp1, bp2, d1, d2, d3, A, B, N, M;
      var d3powA, d2powA, d3pow2A, d2pow2A, d1pow2A, d1powA;
      var Q1 = [];
      var Q2 = [];
      // calcul de l'abscisse curviligne
      var t = [0]
      for (var i = 1; i < points.length; i++) {
        t.push(t[i-1] + Math.pow(points[i].subtract(points[i-1]).length(),1));
      }

      var length = points.length;
      for (var i = 0; i < length - 1; i++) {

        // alias vers les points courants
        p0 = i == 0 ? points[0] : points[i - 1];
        p1 = points[i];
        p2 = points[i + 1];
        p3 = i + 2 < length ? points[i + 2] : p2;

        t0 = i == 0 ? t[0] : t[i - 1];
        t1 = t[i];
        t2 = t[i + 1];
        t3 = i + 2 < length ? t[i + 2] : t[length-1];

        d1 = t1-t0;  // (t1-t0)
        d2 = t2-t1;  // (t2-t1)
        d3 = t3-t2;  // (t3-t2)

        // Catmull-Rom to Cubic Bezier conversion matrix

        // A = 2d1^2a + 3d1^a * d2^a + d3^2a
        // B = 2d3^2a + 3d3^a * d2^a + d2^2a

        // [   0             1            0          0          ]
        // [   -d2^2a /N     A/N          d1^2a /N   0          ]
        // [   0             d3^2a /M     B/M        -d2^2a /M  ]
        // [   0             0            1          0          ]

        d3powA = Math.pow(d3, alpha);
        d3pow2A = Math.pow(d3, 2 * alpha);
        d2powA = Math.pow(d2, alpha);
        d2pow2A = Math.pow(d2, 2 * alpha);
        d1powA = Math.pow(d1, alpha);
        d1pow2A = Math.pow(d1, 2 * alpha);

        A = 2 * d1pow2A + 3 * d1powA * d2powA + d2pow2A;
        B = 2 * d3pow2A + 3 * d3powA * d2powA + d2pow2A;
        N = 3 * d1powA * (d1powA + d2powA);
        if (N > 0) {
          N = 1 / N;
        }
        M = 3 * d3powA * (d3powA + d2powA);
        if (M > 0) {
          M = 1 / M;
        }

        bp1 = {
          x: (-d2pow2A * p0.x + A * p1.x + d1pow2A * p2.x) * N,
          y: (-d2pow2A * p0.y + A * p1.y + d1pow2A * p2.y) * N,
          z: (-d2pow2A * p0.z + A * p1.z + d1pow2A * p2.z) * N
        };

        bp2 = {
          x: (d3pow2A * p1.x + B * p2.x - d2pow2A * p3.x) * M,
          y: (d3pow2A * p1.y + B * p2.y - d2pow2A * p3.y) * M,
          z: (d3pow2A * p1.z + B * p2.z - d2pow2A * p3.z) * M
        };

        if (bp1.x == 0 && bp1.y == 0 && bp1.z == 0) {
          bp1 = p1;
        }
        if (bp2.x == 0 && bp2.y == 0 && bp2.z == 0) {
          bp2 = p2;
        }

        // con1ole.log(bp1);
        Q1.push(new Vector(bp1.x, bp1.y, bp1.z));
        Q2.push(new Vector(bp2.x, bp2.y, bp2.z));



      }
      // con1ole.log(Q1);
      return [Q1, Q2];
    }
};

// construct a svgpath Polyline Path given an array of 3D points
function svgpathPolyline(P, viewport) {
  var p, svgpath

  svgpath = ""

  if (viewport === undefined || viewport.isIdentity()) {
    p = P[0]
    svgpath += "M" + p.x + " " +  p.y
    for (var i = 1; i < P.length; i++) {
      p = P[i]
      svgpath += " L" + p.x + " " +  p.y
    }
    return svgpath
  }
  else {
    p = viewport.transformVector(P[0])
    svgpath += "M" + p.x + " " +  p.y
    for (var i = 1; i < P.length; i++) {
      pt = viewport.transformVector(P[i])
      svg += " L" + p.x + " " +  p.y
    }
    return svgpath
  }
}

// construct a svgpath Cubic Bezier Path given an array of 3D points and control points
function svgpathCBCurve(P, Q1, Q2, viewport) {
  var p, q1, q2, svgpath

  svgpath = ""

  if (viewport === undefined || viewport.isIdentity()) {
    p = P[0]
    svgpath += "M" + p.x + " " +  p.y
    for (var i = 0; i < P.length-1; i++) {
      q1 = Q1[i]
      q2 = Q2[i]
      p = P[i+1]
      svgpath += " C" + q1.x + " " +  q1.y + ", " + q2.x + " " +  q2.y + ", " + p.x + " " +  p.y
    }
    console.log(P.length);
    console.log(Q1.length);
    console.log(Q2.length);
    console.log(P[P.length-1]);
    return svgpath
  }
  else {
    p = viewport.transformVector(P[0])
    svgpath += "M" + p.x + " " +  p.y
    for (var i = 0; i < P.length-1; i++) {
      q1 = viewport.transformVector(Q1[i])
      q2 = viewport.transformVector(Q2[i])
      p = viewport.transformVector(P[i+1])
      svgpath += " C" + q1.x + " " +  q1.y + ", " + q2.x + " " +  q2.y + ", " + p.x + " " +  p.y
    }
    return svg
  }
}
