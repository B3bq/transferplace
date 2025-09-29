document.addEventListener("DOMContentLoaded", () => {
  function sumColumn(className) {
    let total = 0;
    document.querySelectorAll("." + className).forEach(td => {
      const val = td.textContent.trim();
      if (val !== "-" && val !== "") {
        total += parseInt(val, 10);
      }
    });
    return total;
  }

  document.getElementById("lacznie_games").textContent = sumColumn("lacznie_games");
  document.getElementById("lacznie_goals").textContent = sumColumn("lacznie_goals");
  document.getElementById("lacznie_assist").textContent = sumColumn("lacznie_assist");
  document.getElementById("lacznie_min").textContent = sumColumn("lacznie_min");

  document.getElementById("senior_match").textContent = sumColumn("senior_match");
  document.getElementById("senior_goal").textContent = sumColumn("senior_goal");
  document.getElementById("senior_assist").textContent = sumColumn("senior_assist");
  document.getElementById("senior_own").textContent = sumColumn("senior_own");
  document.getElementById("senior_yellow").textContent = sumColumn("senior_yellow");
  document.getElementById("senior_red").textContent = sumColumn("senior_red");
  document.getElementById("senior_min").textContent = sumColumn("senior_min");

  document.getElementById("all_match").textContent = sumColumn("all_match");
  document.getElementById("all_goal").textContent = sumColumn("all_goal");
  document.getElementById("all_assist").textContent = sumColumn("all_assist");
  document.getElementById("all_own").textContent = sumColumn("all_own");
  document.getElementById("all_yellow").textContent = sumColumn("all_yellow");
  document.getElementById("all_red").textContent = sumColumn("all_red");
  document.getElementById("all_min").textContent = sumColumn("senior_min");

  document.getElementById("junior_match").textContent = sumColumn("junior_match");
  document.getElementById("junior_goal").textContent = sumColumn("junior_goal");
  document.getElementById("junior_assist").textContent = sumColumn("junior_assist");
  document.getElementById("junior_own").textContent = sumColumn("junior_own");

  const positions = Array.from(document.querySelectorAll(".position"));

  const visible = positions.map(e => ({e, val: parseInt(e.dataset.value, 10) || 0})).filter(x => x.val >= 50);

  visible.sort((a,b) => b.val - a.val);

  const maxSize = 70;
  const minSize = 25;
  const step = visible.length > 1 ? (maxSize - minSize) / (visible.length - 1) : 0;

  visible.forEach((item, index) => {
    const size = Math.round(maxSize -index * step);
    item.e.style.display = "block";
    item.e.style.width = size + "px";
    item.e.style.height = size + "px";
  })

  spots = Array.from(document.querySelectorAll(".position"));
  let main = null;
  let extras =[];

  if(spots.length > 0){
    const sorted = spots.sort((a,b) => b.dataset.value - a.dataset.value);
    main = sorted[0];

    extras = sorted.filter(e => e !== main && parseInt(e.dataset.value, 10) >= 50);
  }

  if(main){
    document.getElementById("position").textContent = `${main.dataset.position}`;
    document.getElementById("position_bio").textContent = `${main.dataset.position}`;
    document.getElementById("main_position").textContent = `${main.dataset.position}`;
    document.getElementById("alt_position").textContent = extras.map(e => `${e.dataset.position}`).join(", ");
  }

  function removeDiacritics(s) {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  const monthMap = {
    'sty':0,'styczen':0,'stycznia':0,
    'lut':1,'luty':1,'lutego':1,
    'mar':2,'marzec':2,'marca':2,
    'kwi':3,'kwiecien':3,'kwietnia':3,
    'maj':4,'maja':4,
    'cze':5,'czerwiec':5,'czerwca':5,
    'lip':6,'lipiec':6,'lipca':6,
    'sie':7,'sierpien':7,'sierpnia':7,
    'wrz':8,'wrzesien':8,'wrzesnia':8,
    'paz':9,'pazdziernik':9,'pazdziernika':9,
    'lis':10,'listopad':10,'listopada':10,
    'gru':11,'grudzien':11,'grudnia':11
  };

  function ensureString(x) {
    if (x == null) return '';
    if (typeof x === 'string') return x;
    if (x instanceof Element) return x.textContent || x.value || '';
    if (typeof x.textContent === 'string') return x.textContent;
    return String(x);
  }

  function parsePolishDate(str) {
    const s = ensureString(str).trim();
    if (!s) return null;

    const iso = s.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (iso) return new Date(parseInt(iso[1],10), parseInt(iso[2],10)-1, parseInt(iso[3],10));

    const m = s.match(/(\d{1,2})\s+([^\d\(\)\,\.]+)\.?\s+(\d{4})/);
    if (!m) return null;

    const day = parseInt(m[1], 10);
    let monthPart = m[2].toLowerCase().trim();
    monthPart = removeDiacritics(monthPart).replace(/\./g,'').trim();
    const year = parseInt(m[3], 10);

    const monthIndex = monthMap[monthPart] ?? monthMap[monthPart.slice(0,3)];
    if (monthIndex === undefined || isNaN(day) || isNaN(year)) return null;

    return new Date(year, monthIndex, day);
  }

  function calculateAgeFromString(str) {
    const bd = parsePolishDate(str);
    if (!bd || isNaN(bd)) return null;
    const today = new Date();
    let age = today.getFullYear() - bd.getFullYear();
    const m = today.getMonth() - bd.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) age--;
    return age;
  }

  const el = document.getElementById('birthDate');
  const el2 = document.getElementById('birthDate2');
  const raw = el ? el.textContent : '';
  const age = calculateAgeFromString(raw);

  if (age === null) {
    console.warn('Nie udało się sparsować daty urodzenia:', raw);
  } else {
    if (/\(.*\)/.test(raw)) {
      el.textContent = raw.replace(/\(.*\)/, `(${age})`);
      el2.textContent = raw.replace(/\(.*\)/, `(${age})`);
    } else {
      el.textContent = raw + ` (${age})`;
      el2.textContent = raw + ` (${age})`;
    }
  }
  

  // competition data
  document.getElementById("league_games").innerHTML = document.getElementById("l_games").textContent.trim();
  const l_goal = document.getElementById("l_goal").textContent.trim();
  if(l_goal !== '-') {  
    document.getElementById("league_goal").innerHTML = document.getElementById("l_goal").textContent.trim();
  }else{
    document.getElementById("league_goal").innerHTML = "0";
  }

  const l_assist = document.getElementById("l_assist").textContent.trim();
  if(l_assist !== '-') {  
    document.getElementById("league_assist").innerHTML = document.getElementById("l_assist").textContent.trim();
  }else{
    document.getElementById("league_assist").innerHTML = "0";
  }

  document.getElementById("puchar_games").innerHTML = document.getElementById("p_games").textContent.trim();
  const p_goal = document.getElementById("p_goal").textContent.trim();
  if(p_goal !== '-') {  
    document.getElementById("puchar_goal").innerHTML = document.getElementById("p_goal").textContent.trim();
  }else{
    document.getElementById("puchar_goal").innerHTML = "0";
  }

  const p_assist = document.getElementById("p_assist").textContent.trim();
  if(p_assist !== '-') {  
    document.getElementById("puchar_assist").innerHTML = document.getElementById("p_assist").textContent.trim();
  }else{
    document.getElementById("puchar_assist").innerHTML = "0";
  }

  // switch competition
  const btnLeague = document.getElementById("btn_league");
  const btnPuchar = document.getElementById("btn_puchar");
  const viewLeague = document.querySelector(".games__view");
  const viewPuchar = document.querySelector(".games__view2");
  const leagueName = document.getElementById("league");
  const leagueMatches = document.getElementById("league_matches");

  function showLeague() {
    btnLeague.classList.add("active");
    btnPuchar.classList.remove("active");
    viewLeague.style.display = "grid";
    viewPuchar.style.display = "none";
    leagueName.innerHTML = "A Klasa";
    leagueMatches.innerHTML = "7 możliwych meczów";
  }

  function showPuchar() {
    btnPuchar.classList.add("active");
    btnLeague.classList.remove("active");
    viewPuchar.style.display = "grid";
    viewLeague.style.display = "none";
    leagueName.innerHTML = "Puchar Polski";
    leagueMatches.innerHTML = "1 możliwych meczów";
  }

  showLeague(); //default show league
  btnLeague.addEventListener("click", showLeague);
  btnPuchar.addEventListener("click", showPuchar);
});