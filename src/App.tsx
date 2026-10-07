import React, { useState, useEffect } from 'react';
import { Sparkles, Shield, Calendar, Calculator, RotateCcw } from 'lucide-react';

// Skill Cost Curve (Skill, Mastery, Boost Cores)
const SKILL_FRAG_COSTS: Record<number, { erda: number; frags: number }> = {
  1: { erda: 0, frags: 0 }, 2: { erda: 1, frags: 30 }, 3: { erda: 1, frags: 35 }, 4: { erda: 1, frags: 40 }, 5: { erda: 1, frags: 45 },
  6: { erda: 1, frags: 50 }, 7: { erda: 1, frags: 55 }, 8: { erda: 1, frags: 60 }, 9: { erda: 2, frags: 65 }, 10: { erda: 5, frags: 200 },
  11: { erda: 1, frags: 80 }, 12: { erda: 1, frags: 90 }, 13: { erda: 1, frags: 100 }, 14: { erda: 1, frags: 110 }, 15: { erda: 1, frags: 120 },
  16: { erda: 1, frags: 130 }, 17: { erda: 1, frags: 140 }, 18: { erda: 1, frags: 150 }, 19: { erda: 2, frags: 160 }, 20: { erda: 8, frags: 350 },
  21: { erda: 2, frags: 170 }, 22: { erda: 2, frags: 180 }, 23: { erda: 2, frags: 190 }, 24: { erda: 2, frags: 200 }, 25: { erda: 2, frags: 210 },
  26: { erda: 2, frags: 220 }, 27: { erda: 2, frags: 230 }, 28: { erda: 2, frags: 240 }, 29: { erda: 3, frags: 250 }, 30: { erda: 10, frags: 500 },
};

// Common Core Cost Curve (e.g. Sol Janus)
const COMMON_FRAG_COSTS: Record<number, { erda: number; frags: number }> = {
  1: { erda: 7, frags: 125 }, 2: { erda: 2, frags: 38 }, 3: { erda: 2, frags: 44 }, 4: { erda: 2, frags: 50 }, 5: { erda: 2, frags: 57 },
  6: { erda: 2, frags: 63 }, 7: { erda: 2, frags: 69 }, 8: { erda: 2, frags: 75 }, 9: { erda: 4, frags: 82 }, 10: { erda: 10, frags: 250 },
  11: { erda: 2, frags: 100 }, 12: { erda: 2, frags: 113 }, 13: { erda: 2, frags: 125 }, 14: { erda: 2, frags: 138 }, 15: { erda: 2, frags: 150 },
  16: { erda: 2, frags: 163 }, 17: { erda: 2, frags: 175 }, 18: { erda: 2, frags: 188 }, 19: { erda: 4, frags: 200 }, 20: { erda: 16, frags: 438 },
  21: { erda: 3, frags: 213 }, 22: { erda: 3, frags: 225 }, 23: { erda: 3, frags: 238 }, 24: { erda: 3, frags: 250 }, 25: { erda: 3, frags: 263 },
  26: { erda: 3, frags: 275 }, 27: { erda: 3, frags: 288 }, 28: { erda: 3, frags: 300 }, 29: { erda: 5, frags: 313 }, 30: { erda: 20, frags: 625 },
};

interface NodeItem {
  id: string;
  name: string;
  type: 'skill' | 'common';
  current: number;
  target: number;
}

export default function App() {
  const [dailyFrags, setDailyFrags] = useState<number>(12);
  const [grindHours, setGrindHours] = useState<number>(1);
  const [fragsPerHour, setFragsPerHour] = useState<number>(15);

  const [nodes, setNodes] = useState<NodeItem[]>(() => {
    const saved = localStorage.getItem('gms_hexa_nodes_v2');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Origin Skill', type: 'skill', current: 1, target: 10 },
      { id: '2', name: 'Mastery Core 1', type: 'skill', current: 1, target: 10 },
      { id: '3', name: 'Sol Janus', type: 'common', current: 0, target: 10 },
    ];
  });

  useEffect(() => {
    localStorage.setItem('gms_hexa_nodes_v2', JSON.stringify(nodes));
  }, [nodes]);

  // Calculate total required Sol Erda & Fragments
  let totalFragsNeeded = 0;
  let totalErdaNeeded = 0;

  nodes.forEach(node => {
    const costTable = node.type === 'common' ? COMMON_FRAG_COSTS : SKILL_FRAG_COSTS;
    for (let l = node.current + 1; l <= node.target; l++) {
      if (costTable[l]) {
        totalFragsNeeded += costTable[l].frags;
        totalErdaNeeded += costTable[l].erda;
      }
    }
  });

  const dailyIncome = dailyFrags + (grindHours * fragsPerHour);
  const daysRemaining = dailyIncome > 0 ? Math.ceil(totalFragsNeeded / dailyIncome) : 0;

  const updateNode = (id: string, field: keyof NodeItem, value: any) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, [field]: value } : n));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="border-b border-slate-800 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-amber-400">
              <Sparkles className="w-6 h-6" /> Hexa Matrix Calculator
            </h1>
            <p className="text-xs text-slate-400">MapleStory GMS Progression Tracker</p>
          </div>
        </header>

        {/* Income Settings */}
        <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Daily Quest Fragments</label>
            <input 
              type="number" 
              value={dailyFrags} 
              onChange={e => setDailyFrags(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 w-full text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Daily Grind Hours</label>
            <input 
              type="number" 
              value={grindHours} 
              onChange={e => setGrindHours(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 w-full text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Fragments / Hour Rate</label>
            <input 
              type="number" 
              value={fragsPerHour} 
              onChange={e => setFragsPerHour(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 w-full text-sm"
            />
          </div>
        </div>

        {/* Node Tracking List */}
        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" /> Cores & Nodes
          </h2>
          <div className="space-y-3">
            {nodes.map(node => (
              <div key={node.id} className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex items-center justify-between gap-4">
                <input 
                  type="text" 
                  value={node.name}
                  onChange={e => updateNode(node.id, 'name', e.target.value)}
                  className="bg-transparent border-b border-slate-700 text-sm font-medium outline-none px-1 flex-1"
                />
                <select 
                  value={node.type}
                  onChange={e => updateNode(node.id, 'type', e.target.value)}
                  className="bg-slate-800 text-xs rounded border border-slate-700 px-2 py-1"
                >
                  <option value="skill">Skill / Mastery Core</option>
                  <option value="common">Common Core (Sol Janus)</option>
                </select>
                <div className="flex items-center gap-2 text-xs">
                  <span>Lv:</span>
                  <input 
                    type="number" min="0" max="30"
                    value={node.current}
                    onChange={e => updateNode(node.id, 'current', Number(e.target.value))}
                    className="bg-slate-800 border border-slate-700 rounded w-12 text-center py-0.5"
                  />
                  <span>$\rightarrow$ Target:</span>
                  <input 
                    type="number" min="0" max="30"
                    value={node.target}
                    onChange={e => updateNode(node.id, 'target', Number(e.target.value))}
                    className="bg-slate-800 border border-slate-700 rounded w-12 text-center py-0.5"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculations Output Card */}
        <div className="bg-slate-800/80 p-5 rounded-xl border border-indigo-500/30 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-slate-400">Total Sol Erda Needed</p>
            <p className="text-2xl font-bold text-indigo-400">{totalErdaNeeded} Sol Erda</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Total Fragments Needed</p>
            <p className="text-2xl font-bold text-amber-400">{totalFragsNeeded} Fragments</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Estimated Grind Time</p>
            <p className="text-2xl font-bold text-emerald-400">{daysRemaining} Days <span className="text-xs text-slate-400">({(daysRemaining / 7).toFixed(1)} wks)</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
