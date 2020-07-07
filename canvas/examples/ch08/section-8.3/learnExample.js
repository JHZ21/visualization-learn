var canvas = document.getElementById('canvas'),
  context = canvas.getContext('2d'),
  scoreboard = document.getElementById('scoreboard'),
  launchVelocityOutput = document.getElementById('launchVelocityOutput'),
  launchAngleOutput = document.getElementById('launchAngleOutput'),

  elapsedTime = undefined,
  launchTime = undefined,

  score = 0,
  lastScore = 0,
  lastMouse = { left: 0, top: 0 },

  threePointer = false,
  needInstructions = true,

  LAUNCHPAD_X = 50,
  LAUNCHPAD_Y = context.canvas.height - 50,
  LAUNCHPAD_WIDTH = 50,
  LAUNCHPAD_HEIGHT = 12,
  ARENA_LENGTH_IN_METERS = 10,
  INITIAL_LAUNCH_ANGLE = Math.PI / 4,

  launchAngle = INITIAL_LAUNCH_ANGLE,
  pixelsPerMeter = canvas.width / ARENA_LENGTH_IN_METERS,

  // LaunchPad ....... 

  launchPadPainter = {
    LAUNCHPAD_FILL_STYLE: 'rgba(100, 140, 230)',

    paint: function (ledge, context) {
      context.save()
      context.fillStyle = this.LAUNCHPAD_FILL_STYLE
      context.fillRect(LAUNCHPAD_X, LAUNCHPAD_Y,
        LAUNCHPAD_WIDTH, LAUNCHPAD_HEIGHT)
      context.restore()
    }
  },

  launchPad = new Sprite('launchPad', launchPadPainter),

  // Ball ..........  

  BALL_RADIUS = 8,
  lastBallPosition = { left: 0, top: 0 },

  ballPointer = {
    BALL_FILL_STYLE: 'rgba(255,255,0)',
    BALL_STROKE_STYLE: 'rgb(0,0,0,0.4)',

    paint: function (ball, context) {
      context.save()
      context.shadowColor = undefined
      context.lineWidth = 2
      context.fillStyle = this.BALL_FILL_STYLE
      context.strokeStyle = this.BALL_STROKE_STYLE

      context.beginPath()
      context.arc(ball.left + BALL_RADIUS, ball.top + BALL_RADIUS,
        ball.radius, 0, Math.PI * 2, false)

      context.clip()
      context.fill()
      context.stroke()
      context.restore()
    }
  },

  // Lob behavior ...........  

  lob = {
    lastTime: 0,
    GRAVITY_FORCE: 9.81,

    applyGravity: function (elapsed) {
      ball.velocityY = (this.GRAVITY_FORCE * elapsed) -
        (launchVelocity * Math.sin(launchAngle))
    },
    updateBallPosition: function (updateDelta) {
      lastBallPosition.left = ball.left
      lastBallPosition.top = ball.top
      ball.left += ball.velocityX * (updateDelta) * pixelsPerMeter
      ball.top += ball.velocityY * (updateDelta) * pixelsPerMeter
    },
    checkForThreePointer: function () {
      if (ball.top < 0) {
        threePointer = true
      }
    },
    checkBallBounds: function () {
      if (ball.top > canvas.height || ball.left > canvas.width) {
        reset()
      }
    },
    execute: function (ball, context, time) {
      let updateDelta,
        elapsedFlightTime,
        elapsedFrameTime;
      if (ballInFlight) {
        elapsedFrameTime = (time - this.lastTime) / 1000;
        elapsedFlightTime = (time - launchTime) / 1000;

        this.applyGravity(elapsedFlightTime)
        this.updateBallPosition(elapsedFrameTime)
        this.checkForThreePointer()
        this.checkBallBounds()
      }
      this.lastTime = time
    }
  },
  ball = new Sprite('ball', ballPointer, [lob]),
  ballInFlight = false

// Bucket ...............  

BUCKET_LEFT = 668,
  BUCKET_TOP = canvas.height - 100,
  BUCKET_WIDTH = 83,
  BUCKET_HEIGHT = 62,
  bucketHitCenter = {
    x: BUCKET_LEFT + 2 * this.BUCKET_WIDTH / 3,
    y: BUCKET_TOP + BUCKET_HEIGHT / 8
  },

  bucketHitRadius = BUCKET_WIDTH / 8,
  bucketImage = new Image(),

  catchBall = {
    intersectionPoint: { x: 0, y: 0 },
    isBallInBucket: function () {
      if (lastBallPosition.left === ball.left
        || lastBallPosition.top === ball.top) {
        return
      }

      let x1 = lastBallPosition.left,
        y1 = lastBallPosition.top,
        x2 = ball.left,
        y2 = ball.top,
        x3 = BUCKET_LEFT + BUCKET_WIDTH / 4,
        y3 = BUCKET_TOP,
        x4 = BUCKET_LEFT + BUCKET_WIDTH,
        y4 = y3,
        m1 = (ball.top - lastBallPosition.top) / (ball.left - lastBallPosition.left),
        m2 = (y4 - y3) / (x4 - x3),
        b1 = y1 - m1 * x1,
        b2 = y3 - m2 * x3;
      this.intersectionPoint.x = (b2 - b1) / (m1 - m2)
      this.intersectionPoint.y = m1 * this.intersectionPoint.x + b1

      return this.intersectionPoint.x > x3
        && this.intersectionPoint.x < x4
        && ball.top + ball.height > y3
        && ball.left + ball.width < x4
    },
    adjustScore: function () {
      if (threePointer) lastScore = 3
      else lastScore = 2
      score += lastScore
      scoreboard.innerText = score;
    },
    drawRay: function () {
      context.beginPath()
      context.save()
      context.lineWidth = 1
      context.strokeStyle = 'blue'
      context.moveTo(ball.left + BALL_RADIUS, ball.top + BALL_RADIUS)
      context.lineTo(this.intersectionPoint.x, this.intersectionPoint.y)
      context.stroke()
      context.restore()
    },
    execute: function (bucket, context, time) {
      if (ballInFlight) {
        this.drawRay()
        if (this.isBallInBucket) {
          reset()
          this.adjustScore()
        }
      }
    }
  },

  bucket = new Sprite('bucket', {
    paint: function (sprite, context) {
      context.drawImage(bucketImage, BUCKET_LEFT, BUCKET_TOP)
    }
  },
    [catchBall]
  )

// Functions ............ 

function freeze() {
  ball.velocityX = 0
  ball.velocityY = 0
  ballInFlight = false
  needInstructions = false
}

function reset() {
  lastBallPosition.left = ball.left
  lastBallPosition.top = ball.top

  ball.left = LAUNCHPAD_X + LAUNCHPAD_WIDTH / 2 - BALL_RADIUS;
  ball.top = LAUNCHPAD_Y - ball.height / 2 - BALL_RADIUS;

  ball.velocityX = 0
  ball.velocityY = 0
  ballInFlight = false
  needInstructions = false
  lastScore = 0
}

function showText(text) {
  let metrics;

  context.font = '42px Arial'
  metrics = context.measureText(text)

  context.save()
  context.shadowColor = undefined
  context.strokeStyle = 'rgb(80, 120, 210)'
  context.fillStyle = 'rgba(100, 140, 230, 0.5)'

  context.fillText(text,
    canvas.width / 2 - metrics.width / 2,
    canvas.height / 2)
  context.strokeText(text,
    canvas.width / 2 - metrics.width / 2,
    canvas.height / 2)
  context.restore()
}

function drawRubberband() {
  context.beginPath()
  context.moveTo(ball.left + BALL_RADIUS, ball.top + BALL_RADIUS)
  context.lineTo(bucketHitCenter.x, bucketHitCenter.y)
  context.stroke()
}

function drawGuidewire() {
  context.beginPath()
  context.moveTo(ball.left + BALL_RADIUS, ball.top + BALL_RADIUS)
  context.lineTo(bucketHitCenter.x, bucketHitCenter.y)
  context.stroke()
}

function updateBackgroundText() {
  if (lastScore == 3) showText('Three pointer!')
  else if (lastScore == 2) showText('Nice shot!')
  else if (needInstructions) showText('Click to launch ball')
}

function resetScoreLater() {
  setTimeout(function () {
    lastScore = 0
  }, 1000)
}

function updateSprites(time) {
  bucket.update(context, time)
  launchPad.update(context, time)
  ball.update(context, time)
}

function paintSprites() {
  launchPad.paint(cont)
  bucket.paint(context)
  ball.paint(context)
}

function mouseToCanvas(e) {
  let rect = canvas.getBoundingClientRect(),
    loc = {
      x: e.x || e.clientX,
      y: e.y || e.clientY
    }
  loc.x -= rect.left
  loc.y -= rect.top

  return loc
}

// Event handlers ......... 

canvas.onmousedown = function (e) {
  let rect;
  e.preventDefault()
  if (!ballInFlight) {
    ball.velocityX = launchVelocity * Math.cos(launchAngle)
    ball.velocityY = launchVelocity * Math.sin(launchAngle)
    ballInFlight = true
    threePointer = false
    launchTime = +new Date()
  }
}

canvas.onmousemove = function (e) {
  let rect
  e.preventDefault()
  if (!ballInFlight) {
    loc = mouseToCanvas(e)
    lastMouse.left = loc.x
    lastMouse.top = loc.y

    deltaX = Math.abs(lastMouse.left - ball.left)
    deltaY = Math.abs(lastMouse.top - ball.top)

    launchAngle = Math.atan(parseFloat(deltaX) / parseFloat)
  }
}

// Animation Loop ............... 

function animate() {
  let time = Date.now()
  elapsedTime = (time - launchTime) / 1000
  context.clearRect(0, 0, canvas.width, canvas.height)

  if (!ballInFlight) {
    drawGuidewire()
    updateBackgroundText()
    if (lastScore !== 0) {
      resetScoreLater()
    }
  }

  paintSprites()
  updateSprites(time)
  // drawRubberband()

  context.save()
  context.beginPath()
  context.lineWidth = 0.5
  context.strokeStyle = 'red'
  context.moveTo(0, BUCKET_TOP + 0.5)
  context.lineTo(cnavas.width, BUCKET_TOP)
  context.stroke()
  context.restore()

  window.requestAnimationFrame(animate)
}

// Initialization................................................

ball.width = BALL_RADIUS * 2;
ball.height = ball.width;
ball.left = LAUNCHPAD_X + LAUNCHPAD_WIDTH / 2 - BALL_RADIUS;
ball.top = LAUNCHPAD_Y - ball.height / 2 - BALL_RADIUS;
lastBallPosition.left = ball.left;
lastBallPosition.top = ball.top;
ball.radius = BALL_RADIUS;

context.lineWidth = 0.5;
context.strokeStyle = 'rgba(0,0,0,0.5)';
context.shadowColor = 'rgba(0,0,0,0.5)';
context.shadowOffsetX = 2;
context.shadowOffsetY = 2;
context.shadowBlur = 4;
context.stroke();

bucketImage.src = '../../shared/images/bucket.png';
bucketImage.onload = function (e) {
  bucket.left = BUCKET_LEFT;
  bucket.top = BUCKET_TOP;
  bucket.width = BUCKET_WIDTH;
  bucket.height = BUCKET_HEIGHT;
};

animate();