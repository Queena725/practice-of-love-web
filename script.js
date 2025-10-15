(() => {
  const canvas = document.getElementById("rings");
  const ctx = canvas.getContext("2d");
  const dotsContainer = document.getElementById("dots");
  const overlay = document.getElementById("overlayImage");
  const centerEl = document.getElementById("center");
  const heartbeat = document.getElementById("heartbeat");

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

  const IMAGE_CANDIDATES = [
    "images/card.jpg","images/card3.jpg","images/card5.jpg","images/card7.jpg",
    "images/card8.jpg","images/card9.jpg","images/card10.jpg","images/card11.jpg",
    "images/card12.jpg","images/card13.jpg","images/card14.jpg","images/card15.jpg",
    "images/card17.jpg","images/card18.jpg","images/card19.jpg","images/card21.jpg",
    "images/card23.jpg","images/card25.jpg","images/card26.jpg","images/card29.jpg"
  ];

  let imagePool = [];
  const COUNT = 30;

  preloadImages(IMAGE_CANDIDATES).then(good => {
    imagePool = good.length ? good : IMAGE_CANDIDATES;
    startIntroAnimation();
  });

  function preloadImages(paths) {
    return Promise.all(paths.map(src => new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve({ ok: true, src });
      img.onerror = () => resolve({ ok: false, src });
      img.src = src;
    }))).then(results => results.filter(r => r.ok).map(r => r.src));
  }

  // =================  INTRO ANIMATION =================
  function startIntroAnimation() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const easeOut = t => 1 - Math.pow(1 - t, 3);
    const T_TOTAL = 800;

    // 초기 상태
    centerEl.style.opacity = 0;
    centerEl.style.transform = "translate(-50%, -50%) scale(0.66)";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dotsContainer.innerHTML = "";

    // ===== 점 생성 (처음엔 숨김) =====
    const outerR = Math.min(window.innerWidth, window.innerHeight) * 0.27;
    const dotR = outerR + 35;
    const dotSize = 10;
    const dots = [];

    for (let i = 0; i < COUNT; i++) {
      const angle = (i / COUNT) * Math.PI * 2;
      const x = dotR * Math.cos(angle);
      const y = dotR * Math.sin(angle);

      const dot = document.createElement("div");
      dot.className = "dot";
      dot.style.left = `calc(50% + ${x}px - ${dotSize / 2}px)`;
      dot.style.top = `calc(50% + ${y}px - ${dotSize / 2}px)`;
      dot.style.background = "#000";
      dot.style.opacity = "0"; // 처음엔 안 보이게
      dot.style.transition = "opacity 0.4s ease";
      dotsContainer.appendChild(dot);
      dots.push(dot);
    }

    // ================= 애니메이션 프레임 =================
    const start = performance.now();
    let didReveal = false; // 중복 방지

    function frame(now) {
      const t = Math.min((now - start) / T_TOTAL, 1);
      const k = easeOut(t);

      // 중앙 점
      centerEl.style.opacity = k;
      centerEl.style.transform = `translate(-50%, -50%) scale(${0.2 + 0.8 * k})`;

      // 링 (네 원래 버전)
      const cx = canvas.width / 2, cy = canvas.height / 2;
      const outerR = Math.min(window.innerWidth, window.innerHeight) * 0.27;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = `rgba(0,0,0,${0.18 * k})`;
      for (let r = 50; r < outerR; r += 5) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (t < 1) {
        requestAnimationFrame(frame);
      } else if (!didReveal) {
        didReveal = true;

        // 회색 → 검정 → 깜빡
        setTimeout(() => {
          dots.forEach(dot => (dot.style.opacity = "0.15")); // 회색
          setTimeout(() => {
            dots.forEach(dot => (dot.style.opacity = "1")); // 검정
            setTimeout(() => {
              dots.forEach(dot => (dot.style.opacity = "0")); // 깜빡 사라짐
              setTimeout(() => {
                dots.forEach(dot => (dot.style.opacity = "1")); // 다시 등장
              }, 150);
            }, 150);
          }, 300);
        }, 300);

        enableDotInteractions(dots);
      }
    }

    // ✅ 애니메이션 시작
    requestAnimationFrame(frame);
  }

  // ================= 🖱️ HOVER / CLICK 기능 =================
  function enableDotInteractions(dots) {
    const hoverText = document.createElement("div");
    hoverText.id = "hoverText";
    document.body.appendChild(hoverText);

    dots.forEach((dot, i) => {
      dot.addEventListener("mouseenter", () => {
        const pool = imagePool.length ? imagePool : IMAGE_CANDIDATES;
        const idx = i % pool.length;
        overlay.src = pool[idx];
        overlay.classList.add("visible");
        hoverText.textContent = texts[i % texts.length] || "";
        hoverText.classList.add("visible");
        document.body.classList.add("blur-active");
      });

      dot.addEventListener("mouseleave", () => {
        overlay.classList.remove("visible");
        hoverText.classList.remove("visible");
        document.body.classList.remove("blur-active");
      });
    });
  }

  // 🔄 회전
  const titleGroup = document.getElementById("titleGroup");
  if (titleGroup) {
    let rotation = 0;
    titleGroup.querySelectorAll(".word").forEach(w => {
      w.addEventListener("click", () => {
        rotation += 180;
        titleGroup.style.transition = "transform 1s ease";
        titleGroup.style.transform = `rotate(${rotation}deg)`;
      });
    });
  }
})();

// ================= 💓 HEARTBEAT SOUND =================

// 유저가 클릭하면 처음 한 번 재생 + 이후 10초마다 반복
window.addEventListener("click", initHeartbeatOnce);
window.addEventListener("touchstart", initHeartbeatOnce);

function initHeartbeatOnce() {
  const heartbeat = document.getElementById("heartbeat");
  if (!heartbeat) return;

  heartbeat.volume = 0.25; // 🔈 소리 크기 (0~1)
  playHeartbeat();

  // 10초마다 재생
  setInterval(playHeartbeat, 10000);

  // 클릭 이벤트 중복 방지
  window.removeEventListener("click", initHeartbeatOnce);
  window.removeEventListener("touchstart", initHeartbeatOnce);
}

function playHeartbeat() {
  const heartbeat = document.getElementById("heartbeat");
  if (!heartbeat) return;

  heartbeat.currentTime = 0;
  heartbeat.play().catch(err => console.warn("play blocked:", err));

  // 진동 (옵션)
  if (navigator.vibrate) navigator.vibrate(180);
}