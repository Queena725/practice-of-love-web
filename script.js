(() => {
  const canvas = document.getElementById("rings");
  const dotsContainer = document.getElementById("dots");
  const overlay = document.getElementById("overlayImage");

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

  const hoverText = document.createElement("div");
  hoverText.id = "hoverText";
  document.body.appendChild(hoverText);

  const ctx = canvas.getContext("2d");
  const COUNT = 22;

  // 🩶 기존 코드 대신 이 부분만 교체
  const IMAGE_CANDIDATES = [
    "images/card.jpg","images/card3.jpg",
    "images/card5.jpg","images/card7.jpg","images/card8.jpg",
    "images/card9.jpg","images/card10.jpg","images/card11.jpg","images/card12.jpg",
    "images/card13.jpg","images/card14.jpg","images/card15.jpg","images/card17.jpg","images/card18.jpg",
    "images/card19.jpg","images/card21.jpg","images/card23.jpg",
    "images/card25.jpg","images/card26.jpg","images/card29.jpg"
  ];

  let imagePool = [];

  function preloadImages(paths) {
    return Promise.all(paths.map(src => {
      return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve({ ok: true, src });
        img.onerror = () => resolve({ ok: false, src });
        img.src = src;
      });
    })).then(results => {
      const bad = results.filter(r => !r.ok).map(r => r.src);
      if (bad.length) console.warn("❗️로드 실패한 이미지:", bad);
      return results.filter(r => r.ok).map(r => r.src);
    });
  }

  preloadImages(IMAGE_CANDIDATES).then(good => {
    imagePool = good;
    initDots(); // 이미지 준비되면 점 생성 시작
  });

  // ✳️ 나머지 코드는 initDots()로 묶어줌
  function initDots() {
    const dots = [];

    function outerR(){ return Math.min(window.innerWidth, window.innerHeight)*0.30; }

    function size(){
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      positionDots();
      drawRings();
    }

    function drawRings(){
      const cx = canvas.width/2, cy = canvas.height/2;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(0,0,0,0.18)";
      const centerRadius = 40, maxR = outerR()-15;
      for(let r=centerRadius+15; r<maxR; r+=8){
        ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.stroke();
      }
    }

    function positionDots(){
      const half = (parseFloat(getComputedStyle(document.documentElement)
                    .getPropertyValue("--dot-size"))/2) || 6;
      const R = outerR();
      dots.forEach((dot,i)=>{
        const a = (i/COUNT)*Math.PI*2, x = R*Math.cos(a), y = R*Math.sin(a);
        dot.style.left = `calc(50% + ${x}px - ${half}px)`;
        dot.style.top  = `calc(50% + ${y}px - ${half}px)`;
      });
    }

    // create dots once
    for(let i=0;i<COUNT;i++){
      const dot = document.createElement("div");
      dot.className = "dot";
      dot.addEventListener("mouseenter", ()=>{
        const pool = imagePool.length ? imagePool : IMAGE_CANDIDATES;
        const idx = i % pool.length;
        overlay.src = pool[idx];
        overlay.classList.add("visible");
        hoverText.textContent = texts[i % texts.length] || "";
        hoverText.classList.add("visible");
        dots.forEach(d=>{ if(d!==dot) d.classList.add("dimmed"); });
        canvas.classList.add("dimmed");
      });
      dot.addEventListener("mouseleave", ()=>{
        overlay.classList.remove("visible");
        hoverText.classList.remove("visible");
        dots.forEach(d=>d.classList.remove("dimmed"));
        canvas.classList.remove("dimmed");
      });
      dotsContainer.appendChild(dot);
      dots.push(dot);
    }

    window.addEventListener("resize", size);
    size();
  }

  // ===== Practice / of / Love 회전 =====
  const titleGroup = document.getElementById("titleGroup");
  let rotation = 0;
  titleGroup.querySelectorAll(".word").forEach(w=>{
    w.addEventListener("click", ()=>{
      rotation = (rotation + 90) % 360;
      titleGroup.style.transform = `rotate(${rotation}deg)`;
    });
  });


  // ===== 💓 Heartbeat sound (click 시 2초 재생) =====
  const heartbeat = document.getElementById("heartbeat");
  const dots = document.querySelectorAll(".dot");

  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      heartbeat.currentTime = 0;
      heartbeat.volume = 0.4;

      heartbeat.play().then(() => {
        // 2초 후 자동 정지
        setTimeout(() => {
          heartbeat.pause();
          heartbeat.currentTime = 0;
        }, 2000);
      }).catch(err => {
        console.log("오디오 재생 실패:", err);
      });
    });
  });
  
})(); 
