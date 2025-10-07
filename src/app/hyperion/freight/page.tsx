"use client";

import React, { useRef, useState, useEffect, useLayoutEffect, createContext, useContext } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Area, AreaChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import Image from "next/image";

// --- START: Production-Ready Tabs Component ---
interface TabsContextProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}
const TabsContext = createContext<TabsContextProps | null>(null);

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("useTabs must be used within a TabsProvider");
  }
  return context;
};

const Tabs = ({ children, defaultValue }: { children: React.ReactNode; defaultValue: string; }) => {
    const [activeTab, setActiveTab] = useState(defaultValue);
    return <TabsContext.Provider value={{ activeTab, setActiveTab }}>{children}</TabsContext.Provider>;
};

const TabsList = ({ children }: { children: React.ReactNode; }) => <div className="grid w-full grid-cols-3 bg-gray-900 p-1 rounded-lg">{children}</div>;

const TabsTrigger = ({ children, value }: { children: React.ReactNode; value: string; }) => {
    const { activeTab, setActiveTab } = useTabs();
    return <button onClick={() => setActiveTab(value)} className={`w-full px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === value ? 'bg-white text-black' : 'text-gray-400 hover:bg-gray-800'}`}>{children}</button>;
};

const TabsContent = ({ children, value }: { children: React.ReactNode; value: string; }) => {
    const { activeTab } = useTabs();
    return <div className={`mt-4 ${activeTab === value ? 'block' : 'hidden'}`}>{children}</div>;
};
// --- END: Production-Ready Tabs Component ---


// --- Main Page Component ---
export default function FreightPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [showResults, setShowResults] = useState(false);

  useLayoutEffect(() => {
    if (!mainRef.current) return;
    
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>(".story-section");

      ScrollTrigger.create({
        trigger: mainRef.current,
        start: "top top",
        end: `+=${(sections.length - 1) * 100}%`,
        pin: true,
      });

      sections.forEach((section, index) => {
        gsap.timeline({
          scrollTrigger: {
            trigger: mainRef.current,
            start: `top+=${index * 100}% top`,
            end: `top+=${(index + 1) * 100}% top`,
            scrub: 1,
          }
        })
        .fromTo(section, { autoAlpha: 0, scale: 0.95 }, { autoAlpha: 1, scale: 1, ease: "power2.inOut" })
        .to(section, { autoAlpha: 0, scale: 0.95, ease: "power2.inOut" }, ">0.5");
      });

    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={mainRef}>
      <div className="relative" style={{ height: `${(4) * 100}vh` }}>
        <div className="w-full h-screen absolute top-0 left-0 story-section flex flex-col justify-center items-center text-center p-8">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter">The Rosetta Stone.</h1>
            <p className="text-xl md:text-2xl text-gray-400">Our flagship story of intellectual honesty and breakthrough.</p>
        </div>
        <div className="w-full h-screen absolute top-0 left-0 story-section flex flex-col justify-center items-center text-center p-8">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">The Chimera.</h2>
            <p className="text-lg text-gray-400 mt-4 max-w-2xl">Our first model achieved a misleading 98% accuracy on simulated data. A beautiful, useless illusion.</p>
            <div className="mt-8 w-full max-w-4xl p-4 border border-gray-800 rounded-lg bg-gray-900/50"><Image src="https://placehold.co/1200x600/000000/333333?text=Perfect+Prediction+(Illusion)" alt="Perfect prediction chart" width={1200} height={600} className="rounded" /></div>
        </div>
        <div className="w-full h-screen absolute top-0 left-0 story-section flex flex-col justify-center items-center text-center p-8">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">The Abyss.</h2>
            <p className="text-lg text-gray-400 mt-4 max-w-2xl">On real data, the model collapsed, producing negative R² scores. This failure was our most valuable discovery.</p>
            <div className="mt-8 w-full max-w-4xl p-4 border border-gray-800 rounded-lg bg-gray-900/50"><Image src="https://placehold.co/1200x600/000000/333333?text=Chaotic+Prediction+(Failure)" alt="Chaotic and failed prediction chart" width={1200} height={600} className="rounded" /></div>
        </div>
        <div className="w-full h-screen absolute top-0 left-0 story-section flex flex-col justify-center items-center text-center p-8">
            <div className="w-full max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">The Breakthrough.</h2>
              <p className="text-lg text-gray-400 mt-4 mb-12 max-w-3xl mx-auto">The discovery of a proprietary feature, the &apos;Trade Imbalance Ratio,&apos; gave us a real, defensible edge.</p>
              {!showResults && (<button onClick={() => setShowResults(true)} className="px-8 py-4 bg-white text-black font-semibold rounded-full text-lg hover:bg-gray-200 transition-colors">Reveal The Mini-Dashboard</button>)}
              {showResults && (<div className="bg-[#0A0A0A] border border-gray-800 rounded-xl p-6 md:p-8"><MiniDashboard /></div>)}
            </div>
        </div>
      </div>
    </main>
  );
}

// Mini-Dashboard Component
function MiniDashboard() {
    interface PerformanceMetrics {
        [model: string]: {
            '7_day': { R2: number; MAE: number };
            '14_day': { R2: number; MAE: number };
        };
    }
    const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
    useEffect(() => { fetch('/atlas_v2_results_20250923_001400.json').then(res => res.json()).then(data => { setMetrics(data.performance_metrics); }); }, []);
    if (!metrics) return <div className="h-[500px] flex justify-center items-center"><p>Loading Dashboard Data...</p></div>;
    return (
        <div className="space-y-8 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-2xl font-bold">Model Foundry</h3>
                    <p className="text-gray-400 mt-2">Our engine is an ensemble of robust models, ensuring predictions are not reliant on a single methodology.</p>
                    <div className="flex flex-wrap gap-2 mt-4">{["LightGBM", "XGBoost", "CatBoost", "Ridge Regression"].map(model => (<span key={model} className="bg-gray-800 text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">{model}</span>))}</div>
                </div>
                <div>
                    <h3 className="text-2xl font-bold">Performance Overview</h3>
                    <p className="text-gray-400 mt-2">Key R-squared (R²) scores, indicating the percentage of price variance our model successfully predicts.</p>
                    <div className="mt-4 space-y-2">
                        <StatCard title="7-Day Forecast R²" value={`${(metrics.CatBoost['7_day'].R2 * 100).toFixed(1)}%`} />
                        <StatCard title="14-Day Forecast R²" value={`${(metrics.CatBoost['14_day'].R2 * 100).toFixed(1)}%`} />
                    </div>
                </div>
            </div>
            <Tabs defaultValue="7day">
              <TabsList><TabsTrigger value="7day">7-Day</TabsTrigger><TabsTrigger value="14day">14-Day</TabsTrigger><TabsTrigger value="30day">30-Day</TabsTrigger></TabsList>
              <TabsContent value="7day"><FinalChart dataUrl="/kalopathor_7day_predictions.csv" /></TabsContent>
              <TabsContent value="14day"><FinalChart dataUrl="/kalopathor_14day_predictions.csv" /></TabsContent>
              <TabsContent value="30day"><FinalChart dataUrl="/kalopathor_30day_predictions.csv" /></TabsContent>
            </Tabs>
        </div>
    );
}
function StatCard({ title, value }: { title: string; value: string; }) { return (<div className="flex justify-between items-baseline p-2 bg-black rounded"><p className="text-sm text-gray-400">{title}</p><p className="text-xl font-bold">{value}</p></div>); }

// Chart Component
interface ForecastData { date: string; actual: number | null; predicted: number | null; }
function FinalChart({ dataUrl }: { dataUrl: string; }) {
  const [data, setData] = useState<ForecastData[]>([]);
  useEffect(() => {
    fetch(dataUrl).then(response => response.text()).then(csvText => {
        const lines = csvText.trim().split('\n'); const headers = lines[0].split(',').map(h => h.trim());
        const chartData = lines.slice(1).map(line => {
          const values = line.split(','); 
          const entry: {[key: string]: string | number | null} = {};
          headers.forEach((header, index) => { const value = parseFloat(values[index]); entry[header] = isNaN(value) ? null : value; });
          return { date: entry.date as string, actual: entry.actual as number | null, predicted: entry.predicted as number | null };
        });
        setData(chartData);
      });
  }, [dataUrl]);
  if (data.length === 0) return <div className="h-[350px] flex justify-center items-center"><p>Loading Chart Data...</p></div>;
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs><linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00AEEF" stopOpacity={0.8}/><stop offset="95%" stopColor="#00AEEF" stopOpacity={0.1}/></linearGradient><linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.7}/><stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.1}/></linearGradient></defs>
          <XAxis dataKey="date" stroke="#666" fontSize={12} tickLine={false} axisLine={false} /><YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
          <CartesianGrid strokeDasharray="1 3" stroke="#333" /><RechartsTooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #333", color: "#FFF" }} />
          <Area type="monotone" dataKey="actual" stroke="#FFF" fillOpacity={1} fill="url(#colorActual)" name="Actual Price" /><Area type="monotone" dataKey="predicted" stroke="#00AEEF" fillOpacity={1} fill="url(#colorPredicted)" name="Predicted Price" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}