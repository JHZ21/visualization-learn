let convas = document.getElementById("canvas"),
context = canvas.getContext("2d"),
MARGIN = 35,
HAND_TRUNCATION = canvas.width / 25, // hand truncation
HOUR_HAND_TRUNCATION = canvas.width / 10, // hour hand truncation
NUMERAL_SPACING = 20,
RADIUS = canvas.width / 2 - MARGIN,
HEAD_RADIUS = RADIUS + NUMERAL_SPACING;
function drawCircle() {
context.beginPath();
context.arc(
  canvas.width / 2,
  canvas.height / 2,
  RADIUS,
  0,
  Math.PI * 2,
  true
);
context.stroke();
}
function drawNumerals() {
const numerals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
let angle = 0,
  numeralWidth = FONT_HEIGHT / 2;
numerals.forEach(function (numeral) {
  angle = (Math.PI / 6) * (numeral - 3);
  numberalWidth = context.measureText(numeral).width;
  context.fillText(
    numeral,
    canvas.height / 2 +
      Math.cos(angle) * HEAD_RADIUS -
      numeralWidth / 2,
    canvas.height / 2 +
      Math.sin(angle) * HEAD_RADIUS +
      FONT_HEIGHT / 3
  );
});
}
function drawCenter() {
context.beginPath();
context.arc(
  canvas.width / 2,
  canvas.height / 2,
  5,
  0,
  Math.PI * 2,
  true
);
context.fill();
}
function drawHand(loc, isHour, scale) {
let angle = Math.PI * 2 * (loc / 60) - Math.PI / 2,
  handRadius = isHour
    ? RADIUS - HAND_TRUNCATION - HOUR_HAND_TRUNCATION
    : RADIUS - HAND_TRUNCATION;
context.moveTo(canvas.width / 2, canvas.height / 2);
context.lineTo(
  canvas.width / 2 + Math.cos(angle) * handRadius,
  canvas.height / 2 + Math.sin(angle) * handRadius
);
context.lineWidth = scale ? scale : 1;
context.stroke();
context.lineWidth = 1;
}
function drawHands() {
let date = new Date(),
  hour = date.getHours();
hour = hour > 12 ? hour - 12 : hour;
drawHand(hour * 5, (date.getMinutes() / 60) * 5, true, 0.5);
drawHand(date.getMinutes(), false, 0.5);
drawHand(date.getSeconds(), false, 0.3);
}
function drawClock() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  drawCircle()
  drawCenter()
  drawHands()
  drawNumerals()
}