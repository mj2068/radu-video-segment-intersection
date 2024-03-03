const canvasContainerDiv = document.querySelector("#canvas-container");
const canvas = document.querySelector("#canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

addEventListener("resize", (e) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const ctx = canvas.getContext("2d");

const btn1 = document.querySelector("#button1");
btn1 && btn1.addEventListener("click", () => requestAnimationFrame(animate));

const mouse = { x: 0, y: 0 };
canvas.onmousemove = (e) => {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
};

let angle = 0;
canvas.addEventListener(
    "wheel",
    (e) => {
        angle += e.deltaY * 0.001;
        // console.log(angle);
    },
    { passive: false },
);

const A = { x: 100, y: 100 };
const B = { x: 400, y: 300 };
const C = { x: (canvas.width * 3) / 4, y: 300 };
const D = { x: 300, y: (canvas.height * 3) / 4 };

function animate() {
    A.x = mouse.x + Math.cos(angle) * 120;
    A.y = mouse.y + Math.sin(angle) * 120;
    B.x = mouse.x - Math.cos(angle) * 120;
    B.y = mouse.y - Math.sin(angle) * 120;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#444";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "white";

    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.stroke();
    ctx.moveTo(C.x, C.y);
    ctx.lineTo(D.x, D.y);
    ctx.stroke();

    drawNode("A", A);
    drawNode("B", B);
    drawNode("C", C);
    drawNode("D", D);

    const I = getIntersection({ a: A, b: B }, { a: C, b: D });

    I && drawNode("I", I);

    requestAnimationFrame(animate);
}

function drawNode(text, pos, size = 32) {
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, size / 2, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.font = `${size / 2}px sans`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, pos.x, pos.y);
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function getIntersection(a, b) {
    const tTop =
        (a.a.y - b.a.y) * (b.b.x - b.a.x) - (b.b.y - b.a.y) * (a.a.x - b.a.x);
    const bottom =
        (b.b.y - b.a.y) * (a.b.x - a.a.x) - (a.b.y - a.a.y) * (b.b.x - b.a.x);
    const uTop =
        (a.b.y - a.a.y) * (b.a.x - a.a.x) - (a.b.x - a.a.x) * (b.a.y - a.a.y);

    if (0 !== bottom) {
        const t = tTop / bottom;
        const u = uTop / bottom;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: lerp(a.a.x, a.b.x, t),
                y: lerp(a.a.y, a.b.y, t),
                t,
                u,
            };
        }
    }
    return null;
}

animate();
