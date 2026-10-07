import React, { useState, useEffect } from 'react';
import { Sparkles, Shield, Calculator, RefreshCw, Layers } from 'lucide-react';

// Official Hexa Cost Tables
const STANDARD_SKILL_COSTS: Record<number, { erda: number; frags: number }> = {
  1: { erda: 0, frags: 0 }, 2: { erda: 1, frags: 30 }, 3: { erda: 1, frags: 35 }, 4: { erda: 1, frags: 40 }, 5: { erda: 1, frags: 45 },
  6: { erda: 1, frags: 50 }, 7: { erda: 1, frags: 55 }, 8: { erda: 1, frags: 60 }, 9: { erda: 2, frags: 65 }, 10: { erda: 5, frags: 200 },
  11: { erda: 1, frags: 80 }, 12: { erda: 1, frags: 90 }, 13: { erda: 1, frags: 100 }, 14: { erda: 1, frags: 110 }, 15: { erda: 1, frags: 120 },
  16: { erda: 1, frags: 130 }, 17: { erda: 1, frags: 140 }, 18: { erda: 1, frags: 150 }, 19: { erda: 2, frags: 160 }, 20: { erda: 8, frags: 350 },
  21: { erda: 2, frags: 170 }, 22: { erda: 2, frags: 180 }, 23: { erda: 2, frags: 190 }, 24: { erda: 2, frags: 200 }, 25: { erda: 2, frags: 210 },
  26: { erda: 2, frags: 220 }, 27: { erda: 2, frags: 230 }, 28: { erda: 2, frags: 240 }, 29: { erda: 3, frags: 250 }, 30: { erda: 10, frags: 500 },
};

const SOL_JANUS_COSTS: Record<number, { erda: number; frags: number }> = {
  1: { erda: 7, frags: 125 }, 2: { erda: 2, frags: 38 }, 3: { erda: 2, frags: 44 }, 4: { erda: 2, frags: 50 }, 5: { erda: 2, frags: 57 },
  6: { erda: 2, frags: 63 }, 7: { erda: 2, frags: 69 }, 8: { erda: 2, frags: 75 }, 9: { erda: 4, frags: 82 }, 10: { erda: 10, frags: 250 },
  11: { erda: 2, frags: 100 }, 12: { erda: 2, frags: 113 }, 13: { erda: 2, frags: 125 }, 14: { erda: 2, frags: 138 }, 15: { erda: 2, frags: 150 },
  16: { erda: 2, frags: 163 }, 17: { erda: 2, frags: 175 }, 18: { erda: 2, frags: 188 }, 19: { erda: 4, frags: 200 }, 20: { erda: 16, frags: 438 },
  21: { erda: 3, frags: 213 }, 22: { erda: 3, frags: 225 }, 23: { erda: 3, frags: 238 }, 24: { erda: 3, frags: 250 }, 25: { erda: 3, frags: 263 },
  26: { erda: 3, frags: 275 }, 27: { erda: 3, frags: 288 }, 28: { erda: 3, frags: 300 }, 29: { erda: 5, frags: 313 }, 30: { erda: 20, frags: 625 },
};

const SOL_HECATE_COSTS: Record<number, { erda: number; frags: number }> = {
  1: { erda: 7, frags: 170 }, 2: { erda: 2, frags: 52 }, 3: { erda: 2, frags: 60 }, 4: { erda: 2, frags: 68 }, 5: { erda: 2, frags: 77 },
  6: { erda: 2, frags: 86 }, 7: { erda: 2, frags: 94 }, 8: { erda: 2, frags: 102 }, 9: { erda: 4, frags: 112 }, 10: { erda: 10, frags: 340 },
  11: { erda: 2, frags: 136 }, 12: { erda: 2, frags: 154 }, 13: { erda: 2, frags: 170 }, 14: { erda: 2, frags: 188 }, 15: { erda: 2, frags: 204 },
  16: { erda: 2, frags: 222 }, 17: { erda: 2, frags: 238 }, 18: { erda: 2, frags: 256 }, 19: { erda: 4, frags: 272 }, 20: { erda: 16, frags: 598 },
  21: { erda: 3, frags: 290 }, 22: { erda: 3, frags: 307 }, 23: { erda: 3, frags: 324 }, 24: { erda: 3, frags: 341 }, 25: { erda: 3, frags: 359 },
  26: { erda: 3, frags: 375 }, 27: { erda: 3, frags: 393 }, 28: { erda: 3, frags: 409 }, 29: { erda: 5, frags: 427 }, 30: { erda: 20, frags: 853 },
};

// Class Specific Hexa Node Definitions (Mirroring Subluxe/Stiff Sheet)
interface ClassPreset {
  className: string;
  skills: {
    name: string;
    type: 'origin' | 'mastery' | 'boost' | 'common';
    costType: 'standard' | 'sol_janus' | 'sol_hecate';
    iconUrl: string;
  }[];
}

const CLASS_PRESETS: Record<string, ClassPreset> = {
  "Demon Slayer": {
    className: "Demon Slayer",
    skills: [
      { name: "Nightmare", type: "origin", costType: "standard", iconUrl: "https://maplestory.io/api/GMS/250/job/3112/icon" },
      { name: "HEXA Demon Impact", type: "mastery", costType: "standard", iconUrl: "https://maplestory.io/api/GMS/250/item/2430000/icon" },
      { name: "HEXA Demon Lash", type: "mastery", costType: "standard", iconUrl: "https://maplestory.io/api/GMS/250/item/2430000/icon" },
      { name: "HEXA Dark Metamorphosis / Demon Cry", type: "mastery", costType: "standard", iconUrl: "https://maplestory.io/api/GMS/250/item/2430000/icon" },
      { name: "HEXA Cerberus Chomp / Demonic Descent", type: "mastery", costType: "standard", iconUrl: "https://maplestory.io/api/GMS/250/item/2430000/icon" },
      { name: "Demon Awakening", type: "boost", costType: "standard", iconUrl: "https://maplestory.io/api/GMS/250/item/2430000/icon" },
      { name: "Spirit of Rage", type: "boost", costType: "standard", iconUrl: "https://maplestory.io/api/GMS/250/item/2430000/icon" },
      { name: "Orthrus", type: "boost", costType: "standard", iconUrl: "https://maplestory.io/api/GMS/250/item/2430000/icon" },
      { name: "Demon Bane", type: "boost", costType: "standard", iconUrl: "https://maplestory.io/api/GMS/250/item/2430000/icon" },
      { name: "Sol Janus : Dawn / Twilight", type: "common", costType: "sol_janus", iconUrl: "https://maplestory.io/api/GMS/250/item/2430000/icon" },
      { name: "Sol Hecate", type: "common", costType: "sol_hecate", iconUrl: "https://maplestory.io/api/GMS/250/item/2430000/icon" },
    ]
  },
  "Adele": {
    className: "Adele",
    skills: [
      { name: "Maestro", type: "origin", costType: "standard", iconUrl: "https://maplestory.io/api/GMS/250/job/15112/icon" },
      { name: "HEXA Cleave / Magic Dispatch / Aetherial Arms", type: "mastery", costType: "standard", iconUrl: "https://maplestory.io/api/GMS/250/item/2430000/icon" },
      { name: "HEXA Hunting Decree / HEXA Plummet", type: "mastery", costType: "standard", iconUrl: "https://maplestory.io/api/GMS/250/item/2430000/icon" },
      { name: "Ruin", type: "boost", costType: "standard", iconUrl: "https://maplestory.io/api/GMS/250/item/2430000/icon" },
      { name: "Infinity Blade", type: "boost", costType: "standard", iconUrl: "https://maplestory.io/api/GMS/250/item/2430000/icon" },
      { name: "Legacy Restoration", type: "boost", costType: "standard", iconUrl: "https://maplestory.io/api/GMS/250/item/2430000/icon" },
      { name: "Storm", type: "boost", costType: "standard", iconUrl: "https://maplestory.io/api/GMS/250/item/2430000/icon" },
      { name: "Sol Janus : Dawn / Twilight", type: "common", costType: "sol_janus", iconUrl: "https://maplestory.io/api/GMS/250/item/2430000/icon" },
    ]
  },
  "Night Lord": {
    className: "Night Lord",
    skills: [
      { name: "Life and Death", type: "origin", costType: "standard", iconUrl: "https://maplestory.io/api/GMS/250/job/412/icon" },
      { name: "HEXA Quad Star", type: "mastery", costType: "standard", iconUrl: "https://maplestory.io/api/GMS/250/item/2430000/icon" },
      { name: "HEXA Mark of Night Lord", type: "mastery", costType: "standard", iconUrl: "https://maplestory.io/api/GMS/250/item/2430000/icon" },
      { name: "Spread Throw", type: "boost", costType: "standard", iconUrl: "https://maplestory.io/api/GMS/250/item/2430000/icon" },
      { name: "Shurrikane", type: "boost", costType: "standard", iconUrl: "https://maplestory.io/api/GMS/250/item/2430000/icon" },
      { name: "Dark Lord's Omen", type: "boost", costType: "standard", iconUrl: "https://maplestory.io/api/GMS/250/item/2430000/icon" },
      { name: "Throwing Star Barrage", type: "boost", costType: "standard", iconUrl: "https://maplestory.io/api/GMS/250/item/2430000/icon" },
      { name: "Sol Janus : Dawn / Twilight", type: "common", costType: "sol_janus", iconUrl: "https://maplestory.io/api/GMS/250/item/2430000/icon" },
    ]
  },
  "Hero": {
    className: "Hero",
    skills: [
      { name: "Ascendant Shadow", type: "origin", costType: "standard", iconUrl: "https://maplestory.io/api/GMS/250/job/112/icon" },
      { name: "HEXA Raging Blow", type: "mastery", costType: "standard", iconUrl: "https://maplestory.io/api/GMS/250/item/2430000/icon" },
      { name: "HEXA Puncture / Beam Blade", type: "mastery", costType: "standard", iconUrl: "https://maplestory.io/api/GMS/250/item/2430000/icon" },
      { name: "Burning Soul Blade", type: "boost", costType: "standard", iconUrl: "https://maplestory.io/api/GMS/250/item/2430000/icon" },
      { name: "Worldreaver", type: "boost", costType: "standard", iconUrl: "https://maplestory.io/api/GMS/250/item/2430000/icon" },
      { name: "Combo Instinct", type: "boost", costType: "standard", iconUrl: "https://maplestory.io/api/GMS/250/item/2430000/icon" },
      { name: "Sword of Burning Soul", type: "boost", costType: "standard", iconUrl: "https://maplestory.io/api/GMS/250/item/2430000/icon" },
      { name: "Sol Janus : Dawn / Twilight", type: "common", costType: "sol_janus", iconUrl: "https://maplestory.io/api/GMS/250/item/2430000/icon" },
    ]
  }
};

interface ActiveNode {
  id: string;
  name: string;
  type: string;
  costType: 'standard' | 'sol_janus' | 'sol_hecate';
  current: number;
  target: number;
  iconUrl: string;
}

export default function App() {
  const [selectedClass, setSelectedClass] = useState<string>("Demon Slayer");
  const [fragsPerHour, setFragsPerHour] = useState<number>(15);
  const [activeNodes, setActiveNodes] = useState<ActiveNode[]>([]);

  // Load selected class nodes into spreadsheet state
  useEffect(() => {
    const preset = CLASS_PRESETS[selectedClass] || CLASS_PRESETS["Demon Slayer"];
    const savedLevels = localStorage.getItem(`gms_hexa_sheet_${selectedClass}`);
    const parsedLevels = savedLevels ? JSON.parse(savedLevels) : {};

    const nodes: ActiveNode[] = preset.skills.map((s, idx) => ({
      id: `${selectedClass}_${idx}`,
      name: s.name,
      type: s.type,
      costType: s.costType,
      current: parsedLevels[s.name]?.current ?? (s.type === 'origin' || idx === 1 ? 1 : 0),
      target: parsedLevels[s.name]?.target ?? 30,
      iconUrl: s.iconUrl
    }));

    setActiveNodes(nodes);
  }, [selectedClass]);

  // Persist node level updates
  const updateNodeLevel = (name: string, field: 'current' | 'target', value: number) => {
    const updated = activeNodes.map(n => n.name === name ? { ...n, [field]: value } : n);
    setActiveNodes(updated);

    const levelMap: Record<string, { current: number; target: number }> = {};
    updated.forEach(n => levelMap[n.name] = { current: n.current, target: n.target });
    localStorage.setItem(`gms_hexa_sheet_${selectedClass}`, JSON.stringify(levelMap));
  };

  // Compute Fragment & Sol Erda Totals (Spent, Left, Total)
  let totalSpentFrags = 0;
  let totalLeftFrags = 0;
  let totalSpentErda = 0;
  let totalLeftErda = 0;

  activeNodes.forEach(node => {
    const costTable = node.costType === 'sol_janus' ? SOL_JANUS_COSTS : node.costType === 'sol_hecate' ? SOL_HECATE_COSTS : STANDARD_SKILL_COSTS;
    
    // Spent calculation
    for (let l = 1; l <= node.current; l++) {
      if (costTable[l]) {
        totalSpentFrags += costTable[l].frags;
        totalSpentErda += costTable[l].erda;
      }
    }
    // Remaining calculation
    for (let l = node.current + 1; l <= node.target; l++) {
      if (costTable[l]) {
        totalLeftFrags += costTable[l].frags;
        totalLeftErda += costTable[l].erda;
      }
    }
  });

  const grandTotalFrags = totalSpentFrags + totalLeftFrags;
  const grandTotalErda = totalSpentErda + totalLeftErda;
  const progressPercent = grandTotalFrags > 0 ? ((totalSpentFrags / grandTotalFrags) * 100).toFixed(2) : "0.00";
  const hoursLeft = fragsPerHour > 0 ? (totalLeftFrags / fragsPerHour).toFixed(1) : "0.0";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <header className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 flex flex-wrap justify-between items-center gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-amber-400" />
            <div>
              <h1 className="text-xl font-bold text-amber-400">HEXA Matrix Progress Tracker</h1>
              <p className="text-xs text-slate-400">GMS Interactive Spreadsheet Engine</p>
            </div>
          </div>

          {/* Class Dropdown Selector */}
          <div className="flex items-center gap-3 bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400 font-semibold uppercase">Select Class:</span>
            <select 
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-bold text-amber-300 focus:outline-none focus:border-amber-400"
            >
              {Object.keys(CLASS_PRESETS).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </header>

        {/* Dashboard Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400">Fragments Progress</p>
            <p className="text-xl font-bold text-amber-400 mt-1">{totalSpentFrags.toLocaleString()} / {grandTotalFrags.toLocaleString()}</p>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400">Sol Erda Progress</p>
            <p className="text-xl font-bold text-indigo-400 mt-1">{totalSpentErda} / {grandTotalErda}</p>
            <p className="text-xs text-indigo-300/70 mt-1">{totalLeftErda} Sol Erda Remaining</p>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400">Total Completion</p>
            <p className="text-xl font-bold text-emerald-400 mt-1">{progressPercent}%</p>
            <p className="text-xs text-emerald-300/70 mt-1">{totalLeftFrags.toLocaleString()} Frags Left</p>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400">Estimated Training Time</p>
            <div className="flex items-center gap-2 mt-1">
              <input 
                type="number" 
                value={fragsPerHour} 
                onChange={e => setFragsPerHour(Number(e.target.value))}
                className="bg-slate-950 border border-slate-700 text-xs w-14 rounded px-2 py-1 text-center"
              />
              <span className="text-xs text-slate-400">Frags/Hr = </span>
              <span className="text-lg font-bold text-purple-400">{hoursLeft} hrs</span>
            </div>
          </div>
        </div>

        {/* Spreadsheet Data Table */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-800/80 text-slate-400 border-b border-slate-700">
                  <th className="p-3">Skill Core</th>
                  <th className="p-3 text-center">Type</th>
                  <th className="p-3 text-center">Current</th>
                  <th className="p-3 text-center">Desired</th>
                  <th className="p-3 text-right">Frags Spent</th>
                  <th className="p-3 text-right">Frags Left</th>
                  <th className="p-3 text-right">Erda Spent</th>
                  <th className="p-3 text-right">Erda Left</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {activeNodes.map(node => {
                  const costTable = node.costType === 'sol_janus' ? SOL_JANUS_COSTS : node.costType === 'sol_hecate' ? SOL_HECATE_COSTS : STANDARD_SKILL_COSTS;
                  let spentF = 0, leftF = 0, spentE = 0, leftE = 0;

                  for (let l = 1; l <= node.current; l++) {
                    if (costTable[l]) { spentF += costTable[l].frags; spentE += costTable[l].erda; }
                  }
                  for (let l = node.current + 1; l <= node.target; l++) {
                    if (costTable[l]) { leftF += costTable[l].frags; leftE += costTable[l].erda; }
                  }

                  const isMaxed = node.current >= node.target;

                  return (
                    <tr key={node.id} className={`hover:bg-slate-800/50 transition ${isMaxed ? 'bg-emerald-950/20' : ''}`}>
                      <td className="p-3 font-medium text-slate-200 flex items-center gap-2">
                        <img src={node.iconUrl} alt="Skill Icon" className="w-6 h-6 rounded bg-slate-950 p-0.5 border border-slate-700" />
                        <span>{node.name}</span>
                      </td>
                      <td className="p-3 text-center capitalize">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          node.type === 'origin' ? 'bg-amber-900/50 text-amber-300 border border-amber-700/50' :
                          node.type === 'mastery' ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-700/50' :
                          node.type === 'common' ? 'bg-purple-900/50 text-purple-300 border border-purple-700/50' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {node.type}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <input 
                          type="number" min="0" max="30"
                          value={node.current}
                          onChange={e => updateNodeLevel(node.name, 'current', Number(e.target.value))}
                          className="bg-slate-950 border border-slate-700 rounded w-12 text-center py-1 text-xs font-bold text-amber-300 focus:border-amber-400"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input 
                          type="number" min="0" max="30"
                          value={node.target}
                          onChange={e => updateNodeLevel(node.name, 'target', Number(e.target.value))}
                          className="bg-slate-950 border border-slate-700 rounded w-12 text-center py-1 text-xs font-bold text-slate-300 focus:border-amber-400"
                        />
                      </td>
                      <td className="p-3 text-right font-mono text-slate-400">{spentF.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono text-amber-400 font-bold">{leftF.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono text-slate-400">{spentE}</td>
                      <td className="p-3 text-right font-mono text-indigo-400 font-bold">{leftE}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          isMaxed ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {isMaxed ? 'MAXED' : 'IN PROGRESS'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
