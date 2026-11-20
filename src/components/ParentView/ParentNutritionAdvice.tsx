import React, { useState } from 'react';
import { NUTRITION_RECIPES } from '../../data/initialData';
import { Utensils, Heart, Clock, Sparkles, Check, ChevronRight, Apple, Flame, AlertCircle } from 'lucide-react';

interface ParentNutritionAdviceProps {
  childAgeMonths: number;
}

export const ParentNutritionAdvice: React.FC<ParentNutritionAdviceProps> = ({ childAgeMonths }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(NUTRITION_RECIPES[0]);
  const [portionWeight, setPortionWeight] = useState(10.1);

  // Estimasi Kebutuhan Kalori berdasarkan BB
  // Kemenkes: ~100 kcal / kg BB untuk balita 1-2 tahun
  const estimatedCalories = Math.round(portionWeight * 95);
  const estimatedProtein = Math.round(portionWeight * 1.5); // ~15-18 gr

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
      <div>
        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          Pedoman Gizi Seimbang Kemenkes RI
        </span>
        <h3 className="font-extrabold text-slate-900 text-lg mt-1">
          Rekomendasi Menu MPASI & Protein Hewani Ganda
        </h3>
        <p className="text-xs text-slate-500">
          Optimalisasi pertumbuhan linier anak dan pencegahan stunting melalui pemenuhan zat gizi makro dan mikro harian.
        </p>
      </div>

      {/* Kalkulator Kebutuhan Kalori Anak */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border border-emerald-200/80">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Flame className="w-4 h-4 text-emerald-600" />
              <span>Kalkulator Kebutuhan Energi & Protein Harian Balita</span>
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Dihitung otomatis berdasarkan berat badan balita ({portionWeight} kg) usia {childAgeMonths} bulan.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white px-3.5 py-2 rounded-xl border border-emerald-200 shadow-2xs text-center">
              <span className="text-[10px] text-slate-500 font-bold block">Energi Harian</span>
              <strong className="text-emerald-800 text-base font-black font-mono">~{estimatedCalories} kkal</strong>
            </div>
            <div className="bg-white px-3.5 py-2 rounded-xl border border-emerald-200 shadow-2xs text-center">
              <span className="text-[10px] text-slate-500 font-bold block">Protein Hewani</span>
              <strong className="text-emerald-800 text-base font-black font-mono">~{estimatedProtein} gram</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Resep Pilihan Kaya Protein Hewani */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Daftar Resep */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
            Pilihan Resep PMT Pangan Lokal
          </h4>
          {NUTRITION_RECIPES.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedRecipe.id === recipe.id
                  ? 'bg-emerald-50 border-emerald-500 shadow-xs ring-1 ring-emerald-500'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                {recipe.ageRange}
              </span>
              <h5 className="font-bold text-slate-900 text-sm mt-1.5">{recipe.title}</h5>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {recipe.prepTime}
                </span>
                <span className="text-emerald-700 font-medium">Protein Ganda</span>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Resep Terpilih */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {selectedRecipe.ageRange} • {selectedRecipe.prepTime}
              </span>
              <h4 className="font-black text-slate-900 text-lg mt-1">{selectedRecipe.title}</h4>
              <p className="text-xs text-emerald-800 font-semibold mt-0.5">
                Kombinasi: {selectedRecipe.proteinGanda}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Bahan-Bahan:</h5>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              {selectedRecipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-100">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-1.5">
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Langkah Memasak:</h5>
            <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
              {selectedRecipe.instructions}
            </p>
          </div>

          <div className="p-3 bg-emerald-100/60 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <strong className="block font-bold">Mengapa menu ini efektif mencegah stunting?</strong>
            <p className="text-emerald-800 leading-relaxed">{selectedRecipe.benefits}</p>
          </div>
        </div>
      </div>

      {/* Pedoman Feeding Rules Kemenkes */}
      <div className="border-t border-slate-100 pt-6 space-y-3">
        <h4 className="font-bold text-slate-900 text-sm">
          Aturan Pemberian Makan (Feeding Rules) Rekomendasi Dokter Spesialis Anak:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
            <strong className="text-slate-900 block font-bold">1. Teratur & Tepat Waktu</strong>
            <p className="text-slate-500 leading-relaxed">
              Buat jadwal makan teratur 3 kali makan utama dan 2 kali selingan. Batasi waktu makan maksimal 30 menit.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
            <strong className="text-slate-900 block font-bold">2. Lingkungan Netral</strong>
            <p className="text-slate-500 leading-relaxed">
              Tidak ada paksaan saat makan, jangan gunakan gawai/layar ponsel atau mainan sebagai distraksi menyuap.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
            <strong className="text-slate-900 block font-bold">3. Protein Hewani Setiap Kali Makan</strong>
            <p className="text-slate-500 leading-relaxed">
              Pastikan selalu ada protein hewani (telur, ikan, ayam, daging sapi, hati) di setiap piring sajian anak.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
