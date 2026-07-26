document.addEventListener("DOMContentLoaded", ()=>{
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
  const raw = el ? el.textContent : '';
  const age = calculateAgeFromString(raw);

  if (age === null) {
    console.warn('Nie udało się sparsować daty urodzenia:', raw);
  } else {
    if (/\(.*\)/.test(raw)) {
      el.textContent = raw.replace(/\(.*\)/, `(${age})`);
    } else {
      el.textContent = raw + ` (${age})`;
    }
  }
  
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

  // Funkcja generująca wiersze tabeli pozycji z danych JSON
  function generatePositionsTable(selector, pitchData) {
    const tbody = document.querySelector(selector);
    if (!tbody) return;
    tbody.innerHTML = '';

    pitchData.forEach(pos => {
      const tr = document.createElement('tr');

      const tdName = document.createElement('td');
      tdName.textContent = pos.name || pos.code;

      const tdGames = document.createElement('td');
      tdGames.textContent = (pos.games === null || pos.games === undefined) ? '-' : (pos.games === 0 ? '0' : pos.games);

      const tdGoals = document.createElement('td');
      tdGoals.textContent = (pos.goals === null || pos.goals === undefined) ? '-' : (pos.goals === 0 ? '0' : pos.goals);

      const tdAssists = document.createElement('td');
      tdAssists.textContent = (pos.assists === null || pos.assists === undefined) ? '-' : (pos.assists === 0 ? '0' : pos.assists);

      tr.appendChild(tdName);
      tr.appendChild(tdGames);
      tr.appendChild(tdGoals);
      tr.appendChild(tdAssists);

      tbody.appendChild(tr);
    });
  }
  
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
      // Generuj tabelę pozycji z danych pitch
      generatePositionsTable('#positions_table', pitchData);

      // Przeliczenie widocznych pozycji
      const visiblePositions = Array.from(document.querySelectorAll('.position'))
        .map(e => ({e, val: parseInt(e.dataset.value, 10) || 0}))
        .filter(x => x.val >= 50)
        .sort((a, b) => b.val - a.val);

      const media = screen.width;
      let maxSize = media > 768 ? 70 : 40;
      let minSize = media > 768 ? 25 : 16;
      const step = visiblePositions.length > 1 ? (maxSize - minSize) / (visiblePositions.length - 1) : 0;

      visiblePositions.forEach((item, idx) => {
        const size = Math.round(maxSize - idx * step);
        item.e.style.display = 'block';
        item.e.style.width = size + 'px';
        item.e.style.height = size + 'px';
      });

      // Ukrycie pozostałych pozycji
      document.querySelectorAll('.position').forEach(e => {
        if (!visiblePositions.find(vp => vp.e === e)) {
          e.style.display = 'none';
        }
      });

      // Aktualizowanie głównej pozycji
      const allSpots = Array.from(document.querySelectorAll('.position'))
        .sort((a, b) => b.dataset.value - a.dataset.value);
      
      if (allSpots.length > 0) {
        const mainPos = allSpots[0];
        const altPositions = allSpots.filter(e => e !== mainPos && parseInt(e.dataset.value, 10) >= 50);
        
        if (document.getElementById('position')) {
          document.getElementById('position').textContent = mainPos.dataset.position || '';
        }
        if (document.getElementById('main_position')) {
          document.getElementById('main_position').textContent = mainPos.dataset.position || '';
        }
        if (document.getElementById('alt_position')) {
          document.getElementById('alt_position').textContent = altPositions.map(e => e.dataset.position).join(', ');
        }
      }

      // Wygeneruj tabelę wyników na klub (tylko senior - bez sparingów)
      if (data.seasons && Array.isArray(data.seasons.senior)) {
        generateClubTable(document.querySelectorAll('.sezon_history table')[0], data.seasons.senior);
      }

      // Pobierz dodatkowe dane konkurencji i wygeneruj tabelę "BILANS WEDŁUG ROZGRYWEK"
      try {
        const resp2 = await fetch('src/storage/storage.json');
        const compData = await resp2.json();
        if (compData.competitions) {
          const tables = document.querySelectorAll('.sezon_history table');
          if (tables.length > 1) {
            generateCompetitionRows(tables[1], compData.competitions);
          }
          // generate acctual rows (liga / puchar) from `actual` if present
          if (compData.actual) {
            const acctualTable = document.querySelector('.acctual table');
            if (acctualTable) generateActualRows(acctualTable, compData.actual, { liga: 'V liga', puchar: 'Puchar Polski' });
            updateAcctualSums();
          }
        }
      } catch (e) {
        // brak pliku storage.json - to nie jest krytyczne
      }
    } catch (error) {
      console.error('Błąd podczas ładowania statystyk:', error);
    }
  }

  // Generuje tabelę sum statystyk dla każdego klubu z danych senior
  function generateClubTable(tableElem, seniorData) {
    if (!tableElem) return;

    // Zgrupuj po klubie i zsumuj wartości numeryczne
    const map = {};
    const toNum = v => {
      if (v === null || v === undefined || v === '-') return 0;
      const n = parseInt(v, 10);
      return isNaN(n) ? 0 : n;
    };

    seniorData.forEach(row => {
      const club = row.club || 'Unknown';
      if (!map[club]) map[club] = { games: 0, goals: 0, assists: 0, owngoal: 0, yellow: 0, red: 0, minutes: 0 };
      map[club].games += toNum(row.games);
      map[club].goals += toNum(row.goals);
      map[club].assists += toNum(row.assists);
      map[club].owngoal += toNum(row.owngoal);
      map[club].yellow += toNum(row.yellow);
      map[club].red += toNum(row.red);
      map[club].minutes += toNum(row.minutes);
    });

    // Usuń istniejące wiersze (poza nagłówkiem)
    const rows = tableElem.querySelectorAll('tr');
    for (let i = rows.length - 1; i >= 1; i--) {
      rows[i].remove();
    }

    // Wstaw nowe wiersze z podsumowaniami klubów
    Object.keys(map).forEach(club => {
      const totals = map[club];
      const tr = document.createElement('tr');

      const tdClub = document.createElement('td');
      tdClub.textContent = club;
      tdClub.className = club.includes('Granit') ? 'club2' : 'club';

      const tdGames = document.createElement('td');
      tdGames.textContent = totals.games || 0;

      const tdGoals = document.createElement('td');
      tdGoals.textContent = totals.goals || 0;

      const tdAssists = document.createElement('td');
      tdAssists.textContent = totals.assists || 0;

      const tdOwn = document.createElement('td');
      tdOwn.textContent = totals.owngoal || 0;

      const tdYellow = document.createElement('td');
      tdYellow.textContent = totals.yellow || 0;

      const tdRed = document.createElement('td');
      tdRed.textContent = totals.red || 0;

      tr.appendChild(tdClub);
      tr.appendChild(tdGames);
      tr.appendChild(tdGoals);
      tr.appendChild(tdAssists);
      tr.appendChild(tdOwn);
      tr.appendChild(tdYellow);
      tr.appendChild(tdRed);

      tableElem.appendChild(tr);
    });
  }

  // Generuje wiersze tabeli dla danych z `competitions`
  function generateCompetitionRows(tableElem, competitions) {
    if (!tableElem || !competitions) return;

    // Kolejność, w jakiej chcemy pokazać wiersze
    const order = ['aklasa', 'okregowka', 'puchar'];
    const names = { aklasa: 'A Klasa', okregowka: 'V liga', puchar: 'Puchar Polski' };

    // Usuń istniejące wiersze (poza nagłówkiem)
    const rows = tableElem.querySelectorAll('tr');
    for (let i = rows.length - 1; i >= 1; i--) rows[i].remove();

    order.forEach(key => {
      const val = competitions[key];
      if (!val) return;

      const tr = document.createElement('tr');
      const tdName = document.createElement('td');
      tdName.textContent = names[key] || key;

      const fmt = v => (v === null || v === undefined) ? '-' : v;

      const tdGames = document.createElement('td'); tdGames.textContent = fmt(val.games);
      const tdGoals = document.createElement('td'); tdGoals.textContent = fmt(val.goals);
      const tdAssists = document.createElement('td'); tdAssists.textContent = fmt(val.assists);
      const tdOwn = document.createElement('td'); tdOwn.textContent = fmt(val.owngoal);
      const tdYellow = document.createElement('td'); tdYellow.textContent = fmt(val.yellow);
      const tdRed = document.createElement('td'); tdRed.textContent = fmt(val.red);

      tr.appendChild(tdName);
      tr.appendChild(tdGames);
      tr.appendChild(tdGoals);
      tr.appendChild(tdAssists);
      tr.appendChild(tdOwn);
      tr.appendChild(tdYellow);
      tr.appendChild(tdRed);

      tableElem.appendChild(tr);
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

  function updateAcctualSums() {
    const set = (id, cls) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.textContent = sumColumn(cls);
    };
    set('lacznie_games', 'lacznie_games');
    set('lacznie_goals', 'lacznie_goals');
    set('lacznie_assist', 'lacznie_assist');
    set('lacznie_min', 'lacznie_min');
  }

  // Inicjalizacja - załadować statystyki
  loadStats();
})