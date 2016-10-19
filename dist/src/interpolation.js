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

    console.log(t.length());
    console.log(n.length());

    var t1 = (u1.multiply(3*t.dot(u1))).subtract(t)
    var t2 = (u2.multiply(3*t.dot(u2))).subtract(t)

    return [k, c, t, t1, t2]
}


// http://stackoverflow.com/questions/3526940/how-to-create-a-cubic-bezier-curve-when-given-n-points-in-3d
// http://stackoverflow.com/questions/30748316/svg-paths-and-the-catmull-rom-algorithm
function bezier_fitting(points, alpha) {
  // first we need to add two points at start and end of the curve
  // we chose to conserve the curvature at ends
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
  points.unshift(ps)
  console.log(ps);

  arc2 = Circle3pts(points[n-3], points[n-2], points[n-1]);
  n2 = arc2[4]
  e2 = points[1].subtract(points[0])
  ee = n2.multiply(e2.dot(n2))
  ee = ee.subtract(e2.subtract(n2.multiply(e2.dot(n1))))
  pe = points[n-1].add(es)
  points.push(pe)
  console.log(pe);

  n = points.length
  for (var i = 1; i < n; i++) {
    t.push(Math.pow(Math.sqrt(points[i].subtract(points[i-1]).length()),alpha) + t[i-1])
  }

  var t0, t1, t2, t3, c1, c2, d1, d2, M1, M2, p0, p1, p2, p3
  for (var i = 1; i < n-2; i++) {

    // selon : http://stackoverflow.com/questions/30748316/svg-paths-and-the-catmull-rom-algorithm
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

function InterpSVG(points, Q1, Q2){

  var n = points.length
  var svg = ""

  svg += "M" + points[0].x + " " +  points[0].y
  for (var i = 0; i < n-1; i++) {
    svg += " C" + Q1[i].x + " " +  Q1[i].y + ", " + Q2[i].x + " " +  Q2[i].y + ", " + points[i+1].x + " " +  points[i+1].y
  }

  return svg

}

var catmullRomFitting = function (points,alpha) {

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

        // console.log(bp1);
        Q1.push(new Vector(bp1.x, bp1.y, bp1.z));
        Q2.push(new Vector(bp2.x, bp2.y, bp2.z));



      }
      // console.log(Q1);
      return [Q1, Q2];
    }
};
