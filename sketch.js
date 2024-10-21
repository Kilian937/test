let logos = [];  // Array für die Hauptlogos
let numLogos = 1;  // Anzahl der Hauptlogos
let minSize = 20, maxSize = 280;  // Mindest- und Maximalgröße der Hauptlogos
let popSpeed = 35;  // Geschwindigkeit für den Pop-Effekt
let rotationSpeed = 0.01;  // Geschwindigkeit der langsamen Drehung
let margin = 350;  // Abstand vom Rand
let particles = [];  // Array für die fliegenden Logos
let numParticles = 50;  // Anzahl der kleinen fliegenden Logos

function preload() {
  // Hier das Logo laden (Pfad zum Bild angeben)
  for (let i = 0; i < numLogos; i++) {
    let logo = {
      img: loadImage('Logoweiss2.png'),
      x: random(margin, 1920 - margin),
      y: random(margin, 1080 - margin),
      size: minSize,
      angle: 0,
      isPopping: false,
      popSpeed: popSpeed
    };
    logos.push(logo);
  }

  // Lade auch das kleine Logo als Partikelbild
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle(loadImage('Logoweiss2.png')));
  }
}

function setup() {
  createCanvas(1920, 1080);
}

function draw() {
  background(20,85,217);  // Roter Hintergrund

  // Zeichne und aktualisiere die fliegenden Logos (Partikel)
  for (let particle of particles) {
    particle.update();
    particle.show();
  }

  for (let i = 0; i < logos.length; i++) {
    let logo = logos[i];
    
    // Berechne die Distanz zwischen Maus und Logo
    let distance = dist(mouseX, mouseY, logo.x, logo.y);

    // Wenn das Logo berührt wird, starte den Pop-Effekt
    if (distance < logo.size / 2 && !logo.isPopping) {
      logo.isPopping = true;
    }

    // Wenn der Pop-Effekt aktiv ist
    if (logo.isPopping) {
      // Logo wird kurz größer und schrumpft dann, bis es verschwindet
      logo.size += logo.popSpeed;
      if (logo.size >= maxSize * 1.2) {  // Kurz größer als maxSize, um den "Pop"-Effekt zu erzeugen
        logo.popSpeed = -logo.popSpeed;  // Dann beginnt es zu schrumpfen
      }
      if (logo.size <= 0) {  // Wenn es komplett verschwunden ist
        resetLogo(logo);  // Logo wird neu positioniert und wächst neu
      }
    } else {
      // Wenn der Pop-Effekt nicht aktiv ist, Größe des Logos je nach Entfernung zur Maus
      logo.size = map(distance, 0, width, minSize, maxSize);
      logo.size = constrain(logo.size, minSize, maxSize);  // Begrenzung der Größe
    }

    // Zeichne das drehende Logo an der aktuellen Position
    push();  // Speichert den aktuellen Zustand der Zeichenmatrix
    translate(logo.x, logo.y);  // Verschiebt den Ursprung zum Logo
    rotate(logo.angle);  // Dreht das Logo
    imageMode(CENTER);
    image(logo.img, 0, 0, logo.size, logo.size);
    pop();  // Stellt die Matrix zurück

    // Aktualisiere den Rotationswinkel
    logo.angle += rotationSpeed;
  }
}

// Partikel-Klasse für fliegende Logos
class Particle {
  constructor(img) {
    this.x = random(1920);  // Zufällige Startposition
    this.y = random(1080);
    this.size = random(20, 50);  // Zufällige Größe der fliegenden Logos
    this.xSpeed = random(-1, 1);  // Zufällige Bewegungsgeschwindigkeit
    this.ySpeed = random(-1, 1);
    this.img = img;  // Logo-Bild
    this.alpha = random(25, 50);  // Transparenz für das Logo
  }

  // Aktualisiere die Partikelposition
  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    // Wenn der Partikel den Rand erreicht, umkehren
    if (this.x < 0 || this.x > width) {
      this.xSpeed *= -1;
    }
    if (this.y < 0 || this.y > height) {
      this.ySpeed *= -1;
    }
  }

  // Zeichne das fliegende Logo (Partikel)
  show() {
    push();
    translate(this.x, this.y);
    imageMode(CENTER);
    tint(255, this.alpha);  // Halbtransparente Logos
    image(this.img, 0, 0, this.size, this.size);
    pop();
  }
}

function resetLogo(logo) {
  // Setze das Logo an eine neue zufällige Position innerhalb der Ränder
  logo.x = random(margin, width - margin);
  logo.y = random(margin, height - margin);
  // Startgröße auf minSize setzen, damit es aus dem Nichts "aufploppt"
  logo.size = minSize;
  logo.isPopping = false;  // Pop-Effekt zurücksetzen
  logo.popSpeed = abs(popSpeed);  // Sicherstellen, dass es wieder wächst
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);  // Responsives Canvas
}
