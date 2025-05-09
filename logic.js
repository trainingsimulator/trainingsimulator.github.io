// logic.js

// ——————————————————————————
// 1) Core data & tables
// ——————————————————————————
// default
window.currentLang = localStorage.getItem('lang') || 'en';

const baseStats = ['JS','JR','OD','HA','DR','PA','IS','ID','RB','SB'];

let seasonCount = 0;

const heightOptions = ["175cm","178cm","180cm","183cm","185cm","188cm","190cm","193cm","196cm","198cm","201cm","203cm","206cm","208cm","211cm","213cm","216cm","218cm","221cm","224cm","226cm","229cm"];

const potentialOptions = ["Speaker","Reserva","Jogador útil","6º Homem","Titular","Estrela","Super-estrela","Vedeta","Super-vedeta","MVP","Jogador Histórico","Melhor jogador de sempre"];


const trainingEffects = {
  "JS (PG/SG)": { JS:0.52, JR:0.2, DR:0.05, HA:0.05 },
  "JS (SF/PF)": { JS:0.35, JR:0.15, IS:0.25 },
  "JS (SG/SF)": { JS:0.5, JR:0.1, DR:0.05, HA:0.05 },
  "JS (team)": { JS:0.22, JR:0.04, DR:0.02, HA:0.02 },
  "JR (SG)": { JS:0.2, JR:0.4, DR:0.05, HA:0.05 },
  "JR (PG)": { JS:0.15, JR:0.3, DR:0.0375, HA:0.0375 },
  "JR (SG/SF)": { JS:0.15, JR:0.3, DR:0.0375, HA:0.0375 },
  "JR (team)": { JS:0.05, JR:0.1, DR:0.0125, HA:0.0125 },
  "OD (PG)": { OD:0.5, DR:0.05, HA:0.05, ID:0.1 },
  "OD (PG/SG)": { OD:0.375, DR:0.0375, HA:0.0375, ID:0.075 },
  "OD(PG/SG/SF)": { OD:0.2, DR:0.02, HA:0.02, ID:0.04 },
  "HA (PG)": { OD:0.1, DR:0.4, HA:0.5 },
  "HA (PG/SG)": { OD:0.075, DR:0.0375, HA:0.045 },
  "HA (PG/SG/SF)": { OD:0.04, DR:0.2, HA:0.25 },
  "1v1 (PG/SG)": { JS:0.35, DR:0.45, HA:0.38 },
  "1v1 (SF/PF)": { JS:0.18, DR:0.45, HA:0.38, IS:0.19 },
  "1v1 (team)": { JS:0.088, DR:0.176, HA:0.22, IS:0.088 },
  "PA (PG)": { DR:0.16, HA:0.16, PA:0.6  },
  "PA (PG/SG)": { DR:0.12, HA:0.12, PA:0.45 },
  "PA (team)": { DR:0.04, HA:0.04, PA:0.15 },
  "IS (C)": { JS:0.13, IS:0.5, ID:0.1 },
  "IS (PF/C)": { JS:0.075, IS:0.375, ID:0.0375 },
  "IS (SF/PF/C)": { JS:0.04, IS:0.2, ID:0.02 },
  "ID (C)": { IS:0.1, ID:0.5, SB:0.1 },
  "ID (PF/C)": { IS:0.0375, ID:0.375, SB:0.075 },
  "ID (SF/PF/C)": { IS:0.02, ID:0.2, SB:0.04 },
  "RB (PF/C)": { IS:0.05, ID:0.05, RB:0.5 },
  "RB (team)": { IS:0.022, ID:0.022, RB:0.22 },
  "SB (C)": { ID:0.2, RB:0.1, SB:0.5 },
  "SB (PF/C)": { ID:0.15, RB:0.075, SB:0.375 },
  "SB (team)": { ID:0.08, RB:0.04, SB:0.2 }
};

const elasticEffects = {
  'JS->DR': 0.0211, 'JR->OD': 0.0371, 'OD->HA': 0.0352,
  'PA->HA': 0.03, 'DR->JS': 0.0296, 'DR->PA': 0.0129,
  'HA->OD': 0.0116, 'HA->PA': 0.0103, 'IS->JS': 0.0125,
  'IS->ID': 0.0159, 'IS->RB': 0.0257, 'ID->IS': 0.153,
  'RB->ID': 0.0371, 'SB->ID': 0.0197, 
  'OD->ID': 0.0355
};

const heightMultipliers = {
  "175cm": { JS:1,   JR:1.5,  OD:1.5,  HA:1, DR:0.95,   PA:1,   IS:0.65,  ID:0.5,  RB:0.5,  SB:0.5 },
  "178cm": { JS:1,   JR:1.45, OD:1.45, HA:1, DR:0.95,   PA:1,   IS:0.7, ID:0.55, RB:0.55, SB:0.55 },
  "180cm": { JS:1,   JR:1.4,  OD:1.4,  HA:1, DR:0.95,   PA:1,   IS:0.75,  ID:0.6,  RB:0.6,  SB:0.6 },
  "183cm": { JS:1,   JR:1.35, OD:1.35, HA:1, DR:0.95,   PA:1,   IS:0.78, ID:0.65, RB:0.65, SB:0.65 },
  "185cm": { JS:1,   JR:1.3,  OD:1.3,  HA:1, DR:0.95,   PA:1,   IS:0.83,  ID:0.7,  RB:0.7,  SB:0.7 },
  "188cm": { JS:1,   JR:1.25, OD:1.25, HA:1, DR:0.95,   PA:1,   IS:0.85, ID:0.75, RB:0.75, SB:0.75 },
  "190cm": { JS:1,   JR:1.2,  OD:1.2,  HA:1, DR:0.95,   PA:1,   IS:0.88,  ID:0.8,  RB:0.8,  SB:0.8 },
  "193cm": { JS:1,   JR:1.15, OD:1.15, HA:1, DR:0.95,   PA:1,   IS:0.93, ID:0.85, RB:0.85, SB:0.85 },
  "196cm": { JS:1,   JR:1.1,  OD:1.1,  HA:1, DR:0.95,   PA:1,   IS:0.95,  ID:0.9,  RB:0.9,  SB:0.9 },
  "198cm": { JS:1,   JR:1.05, OD:1.05, HA:1, DR:0.95,   PA:1,   IS:0.97, ID:0.95, RB:0.95, SB:0.95 },
  "201cm": { JS:1,   JR:1,    OD:1,    HA:1, DR:0.95,   PA:1,   IS:1,    ID:1,    RB:1,    SB:1   },
  "203cm": { JS:1,   JR:0.95, OD:0.95, HA:1, DR:0.95,   PA:1.05,   IS:1.05, ID:1.05, RB:1.05, SB:1.05 },
  "206cm": { JS:1,   JR:0.9,  OD:0.9,  HA:1, DR:0.95,   PA:1.1,   IS:1.1,  ID:1.1,  RB:1.1,  SB:1.1 },
  "208cm": { JS:1,   JR:0.85, OD:0.85, HA:1, DR:0.95,   PA:1.15,   IS:1.15, ID:1.15, RB:1.15, SB:1.15 },
  "211cm": { JS:1,   JR:0.8,  OD:0.8,  HA:1, DR:0.95,   PA:1.2,   IS:1.2,  ID:1.2,  RB:1.2,  SB:1.2 },
  "213cm": { JS:1,   JR:0.75, OD:0.75, HA:1, DR:0.95,   PA:1.25,   IS:1.25, ID:1.25, RB:1.25, SB:1.25 },
  "216cm": { JS:1,   JR:0.7,  OD:0.7,  HA:1, DR:0.95,   PA:1.3,   IS:1.3,  ID:1.3,  RB:1.3,  SB:1.3 },
  "218cm": { JS:1,   JR:0.65, OD:0.65, HA:1, DR:0.95,   PA:1.35,   IS:1.35, ID:1.35, RB:1.35, SB:1.35 },
  "221cm": { JS:1,   JR:0.6,  OD:0.6,  HA:1, DR:0.95,   PA:1.4,   IS:1.4,  ID:1.4,  RB:1.4,  SB:1.4 },
  "224cm": { JS:1,   JR:0.55, OD:0.55, HA:1, DR:0.95,   PA:1.45,   IS:1.45, ID:1.45, RB:1.45, SB:1.45 },
  "226cm": { JS:1,   JR:0.5,  OD:0.5,  HA:1, DR:0.95,   PA:1.5,   IS:1.5,  ID:1.5,  RB:1.5,  SB:1.5 },
  "229cm": { JS:1,   JR:0.45, OD:0.45, HA:1, DR:0.95,   PA:1.5,   IS:1.55, ID:1.55, RB:1.55, SB:1.55 }
};

const heightExceptions = {
  "JS (SF/PF)":  ["IS"],
};
const ratingLabels = {
  1:  "atrocious", 2:  "pitiful",   3:  "awful",     4:  "inept",
  5:  "mediocre",   6:  "average",   7:  "respectable",8:  "strong",
  9:  "proficient", 10: "prominent",11: "prolific",  12: "sensational",
  13: "tremendous", 14: "wondrous",  15: "marvelous", 16: "prodigious",
  17: "stupendous", 18: "phenomenal",19: "colossal",  20: "legendary",
  20: "legendary",  21: "legendary",  22: "legendary",  23: "legendary",
  24: "legendary",  25: "legendary",  26: "legendary",  27: "legendary",
  28: "legendary",  29: "legendary"

};
const ratingColors = {
  1:  '#000000', // ridículo — black
  2:  '#003399', // horrível — deep navy blue
  3:  '#1a40c2', // tenebroso — strong blue
  4:  '#3366cc', // desajeitado — medium blue
  5:  '#5a2a9a', // medíocre — muted purple
  6:  '#a03fd4', // comum — medium purple
  7:  '#c74ccc', // respeitável — pinkish purple
  8:  '#e53950', // forte — red
  9:  '#8b0000',  // dark red
  10: '#8b0000',  // dark red
  11: '#b02b26',
  12: '#d5554c',
  13: '#fa8072',  // light red
  14: '#FF8C00',  // dark orange
  15: '#C9B037',  // golden
  16: '#DAA520',  // darker golden
  17: '#9ACD32',  // yellowish green
  18: '#006400',  // dark green
  19: '#228B22',  // medium dark green
  20: '#32CD32',  // light green
  21: '#32CD32', 22: '#32CD32', 23: '#32CD32',
  24: '#32CD32', 25: '#32CD32', 26: '#32CD32',
  27: '#32CD32', 28: '#32CD32', 29: '#32CD32'
};



function getAgeCoefficient(age) {
  const table = {
    18:1.00, 19:0.95, 20:0.88, 21:0.8, 22:0.7, 23:0.65, 24:0.61,
    25:0.52, 26:0.43, 27:0.37, 28:0.28, 29:0.19, 30:0.13,
    31:0.1, 32:0.05, 33:0.03, 34:0.02, 35:0.01
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
    applyToAllWeeks: "Apply to all weeks:",
    // baseStats abbreviations will be left as-is, or add entries here to translate them:
    JS: "JS", JR: "JR", OD: "OD", HA: "HA", DR: "DR",
    PA: "PA", IS: "IS", ID: "ID", RB: "RB", SB: "SB",
  },
  pt: {
    Season:      "Temporada",
    Week:        "Semana",
    TrainingType:"Tipo de Treino",
    CoachLevel:  "Nível do Treinador",
    Name:        "Nome",
    Height:      "Altura",
    Age:         "Idade",
    applyToAllWeeks: "Aplicar à temporada:",
    JS: "Lan.", JR: "Dist.", OD: "Def. Ext.", HA: "Dri.", DR: "Pen.",
    PA: "Passe.", IS: "Lanç. Int.", ID: "Def. Int.", RB: "Ress.", SB: "Des."
  }
};

Object.assign(window.translations.en, {
  "JS (PG/SG)":      "JS (PG/SG)",
  "JS (SF/PF)":      "JS (SF/PF)",
  "JS (SG/SF)":      "JS (SG/SF)",
  "JS (team)":       "JS (team)",
  "JR (SG)":         "JR (SG)",
  "JR (PG)":         "JR (PG)",
  "JR (SG/SF)":      "JR (SG/SF)",
  "JR (team)":       "JR (team)",
  "OD (PG)":         "OD (PG)",
  "OD (PG/SG)":      "OD (PG/SG)",
  "OD(PG/SG/SF)":    "OD (PG/SG/SF)",
  "HA (PG)":         "HA (PG)",
  "HA (PG/SG)":      "HA (PG/SG)",
  "HA (PG/SG/SF)":   "HA (PG/SG/SF)",
  "1v1 (PG/SG)":     "1v1 (PG/SG)",
  "1v1 (SF/PF)":     "1v1 (SF/PF)",
  "1v1 (team)":      "1v1 (team)",
  "PA (PG)":         "PA (PG)",
  "PA (PG/SG)":      "PA (PG/SG)",
  "PA (team)":       "PA (team)",
  "IS (C)":          "IS (C)",
  "IS (PF/C)":       "IS (PF/C)",
  "IS (SF/PF/C)":    "IS (SF/PF/C)",
  "ID (C)":          "ID (C)",
  "ID (PF/C)":       "ID (PF/C)",
  "ID (SF/PF/C)":    "ID (SF/PF/C)",
  "RB (PF/C)":       "RB (PF/C)",
  "RB (team)":       "RB (team)",
  "SB (C)":          "SB (C)",
  "SB (PF/C)":       "SB (PF/C)",
  "SB (team)":       "SB (team)",
  "SeasonLabel":  "Season",
  "AgeLabel":     "Age",
  "WeekLabel":    "Week",
  ratingLabels: {
    1:  'atrocious',
    2:  'pitiful',
    3:  'awful',
    4:  'inept',
    5:  'mediocre',
    6:  'average',
    7:  'respectable',
    8:  'strong',
    9:  'proficient',
    10: 'prominent',
    11: 'prolific',
    12: 'sensational',
    13: 'tremendous',
    14: 'wondrous',
    15: 'marvelous',
    16: 'prodigious',
    17: 'stupendous',
    18: 'phenomenal',
    19: 'colossal',
    20: 'legendary',
    21: 'legendary',
    22: 'legendary',
    23: 'legendary',
    24: 'legendary',
    25: 'legendary',
    26: 'legendary',
    27: 'legendary',
    28: 'legendary',
    29: 'legendary',
  },
  potentialLabels: {
  "Speaker": "Speaker",
  "Reserva": "Benchwarmer",
  "Jogador útil": "Role Player",
  "6º Homem": "6th Man",
  "Titular": "Starter",
  "Estrela": "Star",
  "Super-estrela": "Allstar",
  "Vedeta": "Pereniall Allstar",
  "Super-vedeta": "Superstar",
  "MVP": "MVP",
  "Jogador Histórico": "Hall of Famer",
  "Melhor jogador de sempre": "Alltime great"
}
});

Object.assign(window.translations.pt, {
  "JS (PG/SG)":      "Lançamento (BP/BL)",
  "JS (SF/PF)":      "Lançamento (E/EP)",
  "JS (SG/SF)":      "Lançamento (BL/E)",
  "JS (team)":       "Lançamento (equipa)",
  "JR (SG)":         "Distância (BL)",
  "JR (PG)":         "Distância (BP)",
  "JR (SG/SF)":      "Distância (BL/E)",
  "JR (team)":       "Distância (equipa)",
  "OD (PG)":         "Defesa Ext. (BP)",
  "OD (PG/SG)":      "Defesa Ext. (BP/BL)",
  "OD(PG/SG/SF)":    "Defesa Ext. (BP/BL/E)",
  "HA (PG)":         "Drible (BP)",
  "HA (PG/SG)":      "Drible (BP/BL)",
  "HA (PG/SG/SF)":   "Drible (BP/BL/E)",
  "1v1 (PG/SG)":     "1v1 (BP/BL)",
  "1v1 (SF/PF)":     "1v1 (E/EP)",
  "1v1 (team)":      "1v1 (equipa)",
  "PA (PG)":         "Passe (BP)",
  "PA (PG/SG)":      "Passe (BP/BL)",
  "PA (team)":       "Passe (equipa)",
  "IS (C)":          "Lançamento Int. (P)",
  "IS (PF/C)":       "Lançamento Int. (EP/P)",
  "IS (SF/PF/C)":    "Lançamento Int. (E/EP/P)",
  "ID (C)":          "Defesa Int. (P)",
  "ID (PF/C)":       "Defesa Int. (EP/P)",
  "ID (SF/PF/C)":    "Defesa Int. (E/EP/P)",
  "RB (PF/C)":       "Ressaltos (EP/P)",
  "RB (team)":       "Ressaltos (equipa)",
  "SB (C)":          "Desarme (P)",
  "SB (PF/C)":       "Desarme (EP/P)",
  "SB (team)":       "Desarme (equipa)",
  "SeasonLabel":  "Temporada",
  "AgeLabel":     "Idade",
  "WeekLabel":    "Semana",
  ratingLabels: {
    1:  'rídiculo',
    2:  'horrível',
    3:  'tenebroso',
    4:  'desajeitado',
    5:  'medíocre',
    6:  'comum',
    7:  'respeitável',
    8:  'forte',
    9:  'impressionante',
    10: 'admirável',
    11: 'excecional',
    12: 'sensacional',
    13: 'extraordinário',
    14: 'fantástico',
    15: 'maravilhoso',
    16: 'incrível',
    17: 'estupendo',
    18: 'fenomenal',
    19: 'colossal',
    20: 'lendário',
    21: 'lendário',
    22: 'lendário',
    23: 'lendário',
    24: 'lendário',
    25: 'lendário',
    26: 'lendário',
    27: 'lendário',
    28: 'lendário',
    29: 'lendário',
  },
  potentialLabels: {
  "Speaker": "Speaker",
  "Reserva": "Reserva",
  "Jogador útil": "Jogador útil",
  "6º Homem": "6º Homem",
  "Titular": "Titular",
  "Estrela": "Estrela",
  "Super-estrela": "Super-estrela",
  "Vedeta": "Vedeta",
  "Super-vedeta": "Super-vedeta",
  "MVP": "MVP",
  "Jogador Histórico": "Jogador Histórico",
  "Melhor jogador de sempre": "Melhor jogador de sempre"
}
});

function renderPlayerOverview(name, age, playerStats, skillPoints) {
  // sync header
  document.getElementById("playerNameHeader").textContent = `${name}, ${age}`;

  // each stat
  const outsideStats = ['JS','JR','OD','HA','DR','PA'];
  const insideStats  = ['IS','ID','RB','SB'];
  baseStats.forEach(st => {
    let v = Math.round(playerStats[st]);
    v = Math.max(1, Math.min(20, v));
    const lbl = ratingLabels[v];
    const col = ratingColors[v];
    const el  = document.getElementById(`stat${st}`);
    el.textContent = `${lbl} (${v})`;
    el.style.color = col;
  });

  // total skill‐points line
  document.getElementById("skillPointsTotal").textContent =
    `${skillPoints.total} (${skillPoints.outside}|${skillPoints.inside})`;
}

function simulateTraining() {
  // ——————————————————————————
  // 0) Gather common inputs
  // ——————————————————————————
  const coachCoefficient = parseFloat(document.getElementById("coachQuality").value);
  const playerStats = {};
  baseStats.forEach(stat => {
    playerStats[stat] = parseFloat(document.getElementById(stat).value) || 0;
  });
  const playerName    = document.getElementById("playerName").value;
  const heightValue   = document.getElementById("height").value;
  const heightMap     = heightMultipliers[ heightValue ] || {};
  const currentHeight = parseInt(heightValue.replace("cm",""), 10);

  // ——————————————————————————
  // 1) Run through each season/week and apply all gains
  // ——————————————————————————
  for (let s = 1; s <= seasonCount; s++) {
    const selects = document.querySelectorAll(`#seasonBody${s} .training-select`);
    const age     = parseInt(document.getElementById(`seasonAge${s}`).value, 10);
    const ageCoef = getAgeCoefficient(age);

    selects.forEach(select => {
      const effect = trainingEffects[select.value];
      if (!effect) return;

      // compute base + decay
      const relevantStats = Object.keys(effect);
      const flatAverage   = relevantStats.reduce((sum, st) => sum + playerStats[st], 0) / relevantStats.length;
      const gains = {};
      for (let st of relevantStats) {
        const baseGain    = effect[st] * ageCoef * coachCoefficient;
        const decayFactor = Math.pow(0.965, playerStats[st] - flatAverage);
        gains[st] = baseGain * decayFactor;
      }

      // height multiplier (with your IS bump)
      for (let st in gains) {
        let mult = heightMap[st] || 1;
        if (st === "IS" && currentHeight >= 201) {
          mult = 1.05;
        }
        gains[st] *= mult;
      }

      // elastic interactions
      for (let st in gains) {
        for (let key in elasticEffects) {
          const [b,t] = key.split("->");
          if (b === st && playerStats[t] > playerStats[b]) {
            const diff = playerStats[t] - playerStats[b];
            gains[b] += gains[b] * (diff * elasticEffects[key]);
          }
        }
      }

      // penalty & apply
      for (let st in gains) {
        if (playerStats[st] >= 16) gains[st] *= 0.8;
        playerStats[st] += gains[st];
      }
    });
  }

  // ——————————————————————————
  // 2) Update the “after training” table
  // ——————————————————————————
  const resultRow = document.getElementById("resultRow");
  resultRow.innerHTML = `<td>${playerName}</td>` +
    baseStats.map(st => `<td>${playerStats[st].toFixed(2)}</td>`).join("");

  // ——————————————————————————
  // 3) Sync into your Player‐Overview panel
  // ——————————————————————————

  // 3a) grab localized rating‐labels
  const lang   = window.currentLang || localStorage.getItem('lang') || 'en';
  const labels = window.translations[lang].ratingLabels;
  const colors = ratingColors;

  // 3b) per‐stat display (rounded up + label)
  baseStats.forEach(st => {
    const el = document.getElementById(`stat${st}`);
    if (!el) return;

    const raw     = playerStats[st];
    const rounded = Math.min(29, Math.max(1, Math.ceil(raw)));
    const label   = labels[rounded] || '';
    const color   = colors[rounded] || "#000";
    el.innerHTML = `<span style="font-weight: 500; color: ${color};">${label}</span> (${rounded})`;
  });

  // 3c) recompute outside / inside / total skill points
  const outsideKeys = ['JS','JR','OD','HA','DR','PA'];
  const insideKeys  = ['IS','ID','RB','SB'];
  const outsideSum  = outsideKeys.reduce((sum,k) => sum + playerStats[k], 0);
  const insideSum   = insideKeys .reduce((sum,k) => sum + playerStats[k], 0);
  const outsideCeil = Math.ceil(outsideSum);
  const insideCeil  = Math.ceil(insideSum);
  const totalCeil   = outsideCeil + insideCeil;

  const totalEl = document.getElementById('skillPointsTotal');
  if (totalEl) {
    totalEl.textContent = `${totalCeil} (${outsideCeil}|${insideCeil})`;
  }

  // 3d) name sync
  const nameHeader = document.getElementById('playerNameHeader');
  if (nameHeader) nameHeader.textContent = playerName;

  // 3e) age sync from last season (or base input if no seasons)
  let finalAge = parseInt(document.getElementById('playerAge').value, 10);
  if (seasonCount > 0) {
    const lastAgeEl = document.getElementById(`seasonAge${seasonCount}`);
    if (lastAgeEl) finalAge = parseInt(lastAgeEl.value, 10);
  }
  const ageEl = document.getElementById('playerAgeOverview');
  if (ageEl) ageEl.textContent = finalAge;

  // 3f) height sync
  const heightEl = document.getElementById('playerHeightOverview');
  if (heightEl) heightEl.textContent = heightValue;

  // 3g) potential sync
  const potDropdown = document.getElementById("potential");
  const potentialEl = document.getElementById("playerPotentialOverview");
  if (potDropdown && potentialEl) {
    const selectedOption = potDropdown.options[potDropdown.selectedIndex];
    potentialEl.textContent = selectedOption ? selectedOption.textContent : "--";
  }
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

  // grab current lang & its dictionary
  const lang = localStorage.getItem('lang') || 'en';
  const t    = window.translations[lang];

  // build options list with translated labels
  const opts = Object.keys(trainingEffects)
    .map(key => {
      const label = window.translations[lang][key] || key;
      return `<option value="${key}">${label}</option>`;
    })
    .join("");
  const weekOpts  = `<option value="">-- ${t.TrainingType} --</option>${opts}`;
  const applyOpts = `<option value="">-- ${t.TrainingType} --</option>${opts}`;

  div.innerHTML = `
  <ul class="collapsible">
    <li>
      <div class="collapsible-header"><strong>${t.SeasonLabel} ${seasonCount}</strong></div>
      <div class="collapsible-body">
        <div class="input-field">
          <span>${t.AgeLabel}:</span>
          <input
            type="number"
            id="seasonAge${seasonCount}"
            class="season-age-input"
            value="${baseAge + (seasonCount - 1)}">
        </div>
        <div class="input-field">
          <span>${t.applyToAllWeeks}</span>
          <select id="seasonApplyAll${seasonCount}" class="apply-all-select">
            ${applyOpts}
          </select>
          <button
            class="btn green"
            data-i18n="applyButton"
            onclick="applyTrainingToSeason(${seasonCount})">
            ${t.applyButton}
          </button>
        </div>
        <table class="highlight">
          <thead>
            <tr>
              <th>${t.WeekLabel}</th>
              <th>${t.TrainingType}</th>
            </tr>
          </thead>
          <tbody id="seasonBody${seasonCount}">
            ${Array.from({ length: 14 }, (_, i) => `
              <tr>
                <td>${t.WeekLabel} ${i + 1}</td>
                <td>
                  <select class="training-select">
                    ${weekOpts}
                  </select>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </li>
  </ul>
`;


  container.appendChild(div);

  const elems = div.querySelectorAll(".collapsible");
  const instances = M.Collapsible.init(elems);
  if (instances.length > 0) {
    instances[0].open(0);
  }

  // re-initialize all selects and listeners
  M.FormSelect.init(div.querySelectorAll("select"));
  div.querySelectorAll(".training-select")
     .forEach(sel => sel.addEventListener("change", simulateTraining));
  const ageInput = div.querySelector(`#seasonAge${seasonCount}`);
  if (ageInput) ageInput.addEventListener("change", simulateTraining);

  ageInput.addEventListener("change", () => {
         document.getElementById("playerAge").value = ageInput.value;
          simulateTraining();
        });

  // translate newly inserted nodes
  setLanguage(lang);
}


function removeSeason() {
  if (seasonCount === 0) return;
  const last = document.getElementById(`season${seasonCount}`);
  if (last) last.remove();
  seasonCount--;
}


function populateStaticDropdowns() {
  const h = document.getElementById("height"),
        p = document.getElementById("potential");

  if (h) {
    h.innerHTML = heightOptions.map(x => `<option value="${x}">${x}</option>`).join("");
    h.value = "185cm";
    h.addEventListener("change", simulateTraining);
  }
  if (p) {
   const lang = localStorage.getItem('lang') || 'en';
    const t = window.translations[lang];
    p.innerHTML = potentialOptions.map(opt =>
      `<option value="${opt}">${t.potentialLabels[opt] || opt}</option>`
    ).join("");

    p.value = "MVP";
  }

  setTimeout(() => {
    M.FormSelect.init(h);
    M.FormSelect.init(p);
  }, 0);
}

window.addEventListener("DOMContentLoaded", () => {
  // 0) Collapsible panels (if you have any)
  M.Collapsible.init(document.querySelectorAll('.collapsible'));

  // 1) Populate height & potential dropdowns
  populateStaticDropdowns();

  // 2) Initialize ALL selects (coachQuality, height, potential, any season selects later)
  M.FormSelect.init(document.querySelectorAll('select'));
 


  // 3) Base‐stat inputs: JS, JR, … SB
  baseStats.forEach(stat => {
    const el = document.getElementById(stat);
    if (el) el.addEventListener("input", simulateTraining);
  });

  // 4) Player name
  const nameEl = document.getElementById("playerName");
  if (nameEl) nameEl.addEventListener("input", simulateTraining);

  // 5) Player age → mirror into all season‐ages
  const ageEl = document.getElementById("playerAge");
  if (ageEl) {
    ageEl.addEventListener("change", () => {
      const v = ageEl.value;
      document.querySelectorAll(".season-age-input")
              .forEach(el => el.value = v);
      simulateTraining();
    });
  }  // ← make sure this brace is here!

  // 6) Height & Potential
  const heightEl = document.getElementById("height");
  if (heightEl) heightEl.addEventListener("change", simulateTraining);
  const potEl = document.getElementById("potential");
  if (potEl) potEl.addEventListener("change", simulateTraining);

  // 7) Coach quality
  const cq = document.getElementById("coachQuality");
  if (cq) cq.addEventListener("change", simulateTraining);

  // 8) Kick off initial simulation
  simulateTraining();
});  // ← make sure this closes the DOMContentLoaded



function exportTrainingPlan() {
  const lang = localStorage.getItem('lang') || 'en';
  const t    = translations[lang];

  if (seasonCount === 0) {
    alert(
      `${t.TrainingType} – ${t.Week}: ` +
      (lang === 'pt'
        ? "pelo menos uma semana deve ter treino"
        : "at least one week must have training")
    );
    return;
  }

  // Re-run simulation to ensure stats are updated
  simulateTraining();

  const coachSelect      = document.getElementById("coachQuality");
  const coachLevelLabel  = coachSelect.options[coachSelect.selectedIndex].text;
  const coachCoefficient = parseFloat(coachSelect.value);
  const height           = document.getElementById("height").value;
  const playerName       = document.getElementById("playerName").value;

  // Sheet 1: Training Plan
  const seasonPlan = [
    [ t.Season, t.Week, t.TrainingType, t.CoachLevel, t.Name ]
  ];
  const trainingData = [];

  for (let s = 1; s <= seasonCount; s++) {
    const age     = parseInt(document.getElementById(`seasonAge${s}`).value, 10);
    const selects = document.querySelectorAll(`#seasonBody${s} .training-select`);
    selects.forEach((sel, i) => {
      const training = sel.value;
      if (!training) return;
      seasonPlan.push([
        `${t.Season} ${s}`,
        `${t.Week} ${i + 1}`,
        window.translations[lang][training] || training,
        coachLevelLabel,
        playerName
      ]);
      trainingData.push({ season: s, week: i + 1, training, age });
    });
  }

  // Sheet 2: Stat Progress
  const weeklyStats = [[
    t.Season, t.Week, t.Name, t.Height, t.Age,
    ...baseStats.map(st => t[st] || st),
    "Skill Points"
  ]];

  const playerStats = {};
  baseStats.forEach(st => {
    playerStats[st] = parseFloat(document.getElementById(st).value) || 0;
  });
  const heightMap = heightMultipliers[height] || {};

  trainingData.forEach(({ season, week, training, age }) => {
    const ageCoef = getAgeCoefficient(age);
    const effect  = trainingEffects[training];
    if (!effect) return;

    const relevant = Object.keys(effect);
    const flatAvg  = relevant.reduce((sum, st) => sum + playerStats[st], 0) / relevant.length;
    const gains    = {};

    for (let st of relevant) {
      const baseGain    = effect[st] * ageCoef * coachCoefficient;
      const decayFactor = Math.pow(0.965, playerStats[st] - flatAvg);
      gains[st] = baseGain * decayFactor;
    }

    for (let st in gains) {
      for (let key in elasticEffects) {
        const [b,tgt] = key.split("->");
        if (b === st && playerStats[tgt] > playerStats[b]) {
          const diff = playerStats[tgt] - playerStats[b];
          gains[b] += gains[b] * (diff * elasticEffects[key]);
        }
      }
    }

    for (let st in gains) {
      gains[st] *= (heightMap[st] || 1);
    }

    for (let st in gains) {
      if (playerStats[st] >= 16) gains[st] *= 0.8;
      playerStats[st] += gains[st];
    }

    // Skill points total
    const outsideKeys = ['JS','JR','OD','HA','DR','PA'];
    const insideKeys  = ['IS','ID','RB','SB'];
    const outsideSum  = outsideKeys.reduce((sum,k) => sum + playerStats[k], 0);
    const insideSum   = insideKeys.reduce((sum,k) => sum + playerStats[k], 0);
    const totalSkill  = Math.ceil(outsideSum + insideSum);

    weeklyStats.push([
      `${t.Season} ${season}`,
      `${t.Week} ${week}`,
      playerName,
      height,
      age,
      ...baseStats.map(st => playerStats[st].toFixed(2)),
      totalSkill
    ]);
  });

  const wb  = XLSX.utils.book_new();
  const ws1 = XLSX.utils.aoa_to_sheet(seasonPlan);
  const ws2 = XLSX.utils.aoa_to_sheet(weeklyStats);

  ws1['!freeze'] = { xSplit:0, ySplit:1 };
  ws2['!freeze'] = { xSplit:0, ySplit:1 };

  [ws1, ws2].forEach(ws => {
    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const hdr = ws[XLSX.utils.encode_cell({r:0,c:C})];
      if (hdr) hdr.s = {
        font:      { bold:true },
        alignment: { horizontal:"center", vertical:"center" }
      };
    }
    const cols = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let mx = 10;
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cell = ws[XLSX.utils.encode_cell({r:R,c:C})];
        if (cell && cell.v != null) {
          mx = Math.max(mx, cell.v.toString().length);
          if (R > 0) cell.s = { alignment:{ horizontal:"center", vertical:"center" }};
        }
      }
      cols.push({ wch: mx + 2 });
    }
    ws["!cols"] = cols;
  });

  XLSX.utils.book_append_sheet(wb, ws1, lang === 'pt' ? "Plano de Treino" : "Training Plan");
  XLSX.utils.book_append_sheet(wb, ws2, lang === 'pt' ? "Progresso Semanal" : "Weekly Progress");

  const safeName = playerName.replace(/\s+/g, '_');
  XLSX.writeFile(wb, `Training_Plan_${safeName}_${lang}.xlsx`);
}

function exportPlayerOverviewCard() {
  const accordionItem = document.querySelector('#playerOverviewAccordion li');
  if (!accordionItem) {
    alert("Player overview not found.");
    return;
  }

  const lang = localStorage.getItem('lang') || 'en';
  const t = i18n[lang];

  const isOpen = accordionItem.classList.contains('active');
  if (!isOpen) {
    alert(t.collapsedExportWarning);
    return;
  }

  const clone = accordionItem.cloneNode(true);
  clone.style.padding = '20px';
  clone.style.background = '#fff';
  clone.style.width = accordionItem.offsetWidth + 'px';
  clone.classList.add('active');
  clone.querySelector('.collapsible-body').style.display = 'block';

  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.top = '-9999px';
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  html2canvas(clone, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#fff'
  }).then(canvas => {
    const link = document.createElement('a');
    const playerName = document.getElementById("playerNameHeader")?.textContent?.trim() || "player";
    link.download = `${playerName.replace(/\s+/g, '_')}_overview.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    wrapper.remove();
  }).catch(err => {
    console.error("html2canvas failed:", err);
  });
}








