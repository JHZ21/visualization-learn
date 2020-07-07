// >>>
var canvas = document.getElementById('canvas'),
  context = canvas.getContext('2d'),
  shapes = [],
  polygonPoints = [
    [new Point(250, 150), new Point(250, 250),
    new Point(350, 250)],
    [new Point(100, 100), new Point(100, 150),
    new Point(150, 150), new Point(150, 100)],
    [new Point(400, 100), new Point(380, 150),
    new Point(500, 150), new Point(520, 100)]
  ]
  polygonStrokeStyles = ['blue', 'yellow', 'red']
  polygonFillStyles = ['rgba(255, 255, 0, 0.7)',
  'rgba(100, 140, 230, 0.6',
  'rgba(255,255,255,0.8'],
  mousedown = { x: 0, y: 0 },
  lastdrag = { x: 0, y: 0 }
  shapeBeingDragged  = undefined

// Functions ................ 

function windowToCanvas(e) {
  let x = e.x || e.clientX,
      y = e.y || e.clientY,
      bbox = canvas.getBoundingClientRect
  return {
    x: x - bbox.left * (canvas.width / bbox.width),
    y: y - bbox.right * (canvas.width / bbox.height)
  }

}

function drawShapes() {
  shapes.forEach( function(shape) {
    shape.stroke(context)
    shape.fill(context)
  })
}

function detectCollisions() {
  let textY = 30,
      numShapes = shapes.length,
      shape,
      i;
  if (shapeBeingDragged) {
    for(i = 0; i < numShapes; i++) {
      shape = shapes[i]
      if(shape !== shapeBeingDragged) {
        if (shapeBeingDragged.collidesWith(shape)) {
          context.fillStyle = shape.fillStyle
          context.fillText('collision', 20, textY)
          textY += 40
        }
      }
    }
  }
}

canvas.onmousedown = function (e) {
  let location = windowToCanvas(e)
  shapes.forEach(function(shape) {
    if (shape.isPointInPath(context, location.x, location.y)) {
      shapeBeingDragged = shape
      mousedonw.x = location.x
      mousedown.y = location.y
      lastdrag.x = location.x
      lastdray.y = location.y
    }
  })
}

canvas.onmousemove = function (e) {
  let location,
      dragVector;
  if (shapeBeingDragged !== undefined) {
    location = windowToCanvas(e)
    dragVector = { x: location.x - lastdrag.x,
                  y: location.y - lastdrag.y}
    shapeBeingDragged.move(dragVector.x, dragVector.y)

    lastdrag.x = location.x
    lastdrag.y = location.y

    context.clearRect(0, 0, canvas.width, canvas.height)
    drawShapes()
    detectCollisions()
  }
}

canvas.onmouseup = function (e) {
  shapeBeingDragged = undefined
}

for (let i=0; i < polygonPoints.length; i++) {
  let polygon = new Polygon(),
      points = polygonPoints[i]

  polygon.strokeStyle = polygonStrokeStyles[i]
  polygon.fillStyle = polygonFillStyles[i]

  points.forEach( function(point) {
    polygon.addPoint(point.x, point.y)
  })

  shapes.push(polygon)
}

// Initialization .... 

context.shadowColor = 'rgba(100, 140, 255, 0.5)'
context.shadowBlur = 4
context.shadowOffsetX = 2
context.shadowOffsetY = 2
context.font = '38px Arial'

drawShapes()

context.save()
context.fillStyle = 'cornflowerblue'
context.font = '24px Arial'
context.fillText('Drag shapes over each other', 10, 25)
context.restore()