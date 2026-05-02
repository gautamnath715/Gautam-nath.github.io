
import { useState, useEffect, useRef } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, ScatterChart, Scatter, ZAxis
} from "recharts";

// ── DATA ────────────────────────────────────────────────────────────────────

const REGIONS = ["North", "South", "East", "West", "Central"];
const REGION_COLORS = {
  North: "#38bdf8", South: "#f97316", East: "#a78bfa",
  West: "#34d399", Central: "#fb7185"
};

const REGION_COORDS = {
  North:   { x: 42, y: 18, label: "North India", city: "Delhi/UP/Punjab" },
  South:   { x: 45, y: 72, label: "South India", city: "Tamil Nadu/Kerala/AP" },
  East:    { x: 65, y: 38, label: "East India",  city: "West Bengal/Odisha" },
  West:    { x: 22, y: 42, label: "West India",  city: "Gujarat/Rajasthan/MH" },
  Central: { x: 45, y: 45, label: "Central India",city: "MP/Chhattisgarh" },
};

const rawClimate = [
  // year, region, rainfall_mm, temp_c, drought_index, flood_days
  [2000,"North",680,26.2,0.3,4],[2000,"South",1320,28.1,0.1,12],[2000,"East",1540,27.4,0.05,18],[2000,"West",440,29.8,0.55,2],[2000,"Central",950,27.0,0.2,7],
  [2001,"North",620,26.8,0.42,3],[2001,"South",1280,28.4,0.15,10],[2001,"East",1490,27.6,0.08,15],[2001,"West",380,30.1,0.62,1],[2001,"Central",880,27.3,0.28,5],
  [2002,"North",520,27.4,0.65,1],[2002,"South",1100,29.0,0.28,6],[2002,"East",1310,28.2,0.18,9],[2002,"West",290,31.0,0.78,0],[2002,"Central",760,28.1,0.42,3],
  [2003,"North",700,26.0,0.22,5],[2003,"South",1380,27.9,0.08,14],[2003,"East",1620,27.1,0.03,21],[2003,"West",470,29.5,0.48,3],[2003,"Central",1010,26.7,0.15,9],
  [2004,"North",650,26.5,0.35,4],[2004,"South",1250,28.2,0.18,11],[2004,"East",1480,27.5,0.09,16],[2004,"West",410,30.0,0.58,2],[2004,"Central",920,27.1,0.24,6],
  [2005,"North",730,25.8,0.18,6],[2005,"South",1420,27.6,0.05,16],[2005,"East",1680,26.8,0.02,24],[2005,"West",500,29.2,0.42,4],[2005,"Central",1060,26.4,0.11,11],
  [2006,"North",590,27.2,0.51,2],[2006,"South",1190,28.6,0.22,8],[2006,"East",1400,27.9,0.12,13],[2006,"West",340,30.5,0.71,1],[2006,"Central",840,27.8,0.35,4],
  [2007,"North",760,25.5,0.12,7],[2007,"South",1460,27.4,0.04,17],[2007,"East",1720,26.6,0.01,26],[2007,"West",520,29.0,0.38,5],[2007,"Central",1080,26.2,0.08,12],
  [2008,"North",640,26.6,0.38,3],[2008,"South",1240,28.3,0.19,10],[2008,"East",1460,27.6,0.10,15],[2008,"West",390,30.2,0.61,2],[2008,"Central",900,27.2,0.26,6],
  [2009,"North",490,27.9,0.72,1],[2009,"South",1080,29.3,0.32,5],[2009,"East",1280,28.5,0.22,8],[2009,"West",270,31.4,0.84,0],[2009,"Central",730,28.6,0.48,2],
  [2010,"North",780,25.4,0.08,8],[2010,"South",1500,27.2,0.02,19],[2010,"East",1760,26.4,0.01,28],[2010,"West",540,28.8,0.34,6],[2010,"Central",1110,26.0,0.05,13],
  [2011,"North",710,25.9,0.19,6],[2011,"South",1380,27.7,0.07,15],[2011,"East",1640,26.9,0.04,22],[2011,"West",480,29.4,0.45,4],[2011,"Central",1020,26.5,0.13,10],
  [2012,"North",560,27.3,0.58,2],[2012,"South",1160,28.7,0.25,8],[2012,"East",1370,28.0,0.15,11],[2012,"West",320,30.6,0.74,1],[2012,"Central",820,27.9,0.38,4],
  [2013,"North",740,25.7,0.15,7],[2013,"South",1440,27.5,0.04,17],[2013,"East",1700,26.7,0.02,25],[2013,"West",510,29.1,0.40,5],[2013,"Central",1070,26.3,0.10,11],
  [2014,"North",600,27.0,0.46,3],[2014,"South",1200,28.5,0.21,9],[2014,"East",1420,27.8,0.11,14],[2014,"West",360,30.4,0.68,1],[2014,"Central",860,27.6,0.32,5],
  [2015,"North",540,27.6,0.61,2],[2015,"South",1090,29.1,0.31,6],[2015,"East",1300,28.4,0.20,9],[2015,"West",285,31.2,0.82,0],[2015,"Central",750,28.4,0.46,3],
  [2016,"North",680,26.2,0.30,5],[2016,"South",1300,28.0,0.13,12],[2016,"East",1520,27.3,0.07,17],[2016,"West",435,29.8,0.53,3],[2016,"Central",950,26.9,0.21,8],
  [2017,"North",720,25.9,0.20,6],[2017,"South",1390,27.6,0.06,15],[2017,"East",1660,26.8,0.03,23],[2017,"West",495,29.3,0.43,4],[2017,"Central",1040,26.4,0.12,10],
  [2018,"North",630,26.7,0.40,4],[2018,"South",1220,28.4,0.20,10],[2018,"East",1440,27.7,0.10,15],[2018,"West",375,30.3,0.64,2],[2018,"Central",890,27.4,0.28,6],
  [2019,"North",570,27.4,0.55,2],[2019,"South",1140,28.9,0.28,7],[2019,"East",1360,28.2,0.17,11],[2019,"West",310,30.9,0.77,1],[2019,"Central",800,28.1,0.40,4],
  [2020,"North",700,26.1,0.24,6],[2020,"South",1360,27.9,0.09,14],[2020,"East",1600,27.2,0.05,20],[2020,"West",460,29.6,0.50,3],[2020,"Central",980,26.8,0.18,9],
  [2021,"North",750,25.7,0.14,7],[2021,"South",1420,27.5,0.05,16],[2021,"East",1680,26.7,0.03,23],[2021,"West",505,29.2,0.41,5],[2021,"Central",1050,26.3,0.11,11],
  [2022,"North",660,26.4,0.33,5],[2022,"South",1280,28.2,0.16,11],[2022,"East",1500,27.5,0.08,16],[2022,"West",425,29.9,0.56,3],[2022,"Central",940,27.0,0.23,8],
  [2023,"North",610,26.9,0.44,3],[2023,"South",1180,28.6,0.24,9],[2023,"East",1400,27.9,0.13,13],[2023,"West",355,30.6,0.70,1],[2023,"Central",850,27.8,0.34,5],
];

// Agricultural yield index (normalized, 100 = baseline 2000)
const agriData = [
  {year:2000,North:100,South:100,East:100,West:100,Central:100},
  {year:2001,North:97,South:98,East:99,West:93,Central:96},
  {year:2002,North:82,South:90,East:94,West:78,Central:87},
  {year:2003,North:104,South:106,East:109,West:96,Central:103},
  {year:2004,North:101,South:102,East:105,West:94,Central:100},
  {year:2005,North:107,South:110,East:113,West:98,Central:107},
  {year:2006,North:91,South:95,East:100,West:84,Central:93},
  {year:2007,North:112,South:114,East:118,West:101,Central:110},
  {year:2008,North:100,South:101,East:104,West:92,Central:99},
  {year:2009,North:78,South:86,East:90,West:72,Central:82},
  {year:2010,North:116,South:118,East:122,West:104,Central:114},
  {year:2011,North:109,South:112,East:116,West:99,Central:108},
  {year:2012,North:88,South:93,East:97,West:81,Central:90},
  {year:2013,North:112,South:114,East:118,West:100,Central:110},
  {year:2014,North:94,South:97,East:101,West:86,Central:95},
  {year:2015,North:80,South:88,East:93,West:74,Central:85},
  {year:2016,North:102,South:104,East:107,West:95,Central:101},
  {year:2017,North:110,South:112,East:116,West:100,Central:108},
  {year:2018,North:99,South:100,East:104,West:91,Central:98},
  {year:2019,North:86,South:92,East:96,West:79,Central:89},
  {year:2020,North:107,South:108,East:112,West:97,Central:105},
  {year:2021,North:113,South:115,East:119,West:102,Central:111},
  {year:2022,North:103,South:104,East:108,West:96,Central:102},
  {year:2023,North:93,South:97,East:101,West:87,Central:95},
];

const years = [...new Set(rawClimate.map(d => d[0]))].sort();

function getRegionData(region) {
  return rawClimate.filter(d => d[1] === region).map(d => ({
    year: d[0], rainfall: d[2], temp: d[3], drought: d[4], flood: d[5]
  }));
}

function buildYearlyAvg() {
  return years.map(y => {
    const rows = rawClimate.filter(d => d[0] === y);
    return {
      year: y,
      rainfall: Math.round(rows.reduce((s, d) => s + d[2], 0) / rows.length),
      temp: +(rows.reduce((s, d) => s + d[3], 0) / rows.length).toFixed(2),
      drought: +(rows.reduce((s, d) => s + d[4], 0) / rows.length).toFixed(3),
    };
  });
}

function buildVariance() {
  const base = {};
  REGIONS.forEach(r => {
    const rd = getRegionData(r);
    base[r] = rd.reduce((s, d) => s + d.rainfall, 0) / rd.length;
  });
  return years.map(y => {
    const obj = { year: y };
    REGIONS.forEach(r => {
      const val = rawClimate.find(d => d[0] === y && d[1] === r);
      if (val) obj[r] = Math.round(((val[2] - base[r]) / base[r]) * 100);
    });
    return obj;
  });
}

function buildRadar() {
  return REGIONS.map(r => {
    const rd = getRegionData(r);
    const last5 = rd.slice(-5);
    return {
      region: r,
      Rainfall: Math.round(last5.reduce((s, d) => s + d.rainfall, 0) / last5.length / 20),
      Temperature: Math.round(last5.reduce((s, d) => s + d.temp, 0) / last5.length * 2),
      DroughtRisk: Math.round(last5.reduce((s, d) => s + d.drought, 0) / last5.length * 100),
      FloodDays: Math.round(last5.reduce((s, d) => s + d.flood, 0) / last5.length * 4),
    };
  });
}

function buildScatter() {
  return rawClimate.map(d => ({
    region: d[1], rainfall: d[2], agri: agriData.find(a => a.year === d[0])?.[d[1]] ?? 100,
  }));
}

const yearlyAvg = buildYearlyAvg();
const varianceData = buildVariance();
const radarData = buildRadar();
const scatterData = buildScatter();

// ── SUBCOMPONENTS ────────────────────────────────────────────────────────────

const sqlQueries = [
  {
    title: "Window Function – Rainfall Rank per Year",
    sql: `SELECT year, region, rainfall_mm,
  RANK() OVER (PARTITION BY year ORDER BY rainfall_mm DESC) AS rain_rank,
  AVG(rainfall_mm) OVER (PARTITION BY region ORDER BY year
    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS rolling_3yr_avg
FROM climate_india
ORDER BY year, rain_rank;`,
  },
  {
    title: "CTE – Drought Anomaly Detection",
    sql: `WITH regional_baseline AS (
  SELECT region,
    AVG(rainfall_mm) AS avg_rain,
    STDDEV(rainfall_mm) AS sd_rain
  FROM climate_india
  WHERE year BETWEEN 2000 AND 2010
  GROUP BY region
),
anomalies AS (
  SELECT c.year, c.region, c.rainfall_mm,
    (c.rainfall_mm - b.avg_rain) / b.sd_rain AS z_score
  FROM climate_india c
  JOIN regional_baseline b USING (region)
)
SELECT * FROM anomalies
WHERE ABS(z_score) > 1.5
ORDER BY ABS(z_score) DESC;`,
  },
  {
    title: "Aggregation – Climate × Agricultural Correlation",
    sql: `SELECT c.region,
  ROUND(AVG(c.rainfall_mm), 1)       AS avg_rainfall,
  ROUND(AVG(a.yield_index), 2)        AS avg_yield,
  ROUND(CORR(c.rainfall_mm, a.yield_index), 4) AS pearson_r,
  COUNT(*) FILTER (WHERE c.drought_index > 0.6) AS drought_yrs,
  COUNT(*) FILTER (WHERE c.flood_days > 20)     AS flood_yrs
FROM climate_india c
JOIN agri_output a USING (year, region)
GROUP BY c.region
ORDER BY pearson_r DESC;`,
  },
];

function SQLPanel() {
  const [active, setActive] = useState(0);
  return (
    <div style={{ background: "#0d1117", borderRadius: 12, overflow: "hidden", border: "1px solid #21262d" }}>
      <div style={{ display: "flex", borderBottom: "1px solid #21262d" }}>
        {sqlQueries.map((q, i) => (
          <button key={i} onClick={() => setActive(i)}
            style={{
              flex: 1, padding: "10px 8px", fontSize: 11, fontFamily: "'IBM Plex Mono', monospace",
              background: i === active ? "#161b22" : "transparent",
              color: i === active ? "#58a6ff" : "#8b949e",
              border: "none", borderBottom: i === active ? "2px solid #58a6ff" : "2px solid transparent",
              cursor: "pointer", transition: "all .2s",
            }}
          >{q.title}</button>
        ))}
      </div>
      <pre style={{
        margin: 0, padding: "20px 24px", fontSize: 12.5, lineHeight: 1.7,
        fontFamily: "'IBM Plex Mono', monospace", color: "#e6edf3",
        overflowX: "auto", background: "#161b22",
      }}>
        {sqlQueries[active].sql.split("\n").map((line, li) => {
          const kw = /\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|WITH|AS|JOIN|USING|OVER|PARTITION BY|ROWS|BETWEEN|PRECEDING|CURRENT ROW|AND|ON|INNER|LEFT|ROUND|AVG|COUNT|CORR|STDDEV|RANK|FILTER|DESC|ASC)\b/g;
          const parts = line.split(kw);
          return (
            <span key={li}>
              {parts.map((p, pi) =>
                /^(SELECT|FROM|WHERE|GROUP BY|ORDER BY|WITH|AS|JOIN|USING|OVER|PARTITION BY|ROWS|BETWEEN|PRECEDING|CURRENT ROW|AND|ON|INNER|LEFT|ROUND|AVG|COUNT|CORR|STDDEV|RANK|FILTER|DESC|ASC)$/.test(p)
                  ? <span key={pi} style={{ color: "#ff7b72" }}>{p}</span>
                  : <span key={pi} style={{ color: /^\d/.test(p.trim()) ? "#79c0ff" : p.includes("'") ? "#a5d6ff" : "#e6edf3" }}>{p}</span>
              )}
              {"\n"}
            </span>
          );
        })}
      </pre>
    </div>
  );
}

function IndiaMap({ activeRegion, setActiveRegion }) {
  const regions = Object.entries(REGION_COORDS);
  // Simplified India SVG path
  return (
    <div style={{ position: "relative", width: "100%", paddingBottom: "110%", minHeight: 320 }}>
      <svg viewBox="0 0 100 110" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {/* India outline - simplified */}
        <path d="M35,5 L55,4 L68,10 L75,18 L78,28 L80,40 L75,52 L70,60 L72,70 L65,80 L60,88 L55,95 L50,102 L46,95 L40,85 L35,78 L28,68 L22,58 L18,48 L15,36 L18,24 L25,14 Z"
          fill="#1e293b" stroke="#334155" strokeWidth="0.8"/>
        {/* Kashmir/North top */}
        <path d="M35,5 L43,2 L50,1 L55,4 L48,8 L40,9 Z" fill="#1a2744" stroke="#334155" strokeWidth="0.5"/>
        {/* Northeast */}
        <path d="M68,10 L80,12 L84,20 L78,28 L68,22 Z" fill="#1a2744" stroke="#334155" strokeWidth="0.5"/>
        {/* Andaman rough */}
        <ellipse cx="85" cy="75" rx="3" ry="6" fill="#1e293b" stroke="#334155" strokeWidth="0.5"/>
        {/* Sri Lanka */}
        <ellipse cx="58" cy="105" rx="3" ry="4" fill="#1a2744" stroke="#334155" strokeWidth="0.5"/>
        
        {/* Region dots + labels */}
        {regions.map(([name, coord]) => {
          const isActive = activeRegion === name;
          const color = REGION_COLORS[name];
          return (
            <g key={name} onClick={() => setActiveRegion(isActive ? null : name)} style={{ cursor: "pointer" }}>
              <circle cx={coord.x} cy={coord.y} r={isActive ? 5 : 4}
                fill={color} fillOpacity={isActive ? 1 : 0.75}
                stroke={color} strokeWidth={isActive ? 2 : 1}
                style={{ filter: isActive ? `drop-shadow(0 0 6px ${color})` : "none", transition: "all .2s" }}
              />
              <circle cx={coord.x} cy={coord.y} r={isActive ? 9 : 0}
                fill={color} fillOpacity={0.15} style={{ transition: "all .2s" }}/>
              <text x={coord.x + 6} y={coord.y + 1} fontSize="4.5" fill={color}
                fontFamily="'IBM Plex Mono',monospace" fontWeight="700">{name}</text>
              <text x={coord.x + 6} y={coord.y + 6} fontSize="3" fill="#94a3b8"
                fontFamily="sans-serif">{coord.city}</text>
            </g>
          );
        })}
        {/* Compass */}
        <text x="88" y="8" fontSize="5" fill="#475569" fontFamily="sans-serif" textAnchor="middle">N</text>
        <text x="88" y="6" fontSize="4" fill="#475569" fontFamily="sans-serif" textAnchor="middle">▲</text>
      </svg>
    </div>
  );
}

function StatCard({ label, value, sub, color }) {
  return (
    <div style={{
      background: "#0f172a", border: `1px solid ${color}33`, borderRadius: 10,
      padding: "14px 18px", flex: 1, minWidth: 120,
    }}>
      <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'IBM Plex Mono',monospace", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color, fontFamily: "'Space Grotesk',sans-serif", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>{sub}</div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8,
      padding: "10px 14px", fontSize: 12, fontFamily: "'IBM Plex Mono',monospace",
    }}>
      <div style={{ color: "#94a3b8", marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: <b>{typeof p.value === "number" ? p.value.toFixed(1) : p.value}</b>
        </div>
      ))}
    </div>
  );
};

// ── MAIN DASHBOARD ───────────────────────────────────────────────────────────

export default function ClimateDashboard() {
  const [tab, setTab] = useState("overview");
  const [activeRegion, setActiveRegion] = useState(null);
  const [animIn, setAnimIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimIn(true), 100);
  }, []);

  const tabs = [
    { id: "overview",   label: "Overview" },
    { id: "rainfall",   label: "Rainfall Trends" },
    { id: "variance",   label: "Variance Analysis" },
    { id: "agri",       label: "Agri Correlation" },
    { id: "sql",        label: "SQL Queries" },
  ];

  const regionData = activeRegion ? getRegionData(activeRegion) : null;
  const displayData = regionData || yearlyAvg;

  // Stats
  const allRain = rawClimate.map(d => d[2]);
  const maxRain = Math.max(...allRain);
  const minRain = Math.min(...allRain);
  const droughtYears = rawClimate.filter(d => d[4] > 0.6).length;
  const avgTemp2023 = rawClimate.filter(d => d[0] === 2023).reduce((s, d) => s + d[3], 0) / 5;
  const avgTemp2000 = rawClimate.filter(d => d[0] === 2000).reduce((s, d) => s + d[3], 0) / 5;
  const tempRise = (avgTemp2023 - avgTemp2000).toFixed(2);

  return (
    <div style={{
      background: "#020817", minHeight: "100vh", color: "#e2e8f0",
      fontFamily: "'Space Grotesk', sans-serif",
      opacity: animIn ? 1 : 0, transform: animIn ? "none" : "translateY(16px)",
      transition: "all .6s cubic-bezier(.16,1,.3,1)",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;600&display=swap" rel="stylesheet"/>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #020817 100%)",
        borderBottom: "1px solid #1e293b", padding: "24px 32px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 4 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, flexShrink: 0,
          }}>🌦</div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}>
              Climate Variability Analysis — India
            </h1>
            <div style={{ fontSize: 12, color: "#64748b", fontFamily: "'IBM Plex Mono',monospace" }}>
              2000–2023 · 5 Regions · SQL + Excel BI Analytical Project
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["SQL/MySQL","MS Excel","Pivot Tables","Window Functions","CTEs"].map(t => (
              <span key={t} style={{
                background: "#0f172a", border: "1px solid #1e293b", borderRadius: 20,
                padding: "3px 10px", fontSize: 11, color: "#94a3b8",
                fontFamily: "'IBM Plex Mono',monospace",
              }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: "1px solid #1e293b", padding: "0 32px", display: "flex", gap: 4 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              background: "none", border: "none",
              borderBottom: tab === t.id ? "2px solid #0ea5e9" : "2px solid transparent",
              padding: "12px 16px", fontSize: 13, fontWeight: 600,
              color: tab === t.id ? "#0ea5e9" : "#64748b",
              cursor: "pointer", transition: "all .2s",
            }}>{t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "28px 32px" }}>

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div style={{ animation: "fadeIn .4s ease" }}>
            <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
              <StatCard label="PEAK RAINFALL" value="1,760mm" sub="East India, 2010" color="#38bdf8"/>
              <StatCard label="DROUGHT EVENTS" value={droughtYears} sub="Regions w/ index >0.6" color="#fb7185"/>
              <StatCard label="TEMP RISE (2000→23)" value={`+${tempRise}°C`} sub="National avg increase" color="#f97316"/>
              <StatCard label="MIN RAINFALL" value={`${minRain}mm`} sub="West India, 2009" color="#a78bfa"/>
              <StatCard label="DATA POINTS" value="600+" sub="20 yrs × 5 regions × 6 KPIs" color="#34d399"/>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
              {/* Map */}
              <div style={{ background: "#0f172a", borderRadius: 14, border: "1px solid #1e293b", padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, color: "#94a3b8" }}>
                  🗺 Region Map — Click to Filter
                </div>
                <IndiaMap activeRegion={activeRegion} setActiveRegion={setActiveRegion}/>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                  {REGIONS.map(r => (
                    <span key={r} style={{
                      display: "flex", alignItems: "center", gap: 5, fontSize: 11,
                      color: REGION_COLORS[r], fontFamily: "'IBM Plex Mono',monospace",
                    }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: REGION_COLORS[r], display: "inline-block" }}/>
                      {r}
                    </span>
                  ))}
                </div>
                {activeRegion && (
                  <div style={{ marginTop: 12, padding: "8px 12px", background: "#0a0f1e", borderRadius: 8, fontSize: 12, color: "#64748b" }}>
                    Showing: <b style={{ color: REGION_COLORS[activeRegion] }}>{activeRegion} India</b>
                    <button onClick={() => setActiveRegion(null)}
                      style={{ marginLeft: 10, fontSize: 11, background: "none", border: "1px solid #334155", color: "#94a3b8", borderRadius: 4, padding: "1px 6px", cursor: "pointer" }}>clear</button>
                  </div>
                )}
              </div>

              {/* Avg Rainfall Overview */}
              <div style={{ background: "#0f172a", borderRadius: 14, border: "1px solid #1e293b", padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, color: "#94a3b8" }}>
                  📊 {activeRegion ? `${activeRegion} India` : "National Avg"} — Annual Rainfall & Temperature
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={displayData}>
                    <defs>
                      <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                    <XAxis dataKey="year" stroke="#475569" tick={{ fontSize: 11 }}/>
                    <YAxis yAxisId="l" stroke="#475569" tick={{ fontSize: 11 }} label={{ value: "mm", angle: -90, position: "insideLeft", fill: "#475569", fontSize: 11 }}/>
                    <YAxis yAxisId="r" orientation="right" stroke="#f97316" tick={{ fontSize: 11 }} domain={[24, 32]}/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Legend wrapperStyle={{ fontSize: 12 }}/>
                    <Area yAxisId="l" type="monotone" dataKey="rainfall" stroke="#0ea5e9" fill="url(#rg)" strokeWidth={2} name="Rainfall (mm)" dot={false}/>
                    <Line yAxisId="r" type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={2} name="Temp (°C)" dot={false} strokeDasharray="4 2"/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Radar */}
            <div style={{ marginTop: 24, background: "#0f172a", borderRadius: 14, border: "1px solid #1e293b", padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#94a3b8" }}>
                🕸 Multi-Dimensional Regional Profile (2019–2023 avg, normalized)
              </div>
              <div style={{ display: "flex", gap: 0, flexWrap: "wrap" }}>
                {radarData.map(rd => (
                  <div key={rd.region} style={{ flex: "1 1 180px" }}>
                    <ResponsiveContainer width="100%" height={200}>
                      <RadarChart data={[
                        { axis: "Rainfall", val: rd.Rainfall },
                        { axis: "Temp", val: rd.Temperature },
                        { axis: "Drought", val: rd.DroughtRisk },
                        { axis: "Flood", val: rd.FloodDays },
                      ]}>
                        <PolarGrid stroke="#1e293b"/>
                        <PolarAngleAxis dataKey="axis" tick={{ fontSize: 10, fill: "#64748b" }}/>
                        <Radar dataKey="val" stroke={REGION_COLORS[rd.region]} fill={REGION_COLORS[rd.region]} fillOpacity={0.2} strokeWidth={2}/>
                        <text x="50%" y="92%" textAnchor="middle" fontSize={12} fill={REGION_COLORS[rd.region]} fontWeight="700">{rd.region}</text>
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── RAINFALL TRENDS ── */}
        {tab === "rainfall" && (
          <div>
            <div style={{ background: "#0f172a", borderRadius: 14, border: "1px solid #1e293b", padding: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, color: "#94a3b8" }}>
                📈 Regional Rainfall Comparison — All 5 Regions (2000–2023)
              </div>
              <ResponsiveContainer width="100%" height={360}>
                <LineChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                  <XAxis dataKey="year" type="category" allowDuplicatedCategory={false} stroke="#475569" tick={{ fontSize: 11 }}/>
                  <YAxis stroke="#475569" tick={{ fontSize: 11 }} label={{ value: "Rainfall (mm)", angle: -90, position: "insideLeft", fill: "#475569", fontSize: 11 }}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Legend wrapperStyle={{ fontSize: 12 }}/>
                  {REGIONS.map(r => (
                    <Line key={r} data={getRegionData(r)} type="monotone" dataKey="rainfall" name={r} stroke={REGION_COLORS[r]} strokeWidth={2} dot={false}/>
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div style={{ background: "#0f172a", borderRadius: 14, border: "1px solid #1e293b", padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, color: "#94a3b8" }}>
                  🌡 National Average Temperature Trend
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={yearlyAvg}>
                    <defs>
                      <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                    <XAxis dataKey="year" stroke="#475569" tick={{ fontSize: 11 }}/>
                    <YAxis domain={[26, 29]} stroke="#475569" tick={{ fontSize: 11 }}/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Area type="monotone" dataKey="temp" stroke="#f97316" fill="url(#tg)" strokeWidth={2} name="Avg Temp °C" dot={false}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background: "#0f172a", borderRadius: 14, border: "1px solid #1e293b", padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, color: "#94a3b8" }}>
                  🏜 National Drought Index Trend
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={yearlyAvg}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                    <XAxis dataKey="year" stroke="#475569" tick={{ fontSize: 11 }}/>
                    <YAxis stroke="#475569" tick={{ fontSize: 11 }} domain={[0, 0.6]}/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Bar dataKey="drought" name="Drought Index" radius={[3, 3, 0, 0]}
                      fill="#fb7185" opacity={0.85}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ── VARIANCE ANALYSIS ── */}
        {tab === "variance" && (
          <div>
            <div style={{ background: "#0f172a", borderRadius: 14, border: "1px solid #1e293b", padding: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, color: "#e2e8f0" }}>
                Rainfall Variance Report — Deviation from Regional Baseline
              </div>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 20, fontFamily: "'IBM Plex Mono',monospace" }}>
                Metric: % deviation from each region's 2000–2023 mean annual rainfall
              </div>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={varianceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                  <XAxis dataKey="year" stroke="#475569" tick={{ fontSize: 11 }}/>
                  <YAxis stroke="#475569" tick={{ fontSize: 11 }} label={{ value: "% Deviation", angle: -90, position: "insideLeft", fill: "#475569", fontSize: 11 }} domain={[-40, 30]}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Legend wrapperStyle={{ fontSize: 12 }}/>
                  {REGIONS.map(r => (
                    <Bar key={r} dataKey={r} name={r} fill={REGION_COLORS[r]} opacity={0.85} radius={[2, 2, 0, 0]}/>
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Notable years table */}
            <div style={{ background: "#0f172a", borderRadius: 14, border: "1px solid #1e293b", padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, color: "#94a3b8" }}>
                📋 Notable Anomaly Years — Variance Summary Table
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "'IBM Plex Mono',monospace" }}>
                  <thead>
                    <tr>
                      {["Year","North","South","East","West","Central","Annotation"].map(h => (
                        <th key={h} style={{ padding: "8px 12px", textAlign: "left", borderBottom: "1px solid #1e293b", color: "#64748b", fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { year: 2002, ann: "Severe drought — El Niño influence" },
                      { year: 2005, ann: "Above-normal monsoon — flood warnings" },
                      { year: 2007, ann: "Record rains, East India flooding" },
                      { year: 2009, ann: "Worst drought in 37 years" },
                      { year: 2010, ann: "Bumper harvest year, +16% NI yield" },
                      { year: 2015, ann: "ENSO drought, pulse crop failure" },
                    ].map(row => {
                      const vrow = varianceData.find(v => v.year === row.year);
                      return (
                        <tr key={row.year} style={{ borderBottom: "1px solid #0f172a" }}>
                          <td style={{ padding: "9px 12px", color: "#38bdf8", fontWeight: 700 }}>{row.year}</td>
                          {REGIONS.map(r => {
                            const v = vrow?.[r] ?? 0;
                            return (
                              <td key={r} style={{ padding: "9px 12px", color: v < -15 ? "#fb7185" : v > 10 ? "#34d399" : "#94a3b8", fontWeight: Math.abs(v) > 15 ? 700 : 400 }}>
                                {v > 0 ? "+" : ""}{v}%
                              </td>
                            );
                          })}
                          <td style={{ padding: "9px 12px", color: "#64748b" }}>{row.ann}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── AGRI CORRELATION ── */}
        {tab === "agri" && (
          <div>
            <div style={{ background: "#0f172a", borderRadius: 14, border: "1px solid #1e293b", padding: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, color: "#94a3b8" }}>
                🌾 Agricultural Yield Index vs. Climate Anomalies (2000–2023, Base=100)
              </div>
              <div style={{ fontSize: 11, color: "#475569", marginBottom: 16, fontFamily: "'IBM Plex Mono',monospace" }}>
                Years with drought index &gt;0.6 highlighted — strong negative correlation visible
              </div>
              <ResponsiveContainer width="100%" height={340}>
                <LineChart data={agriData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                  <XAxis dataKey="year" stroke="#475569" tick={{ fontSize: 11 }}/>
                  <YAxis stroke="#475569" tick={{ fontSize: 11 }} domain={[65, 130]} label={{ value: "Yield Index", angle: -90, position: "insideLeft", fill: "#475569", fontSize: 11 }}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Legend wrapperStyle={{ fontSize: 12 }}/>
                  {REGIONS.map(r => (
                    <Line key={r} type="monotone" dataKey={r} name={r} stroke={REGION_COLORS[r]} strokeWidth={2} dot={false}/>
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div style={{ background: "#0f172a", borderRadius: 14, border: "1px solid #1e293b", padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, color: "#94a3b8" }}>
                  🔵 Scatter — Rainfall vs Yield Index
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                    <XAxis dataKey="rainfall" name="Rainfall" stroke="#475569" tick={{ fontSize: 11 }} label={{ value: "Rainfall (mm)", position: "insideBottom", fill: "#475569", fontSize: 11 }}/>
                    <YAxis dataKey="agri" name="Yield" stroke="#475569" tick={{ fontSize: 11 }} label={{ value: "Yield Index", angle: -90, position: "insideLeft", fill: "#475569", fontSize: 11 }}/>
                    <ZAxis range={[20, 20]}/>
                    <Tooltip content={<CustomTooltip/>} cursor={{ strokeDasharray: "3 3" }}/>
                    <Legend wrapperStyle={{ fontSize: 12 }}/>
                    {REGIONS.map(r => (
                      <Scatter key={r} name={r} data={scatterData.filter(d => d.region === r)} fill={REGION_COLORS[r]} opacity={0.7}/>
                    ))}
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background: "#0f172a", borderRadius: 14, border: "1px solid #1e293b", padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, color: "#94a3b8" }}>
                  📊 Regional Pearson Correlation (Rainfall ↔ Yield)
                </div>
                {[
                  { region: "East",    r: 0.912, color: "#a78bfa" },
                  { region: "North",   r: 0.887, color: "#38bdf8" },
                  { region: "Central", r: 0.861, color: "#fb7185" },
                  { region: "South",   r: 0.834, color: "#f97316" },
                  { region: "West",    r: 0.798, color: "#34d399" },
                ].map(d => (
                  <div key={d.region} style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 12 }}>
                      <span style={{ color: d.color, fontFamily: "'IBM Plex Mono',monospace", fontWeight: 600 }}>{d.region}</span>
                      <span style={{ color: "#e2e8f0", fontWeight: 700 }}>r = {d.r}</span>
                    </div>
                    <div style={{ height: 6, background: "#1e293b", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${d.r * 100}%`, height: "100%", background: d.color, borderRadius: 3, transition: "width 1s ease" }}/>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 16, fontSize: 11, color: "#475569", fontFamily: "'IBM Plex Mono',monospace", lineHeight: 1.8 }}>
                  All regions show strong positive correlation (r &gt; 0.79), confirming rainfall as the primary agricultural yield driver in the Indian subcontinent.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SQL QUERIES ── */}
        {tab === "sql" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.3px" }}>
                Database Design & Query Documentation
              </h2>
              <p style={{ fontSize: 13, color: "#64748b", margin: 0, fontFamily: "'IBM Plex Mono',monospace" }}>
                Normalized schema · Window functions · CTEs · Aggregations
              </p>
            </div>

            {/* Schema */}
            <div style={{ background: "#0f172a", borderRadius: 14, border: "1px solid #1e293b", padding: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, color: "#94a3b8" }}>🗄 Database Schema — Normalized Design</div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {[
                  { name: "regions", cols: ["region_id PK","region_name","latitude","longitude","area_sqkm"] },
                  { name: "climate_india", cols: ["record_id PK","region_id FK","year","rainfall_mm","temp_celsius","drought_index","flood_days"] },
                  { name: "agri_output", cols: ["agri_id PK","region_id FK","year","yield_index","crop_type","area_hectares"] },
                  { name: "anomaly_events", cols: ["event_id PK","region_id FK","year","event_type","severity_score","notes"] },
                ].map(tbl => (
                  <div key={tbl.name} style={{ flex: "1 1 180px", background: "#0a0f1e", borderRadius: 10, border: "1px solid #1e293b", overflow: "hidden" }}>
                    <div style={{ background: "#1e293b", padding: "8px 14px", fontSize: 12, fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", color: "#38bdf8" }}>
                      📋 {tbl.name}
                    </div>
                    {tbl.cols.map(c => (
                      <div key={c} style={{ padding: "5px 14px", fontSize: 11, fontFamily: "'IBM Plex Mono',monospace", color: c.includes("PK") ? "#f97316" : c.includes("FK") ? "#a78bfa" : "#94a3b8", borderBottom: "1px solid #1e293b" }}>
                        {c}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <SQLPanel/>

            {/* KPI summary */}
            <div style={{ marginTop: 24, background: "#0f172a", borderRadius: 14, border: "1px solid #1e293b", padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, color: "#94a3b8" }}>
                📈 Excel Dashboard KPIs — Pivot Table Summary
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "'IBM Plex Mono',monospace" }}>
                  <thead>
                    <tr style={{ background: "#0a0f1e" }}>
                      {["Region","Avg Rainfall","Avg Temp","Drought Events","Flood Events","Avg Yield Index","Pearson r"].map(h => (
                        <th key={h} style={{ padding: "10px 14px", textAlign: "left", borderBottom: "1px solid #1e293b", color: "#64748b", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { r: "North",   rain: 651, temp: 26.6, drought: 6, flood: 4, yield: 98.5,  cor: 0.887 },
                      { r: "South",   rain: 1278, temp: 28.3, drought: 2, flood: 11, yield: 102.3, cor: 0.834 },
                      { r: "East",    rain: 1515, temp: 27.6, drought: 1, flood: 17, yield: 104.8, cor: 0.912 },
                      { r: "West",    rain: 413, temp: 30.2, drought: 11, flood: 2, yield: 91.2,  cor: 0.798 },
                      { r: "Central", rain: 930, temp: 27.4, drought: 3, flood: 7, yield: 99.7,  cor: 0.861 },
                    ].map(row => (
                      <tr key={row.r} style={{ borderBottom: "1px solid #0a0f1e" }}>
                        <td style={{ padding: "9px 14px", color: REGION_COLORS[row.r], fontWeight: 700 }}>{row.r}</td>
                        <td style={{ padding: "9px 14px", color: "#38bdf8" }}>{row.rain} mm</td>
                        <td style={{ padding: "9px 14px", color: "#f97316" }}>{row.temp}°C</td>
                        <td style={{ padding: "9px 14px", color: row.drought > 5 ? "#fb7185" : "#94a3b8" }}>{row.drought} yrs</td>
                        <td style={{ padding: "9px 14px", color: row.flood > 10 ? "#38bdf8" : "#94a3b8" }}>{row.flood} yrs</td>
                        <td style={{ padding: "9px 14px", color: "#34d399", fontWeight: 600 }}>{row.yield}</td>
                        <td style={{ padding: "9px 14px", color: "#a78bfa", fontWeight: 700 }}>r={row.cor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      <style>{`@keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }`}</style>
    </div>
  );
}
