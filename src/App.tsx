import React, { useState, useEffect } from 'react';
import { Sparkles, Shield, Calendar, Plus, Trash2 } from 'lucide-react';

// 1. Standard Skill Core Cost Curve (Origin, Ascent, 3rd Class, Mastery 1-4, Boost 1-4)
// Total Cost: 1,486 Sol Erda | 4,400 Fragments
const STANDARD_SKILL_COSTS: Record<number, { erda: number; frags: number }> = {
  1: { erda: 0, frags: 0 }, 2: { erda: 1, frags: 30 }, 3: { erda: 1, frags: 35 }, 4: { erda: 1, frags: 40 }, 5: { erda: 1, frags: 45 },
  6: { erda: 1, frags: 50 }, 7: { erda: 1, frags: 55 }, 8: { erda: 1, frags: 60 }, 9: { erda: 2, frags: 65 }, 10: { erda: 5, frags: 200 },
  11: { erda: 1, frags: 80 }, 12: { erda: 1, frags: 90 }, 13: { erda: 1, frags: 100 }, 14: { erda: 1, frags: 110 }, 15: { erda: 1, frags: 120 },
  16: { erda: 1, frags: 130 }, 17: { erda: 1, frags: 140 }, 18: { erda: 1, frags: 150 }, 19: { erda: 2, frags: 160 }, 20: { erda: 8, frags: 350 },
  21: { erda: 2, frags: 170 }, 22: { erda: 2, frags: 180 }, 23: { erda: 2, frags: 190 }, 24: { erda: 2, frags: 200 }, 25: { erda: 2, frags: 210 },
  26: { erda: 2, frags: 220 }, 27: { erda: 2, frags: 230 }, 28: { erda: 2, frags: 240 }, 29: { erda: 3, frags: 250 }, 30: { erda: 10, frags: 500 },
};

// 2. Sol Janus Common Node Cost Curve
// Total Cost: 1,486 Sol Erda | 4,400 Fragments
const SOL_JANUS_COSTS: Record<number, { erda: number; frags: number }> = {
  1: { erda: 7, frags: 125 }, 2: { erda: 2, frags: 38 }, 3: { erda: 2, frags: 44 }, 4: { erda: 2, frags: 50 }, 5: { erda: 2, frags: 57 },
  6: { erda: 2, frags: 63 }, 7: { erda: 2, frags: 69 }, 8: { erda: 2, frags: 75 }, 9: { erda: 4, frags: 82 }, 10: { erda: 10, frags: 250 },
  11: { erda: 2, frags: 100 }, 12: { erda: 2, frags: 113 }, 13: { erda: 2, frags: 125 }, 14: { erda: 2, frags: 138 }, 15: { erda: 2, frags: 150 },
  16: { erda: 2, frags: 163 }, 17: { erda: 2, frags: 175 }, 18: { erda: 2, frags: 188 }, 19: { erda: 4, frags: 200 }, 20: { erda: 16, frags: 438 },
  21: { erda: 3, frags: 213 }, 22: { erda: 3, frags: 225 }, 23: { erda: 3, frags: 238 }, 24: { erda: 3, frags: 250 }, 25: { erda: 3, frags: 263 },
  26: { erda: 3, frags: 275 }, 27: { erda: 3, frags: 288 }, 28: { erda: 3, frags: 300 }, 29: { erda: 5, frags: 313 }, 30: { erda: 20, frags: 625 },
};

// 3. Sol Hecate Common Node Cost Curve
// Total Cost: 1,486 Sol Erda | 6,000 Fragments
const SOL_HECATE_COSTS: Record<number, { erda: number; frags: number }> = {
  1: { erda: 7, frags: 170 }, 2: { erda: 2, frags: 52 }, 3: { erda: 2, frags: 60 }, 4: { erda: 2, frags: 68 }, 5: { erda: 2, frags: 77 },
  6: { erda: 2, frags: 86 }, 7: { erda: 2, frags: 94 }, 8: { erda: 2, frags: 102 }, 9: { erda: 4, frags: 112 }, 10: { erda: 10, frags: 340 },
  11: { erda: 2, frags: 136 }, 12: { erda: 2, frags: 154 }, 13: { erda: 2, frags: 170 }, 14: { erda: 2, frags: 188 }, 15: { erda: 2, frags: 204 },
  16: { erda: 2, frags: 222 }, 17: { erda: 2, frags: 238 }, 18: { erda: 2, frags: 256 }, 19: { erda: 4, frags: 272 }, 20: { erda: 16, frags: 598 },
  21: { erda: 3, frags: 290 }, 22: { erda: 3, frags: 307 }, 23: { erda: 3, frags: 324 }, 24: { erda: 3, frags: 341 }, 25: { erda: 3, frags: 359 },
  26: { erda: 3, frags: 375 }, 27: { erda: 3, frags: 393 }, 28: { erda: 3, frags: 409 }, 29: { erda: 5, frags: 427 }, 30: { erda: 20, frags: 853 },
};

// 4. 5th Job Common Node Boost Cost Curve
// Total Cost: 1,486 Sol Erda | 4,800 Fragments
const FIFTH_JOB_COMMON_COSTS: Record<number, { erda: number; frags: number }> = {
  1: { erda: 7, frags: 136 }, 2: { erda: 2, frags: 41 }, 3: { erda: 2, frags: 48 }, 4: { erda: 2, frags: 55 }, 5: { erda: 2, frags: 62 },
  6: { erda: 2, frags: 69 }, 7: { erda: 2, frags: 75 }, 8: { erda: 2, frags: 82 }, 9: { erda: 4, frags: 89 }, 10: { erda: 10, frags: 272 },
  11: { erda: 2, frags: 109 }, 12: { erda: 2, frags: 123 }, 13: { erda: 2, frags: 136 }, 14: { erda: 2, frags: 150 }, 15: { erda: 2, frags: 163 },
  16: { erda: 2, frags: 178 }, 17: { erda: 2, frags: 191 }, 18: { erda: 2, frags: 205 }, 19: { erda: 4, frags: 218 }, 20: { erda: 16, frags: 478 },
  21: { erda: 3, frags: 232 }, 22: { erda: 3, frags: 245 }, 23: { erda: 3, frags: 259 }, 24: { erda: 3, frags: 273 }, 25: { erda: 3, frags: 287 },
  26: { erda: 3, frags: 300 }, 27: { erda: 3, frags: 314 }, 28: { erda: 3, frags: 327 }, 29: { erda: 5, frags: 341 }, 30: { erda: 20, frags: 682 },
};

type NodeCostType = 'standard' | 'sol_janus' | 'sol_hecate' | 'fifth_job_common';

interface NodeItem {
  id: string;
  name: string;
  costType: NodeCostType;
  current: number;
  target: number;
}

const DEFAULT_NODES: NodeItem[] = [
  { id: '1', name: 'Origin Skill', costType: 'standard', current: 1, target: 10 },
  { id: '2', name: 'Ascent Skill', costType: 'standard', current: 0, target: 10 },
  { id: '3', name: '3rd Class Skill', costType: 'standard', current: 0, target: 10 },
  { id: '4', name: 'Mastery Core 1', costType: 'standard', current: 1, target: 10 },
  { id: '5', name: 'Mastery Core 2', costType: 'standard', current: 0, target: 10 },
  { id: '6', name: 'Mastery Core 3', costType: 'standard', current: 0, target: 10 },
  { id: '7', name: 'Mastery Core 4', costType: 'standard', current: 0, target: 10 },
  { id: '8', name: 'Boost Core 1', costType: 'standard', current: 1, target: 10 },
  { id: '9', name: 'Boost Core 2', costType: 'standard', current: 0, target: 10 },
  { id: '10', name: 'Boost Core 3', costType: 'standard', current: 0, target: 10 },
  { id: '11', name: 'Boost Core 4', costType: 'standard', current: 0, target: 10 },
  { id: '12', name: 'Sol Janus (Common)', costType: 'sol_janus', current: 0, target: 10 },
  { id: '13', name: 'Sol Hecate (Common)', costType: 'sol_hecate', current: 0, target: 10 },
  { id: '14', name: '5th Job Common Boost', costType: 'fifth_job_common', current: 0, target: 10 },
];

export default function App() {
  const [dailyFrags, setDailyFrags] = useState<number>(12);
  const [grindHours, setGrindHours] = useState<number>(1);
  const [fragsPerHour, setFragsPerHour] = useState<number>(15);

  const [nodes, setNodes] = useState<NodeItem[]>(() => {
    const saved = localStorage.getItem('gms_hexa_nodes_v3');
    return saved ? JSON.parse(saved) : DEFAULT_NODES;
  });

  useEffect(() => {
    localStorage.setItem('gms_hexa_nodes_v3', JSON.stringify(nodes));
  }, [nodes]);

  const getCostTable = (type: NodeCostType) => {
    switch (type) {
      case 'sol_janus': return SOL_JANUS_COSTS;
      case 'sol_hecate': return SOL_HECATE_COSTS;
      case 'fifth_job_common': return FIFTH_JOB_COMMON_COSTS;
      default: return STANDARD_SKILL_COSTS;
    }
  };

  let totalFragsNeeded = 0;
  let totalErdaNeeded = 0;

  nodes.forEach(node => {
    const costTable = getCostTable(node.costType);
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

  const addNode = () => {
    const newNode: NodeItem = {
      id: Date.now().toString(),
      name: 'Custom Node',
      costType: 'standard',
      current: 0,
      target: 10
    };
    setNodes([...nodes, newNode]);
  };

  const deleteNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
  };

  const resetToDefault = () => {
    if (window.confirm('Reset node list to standard default setup?')) {
      setNodes(DEFAULT_NODES);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="border-b border-slate-800 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-amber-400">
              <Sparkles className="w-6 h-6" /> Hexa Matrix Calculator
            </h1>
            <p className="text-xs text-slate-400">MapleStory GMS Node & Core Progression Engine</p>
          </div>
          <button 
            onClick={resetToDefault}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded border border-slate-700 transition"
          >
            Reset Default Nodes
          </button>
        </header>

        {/* Daily Fragment Income Settings */}
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
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-400" /> Active Matrix Nodes ({nodes.length})
            </h2>
            <button 
              onClick={addNode}
              className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded transition"
            >
              <Plus className="w-4 h-4" /> Add Custom Node
            </button>
          </div>

          <div className="space-y-3">
            {nodes.map(node => (
              <div key={node.id} className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex flex-wrap md:flex-nowrap items-center gap-3">
                <input 
                  type="text" 
                  value={node.name}
                  onChange={e => updateNode(node.id, 'name', e.target.value)}
                  className="bg-transparent border-b border-slate-700 text-sm font-medium outline-none px-1 flex-1 min-w-[160px]"
                />
                
                <select 
                  value={node.costType}
                  onChange={e => updateNode(node.id, 'costType', e.target.value as NodeCostType)}
                  className="bg-slate-800 text-xs rounded border border-slate-700 px-2 py-1 text-slate-300"
                >
                  <option value="standard">Standard Skill Core (Origin/Mastery/Boost)</option>
                  <option value="sol_janus">Sol Janus (4,400 Frags)</option>
                  <option value="sol_hecate">Sol Hecate (6,000 Frags)</option>
                  <option value="fifth_job_common">5th Job Common Boost (4,800 Frags)</option>
                </select>

                <div className="flex items-center gap-2 text-xs">
                  <span>Current:</span>
                  <input 
                    type="number" min="0" max="30"
                    value={node.current}
                    onChange={e => updateNode(node.id, 'current', Number(e.target.value))}
                    className="bg-slate-800 border border-slate-700 rounded w-12 text-center py-0.5"
                  />
                  <span>Target:</span>
                  <input 
                    type="number" min="0" max="30"
                    value={node.target}
                    onChange={e => updateNode(node.id, 'target', Number(e.target.value))}
                    className="bg-slate-800 border border-slate-700 rounded w-12 text-center py-0.5"
                  />
                </div>

                <button 
                  onClick={() => deleteNode(node.id)}
                  className="text-slate-500 hover:text-red-400 p-1 transition"
                  title="Remove node"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Calculations Output Dashboard */}
        <div className="bg-slate-800/80 p-5 rounded-xl border border-indigo-500/30 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-slate-400">Total Sol Erda Needed</p>
            <p className="text-2xl font-bold text-indigo-400">{totalErdaNeeded} Sol Erda</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Total Fragments Needed</p>
            <p className="text-2xl font-bold text-amber-400">{totalFragsNeeded.toLocaleString()} Fragments</p>
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
