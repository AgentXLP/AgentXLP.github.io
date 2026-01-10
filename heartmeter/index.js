const MAX_PER_ROW = 20;
const SPACING = 24;
const SPEED = 6;

const TOTK_COLOR = [248, 108, 50, 255];
const BOTW_COLOR = [253, 58, 56, 255];
const EMPTY_COLOR = [0, 0, 0, 200];

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const heartImg = new Image();
heartImg.src = "heart.png";
heartImg.onload = render;

const healSound = new Audio("increment_health.ogg");
healSound.preload = "auto";
healSound.load();

const hurtSound = new Audio("decrement_health.ogg");
hurtSound.preload = "auto";
hurtSound.load();

let displayedValue = parseFloat(document.getElementById("max").value);
let targetValue = displayedValue;
let lastTime = 0;
let scale = 0.5;

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function createColoredHeart(colorRGBA) {
    const w = heartImg.width;
    const h = heartImg.height;

    const temp = document.createElement("canvas");
    temp.width = w;
    temp.height = h;
    const tctx = temp.getContext("2d");

    // fill solid color
    tctx.clearRect(0, 0, w, h);
    tctx.fillStyle = `rgba(${colorRGBA[0]},${colorRGBA[1]},${colorRGBA[2]},${colorRGBA[3] / 255})`;
    tctx.fillRect(0, 0, w, h);

    // use heart alpha as mask
    tctx.globalCompositeOperation = "destination-in";
    tctx.drawImage(heartImg, 0, 0);
    tctx.globalCompositeOperation = "source-over";

    return temp;
}

function createEmptyHeart() {
    const w = heartImg.width;
    const h = heartImg.height;

    const temp = document.createElement("canvas");
    temp.width = w;
    temp.height = h;
    const tctx = temp.getContext("2d");

    // base color
    tctx.clearRect(0, 0, w, h);
    tctx.fillStyle = `rgba(${EMPTY_COLOR[0]},${EMPTY_COLOR[1]},${EMPTY_COLOR[2]},${EMPTY_COLOR[3] / 255})`;
    tctx.fillRect(0, 0, w, h);

    // mask to heart shape
    tctx.globalCompositeOperation = "destination-in";
    tctx.drawImage(heartImg, 0, 0);
    tctx.globalCompositeOperation = "source-over";

    return temp;
}

function createPartialHeart(fraction, filledHeart, emptyHeart) {
    const w = heartImg.width;
    const h = heartImg.height;

    const temp = document.createElement("canvas");
    temp.width = w;
    temp.height = h;
    const tctx = temp.getContext("2d");

    // draw empty heart first
    tctx.drawImage(emptyHeart, 0, 0);

    // calculate arc angles
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.max(w, h); // big enough to cover entire heart

    const startAngle = -Math.PI / 2;
    const endAngle = startAngle - (Math.PI * 2 * fraction);

    // create angular clipping mask, kinda confusing but I got it down
    tctx.save();
    tctx.beginPath();
    tctx.moveTo(cx, cy);
    tctx.arc(cx, cy, radius, startAngle, endAngle, true);
    tctx.closePath();
    tctx.clip();

    // draw filled portion inside clip
    tctx.drawImage(filledHeart, 0, 0);
    tctx.restore();

    return temp;
}

function drawHearts(value) {
    let max = parseInt(document.getElementById("max").value);
    if (max <= 0 || max > 40) { max = Math.ceil(value); }

    value = Math.min(value, max);

    const w = heartImg.width;
    const h = heartImg.height;

    const full = Math.floor(value);
    const remainder = value - full;
    const fraction = Math.max(0, Math.min(1, remainder));

    const style = document.getElementById("style").value;
    const filledHeart = createColoredHeart(style == "0" ? TOTK_COLOR : BOTW_COLOR);
    const emptyHeart = createEmptyHeart();

    const hearts = [];

    // full hearts
    for (let i = 0; i < full; i++) {
        hearts.push(filledHeart);
    }

    // partial heart
    if (fraction > 0 && hearts.length < max) {
        hearts.push(createPartialHeart(fraction, filledHeart, emptyHeart));
    }

    // empty hearts
    while (hearts.length < max) {
        hearts.push(emptyHeart);
    }

    // layout
    const cols = Math.min(hearts.length, MAX_PER_ROW);
    const rows = Math.ceil(hearts.length / MAX_PER_ROW);

    canvas.width = (cols * w + (cols - 1) * SPACING) * scale;
    canvas.height = (rows * h + (rows - 1) * SPACING) * scale;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw these hearts yo
    hearts.forEach((heart, i) => {
        const row = Math.floor(i / MAX_PER_ROW);
        const col = i % MAX_PER_ROW;
        const x = col * (w + SPACING) * scale;
        const y = row * (h + SPACING) * scale;
        ctx.drawImage(heart, x, y, heartImg.width * scale, heartImg.height * scale);
    });
}

function animate(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const deltaTime = (timestamp - lastTime) / 1000; // seconds, fixed tickrate is so much easier to work with :pensive:
    lastTime = timestamp;

    const diff = targetValue - displayedValue;
    const direction = Math.sign(diff);
    const step = SPEED * deltaTime * direction;

    let prevDisplayedValue = displayedValue;

    if (Math.abs(step) >= Math.abs(diff)) {
        displayedValue = targetValue;
    } else {
        displayedValue += step;
    }

    if (Math.floor(prevDisplayedValue) < Math.floor(displayedValue)) {
        healSound.cloneNode().play();
    } else if (Math.floor(prevDisplayedValue) > Math.floor(displayedValue)) {
        hurtSound.cloneNode().play();
    }

    drawHearts(displayedValue);

    requestAnimationFrame(animate);
}

function render() {
    if (!heartImg.complete) return;

    let current = parseFloat(document.getElementById("current").value);
    let max = parseInt(document.getElementById("max").value);

    current = clamp(current, 0, 40);
    if (max <= 0 || max > 40) max = Math.ceil(current);

    current = Math.min(current, max);

    targetValue = current;
}

function updateScale() {
    scale = parseFloat(document.getElementById("scale").value);
    document.getElementById("display").innerText = scale;
}

function updateValues() {
    let current = document.getElementById("current");
    let max = document.getElementById("max");
    current.value = String(clamp(parseFloat(current.value), 0, 40));
    max.value = String(clamp(parseInt(max.value), 0, 40));
    render();
}

window.onload = () => {
    updateScale();
    render();
    requestAnimationFrame(animate);
}