// Create stars
const starsContainer = document.getElementById("stars");
for (let i = 0; i < 100; i++) {
  const star = document.createElement("div");
  star.className = "star";
  star.style.left = Math.random() * 100 + "%";
  star.style.top = Math.random() * 100 + "%";
  star.style.animationDelay = Math.random() * 3 + "s";
  starsContainer.appendChild(star);
}

// Cursor trail effect
let lastTrailTime = 0;
document.addEventListener("mousemove", (e) => {
  const now = Date.now();
  if (now - lastTrailTime > 50) {
    const trail = document.createElement("div");
    trail.className = "cursor-trail";
    trail.style.left = e.pageX + "px";
    trail.style.top = e.pageY + "px";
    document.body.appendChild(trail);

    setTimeout(() => trail.remove(), 500);
    lastTrailTime = now;
  }
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Form submission
document.querySelector(".contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("MESSAGE SENT! THANKS FOR REACHING OUT!");
  e.target.reset();
});

// Scroll reveal animation
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

document
  .querySelectorAll(".project-card, .timeline-item, .testimonial-card")
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(50px)";
    el.style.transition = "all 0.8s ease";
    observer.observe(el);
  });

// Konami code easter egg
const konamiCode = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];
let konamiIndex = 0;

document.addEventListener("keydown", (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      const gameOver = document.createElement("div");
      gameOver.className = "game-over";
      gameOver.textContent = "CHEAT CODE ACTIVATED!";
      document.body.appendChild(gameOver);
      gameOver.style.opacity = "1";
      setTimeout(() => {
        gameOver.style.opacity = "0";
        setTimeout(() => {
          gameOver.remove();
          openGame();
        }, 500);
      }, 1500);
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

// Dino Game
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const modal = document.getElementById("gameModal");

let gameRunning = false;
let score = 0;
let highScore = parseInt(localStorage.getItem("dinoHighScore")) || 0;
let gameSpeed = 6;
let gravity = 0.8;

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = 400;
}

const dino = {
  x: 80,
  y: 0,
  width: 44,
  height: 47,
  velocityY: 0,
  jumpStrength: 15,
  isJumping: false,
  frame: 0,

  draw() {
    const groundY = canvas.height - 30;
    const dinoY = groundY - this.height - 15 - this.y;

    ctx.fillStyle = "#FF006E";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#FF006E";

    // Pixel perfect dino
    const pixels = [
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 1, 1, 1, 2, 2, 1, 1, 1, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0],
    ];

    const pixelSize = 3;
    pixels.forEach((row, rowIdx) => {
      row.forEach((pixel, colIdx) => {
        if (pixel === 1) {
          ctx.fillStyle = "#FF006E";
          ctx.fillRect(
            this.x + colIdx * pixelSize,
            dinoY + rowIdx * pixelSize,
            pixelSize,
            pixelSize
          );
        } else if (pixel === 2) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(
            this.x + colIdx * pixelSize,
            dinoY + rowIdx * pixelSize,
            pixelSize,
            pixelSize
          );
        }
      });
    });

    // Animated legs
    const legFrame = Math.floor(this.frame / 6) % 2;
    ctx.fillStyle = "#FF006E";

    if (!this.isJumping && gameRunning) {
      if (legFrame === 0) {
        ctx.fillRect(this.x + 6, dinoY + 45, 9, 15);
        ctx.fillRect(this.x + 21, dinoY + 45, 9, 15);
      } else {
        ctx.fillRect(this.x + 21, dinoY + 45, 9, 15);
        ctx.fillRect(this.x + 6, dinoY + 45, 9, 15);
      }
    } else {
      ctx.fillRect(this.x + 9, dinoY + 45, 9, 15);
      ctx.fillRect(this.x + 18, dinoY + 45, 9, 15);
    }

    ctx.shadowBlur = 0;
    if (gameRunning) this.frame++;
  },

  jump() {
    if (!this.isJumping) {
      this.velocityY = this.jumpStrength; // UPWARD
      this.isJumping = true;
    }
  },

  update() {
    if (this.isJumping) {
      this.velocityY -= gravity; // gravity pulls DOWN
      this.y += this.velocityY;

      // Land on ground
      if (this.y <= 0) {
        this.y = 0;
        this.velocityY = 0;
        this.isJumping = false;
      }
    }
  },
  reset() {
    this.y = 0;
    this.velocityY = 0;
    this.isJumping = false;
    this.frame = 0;
  },
};

class Obstacle {
  constructor() {
    this.type = Math.random() > 0.6 ? "cactus" : "pterodactyl";
    if (this.type === "cactus") {
      this.width = 24;
      this.height = 45;
      this.y = 0;
    } else {
      this.width = 46;
      this.height = 30;
      this.y = 30 + Math.random() * 40; // Flying height
    }
    this.x = canvas.width;
    this.colors = ["#8B00FF", "#00F5FF", "#39FF14"];
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.frame = 0;
  }

  draw() {
    const groundY = canvas.height - 30;
    const obstacleY =
      this.type === "cactus"
        ? groundY - this.height
        : groundY - this.height - this.y;

    ctx.fillStyle = this.color;
    ctx.shadowBlur = 20;
    ctx.shadowColor = this.color;

    if (this.type === "cactus") {
      // Pixelated cactus
      const cactusPixels = [
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
      ];

      const pixelSize = 3;
      cactusPixels.forEach((row, y) => {
        row.forEach((pixel, x) => {
          if (pixel === 1) {
            ctx.fillRect(
              this.x + x * pixelSize,
              obstacleY + y * pixelSize,
              pixelSize,
              pixelSize
            );
          }
        });
      });
    } else {
      // Pixelated pterodactyl (flying dino)
      const wingFrame = Math.floor(this.frame / 10) % 2;
      const pteroPixels =
        wingFrame === 0
          ? [
              [0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
              [0, 0, 0, 1, 1, 1, 1, 1, 1, 0],
              [0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
              [1, 1, 1, 1, 1, 2, 1, 1, 1, 0], // 2 = eye
              [1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
              [0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
            ]
          : [
              [0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
              [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
              [0, 0, 1, 1, 1, 2, 1, 1, 1, 0], // 2 = eye
              [0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
              [0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
            ];

      const pixelSize = 3;
      pteroPixels.forEach((row, y) => {
        row.forEach((pixel, x) => {
          if (pixel === 1) {
            ctx.fillStyle = this.color;
            ctx.fillRect(
              this.x + x * pixelSize,
              obstacleY + y * pixelSize,
              pixelSize,
              pixelSize
            );
          } else if (pixel === 2) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(
              this.x + x * pixelSize,
              obstacleY + y * pixelSize,
              pixelSize,
              pixelSize
            );
          }
        });
      });
    }

    ctx.shadowBlur = 0;
    this.frame++;
  }

  update() {
    this.x -= gameSpeed;
  }
}

class Cloud {
  constructor() {
    this.x = canvas.width + Math.random() * 200;
    this.y = Math.random() * 150 + 30;
    this.width = 60 + Math.random() * 40;
    this.speed = 1 + Math.random();
  }

  draw() {
    ctx.fillStyle = "rgba(0, 245, 255, 0.2)";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00F5FF";

    // Cloud parts
    ctx.beginPath();
    ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
    ctx.arc(this.x + 20, this.y, 20, 0, Math.PI * 2);
    ctx.arc(this.x + 40, this.y, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
  }

  update() {
    this.x -= this.speed;
    if (this.x + this.width < 0) {
      this.x = canvas.width + Math.random() * 200;
      this.y = Math.random() * 150 + 30;
    }
  }
}

let obstacles = [];
let clouds = [];
let frameCount = 0;
let obstacleFrequency = 90;

// Initialize clouds
for (let i = 0; i < 5; i++) {
  clouds.push(new Cloud());
}

function spawnObstacle() {
  obstacles.push(new Obstacle());
}

function checkCollision(dino, obstacle) {
  const groundY = canvas.height - 30;

  // ✅ Correct dino hitbox
  const dinoTop = groundY - dino.height - 15 - dino.y;
  const dinoBottom = groundY - dino.y;
  const dinoLeft = dino.x + 8;
  const dinoRight = dino.x + dino.width - 8;

  let obstacleTop, obstacleBottom, obstacleLeft, obstacleRight;

  if (obstacle.type === "cactus") {
    obstacleTop = groundY - obstacle.height;
    obstacleBottom = groundY;
    obstacleLeft = obstacle.x + 6;
    obstacleRight = obstacle.x + obstacle.width - 6;
  } else {
    obstacleTop = groundY - obstacle.height - obstacle.y;
    obstacleBottom = obstacleTop + obstacle.height;
    obstacleLeft = obstacle.x + 8;
    obstacleRight = obstacle.x + obstacle.width - 8;
  }

  return !(
    dinoRight < obstacleLeft ||
    dinoLeft > obstacleRight ||
    dinoBottom < obstacleTop || // ✅ key fix
    dinoTop > obstacleBottom
  );
}

function drawGround() {
  const groundY = canvas.height - 30;

  // Ground line
  ctx.strokeStyle = "#39FF14";
  ctx.lineWidth = 4;
  ctx.shadowBlur = 15;
  ctx.shadowColor = "#39FF14";
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(canvas.width, groundY);
  ctx.stroke();

  // Moving ground pattern
  ctx.fillStyle = "rgba(57, 255, 20, 0.3)";
  const groundOffset = (frameCount * gameSpeed) % 40;
  for (let i = -groundOffset; i < canvas.width; i += 40) {
    ctx.fillRect(i, groundY + 5, 20, 3);
    ctx.fillRect(i + 25, groundY + 10, 10, 3);
  }

  ctx.shadowBlur = 0;
}

function drawBackground() {
  // Sky gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "rgba(139, 0, 255, 0.1)");
  gradient.addColorStop(1, "rgba(5, 0, 8, 1)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Stars
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  for (let i = 0; i < 50; i++) {
    const x = (i * 137 + frameCount * 0.2) % canvas.width;
    const y = (i * 97) % (canvas.height - 100);
    ctx.fillRect(x, y, 2, 2);
  }
}

function updateScore() {
  document.getElementById("score").textContent = Math.floor(score);
  document.getElementById("highScore").textContent = highScore;
}

function gameLoop() {
  if (!gameRunning) return;

  drawBackground();

  // Update and draw clouds
  clouds.forEach((cloud) => {
    cloud.update();
    cloud.draw();
  });

  drawGround();

  dino.update();
  dino.draw();

  frameCount++;
  if (frameCount % obstacleFrequency === 0) {
    spawnObstacle();
    obstacleFrequency = Math.max(45, 90 - Math.floor(score / 100));
  }

  obstacles.forEach((obstacle, index) => {
    obstacle.update();
    obstacle.draw();

    if (checkCollision(dino, obstacle)) {
      gameRunning = false;
      if (score > highScore) {
        highScore = Math.floor(score);
        localStorage.setItem("dinoHighScore", highScore);
      }
      updateScore();

      // Game over screen
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#FF006E";
      ctx.shadowBlur = 40;
      ctx.shadowColor = "#FF006E";
      ctx.font = '40px "Press Start 2P"';
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 30);

      ctx.font = '20px "Press Start 2P"';
      ctx.fillStyle = "#00F5FF";
      ctx.shadowColor = "#00F5FF";
      ctx.fillText(
        "SCORE: " + Math.floor(score),
        canvas.width / 2,
        canvas.height / 2 + 20
      );

      ctx.font = '14px "Press Start 2P"';
      ctx.fillStyle = "#39FF14";
      ctx.shadowColor = "#39FF14";
      ctx.fillText(
        "PRESS SPACE TO RESTART",
        canvas.width / 2,
        canvas.height / 2 + 70
      );
      ctx.shadowBlur = 0;
      return;
    }

    if (obstacle.x + obstacle.width < 0) {
      obstacles.splice(index, 1);
      score += 10;
    }
  });

  score += 0.15;
  gameSpeed = 6 + score / 400;
  updateScore();

  requestAnimationFrame(gameLoop);
}

function startGame() {
  gameRunning = true;
  score = 0;
  gameSpeed = 6;
  obstacles = [];
  frameCount = 0;
  obstacleFrequency = 90;
  dino.reset();
  updateScore();
  gameLoop();
}

function openGame() {
  modal.classList.add("active");
  resizeCanvas();
  updateScore();
  setTimeout(() => {
    startGame();
  }, 100);
}

function closeGame() {
  modal.classList.remove("active");
  gameRunning = false;
  obstacles = [];
}

// Game controls - SIMPLIFIED
let jumpPressed = false;

document.addEventListener("keydown", (e) => {
  if (!modal.classList.contains("active")) return;

  if ((e.code === "Space" || e.code === "ArrowUp") && !jumpPressed) {
    e.preventDefault();
    jumpPressed = true;

    if (gameRunning) {
      dino.jump();
    } else {
      startGame();
    }
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    jumpPressed = false;
  }
});

canvas.addEventListener("click", (e) => {
  e.preventDefault();
  if (gameRunning) {
    dino.jump();
  } else {
    startGame();
  }
});

canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  if (gameRunning) {
    dino.jump();
  } else {
    startGame();
  }
});

window.addEventListener("resize", () => {
  if (modal.classList.contains("active")) {
    resizeCanvas();
  }
});

const counters = document.querySelectorAll(".counter");

counters.forEach((counter) => {
  const target = +counter.getAttribute("data-count");
  const speed = 200; // smaller = faster

  const updateCount = () => {
    const current = +counter.innerText;
    const increment = Math.ceil(target / speed);

    if (current < target) {
      counter.innerText = current + increment;
      setTimeout(updateCount, 20);
    } else {
      counter.innerText = target.toLocaleString();
    }
  };

  updateCount();
});

const openWorkBtn = document.getElementById("open-work-modal");
const workModal = document.getElementById("work-modal");
const closeModalBtn = workModal.querySelector(".close-modal");

openWorkBtn.addEventListener("click", () => {
  document.body.style.overflow = "hidden";
  workModal.classList.remove("closing");
  workModal.classList.add("show");
});

function closeModal() {
  workModal.classList.add("closing");

  setTimeout(() => {
    workModal.classList.remove("show");
    workModal.classList.remove("closing");
    document.body.style.overflow = "";
  }, 280); // must match macClose duration
}

closeModalBtn.addEventListener("click", closeModal);

workModal.addEventListener("click", (e) => {
  if (e.target === workModal) {
    closeModal();
  }
});

const form = document.getElementById("contact-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const payload = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  await fetch("https://script.google.com/macros/s/AKfycbzFMd8Iv2gfz6cR7w3J1z92AcuWuQKzR98L8TEtWp0iAEK-0ytRCelhJEKjmExSKXIt/exec", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  alert("Message sent successfully!");
  form.reset();
});
