(() => {
  const canvas = document.getElementById("rings");
  const ctx = canvas.getContext("2d");
  const dotsContainer = document.getElementById("dots");
  const overlay = document.getElementById("overlayImage");
  const heartbeat = document.getElementById("heartbeat");
  const titleGroup = document.getElementById("titleGroup");

  const COUNT = 22;
  let imagePool = [];

  const texts = [
    "78 5th Ave, New York, NY 10011",
    "11 West 53rd Street, New York, NY 10019",
    "Bungee Space Book Store",
    "465 W 23rd St, New York, NY 10011",
    "169 Thompson St Suite B, New York, NY 10012",
    "1260 6th Ave, New York, NY 10020",
    "65 W 70th St, New York, NY 10023",
    "44 Grand St, Brooklyn, NY 11249",
    "242 E 10th St, New York, NY 10003",
    "Printed Matter, Inc. MoMA PS1",
    "@ 7SoulsDeep, Union Square, NY"
  ];

  const notes = [
    "With my CD BFA friends\nAt Ariston, we bought a flower, but were gifted blooms—a quiet act of love.",
    "What Stands Behind the Flowers\n“Love is the greatest of all” -Hilma af Klint",
    "Bungee Space Book Store\nAt the bookstore, a t-shirt recalled my ex—yet stayed just a shirt, quietly sweet.",
    "Cafe Ambrosia\nA small heart peeked from the back pocket of her jeans.",
    "Random store in NY\nHi, Teddy? Hi, New York!",
    "Front of Leon Bagel\nTruck carrying love",
    "Lauv Concert_Radio City Music Hall\nThe first heartbreak ended beneath Lauv’s music.",
    "Sipping cocktails with a waterfall\nBy the waterfall, sipping cocktails with Jessica, our laughter spilled like the water itself.",
    "Geometry Garden & Floral Shop\nLooking for a gift meant for someone.",
    "Apollo Bagels\nEnjoying bagels with Serena in the Lower East Side.",
    "NYABF 2025 Printed Matter, Inc.\nVisiting the book fair with CD friends.",
    "@ 7SoulsDeep\nFound text in lower Manhattan — Still a kid with dreams."
  ];

  const IMAGE_CANDIDATES = [
    "images/card.jpg","images/card3.jpg","images/card5.jpg","images/card7.jpg",
    "images/card8.jpg","images/card9.jpg","images/card10.jpg","images/card11.jpg",
    "images/card12.jpg","images/card13.jpg","images/card14.jpg","images/card15.jpg",
    "images/card17.jpg","images/card18.jpg","images/card19.jpg","images/card21.jpg",
    "images/card23.jpg","images/card25.jpg","images/card26.jpg","images/card29.jpg"
  ];

  // ===== 이미지 미리 로드 =====
  function preloadImages(paths) {
    return Promise.all(paths.map(src => new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve({ ok: true, src });
      img.onerror = () => resolve({ ok: false, src });
      img.src = src;
    }))).then(results => results.filter(r => r.ok).map(r => r.src));
  }

  preloadImages(IMAGE_CANDIDATES).then(good => {
    imagePool = good.length ? good : IMAGE_CANDIDATES;
    initDots();
  });

  // ===== 점 생성 및 인터랙션 =====
  function initDots() {
    const dots = [];

    function outerR() {
      return Math.min(window.innerWidth, window.innerHeight) * 0.30;
    }

    function drawRings() {
      const cx = canvas.width / 2, cy = canvas.height / 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(0,0,0,0.18)";
      const centerRadius = 40, maxR = outerR() - 15;
      for (let r = centerRadius + 15; r < maxR; r += 8) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    function positionDots() {
      const half = 6;
      const R = outerR();
      dots.forEach((dot, i) => {
        const a = (i / COUNT) * Math.PI * 2;
        const x = R * Math.cos(a);
        const y = R * Math.sin(a);
        dot.style.left = `calc(50% + ${x}px - ${half}px)`;
        dot.style.top = `calc(50% + ${y}px - ${half}px)`;
      });
    }

    // 점 + 이벤트 생성
    for (let i = 0; i < COUNT; i++) {
      const dot = document.createElement("div");
      dot.className = "dot";

      dot.addEventListener("mouseenter", () => {
        const pool = imagePool.length ? imagePool : IMAGE_CANDIDATES;
        const idx = i % pool.length;

        overlay.src = pool[idx];
        overlay.classList.add("visible");

        showHoverText(texts[i % texts.length], notes[i % notes.length]);
        dots.forEach(d => { if (d !== dot) d.classList.add("dimmed"); });
        canvas.classList.add("dimmed");
      });

      dot.addEventListener("mouseleave", () => {
        overlay.classList.remove("visible");
        hideHoverText();
        dots.forEach(d => d.classList.remove("dimmed"));
        canvas.classList.remove("dimmed");
      });

      dot.addEventListener("click", () => {
        heartbeat.currentTime = 0;
        heartbeat.volume = 0.4;
        heartbeat.play().then(() => {
          setTimeout(() => {
            heartbeat.pause();
            heartbeat.currentTime = 0;
          }, 2000);
        });
      });

      dotsContainer.appendChild(dot);
      dots.push(dot);
    }

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawRings();
      positionDots();
    });

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawRings();
    positionDots();
  }

  // ===== Hover 텍스트 표시 함수 =====
  const hoverText = document.createElement("div");
  hoverText.id = "hoverText";
  document.body.appendChild(hoverText);

  const hoverNote = document.createElement("div");
  hoverNote.id = "hoverNote";
  document.body.appendChild(hoverNote);

  function showHoverText(text, note) {
    hoverText.textContent = text;
    hoverText.classList.add("visible");
    hoverNote.textContent = note;
    hoverNote.classList.add("visible");
  }

  function hideHoverText() {
    hoverText.classList.remove("visible");
    hoverNote.classList.remove("visible");
  }

  // ===== 제목 회전 =====

  let rotation = 0;
  titleGroup.querySelectorAll(".word").forEach(w => {
    w.addEventListener("click", () => {
      rotation = (rotation + 180) % 360;
      titleGroup.style.transform = `rotate(${rotation}deg)`;
    });
  });
})();
