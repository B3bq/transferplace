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

  const positions = Array.from(document.querySelectorAll(".position"));

  const visible = positions.map(e => ({e, val: parseInt(e.dataset.value, 10) || 0})).filter(x => x.val >= 50);

  visible.sort((a,b) => b.val - a.val);

  const media = screen.width;
  let maxSize = 0;
  let minSize = 0;

  if(media>768){
    maxSize = 70;
    minSize = 25;
  }else{
    maxSize = 40;
    minSize = 16;
  }
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
    leagueName.innerHTML = "V liga";
    leagueMatches.innerHTML = "0 możliwych meczów";
  }

  function showPuchar() {
    btnPuchar.classList.add("active");
    btnLeague.classList.remove("active");
    viewPuchar.style.display = "grid";
    viewLeague.style.display = "none";
    leagueName.innerHTML = "Puchar Polski";
    leagueMatches.innerHTML = "0 możliwych meczów";
  }

  showLeague(); //default show league
  btnLeague.addEventListener("click", showLeague);
  btnPuchar.addEventListener("click", showPuchar);

  const nav = document.querySelector('.main-nav');
  const navToggle = document.querySelector('.nav__toggle');
  const navOverlay = document.querySelector('.nav__overlay');

  function toggleMobileNav() {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navOverlay.setAttribute('aria-hidden', String(!isOpen));
    navToggle.textContent = isOpen ? 'Zamknij' : 'Otwórz';
  }

  if (navToggle) {
    navToggle.addEventListener('click', toggleMobileNav);
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', toggleMobileNav);
  }

  document.querySelectorAll('.main-nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('open')) {
        toggleMobileNav();
      }
    });
  });

  // Ładowanie statystyk z JSON
  async function loadStats() {
    try {
      const response = await fetch('src/storage/storage.json');
      const data = await response.json();
      
      // Ładowanie statystyk pozycji
      const pitchData = data.pitch;
      if (!pitchData || !Array.isArray(pitchData)) {
        console.error('Brak danych pitch w JSON');
        return;
      }

      // Mapa kodów pozycji na dane
      const positionMap = {};
      pitchData.forEach(pos => {
        positionMap[pos.code] = pos;
      });

      // Aktualizowanie data-value dla divów pozycji
      document.querySelectorAll('.position').forEach(el => {
        const code = el.classList[1]; // Drugi class to kod pozycji
        if (positionMap[code]) {
          el.dataset.value = positionMap[code].games;
          el.dataset.position = positionMap[code].name;
        }
      });

      // Przeliczenie widocznych pozycji
      const allPositions = Array.from(document.querySelectorAll('.position'));
      const visible = allPositions.map(e => ({e, val: parseInt(e.dataset.value, 10) || 0}))
        .filter(x => x.val >= 50)
        .sort((a, b) => b.val - a.val);

      const media = screen.width;
      let maxSize = media > 768 ? 70 : 40;
      let minSize = media > 768 ? 25 : 16;
      const step = visible.length > 1 ? (maxSize - minSize) / (visible.length - 1) : 0;

      visible.forEach((item, idx) => {
        const size = Math.round(maxSize - idx * step);
        item.e.style.display = 'block';
        item.e.style.width = size + 'px';
        item.e.style.height = size + 'px';
      });

      // Ukrycie pozostałych pozycji
      allPositions.forEach(e => {
        if (!visible.find(vp => vp.e === e)) {
          e.style.display = 'none';
        }
      });

      // Aktualizowanie głównej pozycji
      const spots = allPositions.sort((a, b) => b.dataset.value - a.dataset.value);
      if (spots.length > 0) {
        const main = spots[0];
        const extras = spots.filter(e => e !== main && parseInt(e.dataset.value, 10) >= 50);
        
        if (document.getElementById('position')) {
          document.getElementById('position').textContent = main.dataset.position || '';
        }
        if (document.getElementById('position_bio')) {
          document.getElementById('position_bio').textContent = main.dataset.position || '';
        }
        if (document.getElementById('main_position')) {
          document.getElementById('main_position').textContent = main.dataset.position || '';
        }
        if (document.getElementById('alt_position')) {
          document.getElementById('alt_position').textContent = extras.map(e => e.dataset.position).join(', ');
        }
      }

      // Ładowanie i uzupełnianie tabel sezonów
      if (data.seasons) {
        // Sparings + Senior połączone
        const allSeniorData = [];
        if (data.seasons.sparings && data.seasons.sparings.length > 0) {
          allSeniorData.push(...data.seasons.sparings);
        }
        if (data.seasons.senior && data.seasons.senior.length > 0) {
          allSeniorData.push(...data.seasons.senior);
        }
        
        if (allSeniorData.length > 0) {
          generateSeasonRows('.sezon_history table', allSeniorData);
            updateSums();
        }
        // generate current competitions (liga / puchar) from `actual` data
        if (data.actual) {
          const acctualTable = document.querySelector('.acctual table');
          if (acctualTable) {
            generateActualRows(acctualTable, data.actual, { liga: 'V liga', puchar: 'Puchar Polski' });
            updateSums();
          }
          // update small stats in the games view (spans)
          const fmt = v => (v === null || v === undefined) ? '-' : v;
          const liga = data.actual.liga || {};
          const puchar = data.actual.puchar || {};
          const el = id => document.getElementById(id);
          if (el('league_games')) el('league_games').textContent = fmt(liga.games);
          if (el('league_goal')) el('league_goal').textContent = fmt(liga.goals);
          if (el('league_assist')) el('league_assist').textContent = fmt(liga.assists);
          if (el('puchar_games')) el('puchar_games').textContent = fmt(puchar.games);
          if (el('puchar_goal')) el('puchar_goal').textContent = fmt(puchar.goals);
          if (el('puchar_assist')) el('puchar_assist').textContent = fmt(puchar.assists);
        }
      }
    } catch (error) {
      console.error('Błąd podczas ładowania statystyk:', error);
    }
  }

  function formatValue(val) {
    return val === null || val === undefined || val === '' ? '-' : val;
  }

  // Aktualizuje sumy kolumn po wygenerowaniu wierszy dynamicznie
  function updateSums() {
    const setText = (id, className, formatFunc) => {
      const el = document.getElementById(id);
      if (!el) return;
      const total = sumColumn(className);
      el.textContent = formatFunc ? formatFunc(total) : total;
    };

    setText('lacznie_games', 'lacznie_games');
    setText('lacznie_goals', 'lacznie_goals');
    setText('lacznie_assist', 'lacznie_assist');
    setText('lacznie_min', 'lacznie_min');

    setText('senior_match', 'senior_match');
    setText('senior_goal', 'senior_goal');
    setText('senior_assist', 'senior_assist');
    setText('senior_own', 'senior_own');
    setText('senior_yellow', 'senior_yellow');
    setText('senior_red', 'senior_red');
    setText('senior_min', 'senior_min');

    setText('all_match', 'all_match');
    setText('all_goal', 'all_goal');
    setText('all_assist', 'all_assist');
    setText('all_own', 'all_own');
    setText('all_yellow', 'all_yellow');
    setText('all_red', 'all_red');
    setText('all_min', 'senior_min');

    setText('junior_match', 'junior_match');
    setText('junior_goal', 'junior_goal');
    setText('junior_assist', 'junior_assist');
    setText('junior_own', 'junior_own');
  }

  function generateSeasonRows(tableSelector, seasonData) {
    const table = document.querySelector(tableSelector);
    if (!table) {
      console.error(`Tabela ${tableSelector} nie znaleziona`);
      return;
    }

    const tbody = table.querySelector('#senior_seasons');
    if (!tbody) {
      console.error('Element #senior_seasons nie znaleziony');
      return;
    }

    // Generuj wiersze dla każdego sezonu
    seasonData.forEach(season => {
      const row = document.createElement('tr');
      
      const seasonCell = document.createElement('td');
      seasonCell.textContent = season.season;
      
      const clubCell = document.createElement('td');
      clubCell.textContent = season.club;
      clubCell.className = 'club' + (season.club.includes('Granit') ? '2' : '');
      
      const gamesCell = document.createElement('td');
      gamesCell.textContent = formatValue(season.games);
      gamesCell.className = 'senior_match all_match';
      
      const goalsCell = document.createElement('td');
      goalsCell.textContent = formatValue(season.goals);
      goalsCell.className = 'senior_goal all_goal';
      
      const assistsCell = document.createElement('td');
      assistsCell.textContent = formatValue(season.assists);
      assistsCell.className = 'senior_assist all_assist';
      
      const owngCell = document.createElement('td');
      owngCell.textContent = formatValue(season.owngoal);
      owngCell.className = 'senior_own all_own';
      
      const yellowCell = document.createElement('td');
      yellowCell.textContent = formatValue(season.yellow);
      yellowCell.className = 'senior_yellow all_yellow';
      
      const redCell = document.createElement('td');
      redCell.textContent = formatValue(season.red);
      redCell.className = 'senior_red all_red';
      
      const minutesCell = document.createElement('td');
      minutesCell.textContent = season.minutes ? season.minutes + "'" : '-';
      minutesCell.className = 'senior_min';
      
      row.appendChild(seasonCell);
      row.appendChild(clubCell);
      row.appendChild(gamesCell);
      row.appendChild(goalsCell);
      row.appendChild(assistsCell);
      row.appendChild(owngCell);
      row.appendChild(yellowCell);
      row.appendChild(redCell);
      row.appendChild(minutesCell);
      
      tbody.appendChild(row);
    });
  }

  // Generuje wiersze dla sekcji 'BILANS WYSTĘPÓW' (liga / puchar)
  function generateActualRows(tableElem, actualData, names = { liga: 'V liga', puchar: 'Puchar Polski' }) {
    if (!tableElem || !actualData) return;

    const tbody = tableElem.querySelector('#actual_rows');
    if (!tbody) return;

    tbody.innerHTML = '';

    const order = ['liga', 'puchar'];
    order.forEach(key => {
      const val = actualData[key];
      if (!val) return;
      const tr = document.createElement('tr');

      const tdName = document.createElement('td');
      tdName.textContent = names[key] || key;

      const fmt = v => (v === null || v === undefined) ? '-' : v;

      const tdGames = document.createElement('td'); tdGames.textContent = fmt(val.games); tdGames.className = 'lacznie_games';
      const tdGoals = document.createElement('td'); tdGoals.textContent = fmt(val.goals); tdGoals.className = 'lacznie_goals';
      const tdAssists = document.createElement('td'); tdAssists.textContent = fmt(val.assists); tdAssists.className = 'lacznie_assist';
      const tdMin = document.createElement('td'); tdMin.textContent = (val.minutes === null || val.minutes === undefined) ? '-' : (val.minutes + "'"); tdMin.className = 'lacznie_min';

      tr.appendChild(tdName);
      tr.appendChild(tdGames);
      tr.appendChild(tdGoals);
      tr.appendChild(tdAssists);
      tr.appendChild(tdMin);

      tbody.appendChild(tr);
    });
  }

  // Inicjalizacja - załadować statystyki
  loadStats();
});