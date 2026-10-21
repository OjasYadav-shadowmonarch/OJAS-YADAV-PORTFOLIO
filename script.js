/* ==========================================================================
   Ojas Yadav — portfolio interactions
   Theme · navigation · scroll spy · progress · console · counters · filters
   ========================================================================== */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  /* ---------- Helpers ---------- */
  const $ = (selector, scope) => (scope || document).querySelector(selector);
  const $$ = (selector, scope) => Array.from((scope || document).querySelectorAll(selector));

  const escapeHtml = (value) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  /* ========================================================================
     1. Footer year + local clock
     ======================================================================== */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  const clock = $("#local-clock");
  if (clock) {
    const updateClock = () => {
      const now = new Date().toLocaleTimeString("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
      clock.textContent = "IST " + now;
    };
    updateClock();
    setInterval(updateClock, 30000);
  }

  /* ========================================================================
     2. Theme switching (dark / light)
     ======================================================================== */
  (() => {
    const root = document.documentElement;
    const toggle = $("#theme-toggle");
    const meta = $("#meta-theme-color");
    const palette = { dark: "#0b0d14", light: "#f7f8fc" };

    const apply = (theme) => {
      root.setAttribute("data-theme", theme);
      if (toggle) {
        toggle.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
        toggle.setAttribute(
          "aria-label",
          theme === "light" ? "Switch to dark theme" : "Switch to light theme"
        );
      }
      if (meta) meta.setAttribute("content", palette[theme] || palette.dark);
    };

    apply(root.getAttribute("data-theme") || "dark");

    if (toggle) {
      toggle.addEventListener("click", () => {
        const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
        apply(next);
        try {
          localStorage.setItem("oj-theme", next);
        } catch (error) { /* storage unavailable — theme still applies for this visit */ }
      });
    }

    // Follow the system preference until the visitor picks a theme explicitly.
    const systemQuery = window.matchMedia("(prefers-color-scheme: light)");
    systemQuery.addEventListener("change", (event) => {
      let stored = null;
      try {
        stored = localStorage.getItem("oj-theme");
      } catch (error) { /* ignore */ }
      if (!stored) apply(event.matches ? "light" : "dark");
    });
  })();

  /* ========================================================================
     3. Mobile navigation
     ======================================================================== */
  (() => {
    const navToggle = $(".nav-toggle");
    const navLinks = $("#nav-links");
    if (!navToggle || !navLinks) return;

    const closeNavigation = () => {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation");
      navLinks.classList.remove("is-open");
    };

    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      navLinks.classList.toggle("is-open", !isOpen);
    });

    $$("#nav-links a").forEach((link) => {
      link.addEventListener("click", closeNavigation);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNavigation();
    });

    document.addEventListener("click", (event) => {
      if (!navLinks.classList.contains("is-open")) return;
      if (navLinks.contains(event.target) || navToggle.contains(event.target)) return;
      closeNavigation();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) closeNavigation();
    });
  })();

  /* ========================================================================
     4. Scroll progress + back to top
     ======================================================================== */
  (() => {
    const bar = $("#scroll-progress-bar");
    const toTop = $("#back-to-top");
    let ticking = false;

    const update = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? Math.min(scrollTop / height, 1) : 0;

      if (bar) bar.style.width = (progress * 100).toFixed(2) + "%";
      if (toTop) toTop.classList.toggle("is-visible", scrollTop > 620);

      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
      },
      { passive: true }
    );

    update();

    if (toTop) {
      toTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
      });
    }
  })();

  /* ========================================================================
     5. Scroll spy — highlight the section you are reading
     ======================================================================== */
  (() => {
    const links = $$("#nav-links a");
    if (!links.length) return;

    const sections = links
      .map((link) => {
        const id = link.getAttribute("href");
        if (!id || !id.startsWith("#")) return null;
        const section = document.querySelector(id);
        return section ? { link, section } : null;
      })
      .filter(Boolean);

    if (!sections.length) return;

    const setActive = (activeLink) => {
      sections.forEach(({ link }) => {
        const isActive = link === activeLink;
        link.classList.toggle("is-active", isActive);
        if (isActive) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    };

    let ticking = false;

    const update = () => {
      ticking = false;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const marker = scrollTop + window.innerHeight * 0.32;

      if (scrollTop < 80) {
        setActive(null);
        return;
      }

      let current = null;
      sections.forEach((item) => {
        const top = item.section.getBoundingClientRect().top + scrollTop;
        if (top <= marker) current = item;
      });

      // Near the bottom of the page the last section should stay highlighted.
      const atBottom =
        window.innerHeight + scrollTop >= document.documentElement.scrollHeight - 4;
      if (atBottom) current = sections[sections.length - 1];

      setActive(current ? current.link : null);
    };

    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
      },
      { passive: true }
    );

    window.addEventListener("resize", update, { passive: true });
    update();
  })();

  /* ========================================================================
     6. Scroll reveal
     ======================================================================== */
  (() => {
    const revealItems = $$(".reveal");
    if (!revealItems.length) return;

    if (!("IntersectionObserver" in window) || prefersReducedMotion.matches) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          activeObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealItems.forEach((item) => observer.observe(item));
  })();

  /* ========================================================================
     7. Hero particle network
     ======================================================================== */
  (() => {
    const canvas = $("#hero-particles");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const hero = canvas.closest(".hero");
    if (!hero) return;

    if (prefersReducedMotion.matches) return;

    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const random = (min, max) => Math.random() * (max - min) + min;

    let width = 0;
    let height = 0;
    let particles = [];
    let animationId = 0;
    let running = false;

    const pointer = { x: -1000, y: -1000, active: false };

    function resizeCanvas() {
      const rect = hero.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = coarsePointer.matches ? 22 : 42;
      particles = Array.from({ length: count }, () => ({
        x: random(0, width),
        y: random(0, height),
        vx: random(-0.18, 0.18),
        vy: random(-0.18, 0.18),
        radius: random(1, 2.2)
      }));
    }

    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance > 0 && distance < 100) {
            const force = (100 - distance) / 1000;
            p.x += (dx / distance) * force;
            p.y += (dy / distance) * force;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(103, 232, 210, 0.75)";
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance < 115) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = "rgba(168, 165, 255, " + ((1 - distance / 115) * 0.28).toFixed(3) + ")";
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationId = window.requestAnimationFrame(draw);
    }

    function start() {
      if (running || document.hidden || prefersReducedMotion.matches) return;
      running = true;
      animationId = window.requestAnimationFrame(draw);
    }

    function stop() {
      running = false;
      window.cancelAnimationFrame(animationId);
    }

    canvas.addEventListener("pointermove", (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    });

    canvas.addEventListener("pointerleave", () => {
      pointer.active = false;
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });

    prefersReducedMotion.addEventListener("change", () => {
      if (prefersReducedMotion.matches) {
        stop();
        ctx.clearRect(0, 0, width, height);
      } else {
        resizeCanvas();
        start();
      }
    });

    if ("ResizeObserver" in window) {
      new ResizeObserver(resizeCanvas).observe(hero);
    } else {
      window.addEventListener("resize", resizeCanvas);
    }

    resizeCanvas();
    start();
  })();

  /* ========================================================================
     8. Hero console — typing code snippet
     ======================================================================== */
  (() => {
    const codeEl = $("#console-code");
    if (!codeEl) return;

    const SNIPPET = [
      'const ojas = {',
      '  role: "AI & ML student",',
      '  stack: ["Python", "Flask", "PostgreSQL"],',
      '  currently: "building useful things",',
      '  status: "open to opportunities"',
      '};',
      '',
      'ojas.build(); // ship · test · improve'
    ].join("\n");

    const KEYWORDS = new Set([
      "const", "let", "var", "function", "return", "if", "else", "for", "while",
      "new", "class", "async", "await", "import", "export", "from", "true",
      "false", "null", "undefined"
    ]);

    const TOKEN_RE = /\/\/[^\n]*|"[^"\n]*"|'[^'\n]*'|`[^`\n]*`|\b\d+(?:\.\d+)?\b|\b(?:const|let|var|function|return|if|else|for|while|new|class|async|await|import|export|from|true|false|null|undefined)\b|[A-Za-z_$][\w$]*(?=\s*:)|[A-Za-z_$][\w$]*(?=\()/g;

    // Highlight the raw source, then escape the text that is not a token.
    const renderCode = (code) => {
      let out = "";
      let lastIndex = 0;

      code.replace(TOKEN_RE, (match, offset) => {
        out += escapeHtml(code.slice(lastIndex, offset));

        let cls = "tok-prop";
        if (match.startsWith("//")) cls = "tok-com";
        else if (/^["'`]/.test(match)) cls = "tok-str";
        else if (/^\d/.test(match)) cls = "tok-num";
        else if (KEYWORDS.has(match)) cls = "tok-kw";
        else if (code.slice(offset + match.length).match(/^\s*\(/)) cls = "tok-fn";

        out += '<span class="' + cls + '">' + escapeHtml(match) + "</span>";
        lastIndex = offset + match.length;
        return match;
      });

      out += escapeHtml(code.slice(lastIndex));
      return out;
    };

    const paint = (typed) => {
      codeEl.innerHTML =
        renderCode(typed) + '<span class="console-caret" aria-hidden="true"></span>';
    };

    if (prefersReducedMotion.matches) {
      paint(SNIPPET);
      return;
    }

    let paused = false;

    const loop = async () => {
      for (;;) {
        for (let i = 0; i <= SNIPPET.length; i++) {
          if (paused || document.hidden) {
            await sleep(200);
            i--;
            continue;
          }
          paint(SNIPPET.slice(0, i));
          await sleep(16);
        }
        await sleep(2800);

        // Fade out and start the snippet again.
        codeEl.style.transition = "opacity .3s ease";
        codeEl.style.opacity = "0";
        await sleep(320);
        codeEl.style.opacity = "1";
      }
    };

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        (entries) => {
          paused = !entries[0].isIntersecting;
        },
        { threshold: 0.05 }
      ).observe(codeEl);
    }

    document.addEventListener("visibilitychange", () => {
      paused = document.hidden;
    });

    paint("");
    loop();
  })();

  /* ========================================================================
     9. Rotating word in the hero headline
     ======================================================================== */
  (() => {
    const rotator = $("#rotator");
    if (!rotator) return;

    const WORDS = ["code", "systems", "interfaces", "products"];
    let index = 0;

    if (prefersReducedMotion.matches) {
      rotator.textContent = WORDS[0];
      return;
    }

    setInterval(() => {
      rotator.classList.add("is-swapping");
      setTimeout(() => {
        index = (index + 1) % WORDS.length;
        rotator.textContent = WORDS[index];
        rotator.classList.remove("is-swapping");
      }, 300);
    }, 2600);
  })();

  /* ========================================================================
     10. Animated stat counters
     ======================================================================== */
  (() => {
    const counters = $$("[data-count]");
    if (!counters.length) return;

    const run = (element) => {
      const target = parseInt(element.getAttribute("data-count"), 10);
      const pad = parseInt(element.getAttribute("data-pad") || "0", 10);
      if (Number.isNaN(target)) return;

      if (prefersReducedMotion.matches) {
        element.textContent = String(target).padStart(pad, "0");
        return;
      }

      const duration = 1100;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = String(Math.round(target * eased)).padStart(pad, "0");
        if (progress < 1) window.requestAnimationFrame(step);
      };

      window.requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) {
      counters.forEach(run);
      return;
    }

    const observer = new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          run(entry.target);
          activeObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => observer.observe(counter));
  })();

  /* ========================================================================
     11. Project filtering
     ======================================================================== */
  (() => {
    const buttons = $$(".filter-btn");
    const cards = $$("#project-grid .project-card[data-category]");
    if (!buttons.length || !cards.length) return;

    const applyFilter = (filter) => {
      cards.forEach((card) => {
        const category = card.getAttribute("data-category");
        // Cards tagged "all" (such as the "more on GitHub" card) stay visible.
        const match = filter === "all" || category === "all" || category === filter;
        card.classList.toggle("is-hidden", !match);
      });
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((other) => {
          const active = other === button;
          other.classList.toggle("is-active", active);
          other.setAttribute("aria-pressed", String(active));
        });
        applyFilter(button.getAttribute("data-filter"));
      });
    });
  })();

  /* ========================================================================
     12. Toast helper + copy email address
     ======================================================================== */
  (() => {
    const toast = $("#toast");
    let toastTimer = 0;

    const showToast = (message) => {
      if (!toast) return;
      toast.textContent = message;
      toast.classList.add("is-visible");
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => {
        toast.classList.remove("is-visible");
      }, 2400);
    };

    const copyText = (text) => {
      if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
      }
      // Fallback for browsers that block the clipboard API on insecure origins.
      return new Promise((resolve, reject) => {
        const helper = document.createElement("textarea");
        helper.value = text;
        helper.setAttribute("readonly", "");
        helper.style.position = "fixed";
        helper.style.opacity = "0";
        document.body.appendChild(helper);
        helper.select();
        const copied = document.execCommand("copy");
        document.body.removeChild(helper);
        copied ? resolve() : reject(new Error("Copy failed"));
      });
    };

    const copyButton = $("#copy-email");
    if (copyButton) {
      copyButton.addEventListener("click", () => {
        const address = copyButton.getAttribute("data-copy") || "";
        const label = $("#copy-email-label");
        copyText(address)
          .then(() => {
            showToast("Email address copied — " + address);
            if (label) {
              const original = label.textContent;
              label.textContent = "Copied";
              window.setTimeout(() => {
                label.textContent = original;
              }, 1800);
            }
          })
          .catch(() => {
            showToast("Copy failed — the address is " + address);
          });
      });
    }
  })();

  /* ========================================================================
     13. Contact form — composes an email in the visitor's mail app
     ======================================================================== */
  (() => {
    const form = $("#contact-form");
    if (!form) return;

    const note = $("#form-note");
    const defaultNote = note ? note.textContent : "";

    const setNote = (message, state) => {
      if (!note) return;
      note.textContent = message;
      note.classList.remove("is-error", "is-success");
      if (state) note.classList.add(state);
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = $("#cf-name").value.trim();
      const email = $("#cf-email").value.trim();
      const subject = $("#cf-subject").value;
      const message = $("#cf-message").value.trim();

      const invalid = [];
      if (!name) invalid.push("#cf-name");
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) invalid.push("#cf-email");
      if (!message) invalid.push("#cf-message");

      invalid.forEach((selector) => {
        const field = $(selector);
        if (field) field.setAttribute("aria-invalid", "true");
      });

      if (invalid.length) {
        setNote("Please fill in your name, a valid email address and a message.", "is-error");
        const first = $(invalid[0]);
        if (first) first.focus();
        return;
      }

      const body =
        "Hi Ojas,\n\n" +
        message +
        "\n\n— " +
        name +
        "\n" +
        email;

      const mailto =
        "mailto:ojas20070210@gmail.com" +
        "?subject=" +
        encodeURIComponent(subject + " — from " + name) +
        "&body=" +
        encodeURIComponent(body);

      setNote("Opening your email app with the message ready to send…", "is-success");
      window.location.href = mailto;

      window.setTimeout(() => setNote(defaultNote), 6000);
    });

    $$("input, textarea", form).forEach((field) => {
      field.addEventListener("input", () => {
        field.removeAttribute("aria-invalid");
        if (note) setNote(defaultNote);
      });
    });
  })();

  /* ========================================================================
     14. Interactive project cards — pointer glow + subtle tilt
     ======================================================================== */
  (() => {
    const cards = $$(".project-card");
    if (!cards.length) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!finePointer.matches || prefersReducedMotion.matches) return;

    cards.forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = ((x - centerX) / centerX) * 3;
        const rotateX = ((centerY - y) / centerY) * 3;

        card.style.setProperty("--pointer-x", x + "px");
        card.style.setProperty("--pointer-y", y + "px");
        card.style.transform =
          "perspective(900px) rotateX(" + rotateX.toFixed(2) + "deg) rotateY(" + rotateY.toFixed(2) + "deg)";
      });

      card.addEventListener("pointerleave", () => {
        card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
        card.style.setProperty("--pointer-x", "50%");
        card.style.setProperty("--pointer-y", "50%");
      });
    });
  })();
})();
