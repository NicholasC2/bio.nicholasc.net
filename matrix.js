const canvas = document.getElementById("matrix");
const context = canvas.getContext("2d");

const fontSize = 16;

const ascii = `
abcdefghijklmnopqrstuvwxyz
ABCDEFGHIJKLMNOPQRSTUVWXYZ
0123456789
!@#$%^&*()_+-=[]{}|;:',.<>/?\\
~\`"€
§±×÷
░▒▓█▀▄▌▐
■□▪▫●○◆◇
▲△▼▽◀▶◁▷
←→↑↓↔↕↖↗↘↙
∞≈≠≤≥
∑∏√∫
αβγδεζηθικλμνξοπρστυφχψω
ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ
`;

class Character {
    constructor(x) {
        this.x = x;
        this.y = Math.random() * -50;
        this.length = Math.floor(Math.random() * 20) + 5;
    }

    update() {
        this.y += 1;

        if(this.y > canvas.height / fontSize) {
            this.y = 0;
        }
    }

    draw() {
        const char = ascii[Math.floor(Math.random() * ascii.length)];

        context.fillStyle = "lime";

        context.fillText(
            char,
            this.x * fontSize,
            this.y * fontSize
        );
    }
}

const characters = [];

function loop() {
    context.fillStyle = "rgba(0, 0, 0, 0.15)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = `${fontSize}px monospace`;

    const columns = Math.floor(canvas.width / fontSize);

    while (characters.length < columns) {
        characters.push(new Character(characters.length));
    }

    while(characters.length > columns) {
        characters.pop();
    }

    for (const char of characters) {
        char.update();
        char.draw();
    }

    setTimeout(loop, 160);
}

loop();