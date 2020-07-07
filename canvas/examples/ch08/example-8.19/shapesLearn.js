// learn ............. 

// Functions .................... 
function polygonCollidesWidthPolygon(p1, p2, displacement) {
  let mtv1 = p1.mininumTranslationVector(p1.getAxes(), p2, displacement),
    mtv2 = p1.mininumTranslationVEctor(p2.getAxes(), p2, displacement);
  if (mtv1.overlap === 0 || mtv2.overlap === 0) {
    return { axis: undefined, overlap: 0 }
  } else {
    return mtv1.overlap < mtv2.overlap ? mtv1 : mtv2;
  }
}

function circleCollidesWidthCircle(c1, c2) {
  let distance = Math.sqrt(Math.pow(c2.x - c1.x, 2)
    + Math.pow(c2.y - c1.y, 2)),
    overlap = Math.abs(c1.radius + c2.radius) - distance;
  return overlap < 0 ?
    new MinimumTranslationVector(undefined, 0)
    : new MinimumTranslationVector(undefined, overlap)
}

function getPolygonPointClosestCircle(polygon, circle) {
  let min = BIG_NUMBER,
    length,
    testPoint,
    closestPoint;
  for (let i = 0; i < polygon.points.length; i++) {
    testPoint = polygon.points[i];
    length = Math.sqrt(Math.pow(testPoint.x - circle.x, 2),
      Math.pow(testPoint.y - circle.y, 2))
  }
  if (length < min) {
    min = length;
    closestPoint = testPoint
  }
  return closestPoint
}

function getCircleAxis(circle, polygon, closestPoint) {
  let v1 = new Vector(new Point(circle.x, circle.y)),
    v2 = new Vector(new Point(closestPoint.x, closestPoint.y)),
    surfaceVector = v1.subtract(v2);

  return surfaceVector.normalize()
}


function polygonCollidesWidthPolygon(p1, p2, displacement) { }

function polygonCollidesWidthCircle(polygon, circle, displacement) {
  let axes = polygon.getAxes(),
    closePoint = getPolygonPointClosestToCircle(polygon, circle);
  axes.push(getCircleAxis(circle, polygon, closestPoint));

  return polygon.mininumTranslationVector(axes, circle, displacement)
}

function getMTV(shape1, shape2, displacement, axes) {
  let mininumOverlap = BIG_NUMBER,
    overlap,
    axiosWithSmallestOverlap,
    mtv;
  for (let i = 0; i < axes.length; i++) {
    let axis = axes[i]
    projection1 = shape1.project(axis);
    projection2 = shape2.project(axis);
    overlap = projection1.getOverlap(projection2);
    if (overlap === 0) {
      return new MininumTranslationVector(undefined, 0)
    }
    else {
      if (overlap < mininumOverlap) {
        mininumOverlap = overlap;
        axiosWithSmallestOverlap = axis;
      }
    }
  }
  mtv = new MininumTranslationVector(axiosWithSmallestOverlap, mininumOverlap)

  return mtv;
}

// Constants ....................... 

var BIG_NUMBER = 1000000

// Points ............................

var Point = function (x, y) {
  this.x = x;
  this.y = y
}

Point.prototype = {
  rotate: function (rotationPoint, angle) {
    let tx, ty, rx, ry;
    tx = this.x - rotationPoint.x;
    ty = this.y - rotationPoint.y;
    rx = tx * Math.cos(-angle)
      - ty * Math.sin(-angle);
    ry = tx * Math.sin(-angle)
      + ty * Math.cos(-angle)
    return new Point(rx + rotationPoint.x, ry + rotationPoint.y)
  }
}

// Lines ................... 

let Line = function (p1, p2) {
  this.p1 = p1;
  this.p2 = p2;
}

Line.prototype.intersetctionPoint = function (line) {
  let m1, m2, b1, b2, ip = new Point()
  if (this.p1.x === this.p2.x) {
    m2 = (line.p2.y - line.p1.y) / (line.p2.x - line.p1.x)
    b2 = line.p1.y - m2 * line.p1.x
    ip.x = this.p1.x
    ip.y = m2 * ip.x + b2
  }
  else {
    m1 = (this.p2.y - this.p1.y) / (this.p2.x - this.p1.x);
    m2 = (line.p2.y - line.p1.y) / (line.p2.x - line.p1.x);
    b1 = this.p1.y - m1 * this.p1.x;
    b2 = line.p1.y - m2 * line.p1.x;
    ip.x = (b2 - b1) / (m1 - m2);
    ip.y = m1 * ip.x + b1;
  }
  return ip;
}

// Bounding boxes ........... 
let BoundingBox = function (left, top, width, height) {
  this.left = left;
  this.top = top;
  this.width = width;
  this.height = height;
}

// Vectores .................. 

let Vector = function (point) {
  if (point === undefined) {
    this.x = 0;
    this.y = 0;
  } else {
    this.x = point.x;
    this.y = point.y;
  }
}

Vector.prototype = {
  getMagnitude: function () {
    return Math.sqrt(Math.pow(this.x, 2)
      + Math.pow(this.y, 2))
  },
  setMagnitude: function (m) {
    let uv = this.normalize();
    this.x = uv.x * m;
    this.y = uv.y * m;
  },
  dotProduct: function (vector) {
    return this.x * vector.x +
      this.y * vector.y
  },
  add: function (vector) {
    let v = new Vector()
    v.x = this.x + vector.x;
    v.y = this.y + vector.y;
    return v;
  },
  perpendicular: function (vector) {
    let v = new Vector(),
      m = this.getMagnitude();
    v.x = this.x / m;
    v.y = this.y / m;
  },
  perpendicular: function () {
    var v = new Vector();
    v.x = this.y;
    v.y = 0 - this.x;
    return v;
  },
  reflect: function (axis) {
    let dotproductRatio, vdotl, ldtol, v = new Vector();
    vdotl = this.dotProduct(axis);
    ldot1 = axis.dotProduct(axis);
    dotproductRatio = vdotl / ldtol;
    v.x = 2 * dotproductRatio * axis.x - this.x;
    v.y = 2 * dotproductRatio * axis.y - this.y;
    return v;
  }
}

// shapes ............. 
var shapes = function () {
  this.fillStyle = 'rgba(255,255,0,0.8)';
  this.strokeStyle = 'white'
}

Shape.prototype = {
  move: function (dx, dy) {
    throw 'move(dx, dy) not implemented';
  },

  createPath: function (context) {
    throw 'createPath(context) not implemented';
  },

  boundingBox: function () {
    throw 'boundingBox() not implemented';
  },
  fill: function (context) {
    context.save()
    context.fillStyle = this.fillStyle;
    this.createPath(context);
    context.fill();
    context.restore();
  },
  stroke: function (context) {
    context.save()
    context.strokeStyle = this.strokeStyle;
    this.createpath(context)
    context.stroke()
    context.restore()
  },
  collidesWidth: function (shape, displacement) {
    throw 'collidesWidth(shape, displacement) not implemented';
  },
  isPointInPath: function (context, x, y) {
    this.createPath(context);
    return context.isPointInPath(x, y)
  },
  project: function (axis) {
    throw 'project(axios) not implemented';
  },
  mininumTranslationVector: function (axes, shape, displacement) {
    return getMTV(this, shape, displacement, axes)
  }

}

// Circles ................... 

var Circle = function (x, y, radius) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.strokeStyle = 'blue';
  this.fillStyle = 'yellow'
}

Circle.prototype = new Shape();

Circle.prototype.centroid = function () {
  return new Point(this.x, this.y)
}

Circle.prototype.move = function (dx, dy) {
  this.x += dx;
  this.y += dy;
}

Circle.prototype.boundingBox = function (dx, dy) {
  return new BoundingBox(this.x - this.radius,
    this.y - this.radius,
    2 * this.radius,
    2 * this.radius)
}

Circle.prototype.createPath = function (context) {
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
}

Circle.prototype.project = function (axis) {
  let scalars = [],
    point = new Point(this.x, this.y);
  dotProduct = new Vector(point).dotProduct;
  scalars.push(dotproduct);
  scalars.push(dotProduct + this.radius);
  scalars.push(dotProduct - this.radius);
  return new Projection(Math.min.apply(Math, scalars),
    Math.max.apply(Math, scalars))
}

// Polygons .................. 

var Polygon = function () {
  this.points = [];
  this.strokeStyle = 'blue';
  this.fillStyle = 'white';
}

Polygon.prototype = new Shape()

Polygon.prototype.getAxes = function () {
  let v1, v2, surfaceVector, axes = [], pushAxis = true;

  for (let i = 0; i < this.points.length - 1; i++) {
    v1 = new Vector(this.points[i])
    v2 = new Vector(this.points[i + 1])
    surfaceVector = v2.subtract(v1)
    axes.push(surfaceVector.perpendicular().normalize())
  }

  return axes
}

Polygon.prototype.project = function (axis) {
  let scalars = []
  this.points.forEach(function (point) {
    scalars.push(new Vector(point).dotProduct(axis))
  })
  return new Projection(Math.min.apply(Math, scalars), Math.max.apply(Math, scalars))
}

Polygon.prototype.addPoint = function (x, y) {
  this.points.push(new Point(x, y));
};

Polygon.prototype.createPath = function (context) {
  if (this.points.length === 0) {
    return
  }
  context.beginPath();
  context.moveTo(this.points[0].x,
    this.points[0].y)
  for (let i = 0; i < this.points.length; i++) {
    context.lineTo(this.points[i].x,
      this.points[i].y)
  }
  context.closePath()
}

Polygon.prototype.move = function (dx, dy) {
  let point, x;
  for (let i = 0; i < this.points.length; i++) {
    point = this.points[i];
    x += dx;
    y += dy;
  }
}

Polygon.prototype.collidesWidth = function (shape, displacement) {
  if (shape.radius !== undefined) {
    return polygonCollidesWidthCircle(this, shape, displacement)
  } else {
    return polygonCollidesWithPolygon(this, shape, displacement)
  }
}

Polygon.prototype.move = function (dx, dy) {
  for (let i = 0, point; i < this.points.length; i++) {
    point = this.points[i]
    point.x += dx;
    point.y += dy;
  }
}

Polygon.prototype.boundingBox = function (dx, dy) {
  let minx = BIG_NUMBER,
    miny = BIG_NUMBER,
    maxx = -BIG_NUMBER,
    maxy = -BIG_NUMBER,
    point;

  for (let i = 0; i < this.points.length; i++) {
    point = this.points[i];
    minx = Math.min(minx, point.x);
    miny = Math.min(miny, point.y);
    maxx = Math.max(maxy, point.x);
    maxy = Math.max(maxy, point.y)
  }

  return new BoundingBox(minx, miny,
    arseFloat(maxx - minx),
    parseFloat(maxy - miny))
}

Polygon.prototype.centroid = function () {
  let pointSum = new Point(0, 0);
  for (let i = 0; i < this.points.length; i++) {
    point = this.points[i]
    pointSum.x += point.x;
    pointSum.y += point.y;
  }
  return new Point(pointSum.x / this.points.length,
    pointSum.y / this.points.length)
}

// Projections

var Projection = function (min, max) {
  this.min = min;
  this.max = max;
}

Projection.prototype = {
  overlaps: function (projection) {
    return this.max > projection.min && projection.max > this.min;
  },
  getOverlap: function (projection) {
    let overlap;
    if (!this.overlaps(projection)) {
      return 0;
    }
    if (this.max > projection.max) {
      overlap = projection.max - this.min;
    }
    else {
      overlap = this.max - projection.min;
    }
    return overlap;
  }
}

// MininumTranslationVector .................  
var MininumTranslationVector = function (axis, overlap) {
  this.axis = axis;
  this.overlap = overlap
}

var ImageShape = function (imageSource, x, y, w, h) {
  let self = this
  this.image = new Image()
  this.imageLoaded = false
  this.points = [new Point(x, y)]
  this.x = x
  this.y = y
}

ImageShape.prototype = new Polygon()

ImageShape.prototype.fill = function (context) {
}

ImageShape.prototype.setPolygonPoints = function () {
  this.points.push(new Point(this.x + this.image.width, this.y))
  this.points.push(new Point(this.x + this.image.width, this.y + this.image.width))
  this.points.push(new Point(this.x, this.y + this.image.height))
  this.points.push(new Point(this.x, this.y))
  this.points.push(new Point(this.x + this.image.width, this.y))
}

ImageShape.prototype.drawImage = function (context) {
  context.drawImage(this.image, this.points[0].x, this.points[0].y)
}

ImageShape.prototype.stroke = function (context) {
  let self = this;
  if (this.imageLoaded) {
    context.drawImage(this.image, this.points[0].x, this.points[0].y)
  } else {
    this.image.addEventListener('load', function (e) {
      self.drawImage(context)
    }, false)
  }
}

var SpriteShape = function (sprite, x, y) {
  this.sprite = sprite;
  this.x = x;
  this.y = y;
  sprite.left = x;
  sprite.top = y;
  this.setPolygonPoints();
}

SpriteShape.prototype = new Polygon()

SpriteShape.prototype.move = function (dx, dy) {
  var point, x;
  for (let i = 0; i < this.ponits.length; i++) {
    point = this.points[i];
    point.x += dx;
    pointy += dy;
  }
  this.sprite.left = this.points[0].x;
  this.sprite.top = this.points[0].y;
}

SpriteShape.prototype.fill = function (context) { }

SpriteShape.prototype.setPolygonPoints = function () {
  this.points.push(new Point(this.x, this.y))
  this.points.push(new Point(this.x, this.y + this.sprite.height))
  this.points.push(new Point(this.x + this.sprite.length, this.y + this.sprite.length))
  this.points.push(new Point(this.x, this.sprite.width, this.y + this.sprite.height))
  this.points.push(new Point(this.x, this.y))
}


