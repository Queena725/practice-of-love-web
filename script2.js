window.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");
  const imgs = gallery.querySelectorAll("img");

  // 💡 기본 세팅
  gallery.style.position = "relative";
  gallery.style.overflowY = "auto";
  gallery.style.height = "100vh";
  gallery.style.display = "block";
  gallery.style.paddingBottom = "200px";

  // 🌼 모달 (확대용)
  const modal = document.createElement("div");
  modal.id = "imageModal";
  modal.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    z-index: 3000;
  `;
  const modalImg = document.createElement("img");
  modalImg.style.cssText = `
    max-width: 80vw;
    max-height: 80vh;
    border: none;
    transition: transform 0.3s ease;
  `;
  modal.appendChild(modalImg);
  document.body.appendChild(modal);

  modal.addEventListener("click", () => {
    modal.style.opacity = "0";
    modal.style.pointerEvents = "none";
  });

  // 🔹 위치 텍스트 데이터
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

  // 🔹 hoverText 생성 및 스타일
  const hoverText = document.createElement("div");
  hoverText.id = "hoverText";
  hoverText.style.position = "fixed";
  hoverText.style.left = "40px";
  hoverText.style.bottom = "30px";
  hoverText.style.fontFamily = '"adobe-garamond-pro", serif';
  hoverText.style.fontSize = "16px";
  hoverText.style.color = "#000";
  hoverText.style.opacity = "0";
  hoverText.style.transition = "opacity 0.3s ease";
  hoverText.style.pointerEvents = "none";
  document.body.appendChild(hoverText);

  // 🌿 카드 세팅
  imgs.forEach((img, i) => {
    img.classList.add("floating");
    img.style.position = "absolute";
    img.style.cursor = "grab";

    // 랜덤 위치
    const x = Math.random() * 80 + 10; // 가로는 중앙 근처 유지
    const y = Math.random() * 400 + 200; // 세로는 중앙 아래쪽
    img.style.left = `${x}%`;
    img.style.top = `${y}px`;
    img.style.transform = "translate(-50%, -50%)";
    img.style.transition = "transform 0.25s ease, opacity 0.3s ease";

    // 랜덤 크기
    const size = Math.random() * 120 + 100;
    img.style.width = `${size}px`;

    // ✅ hover 시
    img.addEventListener("mouseenter", () => {
      // 뒷면으로 전환
      const alt = img.getAttribute("data-alt");
      if (alt) {
        const current = img.src;
        img.src = alt;
        img.setAttribute("data-alt", current);
      }

      // 위치 텍스트 표시
      hoverText.textContent = texts[i] || "";
      hoverText.style.opacity = "1";
      img.style.transform = "translate(-50%, -50%) scale(1.08)";
      img.style.zIndex = 2000;
    });

    // ✅ hover 끝나면
    img.addEventListener("mouseleave", () => {
      // 다시 앞면으로
      const alt = img.getAttribute("data-alt");
      if (alt) {
        const current = img.src;
        img.src = alt;
        img.setAttribute("data-alt", current);
      }

      hoverText.style.opacity = "0";
      img.style.transform = "translate(-50%, -50%) scale(1)";
      img.style.zIndex = 1;
    });

    // ✅ click 시 앞뒤 전환
    img.addEventListener("click", () => {
      const alt = img.getAttribute("data-alt");
      if (!alt) return;
      const current = img.src;
      img.src = alt;
      img.setAttribute("data-alt", current);
    });

    // ✅ double-click 확대 보기
    img.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      modalImg.src = img.src;
      modal.style.opacity = "1";
      modal.style.pointerEvents = "auto";
    });

    // 🌿 부드러운 드래그
    let isDragging = false;
    let startX, startY, offsetX, offsetY;

    const startDrag = (e) => {
      e.preventDefault();
      isDragging = true;
      img.style.cursor = "grabbing";
      img.style.transition = "none";
      const rect = img.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      offsetX = startX - rect.left;
      offsetY = startY - rect.top;
      img.style.zIndex = 3000;
    };

    const duringDrag = (e) => {
      if (!isDragging) return;
      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;
      img.style.left = `${newX}px`;
      img.style.top = `${newY}px`;
    };

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      img.style.cursor = "grab";
      img.style.transition = "transform 0.25s ease, opacity 0.3s ease";
    };

    img.addEventListener("mousedown", startDrag);
    window.addEventListener("mousemove", duringDrag);
    window.addEventListener("mouseup", endDrag);

    // 🌬️ 기본 부유 모션
    function floatAround() {
      if (isDragging) return;
      const dx = (Math.random() - 0.5) * 10;
      const dy = (Math.random() - 0.5) * 10;
      img.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
      setTimeout(floatAround, Math.random() * 4000 + 2000);
    }
    floatAround();
  });
});