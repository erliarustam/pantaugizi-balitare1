import React, { useState } from 'react';
import { ChildProfile, MeasurementRecord, GrowthMetric } from '../../types';
import { WHO_BBU_BOYS, WHO_BBU_GIRLS } from '../../utils/whoStandards';
import { Info, TrendingUp, Filter, Calendar, Award, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ParentKmsChartProps {
  child: ChildProfile;
  measurements: MeasurementRecord[];
}

export const ParentKmsChart: React.FC<ParentKmsChartProps> = ({ child, measurements }) => {
  const [metric, setMetric] = useState<GrowthMetric>('bbu');
  const [hoveredPoint, setHoveredPoint] = useState<MeasurementRecord | null>(null);

  // Urutkan pengukuran berdasarkan usia bulan ascending
  const sortedMeasurements = [...measurements].sort((a, b) => a.ageMonths - b.ageMonths);
  
  // Pilih tabel referensi standar WHO sesuai jenis kelamin
  const referenceData = child.gender === 'L' ? WHO_BBU_BOYS : WHO_BBU_GIRLS;

  // Dimensi SVG
  const width = 800;
  const height = 400;
  const padding = { top: 40, right: 40, bottom: 50, left: 60 };

  // Domain X (0 - 24 bulan)
  const maxMonth = 24;
  const getX = (month: number) => {
    return padding.left + (month / maxMonth) * (width - padding.left - padding.right);
  };

  // Domain Y untuk BB/U (0 - 20 kg)
  const minY = 0;
  const maxY = 20;
  const getY = (val: number) => {
    return height - padding.bottom - ((val - minY) / (maxY - minY)) * (height - padding.top - padding.bottom);
  };

  // Generate SVG Path untuk pita kurva standar
  const generatePath = (key: 'm3' | 'm2' | 'm1' | 'median' | 'p1' | 'p2' | 'p3') => {
    const pts = referenceData
      .filter((d) => d.month <= maxMonth)
      .map((d) => `${getX(d.month)},${getY(d[key])}`);
    return `M ${pts.join(' L ')}`;
  };

  // Generate SVG polygon untuk area warna KMS
  const generateArea = (
    keyTop: 'p3' | 'p2' | 'p1' | 'median' | 'm1' | 'm2',
    keyBottom: 'p2' | 'p1' | 'median' | 'm1' | 'm2' | 'm3'
  ) => {
    const validData = referenceData.filter((d) => d.month <= maxMonth);
    const topPts = validData.map((d) => `${getX(d.month)},${getY(d[keyTop])}`);
    const btmPts = [...validData].reverse().map((d) => `${getX(d.month)},${getY(d[keyBottom])}`);
    return `M ${topPts.join(' L ')} L ${btmPts.join(' L ')} Z`;
  };

  const isBoy = child.gender === 'L';
  const themeBg = isBoy ? 'bg-sky-50 border-sky-200' : 'bg-pink-50 border-pink-200';
  const themeAccent = isBoy ? 'text-sky-700' : 'text-pink-700';

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
              isBoy ? 'bg-sky-100 text-sky-800' : 'bg-rose-100 text-rose-800'
            }`}>
              Buku KIA Resmi • KMS {isBoy ? 'Laki-Laki (Biru)' : 'Perempuan (Merah Muda)'}
            </span>
            <span className="text-xs text-slate-500 font-medium">Standar Acuan WHO 2006</span>
          </div>
          <h3 className="font-extrabold text-slate-900 text-lg mt-1">
            Grafik Pertumbuhan Antropometri: {child.name}
          </h3>
          <p className="text-xs text-slate-500">
            Arahkan kursor atau sentuh titik pengukuran pada kurva untuk melihat rincian kenaikan (N/T) dan deviasi Z-score.
          </p>
        </div>

        {/* Metric Selector */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setMetric('bbu')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              metric === 'bbu'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Berat Badan / Usia (BB/U)
          </button>
          <button
            onClick={() => setMetric('pbu')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              metric === 'pbu'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Panjang Badan / Usia (PB/U)
          </button>
          <button
            onClick={() => setMetric('bbpb')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              metric === 'bbpb'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            BB / PB (Gizi Akut)
          </button>
        </div>
      </div>

      {/* Legend KMS Kemenkes */}
      <div className="flex flex-wrap items-center gap-4 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
        <span className="font-bold text-slate-600">Pita KMS:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-emerald-500/80 border border-emerald-600"></span>
          <span className="text-slate-700 font-medium">Pita Hijau (Normal: -2 SD s.d. +2 SD)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-amber-400/80 border border-amber-500"></span>
          <span className="text-slate-700 font-medium">Pita Kuning (-2 SD s.d. -3 SD / Waspada)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-rose-500/80 border border-rose-600"></span>
          <span className="text-slate-700 font-medium">Bawah Garis Merah (&lt; -3 SD / BGM)</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-900"></span>
          <span className="text-slate-900 font-bold">● Titik Ukur Balita</span>
        </div>
      </div>

      {/* Interactive SVG Chart Container */}
      <div className="relative bg-slate-50/50 rounded-2xl border border-slate-200 overflow-hidden p-2 sm:p-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none overflow-visible"
        >
          {/* Grid lines horizontal */}
          {[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20].map((val) => (
            <g key={val}>
              <line
                x1={padding.left}
                y1={getY(val)}
                x2={width - padding.right}
                y2={getY(val)}
                stroke="#e2e8f0"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 10}
                y={getY(val) + 4}
                textAnchor="end"
                className="text-[10px] fill-slate-400 font-mono"
              >
                {val} kg
              </text>
            </g>
          ))}

          {/* Grid lines vertical (Months) */}
          {[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24].map((m) => (
            <g key={m}>
              <line
                x1={getX(m)}
                y1={padding.top}
                x2={getX(m)}
                y2={height - padding.bottom}
                stroke="#e2e8f0"
                strokeWidth="1"
                strokeDasharray={m % 6 === 0 ? '0' : '3 3'}
              />
              <text
                x={getX(m)}
                y={height - padding.bottom + 18}
                textAnchor="middle"
                className="text-[11px] fill-slate-500 font-medium"
              >
                {m}
              </text>
            </g>
          ))}

          <text
            x={width / 2}
            y={height - 10}
            textAnchor="middle"
            className="text-[11px] fill-slate-500 font-bold uppercase tracking-wider"
          >
            Usia Anak (Bulan)
          </text>

          {/* Area Bands KMS */}
          {/* 1. Area Bawah Garis Merah (< -3 SD) */}
          <path
            d={`${generatePath('m3')} L ${width - padding.right},${getY(0)} L ${padding.left},${getY(0)} Z`}
            fill="#ffe4e6"
            opacity="0.6"
          />

          {/* 2. Area Kuning (-3 SD s.d. -2 SD) */}
          <path d={generateArea('m2', 'm3')} fill="#fef3c7" opacity="0.8" />

          {/* 3. Area Hijau (-2 SD s.d. +2 SD) */}
          <path d={generateArea('p2', 'm2')} fill="#d1fae5" opacity="0.75" />

          {/* 4. Area Risiko Lebih (+2 SD s.d. +3 SD) */}
          <path d={generateArea('p3', 'p2')} fill="#fef9c3" opacity="0.6" />

          {/* Boundary Curves */}
          <path d={generatePath('p3')} fill="none" stroke="#eab308" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d={generatePath('p2')} fill="none" stroke="#10b981" strokeWidth="1.5" />
          <path d={generatePath('median')} fill="none" stroke="#059669" strokeWidth="2.5" />
          <path d={generatePath('m2')} fill="none" stroke="#10b981" strokeWidth="1.5" />
          <path d={generatePath('m3')} fill="none" stroke="#ef4444" strokeWidth="2" />

          {/* Label garis batas */}
          <text x={width - padding.right + 5} y={getY(referenceData[referenceData.length - 3].p3)} className="text-[9px] fill-amber-700 font-bold">+3 SD</text>
          <text x={width - padding.right + 5} y={getY(referenceData[referenceData.length - 3].p2)} className="text-[9px] fill-emerald-700 font-bold">+2 SD</text>
          <text x={width - padding.right + 5} y={getY(referenceData[referenceData.length - 3].median)} className="text-[9px] fill-emerald-800 font-bold">Median (0)</text>
          <text x={width - padding.right + 5} y={getY(referenceData[referenceData.length - 3].m2)} className="text-[9px] fill-emerald-700 font-bold">-2 SD</text>
          <text x={width - padding.right + 5} y={getY(referenceData[referenceData.length - 3].m3)} className="text-[9px] fill-rose-600 font-bold">-3 SD (KBM)</text>

          {/* Trajectory Jalur Pertumbuhan Balita */}
          {sortedMeasurements.length > 1 && (
            <path
              d={`M ${sortedMeasurements.map((m) => `${getX(m.ageMonths)},${getY(m.weight)}`).join(' L ')}`}
              fill="none"
              stroke="#0f172a"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Titik-titik Pengukuran Balita */}
          {sortedMeasurements.map((m, idx) => {
            const cx = getX(m.ageMonths);
            const cy = getY(m.weight);
            const isHovered = hoveredPoint?.id === m.id;
            const isLatest = idx === sortedMeasurements.length - 1;

            return (
              <g key={m.id} className="cursor-pointer">
                {/* Pulse ring for latest measurement */}
                {isLatest && (
                  <circle cx={cx} cy={cy} r="14" fill="#059669" opacity="0.25" className="animate-ping" />
                )}

                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 8 : isLatest ? 7 : 5.5}
                  fill={isLatest ? '#047857' : '#0f172a'}
                  stroke="#ffffff"
                  strokeWidth={2.5}
                  onMouseEnter={() => setHoveredPoint(m)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  onClick={() => setHoveredPoint(m)}
                />

                <text
                  x={cx}
                  y={cy - 12}
                  textAnchor="middle"
                  className="text-[10px] font-bold fill-slate-900 pointer-events-none drop-shadow-xs"
                >
                  {m.weight}kg
                </text>
              </g>
            );
          })}
        </svg>

        {/* Interactive Hover Tooltip Box */}
        {hoveredPoint && (
          <div className="absolute top-4 right-4 bg-slate-900 text-white p-4 rounded-xl shadow-xl max-w-xs text-xs space-y-2 border border-slate-700 pointer-events-none transition-all">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <span className="font-bold text-emerald-400">Usia: {hoveredPoint.ageMonths} Bulan</span>
              <span className="text-[10px] text-slate-300">{hoveredPoint.date}</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Berat Badan:</span>
                <strong className="text-white">{hoveredPoint.weight} kg</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Panjang/Tinggi:</span>
                <strong className="text-white">{hoveredPoint.height} cm</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Z-Score BB/U:</span>
                <strong className={hoveredPoint.bbuZScore < -2 ? 'text-amber-400' : 'text-emerald-400'}>
                  {hoveredPoint.bbuZScore > 0 ? '+' : ''}{hoveredPoint.bbuZScore} SD
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status Kenaikan:</span>
                <span className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${
                  hoveredPoint.kmsGrowthStatus === 'N' ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                }`}>
                  {hoveredPoint.kmsGrowthStatus === 'N' ? 'Naik (N)' : 'Tidak Naik (T)'}
                </span>
              </div>
            </div>
            {hoveredPoint.notes && (
              <p className="text-[11px] text-slate-300 pt-1 border-t border-slate-700 italic">
                "{hoveredPoint.notes}"
              </p>
            )}
          </div>
        )}
      </div>

      {/* Riwayat Penimbangan Tabel Rinci */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-slate-900 text-sm">Riwayat Catatan Buku KIA & Posyandu</h4>
          <span className="text-xs text-slate-500">{sortedMeasurements.length} Pencatatan Terarsip</span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-xs text-left text-slate-600">
            <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Tanggal Ukur</th>
                <th className="p-3">Usia</th>
                <th className="p-3">Berat (kg)</th>
                <th className="p-3">Panjang/Tinggi (cm)</th>
                <th className="p-3">LiLA</th>
                <th className="p-3">Z-Score (BB/U)</th>
                <th className="p-3">KMS (N/T)</th>
                <th className="p-3">Petugas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {sortedMeasurements.slice().reverse().map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-semibold text-slate-900">{rec.date}</td>
                  <td className="p-3">{rec.ageMonths} Bulan</td>
                  <td className="p-3 font-bold text-slate-900">{rec.weight} kg</td>
                  <td className="p-3 font-medium text-slate-700">{rec.height} cm</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {rec.upperArmCircumference || 14.5} cm
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-emerald-700">
                    {rec.bbuZScore > 0 ? `+${rec.bbuZScore}` : rec.bbuZScore} SD
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      rec.kmsGrowthStatus === 'N' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rec.kmsGrowthStatus === 'N' ? 'Tumbuh Naik (N)' : 'Tidak Naik (T)'}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500">{rec.cadreName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
