import React from "react";
import { useEffect, useRef, useState } from "react";

export default function Particles() {
  // const Particles:React.FC = () => {

  const [resetTrigger, setResetTrigger] = useState(0);

  useEffect(() => {
    let canvas = document.querySelector("#scene") as HTMLCanvasElement,
      ctx = canvas.getContext("2d", {
        willReadFrequently: true,
      }) as CanvasRenderingContext2D,
      particles: Particle[] = [],
      amount = 0,
      mouse = { x: 0, y: 0 },
      radius = 0.5;

      const darkmodeToggleButton = document.getElementById('darkmodeToggleButton');

    // let color = ["#ffffff"];
    const color = [
      getComputedStyle(document.documentElement).getPropertyValue(
        "--particle-color"
      ),
    ];

    let displayText = "O*";

    let ww = window.innerWidth;
    let wh = window.innerHeight;

    class Particle {
      x: number;
      y: number;
      dest: { x: number; y: number };
      r: number;
      vx: number;
      vy: number;
      accX: number;
      accY: number;
      friction: number;
      color: string[];

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.dest = {
          x: x,
          y: y,
        };

        //   this.r = ww / 600;
        // this.r = ww/50
        // this.r = ww/100
        this.r = 5;

        this.vx = 0;
        this.vy = 0;

        this.accX = 0;
        this.accY = 0;
        this.friction = 0.7;

        this.color = color;
      }

      render() {
        this.accX = (this.dest.x - this.x) / 100;
        this.accY = (this.dest.y - this.y) / 100;
        this.vx += this.accX;
        this.vy += this.accY;
        this.vx *= this.friction;
        this.vy *= this.friction;

        this.x += this.vx;
        this.y += this.vy;

        ctx.fillStyle = this.color[0];
        ctx.beginPath();

        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);

        ctx.fill();

        let a = this.x - mouse.x;
        let b = this.y - mouse.y;

        let distance = Math.sqrt(a * a + b * b);

        if (distance < radius * 60) {
          this.accX = this.x - mouse.x;
          this.accY = this.y - mouse.y;

          this.vx += this.accX;
          this.vy += this.accY;
        }
        if (distance > radius * 250) {
          this.accX = (this.dest.x - this.x) / 10;
          this.accY = (this.dest.y - this.y) / 10;
          this.vx += this.accX;
          this.vy += this.accY;
        }
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    const onTouchEnd = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const onMouseDown = () => {
      radius = 2;
    };

    const onMouseUp = () => {
      radius = 0.5;
    };

    function initScene() {
      ww = canvas.width = window.innerWidth;
      wh = canvas.height = window.innerHeight;

      // ctx.font = "400px Arial";
      if (ww < 900) {
        ctx.font = "400px Arial";
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "650px Arial";
      }

      ctx.textAlign = "center";

      if (wh > 700) {
        ctx.fillText(displayText, ww / 2, wh / 1.3);
      }
      else {
        ctx.fillText(displayText, ww / 2, wh / 1.2);
      }
      // ctx.fillText(displayText, ww / 2, wh / 1.2);
      // ctx.fillText(displayText, ww / 2, wh /2);

      let data = ctx.getImageData(0, 0, ww, wh).data;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "screen";

      let divider = 50;

      particles = [];
      for (let i = 0; i < ww; i += Math.round(ww / divider)) {
        for (let j = 0; j < wh; j += Math.round(ww / divider)) {
          if (data[(i + j * ww) * 4 + 3] > divider) {
            particles.push(new Particle(i, j));
          }
        }
      }
      amount = particles.length;
    }

    let animationFrameId: number;

    function render() {
      animationFrameId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < amount; i++) {
        particles[i].render();
      }
    }

    const handleThemeToggle = () => {resetScene()}

    if (darkmodeToggleButton) {
      darkmodeToggleButton.addEventListener('click', handleThemeToggle);
  }
    window.addEventListener("resize", initScene);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchend", onTouchEnd);
    initScene();
    animationFrameId = requestAnimationFrame(render);

    return () => {
      if (darkmodeToggleButton) {
        darkmodeToggleButton.removeEventListener('click', handleThemeToggle);
    }
      window.removeEventListener("resize", initScene);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchend", onTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, [resetTrigger]);

  function resetScene() {
    setResetTrigger(prev => prev + 1);
}

  return (
    <div className="bodyCenter">
    <div>
      <h1> Particles </h1>
      <canvas
        style={{
          width: window.innerWidth,
          height: window.innerHeight,
          position: "absolute",
          top: 0,
          left: 0,
          overflow: "hidden",
          zIndex: -10,
        }}
        id="scene"
      ></canvas>
    </div>
    </div>
  );
}
