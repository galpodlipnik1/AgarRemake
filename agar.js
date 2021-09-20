var canvas, context;
var mouseX = 300, mouseY = 300;
var x = Math.random()*25000, y = Math.random()*25000;
var speed = 10;
var size =50;
var barve = ["red", "blue", "yellow", "green", "orange", "purple"];
var pikice = [];
var playerBarva;
var angle = 0;
var gridSize = 50;
var growthFactor = 0.05;
var growthFactorvarVirus = 0.20;
var screenX = 0, screenY = 0;
var virusi = [];
var virusBarva = ["lime"]
var Virussize = 80;
var person = "";
var canvas = document.getElementById("myCanvas");
var txtBarva = "black";
var zoom = 1;
var sirina =0;
var powerUP =[];
var sizepower = 30;
var powerspeed = 15;


var mapWidth = 25000; // Sirina mape
var mapHeight =25000; // Visina mape

function main() {
    // Zacetek programa
    // Najdemo canvas in si ga shranimo v globalno spremenljivko
    person = window.prompt("Enter your nickname", "");
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousemove", handleMouseMove);

    playerBarva = izberiNakljucnoBarvo();

    context.font = "30px arial";
    sirina = context.measureText(person).width;
    

    for (var i = 0; i < 5000; i++) {
        spawnPikica();
    }

    for (var i = 0; i < 75; i++) {
        spawnVirus();
    }
    
    for (var i = 0; i < 40; i++) {
        spawnPower();
    }


    tick();
}

function handleKeyDown(e) {
    // Tipka je bila pritisnena
    if (e.key === " ") {
        // Koda za split
    }
}
function handleMouseMove(e) {
    // Miska se je premaknila
    mouseX = e.clientX;
    mouseY = e.clientY;
}

function tick() {
    // Funkcija tick se poklice veckrat na sekundo
    update(); // najprej izracunajmo novo stanje igre
    draw(); // potem pa stanje izrisimo na canvas
    requestAnimationFrame(tick);
}

function update() {
    // Logiko sprogramirajte tukaj

    // Player x,y sledi miski
    if (Math.abs(mouseX - x * zoom) > speed || Math.abs(mouseY - y * zoom) > speed) {
        angle = Math.atan2(x * zoom - mouseX - screenX, y * zoom - mouseY - screenY) + Math.PI / 2;
        x += Math.cos(angle) * speed;
        y -= Math.sin(angle) * speed;
        //console.log("angle", angle/Math.PI * 180);
    }

    if (x < 0) {
        x = 0;
    }

    if (y < 0) {
        y = 0;
    }

    if (x > mapWidth) {
        x = mapWidth;
    }

    if (y > mapHeight) {
        y = mapHeight;
    }

    // Odzoomiranje
    zoom = Math.min(1, 200 / size);

    // Kamera sledi playerju
    screenX = x * zoom - canvas.width / 2;
    screenY = y * zoom - canvas.height / 2;


    // Pobiranje pikic
    for (var i = 0; i < pikice.length; i++) {
        var razdalja = Math.sqrt(Math.pow(pikice[i].x - x, 2) + Math.pow(pikice[i].y - y, 2));
        if (razdalja <= size) {
            // To pikico bomo pobrali
            size = size + pikice[i].size * growthFactor;
            odstraniPikico(pikice[i]);
            spawnPikica();
        }
    }

    
     // Pobiranje power upov
     for (var i = 0; i < powerUP.length; i++) {
        var razdalja = Math.sqrt(Math.pow(powerUP[i].x - x, 2) + Math.pow(powerUP[i].y - y, 2));
        if (razdalja <= size && size > powerUP[i].size) {
            // To powerUp bomo pobrali
            speed = powerspeed;
            console.log("speed", speed);
            setTimeout(() => {
                speed = 10;
                console.log("speed", speed);
            }, 15000);
            odstraniPower(powerUP[i]);
            spawnPower();
        }
    }

    // Pobiranje virusov
    for (var i = 0; i < virusi.length; i++) {
        var razdalja = Math.sqrt(Math.pow(virusi[i].x - x, 2) + Math.pow(virusi[i].y - y, 2));
        if (razdalja <= size && size > virusi[i].size) {
            // To virus bomo pobrali
            size = size + virusi[i].size * growthFactorvarVirus;
            odstraniVirus(virusi[i]);
            spawnVirus();
        }
    }


    if (person == null || person == "") {
        txt = "user cencle the pomt.";
    } else {
        txt = person
    }

    if (size > 300) {
        context.font = "60px arial";
    }


    

}

function draw() {
    // Risanje sprogramirajte tukaj

    // Narisemo ozadje
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Rob mape
    // -> Narisi rob mape


    // Vertikalne crte
    for (var i = 0; i <= mapWidth / gridSize; i++) {
        context.beginPath();
        context.strokeStyle = "silver";
        context.moveTo((i * gridSize * zoom - screenX), 0);
        context.lineTo((i * gridSize * zoom - screenX), canvas.height);
        context.stroke();
    }

    // Horizontalne crte
    for (var i = 0; i <= mapHeight / gridSize; i++) {
        context.beginPath();
        context.strokeStyle = "silver";
        context.moveTo(0, i * gridSize * zoom - screenY);
        context.lineTo(canvas.width, i * gridSize * zoom - screenY);
        context.stroke();
    }

    // Pikice
    for (var i = 0; i < pikice.length; i++) {
        context.beginPath();
        context.fillStyle = pikice[i].barva;
        context.ellipse(pikice[i].x * zoom - screenX, pikice[i].y * zoom - screenY, pikice[i].size * zoom, pikice[i].size * zoom, 0, 0, 2 * Math.PI);
        context.fill();
    }

    //naredimo virus
    for (var i = 0; i < virusi.length; i++) {
        context.beginPath();
        context.fillStyle = virusi[i].barva[0];
        context.ellipse(virusi[i].x * zoom - screenX, virusi[i].y * zoom - screenY, virusi[i].size * zoom, virusi[i].size * zoom, 0, 0, 2 * Math.PI);
        context.fill();;
    }
          //naredimo powerup
    for (var i = 0; i < powerUP.length; i++) {
        context.beginPath();
       
        context.ellipse(powerUP[i].x * zoom - screenX, powerUP[i].y * zoom - screenY, powerUP[i].size * zoom, powerUP[i].size * zoom, 0, 0, 2 * Math.PI);
        context.fill();;
    }
    // Narisemo igralca
    context.beginPath();
    context.fillStyle = playerBarva;
    context.ellipse(x * zoom - screenX, y * zoom - screenY, size * zoom, size * zoom, 0, 0, 2 * Math.PI);
    context.fill();


    //naredimo text
    context.fillStyle = txtBarva;
    context.fillText(person, x * zoom - screenX - sirina/2, y * zoom - screenY +20/2);
    //context.fill();
}


// Funkcije za pomoc

function izberiNakljucnoBarvo() {
    var idxNakljucneBarve = Math.floor(Math.random() * barve.length);
    return barve[idxNakljucneBarve];
}

function spawnPikica() {
    pikice.push({
        x: Math.random() * mapWidth,
        y: Math.random() * mapHeight,
        barva: izberiNakljucnoBarvo(),
        size: 10,
    });
}

function spawnVirus() {
    var virus = {
        x: Math.random() * mapWidth,
        y: Math.random() * mapHeight,
        barva: virusBarva,
        size: Virussize,
    };
    virusi.push(virus);
    console.log(virus);
}
function spawnPower() {
    var pu = {
        x: Math.random() * mapWidth,
        y: Math.random() * mapHeight,
        barva: "blue",
        size: sizepower,
    };
    powerUP.push(pu);
    console.log(powerUP);
}

function odstraniPikico(pikica) {
    var idx = pikice.indexOf(pikica);
    if (idx == -1) return;
    pikice.splice(idx, 1);
}

function odstraniVirus(virus) {
    var idx = virusi.indexOf(virus);
    if (idx == -1) return;
    virusi.splice(idx, 1);
}
function odstraniPower(powerup) {
    var idx = powerUP.indexOf(powerup);
    if (idx == -1) return;
    powerUP.splice(idx, 1);
}


