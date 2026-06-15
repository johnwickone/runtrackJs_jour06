// Job 02 - interactions Bootstrap / JavaScript / jQuery
$(function () {
  const bladeRunnerQuotes = [
    "Tous ces moments se perdront dans l'oubli, comme les larmes dans la pluie.",
    "J'ai vu tant de choses que vous, humains, ne pourriez pas croire.",
    "Plus humain que l'humain, c'est notre devise.",
    "La lumière qui brille deux fois plus fort brûle deux fois moins longtemps."
  ];

  const pageTexts = [
    "Bienvenue sur la page Bootstrap du jour 6.",
    "Bootstrap permet de créer rapidement des interfaces responsives.",
    "JavaScript rend la page interactive.",
    "La pagination peut changer le contenu sans recharger la page."
  ];

  const colors = ["primary", "secondary", "success", "danger", "warning", "info", "dark"];
  let progress = 50;
  let secretKeys = [];

  $(".nav-link").first().attr("href", "https://laplateforme.io/").attr("target", "_blank");

  // Modale d'achat du papillon.
  const buyModal = new bootstrap.Modal(document.getElementById("buyModal"));
  $("#butterflyBtn").on("click", function (event) {
    event.preventDefault();
    buyModal.show();
  });

  // Citation aléatoire Blade Runner dans le jumbotron.
  $("#rebootBtn").on("click", function () {
    const quote = bladeRunnerQuotes[Math.floor(Math.random() * bladeRunnerQuotes.length)];
    $("#jumbotronText").text(quote);
  });

  // Pagination : modification du contenu du jumbotron.
  $(".page-link").on("click", function (event) {
    event.preventDefault();
    const index = Number($(this).data("page")) - 1;
    if (pageTexts[index]) {
      $("#jumbotronText").text(pageTexts[index]);
    }
  });

  // Liste active à droite.
  $(".list-group-item").on("click", function (event) {
    event.preventDefault();
    $(".list-group-item").removeClass("active");
    $(this).addClass("active");
  });

  // Progress bar.
  function updateProgress() {
    $("#progressBar").css("width", progress + "%").text(progress + "%");
  }
  $("#progressMinus").on("click", function () {
    progress = Math.max(0, progress - 10);
    updateProgress();
  });
  $("#progressPlus").on("click", function () {
    progress = Math.min(100, progress + 10);
    updateProgress();
  });

  // Séquence D G C : modale récapitulative du formulaire gauche.
  const recapModal = new bootstrap.Modal(document.getElementById("recapModal"));
  $(document).on("keydown", function (event) {
    secretKeys.push(event.key.toUpperCase());
    secretKeys = secretKeys.slice(-3);
    if (secretKeys.join("") === "DGC") {
      const recap = `Login : ${$("#login").val()}\nMot de passe : ${$("#passwordLeft").val()}\nDogeCoin : ${$("#dogecoin").val()}\nURL : ${$("#url").val()}`;
      $("#recapBody").text(recap);
      recapModal.show();
    }
  });

  // Formulaire de droite : couleur aléatoire du spinner si champs non vides.
  $("#rightForm").on("submit", function (event) {
    event.preventDefault();
    const email = $("#email").val().trim();
    const password = $("#passwordRight").val().trim();
    if (email !== "" && password !== "") {
      const color = colors[Math.floor(Math.random() * colors.length)];
      $("#mainSpinner").removeClass(function (i, classes) {
        return (classes.match(/text-\S+/g) || []).join(" ");
      }).addClass("text-" + color);
    }
  });
});
