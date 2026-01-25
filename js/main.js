// Landing slideshow (Iron Veil: Dominion)
document.addEventListener("DOMContentLoaded", () => {
  const img = document.getElementById("slideImage");
  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");

  // Si no existe el bloque no falla
  if (!img || !prevBtn || !nextBtn) return;

  const slides = [
    "assets/img/slide001.png",
    "assets/img/slide002.png",
    "assets/img/slide003.png",
  ];

  let index = 0;

  function showSlide(i) {
    index = (i + slides.length) % slides.length;

    // pequeño “fade”
    img.style.opacity = "0";
    setTimeout(() => {
      img.src = slides[index];
      img.style.opacity = "1";
    }, 120);
  }

  prevBtn.addEventListener("click", () => showSlide(index - 1));
  nextBtn.addEventListener("click", () => showSlide(index + 1));

  // Autoplay opcional 
  let timer = setInterval(() => showSlide(index + 1), 4500);

  // Si el usuario interactúa, reiniciamos el autoplay
  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => showSlide(index + 1), 4500);
  }

  prevBtn.addEventListener("click", resetTimer);
  nextBtn.addEventListener("click", resetTimer);

  // Fade
  img.style.transition = "opacity 160ms ease";

 
  showSlide(0);
});
