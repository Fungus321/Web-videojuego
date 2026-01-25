/* Iron Veil: Dominion — Demo Menús (jQuery) */
$(function () {
  // Estado demo
  const state = {
    coins: 250,
    upgrades: { armor: 1, repair: 1, damage: 1, rate: 1 },
    weapon: { name: "Vigilante de Hierro", dmg: 1.1, rate: 1.0 },
    hud: { hp: true, xp: true, timer: true, coins: true }
  };

  // Helpers UI
  function setCoins(v){
    state.coins = Math.max(0, v);
    $("#coinsValue").text(state.coins);
    $("#hudCoinsValue").text(state.coins);
  }

  function showMsg($el, text){
    $el.text(text);
    clearTimeout($el.data("t"));
    const t = setTimeout(() => $el.text(""), 1800);
    $el.data("t", t);
  }

  function toRoman(n){
    //facil sencillo y para toda la familia (hasta 5 niveles visibles)
    const clamped = Math.max(1, Math.min(5, Math.round(n)));
    return "I".repeat(clamped);
  }

  function renderUpgrades(){
    $("#statArmor").text(state.upgrades.armor.toFixed(1) + "×");
    $("#statRepair").text(state.upgrades.repair.toFixed(1) + "×");
    $("#statDamage").text(state.upgrades.damage.toFixed(1) + "×");
    $("#statRate").text(state.upgrades.rate.toFixed(1) + "×");

    // Preview: muestra blindaje en romano
    $("#trainStatus").text("BLINDAJE " + toRoman(state.upgrades.armor));
  }

  function renderWeapon(){
    $("#weaponName").text(state.weapon.name);
    $("#weaponDmg").text(state.weapon.dmg.toFixed(2) + "×");
    $("#weaponRate").text(state.weapon.rate.toFixed(2) + "×");
    $("#weaponSigil").text("IV");
  }

  function renderHud(){
    $("#hud-hp").toggle(state.hud.hp);
    $("#hud-xp").toggle(state.hud.xp);
    $("#hud-timer").toggle(state.hud.timer);
    $("#hud-coins").toggle(state.hud.coins);
  }

  // Navegación pantallas
  $(".nav-item[data-screen]").on("click", function(){
    const key = $(this).data("screen");

    $(".nav-item").removeClass("is-active");
    $(this).addClass("is-active");

    $(".screen").removeClass("is-visible");
    $("#screen-" + key).addClass("is-visible");
  });

  // SETTINGS: sliders
  function bindSlider(id, outId){
    $("#" + id).on("input", function(){
      $("#" + outId).text($(this).val());
    });
  }
  bindSlider("volMaster", "volMasterValue");
  bindSlider("volMusic", "volMusicValue");
  bindSlider("volFx", "volFxValue");

  $("#applySettings").on("click", function(){
    showMsg($("#settingsMsg"), "Configuración aplicada.");
  });

  // UPGRADES: + / - con coste
  const COST = 20;

  $(".stepper .plus").on("click", function(){
    const key = $(this).closest(".stepper").data("up"); // damage, rate, armor, repair
    if(state.coins < COST){
      showMsg($("#upgradesMsg"), "No tienes suficientes monedas.");
      return;
    }
    setCoins(state.coins - COST);
    state.upgrades[key] += 1;
    $("#lvl-" + key).text(state.upgrades[key]);
    renderUpgrades();
    showMsg($("#upgradesMsg"), "Mejora adquirida (−" + COST + ").");
  });

  $(".stepper .minus").on("click", function(){
    const key = $(this).closest(".stepper").data("up");
    if(state.upgrades[key] <= 1){
      showMsg($("#upgradesMsg"), "Nivel mínimo.");
      return;
    }
    state.upgrades[key] -= 1;
    $("#lvl-" + key).text(state.upgrades[key]);
    renderUpgrades();
    showMsg($("#upgradesMsg"), "Nivel reducido.");
  });

  // LOADOUT: selección de arma
  $("#weaponChoices .choice").on("click", function(){
    $("#weaponChoices .choice").removeClass("is-selected");
    $(this).addClass("is-selected");

    state.weapon.name = $(this).data("weapon");
    state.weapon.dmg = parseFloat($(this).data("dmg"));
    state.weapon.rate = parseFloat($(this).data("rate"));
    renderWeapon();
  });

  // HUD: toggles
  $(".hudToggle").on("change", function(){
    const key = $(this).data("hud");
    state.hud[key] = $(this).is(":checked");
    renderHud();
  });

  // Reset demo
  $("#resetDemo").on("click", function(){
    setCoins(120);

    state.upgrades = { armor: 1, repair: 1, damage: 1, rate: 1 };
    $("#lvl-armor").text(1);
    $("#lvl-repair").text(1);
    $("#lvl-damage").text(1);
    $("#lvl-rate").text(1);

    state.weapon = { name: "Vigilante de Hierro", dmg: 1.1, rate: 1.0 };
    $("#weaponChoices .choice").removeClass("is-selected");
    $("#weaponChoices .choice").first().addClass("is-selected");

    state.hud = { hp: true, xp: true, timer: true, coins: true };
    $(".hudToggle").prop("checked", true);

    renderUpgrades();
    renderWeapon();
    renderHud();
    showMsg($("#upgradesMsg"), "Demo reiniciada.");
    showMsg($("#settingsMsg"), "");
  });

  // Render inicial
  setCoins(state.coins);
  renderUpgrades();
  renderWeapon();
  renderHud();
});

