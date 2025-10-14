const authorLinks = document.querySelectorAll('.center-names span');
authorLinks.forEach(link => {
  link.addEventListener('click', () => {
    const id = link.getAttribute('data-id');
    document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});