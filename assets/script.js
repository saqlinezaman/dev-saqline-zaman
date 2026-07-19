
      (function () {
        // Create preloader element
        const preloader = document.createElement("div");
        preloader.id = "preloader";
        preloader.style.cssText =
          "position:fixed; inset:0; z-index:99999; display:flex; align-items:center; justify-content:center; background:#030303; backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); transition:opacity 0.6s ease;";

        const text = document.createElement("h1");
        text.style.cssText =
          "font-family:'Space Grotesk', sans-serif; font-weight:600; font-size:1.6rem; letter-spacing:-0.01em; background:linear-gradient(120deg,#F5F5F7 30%,#C4B5FD 65%,#8B5CF6 100%); -webkit-background-clip:text; background-clip:text; color:transparent; white-space:nowrap;";

        const cursor = document.createElement("span");
        cursor.style.cssText =
          "display:inline-block; width:2px; margin-left:2px; background:#8B5CF6; animation:blinkCursor 0.8s step-end infinite;";

        // Cursor blink keyframes
        const styleTag = document.createElement("style");
        styleTag.textContent =
          "@keyframes blinkCursor { 0%, 100% { opacity:1; } 50% { opacity:0; } }";
        document.head.appendChild(styleTag);

        preloader.appendChild(text);
        preloader.appendChild(cursor);
        document.body.appendChild(preloader);
        document.body.style.overflow = "hidden";

        const message = "< Hey, I'm Saqline Zaman />";
        let i = 0;

        function typeWriter() {
          if (i < message.length) {
            text.textContent += message.charAt(i);
            i++;
            setTimeout(typeWriter, 30);
          }
        }
        typeWriter();

        // Fade out and remove after 2s
        setTimeout(() => {
          preloader.style.opacity = "0";
          setTimeout(() => {
            preloader.remove();
            document.body.style.overflow = "";
          }, 600);
        }, 1600);
      })();
      document.getElementById("year").textContent = new Date().getFullYear();

      const menuBtn = document.getElementById("menu-btn");
      const closeMenuBtn = document.getElementById("close-menu-btn");
      const mobileMenu = document.getElementById("mobile-menu");

      menuBtn.addEventListener("click", () => {
        mobileMenu.classList.add("show");
      });

      closeMenuBtn.addEventListener("click", () => {
        mobileMenu.classList.remove("show");
      });

      mobileMenu.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", () => {
          mobileMenu.classList.remove("show");
        }),
      );

      /* ---------------- Custom cursor ---------------- */
      const dot = document.getElementById("cursor-dot");
      const ring = document.getElementById("cursor-ring");
      let mouseX = 0,
        mouseY = 0,
        ringX = 0,
        ringY = 0;

      window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + "px";
        dot.style.top = mouseY + "px";
      });

      function animateRing() {
        ringX += (mouseX - ringX) * 0.16;
        ringY += (mouseY - ringY) * 0.16;
        ring.style.left = ringX + "px";
        ring.style.top = ringY + "px";
        requestAnimationFrame(animateRing);
      }
      animateRing();

      const hoverables = document.querySelectorAll(
        "a, button, .skill-chip, .project-card",
      );
      hoverables.forEach((el) => {
        el.addEventListener("mouseenter", () => ring.classList.add("hovered"));
        el.addEventListener("mouseleave", () =>
          ring.classList.remove("hovered"),
        );
      });

      /* ---------------- GSAP animations ---------------- */
      gsap.registerPlugin(ScrollTrigger);

      // Hero entrance
      gsap.set(".hero-line", { y: 40, opacity: 0 });
      gsap.to(".hero-line", {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.2,
      });

      // Section reveal-on-scroll
      document.querySelectorAll(".reveal-up").forEach((el) => {
        gsap.set(el, { y: 50, opacity: 0 });
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          onEnter: () =>
            gsap.to(el, {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power3.out",
            }),
          once: true,
        });
      });

      // toolkit section reveal
      (function () {
        const boxes = document.querySelectorAll("[data-box]");

        boxes.forEach((box) => {
          const balls = Array.from(box.querySelectorAll(".skill-ball"));
          const state = [];

          function rectSize() {
            return { w: box.clientWidth, h: box.clientHeight };
          }

          const { w: initW, h: initH } = rectSize();

          balls.forEach((ball) => {
            const size = ball.offsetWidth || 60;
            let placed = false;
            let x = 0,
              y = 0;
            let attempts = 0;

            while (!placed && attempts < 200) {
              x = Math.random() * Math.max(1, initW - size);
              y = Math.random() * Math.max(1, initH - size);
              placed = true;
              for (const s of state) {
                const dx = x + size / 2 - (s.x + s.size / 2);
                const dy = y + size / 2 - (s.y + s.size / 2);
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < size / 2 + s.size / 2) {
                  placed = false;
                  break;
                }
              }
              attempts++;
            }

            const angle = Math.random() * Math.PI * 2;
            const speed = 0.35 + Math.random() * 0.25;
            state.push({
              el: ball,
              size,
              x,
              y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              dragging: false,
            });
          });

          let mouseX = null,
            mouseY = null,
            mouseActive = false;

          box.addEventListener("pointermove", (e) => {
            const rect = box.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
            mouseActive = true;
          });
          box.addEventListener("pointerleave", () => {
            mouseActive = false;
          });

          state.forEach((s) => {
            let offsetX = 0,
              offsetY = 0;
            s.el.addEventListener("pointerdown", (e) => {
              s.dragging = true;
              s.el.setPointerCapture(e.pointerId);
              const rect = box.getBoundingClientRect();
              offsetX = e.clientX - rect.left - s.x;
              offsetY = e.clientY - rect.top - s.y;
            });
            s.el.addEventListener("pointermove", (e) => {
              if (!s.dragging) return;
              const rect = box.getBoundingClientRect();
              const px = s.x,
                py = s.y;
              s.x = e.clientX - rect.left - offsetX;
              s.y = e.clientY - rect.top - offsetY;
              s.vx = s.x - px;
              s.vy = s.y - py;
            });
            s.el.addEventListener("pointerup", (e) => {
              s.dragging = false;
              s.el.releasePointerCapture(e.pointerId);
              const len = Math.hypot(s.vx, s.vy);
              if (len < 0.2) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 0.35 + Math.random() * 0.25;
                s.vx = Math.cos(angle) * speed;
                s.vy = Math.sin(angle) * speed;
              }
            });
            s.el.addEventListener("pointercancel", () => {
              s.dragging = false;
            });
          });

          function resolveCollisions() {
            for (let i = 0; i < state.length; i++) {
              for (let j = i + 1; j < state.length; j++) {
                const a = state[i],
                  b = state[j];
                const ar = a.size / 2,
                  br = b.size / 2;
                const acx = a.x + ar,
                  acy = a.y + ar;
                const bcx = b.x + br,
                  bcy = b.y + br;
                let dx = bcx - acx;
                let dy = bcy - acy;
                let dist = Math.sqrt(dx * dx + dy * dy);
                const minDist = ar + br;

                if (dist < minDist) {
                  if (dist === 0) {
                    dx = (Math.random() - 0.5) * 0.1;
                    dy = (Math.random() - 0.5) * 0.1;
                    dist = 0.01;
                  }
                  const overlap = (minDist - dist) / 2;
                  const nx = dx / dist;
                  const ny = dy / dist;

                  if (!a.dragging) {
                    a.x -= nx * overlap;
                    a.y -= ny * overlap;
                  }
                  if (!b.dragging) {
                    b.x += nx * overlap;
                    b.y += ny * overlap;
                  }

                  const avx = a.vx,
                    avy = a.vy;
                  const bvx = b.vx,
                    bvy = b.vy;

                  if (!a.dragging && !b.dragging) {
                    a.vx = bvx;
                    a.vy = bvy;
                    b.vx = avx;
                    b.vy = avy;
                  } else if (a.dragging && !b.dragging) {
                    b.vx = nx * 1.2;
                    b.vy = ny * 1.2;
                  } else if (b.dragging && !a.dragging) {
                    a.vx = -nx * 1.2;
                    a.vy = -ny * 1.2;
                  }
                }
              }
            }
          }

          function step() {
            const { w, h } = rectSize();

            state.forEach((s) => {
              if (!s.dragging) {
                s.x += s.vx;
                s.y += s.vy;

                if (mouseActive) {
                  const cx = s.x + s.size / 2;
                  const cy = s.y + s.size / 2;
                  const dx = cx - mouseX;
                  const dy = cy - mouseY;
                  const dist = Math.sqrt(dx * dx + dy * dy);
                  const minDist = 120;
                  if (dist < minDist && dist > 0.01) {
                    const force = (minDist - dist) / minDist;
                    s.vx += (dx / dist) * force * 1.4;
                    s.vy += (dy / dist) * force * 1.4;
                  }
                }

                const speed = Math.hypot(s.vx, s.vy);
                const minSpeed = 1.0;
                const maxSpeed = 2.0;
                if (speed < minSpeed && speed > 0.001) {
                  const boost = minSpeed / speed;
                  s.vx *= boost;
                  s.vy *= boost;
                } else if (speed > maxSpeed) {
                  const damp = maxSpeed / speed;
                  s.vx *= damp;
                  s.vy *= damp;
                }

                s.vx *= 0.985;
                s.vy *= 0.985;

                if (s.x < 0) {
                  s.x = 0;
                  s.vx = Math.abs(s.vx);
                }
                if (s.y < 0) {
                  s.y = 0;
                  s.vy = Math.abs(s.vy);
                }
                if (s.x > w - s.size) {
                  s.x = w - s.size;
                  s.vx = -Math.abs(s.vx);
                }
                if (s.y > h - s.size) {
                  s.y = h - s.size;
                  s.vy = -Math.abs(s.vy);
                }
              } else {
                s.x = Math.max(0, Math.min(w - s.size, s.x));
                s.y = Math.max(0, Math.min(h - s.size, s.y));
              }
            });

            resolveCollisions();

            state.forEach((s) => {
              s.el.style.transform = `translate(${s.x}px, ${s.y}px)`;
            });

            requestAnimationFrame(step);
          }

          requestAnimationFrame(step);

          window.addEventListener("resize", () => {
            const { w, h } = rectSize();
            state.forEach((s) => {
              s.x = Math.min(s.x, Math.max(0, w - s.size));
              s.y = Math.min(s.y, Math.max(0, h - s.size));
            });
          });
        });
      })();
// Benefits auto-sliding carousel — moves 1 card at a time, shows 1 (mobile) / 2 (tablet) / 3 (desktop)
(function () {
  const track = document.getElementById('benefits-track');
  const items = document.querySelectorAll('.benefit-slide-item');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  const slider = document.getElementById('benefits-slider');
  if (!track || !items.length) return;

  const total = items.length;
  let index = 0;
  let autoplay;

  function getVisibleCount() {
    const w = window.innerWidth;
    if (w >= 1024) return 3;
    if (w >= 640) return 2;
    return 1;
  }

  function render() {
    const visible = getVisibleCount();
    const maxIndex = Math.max(0, total - visible);
    if (index > maxIndex) index = maxIndex;
    const step = 100 / visible;
    track.style.transform = `translateX(-${index * step}%)`;
  }

  function next() {
    const visible = getVisibleCount();
    const maxIndex = Math.max(0, total - visible);
    index = index >= maxIndex ? 0 : index + 1;
    render();
  }
  function prev() {
    const visible = getVisibleCount();
    const maxIndex = Math.max(0, total - visible);
    index = index <= 0 ? maxIndex : index - 1;
    render();
  }
  function startAutoplay() { autoplay = setInterval(next, 3500); }
  function stopAutoplay() { clearInterval(autoplay); }

  nextBtn.addEventListener('click', () => { next(); stopAutoplay(); startAutoplay(); });
  prevBtn.addEventListener('click', () => { prev(); stopAutoplay(); startAutoplay(); });
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);
  window.addEventListener('resize', render);

  render();
  startAutoplay();
})();
      // Project cards stagger
      gsap.set(".project-card", { y: 60, opacity: 0 });
      ScrollTrigger.create({
        trigger: "#project-grid",
        start: "top 80%",
        onEnter: () =>
          gsap.to(".project-card", {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
          }),
        once: true,
      });

      // Skill chips
      gsap.set(".skill-chip", { scale: 0.8, opacity: 0 });
      document.querySelectorAll("#skills .flex.flex-wrap").forEach((group) => {
        ScrollTrigger.create({
          trigger: group,
          start: "top 85%",
          onEnter: () =>
            gsap.to(group.querySelectorAll(".skill-chip"), {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              stagger: 0.05,
              ease: "back.out(1.7)",
            }),
          once: true,
        });
      });

      // Counters
      document.querySelectorAll(".counter").forEach((counter) => {
        const target = +counter.dataset.target;
        ScrollTrigger.create({
          trigger: counter,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.to(counter, {
              innerText: target,
              duration: 1.4,
              snap: { innerText: 1 },
              ease: "power2.out",
            });
          },
        });
      });
      // Mouse-tracking spotlight glow inside each benefit card
      document.querySelectorAll(".benefit-card").forEach((card) => {
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          card.style.setProperty("--mx", x + "%");
          card.style.setProperty("--my", y + "%");
        });
      });
      // Nav background on scroll (subtle)
      ScrollTrigger.create({
        start: "top -80",
        onUpdate: (self) => {
          const nav = document.querySelector("nav");
          if (self.scroll() > 80)
            nav.classList.add("shadow-[0_1px_20px_-5px_rgba(139,92,246,0.25)]");
          else
            nav.classList.remove(
              "shadow-[0_1px_20px_-5px_rgba(139,92,246,0.25)]",
            );
        },
      });