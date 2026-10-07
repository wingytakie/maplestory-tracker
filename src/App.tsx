import React, { useState, useEffect } from 'react';
import { Sparkles, Shield, Search } from 'lucide-react';
import classDatabase from './data/classData.json';

// Standard Hexa Matrix Cost Tables
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

interface ActiveNode {
  id: string;
  name: string;
  type: string;
  costType: string;
  current: number;
  target: number;
  iconUrl: string;
}

export default function App() {
  const [selectedClass, setSelectedClass] = useState<string>("Hero");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [fragsPerHour, setFragsPerHour] = useState<number>(15);
  const [activeNodes, setActiveNodes] = useState<ActiveNode[]>([]);

  const classList = Object.keys(classDatabase).sort();

  useEffect(() => {
    const classData = (classDatabase as any)[selectedClass] || (classDatabase as any)["Hero"];
    const savedLevels = localStorage.getItem(`gms_hexa_sheet_${selectedClass}`);
    const parsedLevels = savedLevels ? JSON.parse(savedLevels) : {};

    const nodes: ActiveNode[] = classData.skills.map((s: any, idx: number) => ({
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

  const updateNodeLevel = (name: string, field: 'current' | 'target', value: number) => {
    const updated = activeNodes.map(n => n.name === name ? { ...n, [field]: value } : n);
    setActiveNodes(updated);

    const levelMap: Record<string, { current: number; target: number }> = {};
    updated.forEach(n => levelMap[n.name] = { current: n.current, target: n.target });
    localStorage.setItem(`gms_hexa_sheet_${selectedClass}`, JSON.stringify(levelMap));
  };

  let totalSpentFrags = 0, totalLeftFrags = 0, totalSpentErda = 0, totalLeftErda = 0;

  activeNodes.forEach(node => {
    const costTable = node.costType === 'sol_janus' ? SOL_JANUS_COSTS : STANDARD_SKILL_COSTS;
    for (let l = 1; l <= node.current; l++) {
      if (costTable[l]) { totalSpentFrags += costTable[l].frags; totalSpentErda += costTable[l].erda; }
    }
    for (let l = node.current + 1; l <= node.target; l++) {
      if (costTable[l]) { totalLeftFrags += costTable[l].frags; totalLeftErda += costTable[l].erda; }
    }
  });

  const grandTotalFrags = totalSpentFrags + totalLeftFrags;
  const progressPercent = grandTotalFrags > 0 ? ((totalSpentFrags / grandTotalFrags) * 100).toFixed(2) : "0.00";
  const hoursLeft = fragsPerHour > 0 ? (totalLeftFrags / fragsPerHour).toFixed(1) : "0.0";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <header className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-amber-400" />
            <div>
              <h1 className="text-xl font-bold text-amber-400">HEXA Matrix Progress Tracker</h1>
              <p className="text-xs text-slate-400">50+ Class Auto-Populated Engine</p>
            </div>
          </div>

          {/* Searchable Class Selection */}
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            <Search className="w-4 h-4 text-slate-400" />
            <select 
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="bg-slate-900 text-amber-300 font-bold rounded-lg px-2 py-1 text-sm border-none focus:outline-none"
            >
              {classList.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </header>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400">Frags Progress</p>
            <p className="text-xl font-bold text-amber-400 mt-1">{totalSpentFrags.toLocaleString()} / {grandTotalFrags.toLocaleString()}</p>
          </div>
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400">Sol Erda Needed</p>
            <p className="text-xl font-bold text-indigo-400 mt-1">{totalLeftErda} Erda</p>
          </div>
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400">Progress</p>
            <p className="text-xl font-bold text-emerald-400 mt-1">{progressPercent}%</p>
          </div>
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400">Training Time</p>
            <p className="text-xl font-bold text-purple-400 mt-1">{hoursLeft} hrs</p>
          </div>
        </div>

        {/* Skill Matrix Table */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="bg-slate-800/80 text-slate-400 border-b border-slate-700">
                <th className="p-3">Skill Core</th>
                <th className="p-3 text-center">Type</th>
                <th className="p-3 text-center">Current</th>
                <th className="p-3 text-center">Target</th>
                <th className="p-3 text-right">Frags Left</th>
                <th className="p-3 text-right">Erda Left</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {activeNodes.map(node => {
                const costTable = node.costType === 'sol_janus' ? SOL_JANUS_COSTS : STANDARD_SKILL_COSTS;
                let leftF = 0, leftE = 0;
                for (let l = node.current + 1; l <= node.target; l++) {
                  if (costTable[l]) { leftF += costTable[l].frags; leftE += costTable[l].erda; }
                }

                return (
                  <tr key={node.id} className="hover:bg-slate-800/50">
                    <td className="p-3 font-medium text-slate-200 flex items-center gap-2">
                      <img src={node.iconUrl} alt="Icon" className="w-6 h-6 rounded bg-slate-950 p-0.5 border border-slate-700" />
                      <span>{node.name}</span>
                    </td>
                    <td className="p-3 text-center capitalize">
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-300">{node.type}</span>
                    </td>
                    <td className="p-3 text-center">
                      <input 
                        type="number" min="0" max="30"
                        value={node.current}
                        onChange={e => updateNodeLevel(node.name, 'current', Number(e.target.value))}
                        className="bg-slate-950 border border-slate-700 rounded w-12 text-center py-1 text-amber-300 font-bold"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <input 
                        type="number" min="0" max="30"
                        value={node.target}
                        onChange={e => updateNodeLevel(node.name, 'target', Number(e.target.value))}
                        className="bg-slate-950 border border-slate-700 rounded w-12 text-center py-1 text-slate-300 font-bold"
                      />
                    </td>
                    <td className="p-3 text-right font-mono text-amber-400 font-bold">{leftF.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono text-indigo-400 font-bold">{leftE}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
