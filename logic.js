// logic.js

// ——————————————————————————
// 1) Core data & tables
// ——————————————————————————

const baseStats = ['JS','JR','OD','HA','DR','PA','IS','ID','RB','SB'];

const trainingEffects = {
  "JS (PG/SG)": { JS:0.6, JR:0.2, DR:0.05, HA:0.05 },
  "JS (SF/PF)": { JS:0.4, JR:0.15, IS:0.25 },
  "JS (SG/SF)": { JS:0.5, JR:0.1, DR:0.05, HA:0.05 },
  "JS (team)": { JS:0.22, JR:0.04, DR:0.02, HA:0.02 },
  "JR (SG)": { JS:0.2, JR:0.4, DR:0.05, HA:0.05 },
  "JR (PG)": { JS:0.15, JR:0.3, DR:0.0375, HA:0.0375 },
  "JR (SG/SF)": { JS:0.15, JR:0.3, DR:0.0375, HA:0.0375 },
  "JR (team)": { JS:0.05, JR:0.1, DR:0.0125, HA:0.0125 },
  "OD (PG)": { OD:0.5, DR:0.05, HA:0.05, ID:0.1 },
  "OD (PG/SG)": { OD:0.375, DR:0.0375, HA:0.0375, ID:0.075 },
  "OD(PG/SG/SF)": { OD:0.2, DR:0.02, HA:0.02, ID:0.04 },
  "HA (PG)": { OD:0.1, DR:0.5, HA:0.4 },
  "HA (PG/SG)": { OD:0.075, DR:0.375, HA:0.03 },
  "HA (PG/SG/SF)": { OD:0.04, DR:0.2, HA:0.16 },
  "1v1 (PG/SG)": { JS:0.4, DR:0.5, HA:0.4 },
  "1v1 (SF/PF)": { JS:0.2, DR:0.5, HA:0.4, IS:0.2 },
  "1v1 (team)": { JS:0.088, DR:0.176, HA:0.22, IS:0.088 },
  "PA (PG)": { DR:0.16, HA:0.16, PA:0.6 },
  "PA (PG/SG)": { DR:0.12, HA:0.12, PA:0.45 },
  "PA (team)": { DR:0.04, HA:0.04, PA:0.15 },
  "IS (C)": { JS:0.1, IS:0.5, ID:0.05 },
  "IS (PF/C)": { JS:0.075, IS:0.375, ID:0.0375 },
  "IS (SF/PF/C)": { JS:0.04, IS:0.2, ID:0.02 },
  "ID (C)": { IS:0.05, ID:0.5, SB:0.1 },
  "ID (PF/C)": { IS:0.0375, ID:0.375, SB:0.075 },
  "ID (SF/PF/C)": { IS:0.02, ID:0.2, SB:0.04 },
  "RB (PF/C)": { IS:0.05, ID:0.05, RB:0.5 },
  "RB (team)": { IS:0.022, ID:0.022, RB:0.22 },
  "SB (C)": { ID:0.2, RB:0.1, SB:0.5 },
  "SB (PF/C)": { ID:0.15, RB:0.075, SB:0.375 },
  "SB (team)": { ID:0.08, RB:0.04, SB:0.2 }
};

const elasticEffects = {
  'JS->DR': 0.0211, 'JR->OD': 0.0371, 'OD->HA': 0.0332,
  'PA->HA': 0.04, 'DR->JS': 0.0296, 'DR->PA': 0.0129,
  'HA->OD': 0.0116, 'HA->PA': 0.0103, 'IS->JS': 0.0125,
  'IS->ID': 0.0289, 'IS->RB': 0.0257, 'ID->IS': 0.0153,
  'RB->ID': 0.0371, 'SB->ID': 0.0197, 'OD->ID': 0.0455
};

const heightMultipliers = {
  "175cm": { JS:1,   JR:1.5,  OD:1.5,  HA:1, DR:1,   PA:1,   IS:0.5,  ID:0.5,  RB:0.5,  SB:0.5 },
  "178cm": { JS:1,   JR:1.45, OD:1.45, HA:1, DR:1,   PA:1,   IS:0.55, ID:0.55, RB:0.55, SB:0.55 },
  "180cm": { JS:1,   JR:1.4,  OD:1.4,  HA:1, DR:1,   PA:1,   IS:0.6,  ID:0.6,  RB:0.6,  SB:0.6 },
  "183cm": { JS:1,   JR:1.35, OD:1.35, HA:1, DR:1,   PA:1,   IS:0.65, ID:0.65, RB:0.65, SB:0.65 },
  "185cm": { JS:1,   JR:1.3,  OD:1.3,  HA:1, DR:1,   PA:1,   IS:0.7,  ID:0.7,  RB:0.7,  SB:0.7 },
  "188cm": { JS:1,   JR:1.25, OD:1.25, HA:1, DR:1,   PA:1,   IS:0.75, ID:0.75, RB:0.75, SB:0.75 },
  "190cm": { JS:1,   JR:1.2,  OD:1.2,  HA:1, DR:1,   PA:1,   IS:0.8,  ID:0.8,  RB:0.8,  SB:0.8 },
  "193cm": { JS:1,   JR:1.15, OD:1.15, HA:1, DR:1,   PA:1,   IS:0.85, ID:0.85, RB:0.85, SB:0.85 },
  "196cm": { JS:1,   JR:1.1,  OD:1.1,  HA:1, DR:1,   PA:1,   IS:0.9,  ID:0.9,  RB:0.9,  SB:0.9 },
  "198cm": { JS:1,   JR:1.05, OD:1.05, HA:1, DR:1,   PA:1,   IS:0.95, ID:0.95, RB:0.95, SB:0.95 },
  "201cm": { JS:1,   JR:1,    OD:1,    HA:1, DR:1,   PA:1,   IS:1,    ID:1,    RB:1,    SB:1   },
  "203cm": { JS:1,   JR:0.95, OD:0.95, HA:1, DR:1,   PA:1,   IS:1.05, ID:1.05, RB:1.05, SB:1.05 },
  "206cm": { JS:1,   JR:0.9,  OD:0.9,  HA:1, DR:1,   PA:1,   IS:1.1,  ID:1.1,  RB:1.1,  SB:1.1 },
  "208cm": { JS:1,   JR:0.85, OD:0.85, HA:1, DR:1,   PA:1,   IS:1.15, ID:1.15, RB:1.15, SB:1.15 },
  "211cm": { JS:1,   JR:0.8,  OD:0.8,  HA:1, DR:1,   PA:1,   IS:1.2,  ID:1.2,  RB:1.2,  SB:1.2 },
  "213cm": { JS:1,   JR:0.75, OD:0.75, HA:1, DR:1,   PA:1,   IS:1.25, ID:1.25, RB:1.25, SB:1.25 },
  "216cm": { JS:1,   JR:0.7,  OD:0.7,  HA:1, DR:1,   PA:1,   IS:1.3,  ID:1.3,  RB:1.3,  SB:1.3 },
  "218cm": { JS:1,   JR:0.65, OD:0.65, HA:1, DR:1,   PA:1,   IS:1.35, ID:1.35, RB:1.35, SB:1.35 },
  "221cm": { JS:1,   JR:0.6,  OD:0.6,  HA:1, DR:1,   PA:1,   IS:1.4,  ID:1.4,  RB:1.4,  SB:1.4 },
  "224cm": { JS:1,   JR:0.55, OD:0.55, HA:1, DR:1,   PA:1,   IS:1.45, ID:1.45, RB:1.45, SB:1.45 },
  "226cm": { JS:1,   JR:0.5,  OD:0.5,  HA:1, DR:1,   PA:1,   IS:1.5,  ID:1.5,  RB:1.5,  SB:1.5 },
  "229cm": { JS:1,   JR:0.45, OD:0.45, HA:1, DR:1,   PA:1,   IS:1.55, ID:1.55, RB:1.55, SB:1.55 }
};


function getAgeCoefficient(age) {
  const table = {
    18:1.00, 19:0.95, 20:0.88, 21:0.78, 22:0.7, 23:0.6, 24:0.51,
    25:0.42, 26:0.35, 27:0.27, 28:0.21, 29:0.16, 30:0.11,
    31:0.07, 32:0.05, 33:0.03, 34:0.02, 35:0.01
  };
  return table[age] || 0;
}

window.translations = {
  en: {
    Season:      "Season",
    Week:        "Week",
    TrainingType:"Training Type",
    CoachLevel:  "Coach Level",
    Name:        "Name",
    Height:      "Height",
    Age:         "Age",
    // baseStats abbreviations will be left as-is, or add entries here to translate them:
    JS: "JS", JR: "JR", OD: "OD", HA: "HA", DR: "DR",
    PA: "PA", IS: "IS", ID: "ID", RB: "RB", SB: "SB"
  },
  pt: {
    Season:      "Temporada",
    Week:        "Semana",
    TrainingType:"Tipo de Treino",
    CoachLevel:  "Nível do Treinador",
    Name:        "Nome",
    Height:      "Altura",
    Age:         "Idade",
    JS: "JS", JR: "JR", OD: "OD", HA: "HA", DR: "DR",
    PA: "PA", IS: "IS", ID: "ID", RB: "RB", SB: "SB"
  }
};

function simulateTraining() {
  const coachCoefficient = parseFloat(document.getElementById("coachQuality").value);
  const playerStats = {};
  baseStats.forEach(stat => {
    playerStats[stat] = parseFloat(document.getElementById(stat).value) || 0;
  });
  const playerName = document.getElementById("playerName").value;
  const heightMap = heightMultipliers[document.getElementById("height").value] || {};

  for (let s = 1; s <= seasonCount; s++) {
    const selects = document.querySelectorAll(`#seasonBody${s} .training-select`);
    const age = parseInt(document.getElementById(`seasonAge${s}`).value, 10);
    const ageCoef = getAgeCoefficient(age);

    selects.forEach(select => {
      const effect = trainingEffects[select.value];
      if (!effect) return;

      const gains = {};
      for (let st in effect) {
        gains[st] = effect[st] * ageCoef * coachCoefficient;
      }

      for (let st in gains) {
        for (let key in elasticEffects) {
          const [b, t] = key.split("->");
          if (b === st && playerStats[t] > playerStats[b]) {
            const diff = playerStats[t] - playerStats[b];
            gains[b] += gains[b] * (diff * elasticEffects[key]);
          }
        }
      }

      for (let st in gains) {
        gains[st] *= (heightMap[st] || 1);
      }

      for (let st in gains) {
        playerStats[st] += gains[st];
      }
    });
  }

  const resultRow = document.getElementById("resultRow");
  resultRow.innerHTML = `<td>${playerName}</td>` +
    baseStats.map(st => `<td>${playerStats[st].toFixed(2)}</td>`).join("");
}

function applyTrainingToSeason(seasonNum) {
  const val = document.getElementById(`seasonApplyAll${seasonNum}`).value;
  if (!val) return;
  document.querySelectorAll(`#seasonBody${seasonNum} .training-select`).forEach(sel => {
    sel.value = val;
    M.FormSelect.init(sel);
  });
  simulateTraining();
}

function addSeason() {
  seasonCount++;
  const baseAge = parseInt(document.getElementById("playerAge").value, 10);
  const container = document.getElementById("seasonsContainer");
  const div = document.createElement("div");
  div.id = `season${seasonCount}`;
  div.classList.add("season-card");

  const opts = Object.keys(trainingEffects).map(o => `<option>${o}</option>`).join("");
  const weekOpts = `<option value="">-- No Training --</option>${opts}`;
  const applyOpts = `<option value="">-- Choose Training Type --</option>${opts}`;

  div.innerHTML = `
    <h5>Season ${seasonCount}</h5>
    <div class="input-field">
      <span>Age:</span>
      <input type="number" id="seasonAge${seasonCount}" class="season-age-input"
        value="${baseAge + (seasonCount - 1)}">
    </div>
    <div class="input-field">
      <span>Apply to all weeks:</span>
      <select id="seasonApplyAll${seasonCount}" class="apply-all-select">${applyOpts}</select>
      <button class="btn green" data-i18n="applyButton" onclick="applyTrainingToSeason(${seasonCount})">APPLY</button>
    </div>
    <table class="highlight">
      <thead><tr><th>Week</th><th>Training Type</th></tr></thead>
      <tbody id="seasonBody${seasonCount}">
        ${Array.from({ length: 14 }, (_, i) => `
          <tr>
            <td>Week ${i+1}</td>
            <td>
              <select class="training-select">${weekOpts}</select>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;

  container.appendChild(div);
  M.FormSelect.init(div.querySelectorAll("select"));
  
  div.querySelectorAll(".training-select").forEach(sel => {
    sel.addEventListener("change", simulateTraining);
  });
  
  // Add change listener to age input
  const ageInput = div.querySelector(`#seasonAge${seasonCount}`);
  if (ageInput) {
    ageInput.addEventListener("change", simulateTraining);
  }
}

function removeSeason() {
  if (seasonCount === 0) return;
  const last = document.getElementById(`season${seasonCount}`);
  if (last) last.remove();
  seasonCount--;
}

let seasonCount = 0;

const heightOptions = ["175cm","178cm","180cm","183cm","185cm","188cm","190cm","193cm","196cm","198cm","201cm","203cm","206cm","208cm","211cm","213cm","216cm","218cm","221cm","224cm","226cm","229cm"];

const potentialOptions = ["Speaker","Reserva","Jogador útil","6º Homem","Titular","Estrela","Super-estrela","Vedeta","Super-vedeta","MVP","Jogador Histórico","Melhor jogador de sempre"];

function populateStaticDropdowns() {
  const h = document.getElementById("height"),
        p = document.getElementById("potential");

  if (h) {
    h.innerHTML = heightOptions.map(x => `<option value="${x}">${x}</option>`).join("");
    h.value = "185cm";
    h.addEventListener("change", simulateTraining);
  }
  if (p) {
    p.innerHTML = potentialOptions.map(x => `<option value="${x}">${x}</option>`).join("");
    p.value = "MVP";
  }

  setTimeout(() => {
    M.FormSelect.init(h);
    M.FormSelect.init(p);
  }, 0);
}

 window.addEventListener("DOMContentLoaded", () => {
  populateStaticDropdowns();
  baseStats.forEach(st => {
    const el = document.getElementById(st);
    if (el) el.value = 7;
  });
  document.getElementById("playerName").value = "Carlos";
  const cq = document.getElementById("coachQuality");
  if (cq) {
    M.FormSelect.init([cq]);
    cq.addEventListener("change", simulateTraining);
  }
  simulateTraining();
});

function exportTrainingPlan() {
  if (seasonCount === 0) {
    alert(translations[localStorage.getItem('lang')||'en'].TrainingType + 
          " – " +
          (translations[localStorage.getItem('lang')||'en'].Week) + 
          ": add at least one season."); 
    return;
  }

  const lang = localStorage.getItem('lang') || 'en';
  const t    = translations[lang];

  const coachSelect     = document.getElementById("coachQuality");
  const coachLevelLabel = coachSelect.options[coachSelect.selectedIndex].text;
  const coachCoefficient= parseFloat(coachSelect.value);
  const height          = document.getElementById("height").value;
  const playerName      = document.getElementById("playerName").value;

  // Sheet 1: Training Plan
  const seasonPlan = [[
    t.Season, t.Week, t.TrainingType, t.CoachLevel, t.Name
  ]];
  const trainingData = [];

  for (let s = 1; s <= seasonCount; s++) {
    const age     = parseInt(document.getElementById(`seasonAge${s}`).value, 10);
    const selects = document.querySelectorAll(`#seasonBody${s} .training-select`);
    selects.forEach((sel, i) => {
      const training = sel.value;
      if (!training) return;
      seasonPlan.push([
        `${t.Season} ${s}`,
        `${t.Week} ${i+1}`,
        training,
        coachLevelLabel,
        playerName
      ]);
      trainingData.push({ season: s, week: i+1, training, age });
    });
  }

  if (trainingData.length === 0) {
    alert(t.TrainingType + " – " + t.Week + ": " + 
          (lang === 'pt' 
            ? "pelo menos uma semana deve ter treino" 
            : "at least one week must have training")
    );
    return;
  }

  // Sheet 2: Stat Progress
  const weeklyStats = [[
    t.Season, t.Week, t.Name, t.Height, t.Age, 
    ...baseStats.map(st => t[st] || st)
  ]];
  const heightMap = heightMultipliers[height] || {};
  const playerStats = {};
  baseStats.forEach(st => {
    playerStats[st] = parseFloat(document.getElementById(st).value) || 0;
  });

  trainingData.forEach(({ season, week, training, age }) => {
    const ageCoef = getAgeCoefficient(age);
    const effect  = trainingEffects[training];
    if (!effect) return;

    const gains = {};
    for (let st in effect) {
      gains[st] = effect[st] * ageCoef * coachCoefficient;
    }
    for (let st in gains) {
      for (let key in elasticEffects) {
        const [b,tgt] = key.split("->");
        if (b===st && playerStats[tgt]>playerStats[b]) {
          const diff = playerStats[tgt]-playerStats[b];
          gains[b] += gains[b] * (diff * elasticEffects[key]);
        }
      }
    }
    for (let st in gains) {
      gains[st] *= (heightMap[st]||1);
    }
    for (let st in gains) {
      playerStats[st] += gains[st];
    }

    weeklyStats.push([
      `${t.Season} ${season}`,
      `${t.Week} ${week}`,
      playerName,
      height,
      age,
      ...baseStats.map(st => playerStats[st].toFixed(2))
    ]);
  });

  // Create workbook
  const wb  = XLSX.utils.book_new();
  const ws1 = XLSX.utils.aoa_to_sheet(seasonPlan);
  const ws2 = XLSX.utils.aoa_to_sheet(weeklyStats);

  // Freeze top row
  ws1['!freeze'] = { xSplit:0, ySplit:1 };
  ws2['!freeze'] = { xSplit:0, ySplit:1 };

  // Format both sheets
  [ws1, ws2].forEach(ws => {
    const range = XLSX.utils.decode_range(ws["!ref"]);
    // Bold & center headers
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const hdr = ws[XLSX.utils.encode_cell({r:0,c:C})];
      if (hdr) hdr.s = {
        font: { bold:true },
        alignment: { horizontal:"center", vertical:"center" }
      };
    }
    // Auto‐width & center data
    const cols = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let max = 10;
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cell = ws[XLSX.utils.encode_cell({r:R,c:C})];
        if (cell && cell.v) {
          max = Math.max(max, cell.v.toString().length);
          if (R>0) cell.s = { alignment:{horizontal:"center",vertical:"center"} };
        }
      }
      cols.push({ wch: max+2 });
    }
    ws["!cols"] = cols;
  });

  XLSX.utils.book_append_sheet(wb, ws1, lang==="pt"?"Plano de Treino":"Training Plan");
  XLSX.utils.book_append_sheet(wb, ws2, lang==="pt"?"Progresso de Stats":"Stat Progress");
  XLSX.writeFile(wb, `Training_Plan_${lang}.xlsx`);
}
