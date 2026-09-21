import React, { useRef, useEffect, useState } from 'react';
import { WHEEL_PRIZES } from '../data/menuData';
import { WheelPrize } from '../types';
import { Sparkles, Copy, Check, RefreshCw } from 'lucide-react';

export const RuletaSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [spinsLeft, setSpinsLeft] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('doradosSpinsLeft');
      return saved !== null ? parseInt(saved, 10) : 3;
    } catch {
      return 3;
    }
  });

  const [currentRotation, setCurrentRotation] = useState(0);
  const [winningPrize, setWinningPrize] = useState<WheelPrize | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const prizes = WHEEL_PRIZES;
  const n = prizes.length;
  const segAngle = (2 * Math.PI) / n;

  // Draw wheel on canvas
  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const radius = size / 2;

    ctx.clearRect(0, 0, size, size);

    // Draw slices
    prizes.forEach((p, i) => {
      const start = i * segAngle;
      const end = start + segAngle;

      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius - 4, start, end);
      ctx.closePath();
      ctx.fillStyle = p.color;
      ctx.fill();

      // Text label inside slice
      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(start + segAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = p.text;
      ctx.font = 'bold 15px system-ui, sans-serif';
      ctx.fillText(p.label, radius - 24, 5);
      ctx.restore();
    });

    // Center decorative circle
    ctx.beginPath();
    ctx.arc(radius, radius, 32, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFF8ED';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#2B1B0E';
    ctx.stroke();

    // Center emblem
    ctx.fillStyle = '#DA291C';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('M', radius, radius + 1);
  };

  useEffect(() => {
    drawWheel();
  }, []);

  const pickWeightedIndex = (): number => {
    const total = prizes.reduce((s, p) => s + p.weight, 0);
    let r = Math.random() * total;
    for (let i = 0; i < prizes.length; i++) {
      r -= prizes[i].weight;
      if (r <= 0) return i;
    }
    return prizes.length - 1;
  };

  const handleSpin = () => {
    if (spinning || spinsLeft <= 0) return;

    setSpinning(true);
    setWinningPrize(null);
    setGeneratedCode('');
    setCopied(false);

    const winnerIndex = pickWeightedIndex();
    const winnerCenter = winnerIndex * segAngle + segAngle / 2;
    // Pointer is at the top (-90 degrees or 3*PI/2)
    const targetAngleRad = (3 * Math.PI / 2) - winnerCenter;
    let targetDeg = (targetAngleRad * 180 / Math.PI) % 360;
    if (targetDeg < 0) targetDeg += 360;

    const extraSpins = 6;
    const finalRotation = currentRotation - (currentRotation % 360) + extraSpins * 360 + targetDeg;
    setCurrentRotation(finalRotation);

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.transform = `rotate(${finalRotation}deg)`;
    }

    setTimeout(() => {
      setSpinning(false);
      const newSpins = spinsLeft - 1;
      setSpinsLeft(newSpins);
      try {
        localStorage.setItem('doradosSpinsLeft', newSpins.toString());
      } catch {}

      const won = prizes[winnerIndex];
      setWinningPrize(won);

      if (won.label !== 'Sigue intentando') {
        const code = 'DORADO-' + Math.random().toString(36).slice(2, 7).toUpperCase();
        setGeneratedCode(code);
      }
    }, 4600);
  };

  const handleCopy = () => {
    if (!generatedCode) return;
    navigator.clipboard?.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetSpins = () => {
    setSpinsLeft(3);
    setWinningPrize(null);
    try {
      localStorage.setItem('doradosSpinsLeft', '3');
    } catch {}
  };

  return (
    <section id="ruleta" className="py-24 px-6 sm:px-12 bg-[#FFF8ED] text-[#2B1B0E]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[#DA291C] font-extrabold text-sm tracking-widest uppercase block mb-2">
            Gira y gana
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#2B1B0E] tracking-tight">
            Ruleta de premios
          </h2>
          <p className="text-[#5A3E24] mt-3 text-base">
            Prueba tu suerte con la ruleta oficial de Arcos Dorados y desbloquea descuentos, combos y papas doradas gratis.
          </p>
        </div>

        {/* Wheel Wrap */}
        <div className="flex flex-wrap items-center justify-center gap-12 lg:gap-16">
          {/* Wheel Box */}
          <div className="relative flex flex-col items-center gap-6">
            {/* Pointer */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[30px] border-t-[#DA291C] drop-shadow-md" />

            {/* Canvas */}
            <div className="relative rounded-full p-2 bg-[#FFC72C] shadow-[0_20px_50px_rgba(43,27,14,0.22)] border-4 border-[#2B1B0E]/10">
              <canvas
                id="wheelCanvas"
                ref={canvasRef}
                width={420}
                height={420}
                className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] rounded-full transition-transform duration-[4500ms] cubic-bezier(0.17,0.89,0.32,1.15) select-none"
              />
            </div>

            {/* Spin Trigger Button */}
            <button
              id="spinBtn"
              onClick={handleSpin}
              disabled={spinning || spinsLeft <= 0}
              className={`px-10 py-4 rounded-full font-black text-lg tracking-wide shadow-[0_6px_0_#A8180D] active:translate-y-1 active:shadow-[0_2px_0_#A8180D] transition-all cursor-pointer flex items-center gap-2 ${
                spinning || spinsLeft <= 0
                  ? 'bg-neutral-400 text-neutral-200 cursor-not-allowed opacity-75 shadow-none'
                  : 'bg-[#DA291C] text-white hover:bg-[#C22317]'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span>{spinning ? 'Girando ruleta...' : 'Girar la ruleta'}</span>
            </button>
          </div>

          {/* Wheel Info & Results */}
          <div className="max-w-md w-full flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <p id="spinsLeft" className="font-extrabold text-[#5A3E24] text-base sm:text-lg">
                {spinsLeft > 0 ? (
                  <>Te quedan <strong className="text-[#DA291C] font-black text-xl">{spinsLeft}</strong> {spinsLeft === 1 ? 'giro' : 'giros'} hoy</>
                ) : (
                  <span className="text-[#DA291C] font-bold">¡Ya usaste tus giros de hoy!</span>
                )}
              </p>

              {spinsLeft === 0 && (
                <button
                  onClick={handleResetSpins}
                  className="text-xs font-bold text-[#5A3E24] hover:text-[#DA291C] flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1.5 rounded-lg border border-neutral-200 shadow-xs"
                  title="Reiniciar giros para probar"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reiniciar</span>
                </button>
              )}
            </div>

            {/* Result Box */}
            {winningPrize && (
              <div
                id="resultBox"
                className="bg-white border-3 border-[#FFC72C] rounded-3xl p-6 shadow-md animate-pop relative overflow-hidden"
              >
                <span className="text-[#DA291C] font-black text-xs tracking-widest uppercase block mb-1">
                  {winningPrize.label === 'Sigue intentando' ? '¡Ánimo!' : '¡Felicidades, ganaste!'}
                </span>
                <h3 id="resultText" className="text-2xl font-black text-[#2B1B0E] mb-3">
                  {winningPrize.label}
                </h3>

                {generatedCode ? (
                  <div className="flex items-center gap-2 mt-2">
                    <div
                      id="resultCode"
                      className="font-mono bg-[#FFF8ED] px-4 py-2.5 rounded-xl font-black text-sm text-[#2B1B0E] tracking-wider border border-[#FFC72C]/40 flex-1 text-center"
                    >
                      {generatedCode}
                    </div>
                    <button
                      onClick={handleCopy}
                      className="bg-[#FFC72C] hover:bg-[#FFE28A] text-[#2B1B0E] p-2.5 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                      title="Copiar código promocional"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-[#5A3E24]">
                    Suerte para la próxima 🍀 ¡Inténtalo de nuevo!
                  </p>
                )}
              </div>
            )}

            {/* Rules List */}
            <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-6 border border-[#2B1B0E]/10">
              <h4 className="text-sm font-black text-[#2B1B0E] uppercase tracking-wider mb-3">
                Reglas de la ruleta
              </h4>
              <ul className="ruleta-rules list-none p-0 m-0 flex flex-col gap-2.5 text-xs sm:text-sm text-[#5A3E24] font-medium leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#DA291C] font-black text-base leading-none">•</span>
                  <span>Un giro por cliente cada vez que compras un combo o accedes al día.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#DA291C] font-black text-base leading-none">•</span>
                  <span>Los premios se canjean en caja o en la App mostrando el código generado.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#DA291C] font-black text-base leading-none">•</span>
                  <span>Válido por 7 días naturales desde el momento en que lo ganas.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
