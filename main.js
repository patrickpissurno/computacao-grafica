const canvas = document.getElementById("canvas");

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

function desenharQuadrado(){
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(200, 100);
    ctx.lineTo(200, 200);
    ctx.lineTo(100, 200);
    ctx.fill();
}

desenharQuadrado();