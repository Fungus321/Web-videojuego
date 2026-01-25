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

  
// Validación formulario beta (jQuery)
$(function () {
  const $form = $("#betaForm");
  const $email = $("#betaEmail");
  const $ok = $("#betaOk");
  const $msg = $("#betaMsg");

  if (!$form.length) return;

  function setMsg(text, type){
    $msg.text(text);

    // estilos rápidos sin complicar el CSS
    if(type === "ok"){
      $msg.css("color", "var(--gold2)");
    }else if(type === "error"){
      $msg.css("color", "var(--red2)");
    }else{
      $msg.css("color", "var(--muted)");
    }
  }

  function isValidEmail(v){
    // validación sencilla (suficiente para un form de demo)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  $form.on("submit", function (e) {
    e.preventDefault();

    const emailVal = $email.val().trim();
    const okVal = $ok.is(":checked");

    // Limpia mensaje anterior
    setMsg("", "neutral");

    if (!emailVal){
      setMsg("Escribe un email para apuntarte.", "error");
      $email.focus();
      return;
    }

    if (!isValidEmail(emailVal)){
      setMsg("Ese email no parece válido. Revisa el formato.", "error");
      $email.focus();
      return;
    }

    if (!okVal){
      setMsg("Debes aceptar recibir emails sobre la beta.", "error");
      return;
    }

    // Demo: éxito
    setMsg("¡Listo! Te avisaremos cuando la beta esté disponible.", "ok");

    // Opcional: limpia el formulario
    $form[0].reset();
  });

  // Feedback suave mientras escribe
  $email.on("input", function(){
    if(!$email.val().trim()){
      setMsg("", "neutral");
      return;
    }
    if(isValidEmail($email.val())){
      setMsg("Email correcto.", "ok");
    }else{
      setMsg("Formato de email pendiente…", "neutral");
    }
  });
});

});
