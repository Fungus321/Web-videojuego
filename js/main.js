// Landing slideshow (Iron Veil: Dominion)
/*console.log("MAIN JS CARGADO");


window.addEventListener("load", () => {
  console.log("WINDOW LOAD");

  const scanBtn = document.getElementById("scanRoute");
  const routeSelect = document.getElementById("routeSelect");
  const resultBox = document.getElementById("routeResult");

  console.log(scanBtn, routeSelect, resultBox);
}); */

document.addEventListener("DOMContentLoaded", () => {
  const img = document.getElementById("slideImage");
  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");

  // Si no existe el bloque no falla
  if (!img || !prevBtn || !nextBtn) return;

  const slides =
    [
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

    function setMsg(text, type) {
      $msg.text(text);

      // estilos rápidos sin complicar el CSS
      if (type === "ok") {
        $msg.css("color", "var(--gold2)");
      }
      else if (type === "error") {
        $msg.css("color", "var(--red2)");
      }
      else {
        $msg.css("color", "var(--muted)");
      }
    }

    function isValidEmail(v) {
      // validación sencilla (suficiente para un form de demo)
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
    }

    $form.on("submit", function (e) {
      e.preventDefault();

      const emailVal = $email.val().trim();
      const okVal = $ok.is(":checked");

      // Limpia mensaje anterior
      setMsg("", "neutral");

      if (!emailVal) {
        setMsg("Escribe un email para apuntarte.", "error");
        $email.focus();
        return;
      }

      if (!isValidEmail(emailVal)) {
        setMsg("Ese email no parece válido. Revisa el formato.", "error");
        $email.focus();
        return;
      }

      if (!okVal) {
        setMsg("Debes aceptar recibir emails sobre la beta.", "error");
        return;
      }

      // Demo: éxito
      setMsg("¡Listo! Te avisaremos cuando la beta esté disponible.", "ok");

      // Opcional: limpia el formulario
      $form[0].reset();
    });

    // Feedback suave mientras escribe
    $email.on("input", function () {
      if (!$email.val().trim()) {
        setMsg("", "neutral");
        return;
      }
      if (isValidEmail($email.val())) {
        setMsg("Email correcto.", "ok");
      }
      else {
        setMsg("Formato de email pendiente…", "neutral");
      }
    });
  });

  // Escáner de rutas con Open-Meteo API
  document.addEventListener("DOMContentLoaded", () => {
    const scanBtn = document.getElementById("scanRoute");
    const routeSelect = document.getElementById("routeSelect");
    const resultBox = document.getElementById("routeResult");

    if (!scanBtn || !routeSelect || !resultBox) return;

    function getThreatLevel(temp, wind, rain) {
      let danger = 0;

      if (temp <= 5 || temp >= 30) danger++;
      if (wind >= 25) danger++;
      if (rain > 0) danger++;

      if (danger === 0) return "Ruta estable";
      if (danger === 1) return "Amenaza moderada";
      if (danger === 2) return "Ruta hostil";
      return "Dominio crítico";
    }

    function getWeatherLabel(code) {
      const labels =
      {
        0: "Cielo despejado",
        1: "Principalmente despejado",
        2: "Parcialmente nublado",
        3: "Cubierto",
        45: "Niebla",
        48: "Niebla helada",
        51: "Llovizna ligera",
        53: "Llovizna moderada",
        55: "Llovizna densa",
        61: "Lluvia ligera",
        63: "Lluvia moderada",
        65: "Lluvia intensa",
        71: "Nieve ligera",
        73: "Nieve moderada",
        75: "Nieve intensa",
        95: "Tormenta"
      };

      return labels[code] || "Condición desconocida";
    }

    async function scanRoute() {
      console.log("Botón escanear pulsado");
      const [lat, lon, city] = routeSelect.value.split(",");

      resultBox.innerHTML = "<p>Escaneando territorio...</p>";

      try {
        const url =
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
          `&current=temperature_2m,precipitation,weather_code,wind_speed_10m`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Error al conectar con la API");
        }

        const data = await response.json();
        const current = data.current;

        const temp = current.temperature_2m;
        const rain = current.precipitation;
        const wind = current.wind_speed_10m;
        const weather = getWeatherLabel(current.weather_code);
        const threat = getThreatLevel(temp, wind, rain);

        resultBox.innerHTML = `
      <h3>${city}</h3>

     <div class="row g-3 api-grid">
        <div class="col-12 col-md-3">
         <div class="api-card h-100">
            <strong>Temperatura</strong>
            <span>${temp} °C</span>
          </div>
       </div>

        <div class="col-12 col-md-3">
          <div class="api-card h-100">
           <strong>Viento</strong>
           <span>${wind} km/h</span>
          </div>
        </div>

       <div class="col-12 col-md-3">
          <div class="api-card h-100">
            <strong>Precipitación</strong>
           <span>${rain} mm</span>
         </div>
       </div>

        <div class="col-12 col-md-3">
         <div class="api-card h-100">
            <strong>Estado</strong>
            <span>${weather}</span>
          </div>
       </div>
      </div>

     <p class="api-warning">
        Evaluación del Tren: ${threat}
     </p>
    `;
      }

      catch (error) {
        resultBox.innerHTML = `
         <p>No se pudo completar el escaneo. Revisa la conexión o inténtalo más tarde.</p>
        `;
      }
    }
    console.log("Escáner cargado correctamente");
    scanBtn.addEventListener("click", scanRoute);
    console.log("BOTON FUNCIONA");
  });


  /* =========================
     API ROUTE SCANNER
  ========================= */

  window.addEventListener("load", () => {

    const scanBtn = document.getElementById("scanRoute");
    const routeSelect = document.getElementById("routeSelect");
    const resultBox = document.getElementById("routeResult");

    if (!scanBtn || !routeSelect || !resultBox) return;

    function getWeatherState(code) {

      const states =
      {
        0: "Cielo despejado",
        1: "Zona estable",
        2: "Nubes dispersas",
        3: "Territorio cubierto",
        45: "Niebla densa",
        51: "Llovizna ligera",
        61: "Lluvia ligera",
        63: "Lluvia intensa",
        71: "Nieve",
        95: "Tormenta hostil"
      };

      return states[code] || "Condición desconocida";
    }

    function getThreat(temp, wind, rain) {

      let danger = 0;

      if (temp <= 5 || temp >= 30) danger++;
      if (wind >= 25) danger++;
      if (rain > 0) danger++;

      if (danger === 0) return "Ruta estable";
      if (danger === 1) return "Amenaza moderada";
      if (danger === 2) return "Ruta hostil";

      return "Dominio crítico";
    }

    scanBtn.addEventListener("click", async () => {

      const [lat, lon, city] = routeSelect.value.split(",");

      resultBox.innerHTML = "<p>Escaneando territorio...</p>";

      try {

        const url =
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
          `&current=temperature_2m,precipitation,weather_code,wind_speed_10m`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Error API");
        }

        const data = await response.json();

        const current = data.current;

        const weatherState = getWeatherState(current.weather_code);

        const threatLevel = getThreat
          (
            current.temperature_2m,
            current.wind_speed_10m,
            current.precipitation
          );

        resultBox.innerHTML = `
          <h3>${city}</h3>

          <div class="api-grid">

            <div class="api-card">
              <strong>Temperatura</strong>
              <span>${current.temperature_2m} °C</span>
            </div>

            <div class="api-card">
              <strong>Viento</strong>
              <span>${current.wind_speed_10m} km/h</span>
            </div>

            <div class="api-card">
              <strong>Precipitación</strong>
              <span>${current.precipitation} mm</span>
            </div>

            <div class="api-card">
              <strong>Estado</strong>
              <span>${weatherState}</span>
            </div>

          </div>

          <p class="api-warning">
            Evaluación del Tren: ${threatLevel}
          </p>
        `;
        if (typeof gsap !== "undefined") {
          gsap.from("#routeResult .api-card", {
            opacity: 0,
            y: 16,
            duration: 0.45,
            stagger: 0.08,
            ease: "power2.out"
          });

          gsap.from("#routeResult .api-warning", {
            opacity: 0,
            y: 10,
            duration: 0.45,
            delay: 0.2,
            ease: "power2.out"
          });
        }
      }

      catch (error) {

        console.error(error);

        resultBox.innerHTML = `
          <p>
          No se pudo completar el escaneo.
         Revisa la conexión o inténtalo más tarde.
          </p>
        `;
      }
    })
  });


  //   GSAP ANIMATIONS

  window.addEventListener("load", () => {
    if (typeof gsap === "undefined") return;

    gsap.from(".hero h1", {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power2.out"
    });

    gsap.from(".hero .lead", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      delay: 0.2,
      ease: "power2.out"
    });

    gsap.from(".hero-actions .btn", {
      opacity: 0,
      y: 18,
      duration: 0.6,
      delay: 0.4,
      stagger: 0.12,
      ease: "power2.out"
    });

    gsap.from(".hero-media .media-box", {
      opacity: 0,
      scale: 0.96,
      duration: 0.9,
      delay: 0.3,
      ease: "power2.out"
    });

    gsap.from(".card", {
      opacity: 0,
      y: 28,
      duration: 0.7,
      stagger: 0.12,
      delay: 0.5,
      ease: "power2.out"
    });

    gsap.from("#route-scanner", {
      opacity: 0,
      y: 35,
      duration: 0.8,
      delay: 0.7,
      ease: "power2.out"
    });
  });
});


