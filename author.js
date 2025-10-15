const authorLinks = document.querySelectorAll('.center-names span');
const authorSections = document.querySelectorAll('.author-section');
let shown = false; // 한 번만 실행되게

authorLinks.forEach(link => {
  link.addEventListener('click', () => {
    const id = link.getAttribute('data-id');
    const section = document.getElementById(id);
    const offset = 120;

    //  처음 클릭 시 모든 섹션 보이게 만들기
    if (!shown) {
      authorSections.forEach(s => s.classList.add('active'));
      shown = true;
    }

    // 클릭한 작가 섹션으로 스크롤 이동
    const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: sectionTop, behavior: 'smooth' });
  });
});

const readLinks = document.querySelectorAll(".read-link");

readLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const pageIndex = parseInt(link.getAttribute("data-page"), 10);

    // Hide all spreads first
    spreads.forEach(spread => spread.classList.remove("active"));

    // Show selected spread
    currentIndex = pageIndex;
    spreads[currentIndex].classList.add("active");

    // Show modal
    pdfModal.style.display = "flex";
    document.body.style.overflow = "hidden";
    if (infoButton) infoButton.style.display = "none";
  });
});