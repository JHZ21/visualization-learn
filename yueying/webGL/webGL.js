// WebGL
const vertexShader = gl.createShader(gl.VERTEX_SHADER)
gl.shapderSource(vertexShader, vertex)
gl.compileShader(vertexShader)

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
gl.shapderSource(fragmentShader, fragment)
gl.compileShader(fragmentShader)

const program = gl.createProgram()
gl.attachShader(program, vertexShader)
gl.attachShader(program, fragmentShader)
gl.linkProgram(program)

gl.userProgram(program)

const points = new Float32Array([
  -1, -1,
  0, 1,
  1, -1
])

const bufferId = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, bufferId)
gl.bufferData(gl.ARRAY_BUFFER, points, gl.STARTIC_DRAW)