import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Crosshair, Eye } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [protocols, setProtocols] = useState<Record<string, boolean>>({
    DISZIPLIN: false,
    AUSDAUER: false,
    FOKUS: false,
  });
  const [sliderValue, setSliderValue] = useState(50);

  const selectedProtocolCount = Object.values(protocols).filter(Boolean).length;
  const step1Done = selectedProfile !== null;
  const step2Done = selectedProtocolCount >= 2;
  const step3Done = sliderValue >= 85;
  const isUnlocked = step1Done && step2Done && step3Done;

  const handleSubmit = () => {
    if (!selectedProfile) {
      toast.error("FEHLER: Profil auswählen.", { className: "hud-toast" });
      return;
    }
    if (selectedProtocolCount < 2) {
      toast.error("FEHLER: Mindestens 2 Protokolle wählen.", { className: "hud-toast" });
      return;
    }
    if (sliderValue < 85) {
      toast.error("FEHLER: Signalstärke auf mindestens 85% setzen.", { className: "hud-toast" });
      return;
    }
    toast.success("ZUGANG GEWÄHRT", { className: "hud-toast" });
    setTimeout(() => navigate("/next"), 1200);
  };

  const toggleProtocol = (key: string) => {
    setProtocols((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background hud-grid-bg flex flex-col items-center justify-start px-4 py-8 sm:justify-center sm:p-8">
      <div className="relative w-full max-w-[480px] sm:max-w-[780px] px-5 py-10 sm:px-11 sm:py-16 hud-corner-tl hud-corner-tr">
        <div className="relative hud-corner-bl hud-corner-br pb-3">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono-hud text-[10px] sm:text-xs tracking-[0.35em] text-muted-foreground mb-1.5">
                  SYSTEM V.4.0.2
                </p>
                <h1 className="text-[28px] sm:text-5xl font-extrabold tracking-tight text-foreground leading-none">
                  TRESORZUGANG
                </h1>
              </div>
              <span className="font-mono-hud text-[9px] sm:text-xs tracking-widest border border-[hsl(var(--green-status))] text-[hsl(var(--green-status))] px-2 py-1 sm:px-3 sm:py-1.5 rounded-sm mt-1 whitespace-nowrap">
                GEWÄHRT
              </span>
            </div>
            {/* Dynamic progress bars */}
            <div className="flex gap-1.5 mt-5">
              <ProgressBar active={step1Done} />
              <ProgressBar active={step2Done} />
              <ProgressBar active={step3Done} />
            </div>
          </header>

          {/* Section 1 */}
          <section className="mb-8">
            <p className="font-mono-hud text-[10px] sm:text-xs tracking-widest text-muted-foreground mb-4">
              /// 01. BENUTZERPROFIL WÄHLEN
            </p>
            <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-5">
              <ProfileCard
                title="STRATEGE"
                desc="Ich plane sorgfältig und führe präzise aus."
                icon={<Crosshair className="w-4 h-4" />}
                selected={selectedProfile === "STRATEGE"}
                onSelect={() => setSelectedProfile("STRATEGE")}
              />
              <ProfileCard
                title="VISIONÄR"
                desc="Ich sehe Chancen, wo andere Risiken sehen."
                icon={<Eye className="w-4 h-4" />}
                selected={selectedProfile === "VISIONÄR"}
                onSelect={() => setSelectedProfile("VISIONÄR")}
              />
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <p className="font-mono-hud text-[10px] sm:text-xs tracking-widest text-muted-foreground mb-4">
              /// 02. PROTOKOLLE VERIFIZIEREN (MIN: 2)
            </p>
            <div className="flex flex-col gap-3">
              {(["DISZIPLIN", "AUSDAUER", "FOKUS"] as const).map((key) => (
                <ProtocolRow
                  key={key}
                  label={`PROTOKOLL: ${key}`}
                  checked={protocols[key]}
                  onToggle={() => toggleProtocol(key)}
                />
              ))}
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <p className="font-mono-hud text-[10px] sm:text-xs tracking-widest text-muted-foreground mb-3">
              /// 03. SYNCHRONISATIONSFREQUENZ
            </p>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono-hud text-xs sm:text-sm font-semibold text-primary tracking-wider">
                SIGNALSTÄRKE
              </span>
              <span className="font-mono-hud text-xs sm:text-sm font-bold text-foreground">
                {sliderValue}%
              </span>
            </div>
            <div className="relative py-2">
              <input
                type="range"
                min={0}
                max={100}
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className="w-full h-1.5 appearance-none bg-transparent slider-hud cursor-pointer touch-pan-y"
              />
              {/* 85% threshold marker */}
              <div
                className="absolute top-0 h-full flex items-center pointer-events-none"
                style={{ left: "85%" }}
              >
                <div className="w-px h-5 border-l border-dashed border-primary/50" />
              </div>
            </div>
            <div className="flex justify-end mt-0.5">
              <span className="font-mono-hud text-[9px] text-muted-foreground tracking-wider">
                MIN: 85%
              </span>
            </div>
          </section>

          {/* CTA */}
          <button
            onClick={handleSubmit}
            className={`w-full font-mono-hud text-base sm:text-xl font-bold tracking-[0.15em] py-4 sm:py-5 rounded-sm transition-all duration-200 active:scale-[0.98] ${
              isUnlocked
                ? "bg-primary text-primary-foreground amber-glow-strong hover:brightness-110 cursor-pointer"
                : "bg-primary/20 text-primary/40 cursor-not-allowed"
            }`}
          >
            ZUGANG GEWÄHREN
          </button>

          {/* Footer */}
          <p className="font-mono-hud text-[9px] tracking-[0.25em] text-muted-foreground text-center mt-5">
            SICHERE VERBINDUNG // 256-BIT VERSCHLÜSSELUNG
          </p>
        </div>
      </div>
    </div>
  );
};

/* ---- Sub-components ---- */

function ProgressBar({ active }: { active: boolean }) {
  return (
    <div
      className={`h-2 flex-1 rounded-sm transition-all duration-500 ${
        active ? "bg-primary amber-glow" : "bg-muted"
      }`}
    />
  );
}

function ProfileCard({
  title,
  desc,
  icon,
  selected,
  onSelect,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`relative text-left p-4 sm:p-6 rounded-sm border transition-all duration-150 active:scale-[0.98] ${
        selected
          ? "border-primary bg-primary/10 amber-glow"
          : "border-muted-foreground/20 bg-card hover:border-muted-foreground/40"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`${selected ? "text-primary" : "text-muted-foreground"}`}>
            {icon}
          </span>
          <span className="font-bold text-sm sm:text-base tracking-wide text-foreground">{title}</span>
        </div>
        {selected && (
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-primary flex items-center justify-center">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary" />
          </div>
        )}
      </div>
      <p className="text-xs sm:text-sm text-secondary-foreground/70 pl-6">{desc}</p>
    </button>
  );
}

function ProtocolRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-between px-4 py-3.5 sm:px-5 sm:py-4 rounded-sm border transition-all duration-150 active:scale-[0.98] ${
        checked
          ? "border-primary bg-primary/10 amber-glow"
          : "border-primary/40 bg-card hover:border-primary/70"
      }`}
    >
      <span className="font-mono-hud text-xs sm:text-sm font-semibold tracking-wider text-foreground">
        {label}
      </span>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`block w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[2px] transition-colors ${
              checked ? "bg-primary" : "bg-primary/25"
            }`}
          />
        ))}
      </div>
    </button>
  );
}

export default Index;
