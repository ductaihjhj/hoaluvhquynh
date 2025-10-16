// ===========================
// Particles - Falling Petals & Sparkles
// ===========================

class Petal {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
    this.y = Math.random() * canvas.height;
  }
  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = -20;
    this.size = Math.random() * 15 + 10;
    this.speed = Math.random() * 1.5 + 0.5;
    this.swingSpeed = Math.random() * 0.03 + 0.01;
    this.swingAmount = Math.random() * 50 + 30;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    this.opacity = Math.random() * 0.5 + 0.3;

    const colors = ['#FFD1DC', '#E6D5F5', '#FFE5D9', '#FFC0CB', '#E6B8D4', '#FFB3D9'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.y += this.speed;
    this.x += Math.sin(this.y * this.swingSpeed) * 0.8;
    this.rotation += this.rotationSpeed;
    if (this.y > this.canvas.height + 20) this.reset();
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size * 0.6, this.size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;
    ctx.restore();
  }
}

class Sparkle {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
  }
  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.size = Math.random() * 2 + 1;
    this.opacity = Math.random();
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.life = Math.random() * 200 + 50;
    this.age = 0;
    const colors = ['#FFE5F1', '#FFF9E5', '#E5F9E9', '#F0E6FF', '#FFFFFF'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.age++;
    this.y += this.speedY;
    this.opacity = Math.abs(Math.sin(this.age * 0.05));
    if (this.age > this.life) this.reset();
  }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('petalsCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.petals = [];
    this.sparkles = [];
    this.animationId = null;
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    const petalCount = window.innerWidth < 768 ? 20 : 40;
    const sparkleCount = window.innerWidth < 768 ? 25 : 50;
    this.petals = Array.from({ length: petalCount }, () => new Petal(this.canvas));
    this.sparkles = Array.from({ length: sparkleCount }, () => new Sparkle(this.canvas));
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.sparkles.forEach(s => { s.update(); s.draw(this.ctx); });
    this.petals.forEach(p => { p.update(); p.draw(this.ctx); });
    this.animationId = requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => new ParticleSystem());
