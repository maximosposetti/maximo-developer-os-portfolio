import { useState, useRef, useEffect, useCallback, type FormEvent } from "react";
import { X, Minus, Square, ExternalLink, GitBranch, Download, ChevronRight } from "lucide-react";

// ── DATA ──────────────────────────────────────────────────────────────────────

const CONTACT_INFO = {
  email: "maximosposetti@hotmail.com",
  github: "github.com/maximosposetti",
  linkedin: "linkedin.com/in/máximo-giuliano-sposetti-580693291",
  location: "Villa Constitucion, Santa Fe, Argentina",
};

const GITHUB_URL = "https://github.com/maximosposetti";
const LINKEDIN_URL = "https://linkedin.com/in/máximo-giuliano-sposetti-580693291";
const CV_URL = "/Maximo_Sposetti_CV.pdf";

const PROJECTS = [
  {
    id: 1,
    name: "SmashCenter",
    desc: "Plataforma de gestion deportiva con reservas, membresias y disponibilidad de canchas en tiempo real.",
    tech: ["React", "Node.js", "PostgreSQL", "Stripe"],
    demo: "#",
    github: "#",
    status: "Produccion",
  },
  {
    id: 2,
    name: "DevFlow",
    desc: "Tablero Kanban para equipos de desarrollo con colaboracion en tiempo real e integracion con GitHub.",
    tech: ["Next.js", "Prisma", "Socket.io", "TypeScript"],
    demo: "#",
    github: "#",
    status: "Beta",
  },
  {
    id: 3,
    name: "PixelCart",
    desc: "Tienda e-commerce headless con checkout de Stripe y catalogo administrable desde CMS.",
    tech: ["Next.js", "Stripe", "Sanity", "Vercel"],
    demo: "#",
    github: "#",
    status: "Produccion",
  },
];

const SKILLS: Record<string, string[]> = {
  Frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  Backend: ["Node.js", "Express", "PostgreSQL", "Prisma", "REST / GraphQL"],
  Herramientas: ["Git", "Docker", "Vercel", "Figma", "Linux"],
};

const EXPERIENCE = [
  {
    role: "Desarrollador Frontend",
    company: "TechCorp S.A.",
    period: "2023 - Presente",
    desc: "Lidere la reconstruccion visual del producto principal, reduje tiempos de carga y consolide un sistema de diseno.",
  },
  {
    role: "Desarrollador Full Stack",
    company: "Freelance",
    period: "2021 - 2023",
    desc: "Construi aplicaciones web para clientes de retail, deportes y productos SaaS.",
  },
  {
    role: "Desarrollador Junior",
    company: "StartupXYZ",
    period: "2020 - 2021",
    desc: "Desarrolle features en React dentro de un equipo agil con entregas semanales.",
  },
];

// ── TYPES ─────────────────────────────────────────────────────────────────────

type WinId = "terminal" | "projects" | "about" | "contact" | "explorer" | "settings";

interface Win {
  id: WinId;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  defaultPos: { x: number; y: number };
  defaultSize: { w: number; h: number };
}

type LineType = "input" | "output" | "error" | "system" | "blank";
interface TermLine {
  type: LineType;
  text: string;
}

// ── TERMINAL COMMAND PROCESSOR ────────────────────────────────────────────────

function execCommand(
  raw: string,
  openWindow: (id: WinId) => void
): { lines: TermLine[]; action?: "clear" } {
  const cmd = raw.trim().toLowerCase();
  if (cmd === "") return { lines: [] };
  if (cmd === "clear") return { lines: [], action: "clear" };

  if (cmd === "help" || cmd === "ayuda") {
    return {
      lines: [
        { type: "blank", text: "" },
        { type: "output", text: "┌─ MAXIMO/OS ──────────────────────────────────────┐" },
        { type: "output", text: "│                                                   │" },
        { type: "output", text: "│   sobre-mi        Quien es Maximo                 │" },
        { type: "output", text: "│   proyectos       Proyectos del portfolio          │" },
        { type: "output", text: "│   experiencia     Historial laboral                │" },
        { type: "output", text: "│   habilidades     Stack tecnico                    │" },
        { type: "output", text: "│   contacto        Datos de contacto                │" },
        { type: "output", text: "│   github          Abrir GitHub                     │" },
        { type: "output", text: "│   linkedin        Abrir LinkedIn                   │" },
        { type: "output", text: "│   descargar cv    Descargar CV                     │" },
        { type: "output", text: "│   abrir [app]     Abrir una ventana                │" },
        { type: "output", text: "│   limpiar         Limpiar terminal                 │" },
        { type: "output", text: "│                                                   │" },
        { type: "output", text: "└───────────────────────────────────────────────────┘" },
        { type: "blank", text: "" },
      ],
    };
  }

  if (cmd === "about" || cmd === "sobre-mi") {
    return {
      lines: [
        { type: "blank", text: "" },
        { type: "output", text: "  ┌──────────────────────────────────┐" },
        { type: "output", text: "  │  MAXIMO - Desarrollador Full Stack │" },
        { type: "output", text: "  │  Villa Constitucion, Santa Fe      │" },
        { type: "output", text: "  └──────────────────────────────────┘" },
        { type: "blank", text: "" },
        { type: "output", text: "  Construyo aplicaciones web rapidas, limpias y escalables." },
        { type: "output", text: "  Me enfoco en buena experiencia de usuario, arquitectura clara" },
        { type: "output", text: "  y detalles que hacen que un producto se sienta cuidado." },
        { type: "blank", text: "" },
        { type: "system", text: "  Actualmente abierto a nuevas oportunidades." },
        { type: "blank", text: "" },
      ],
    };
  }

  if (cmd === "projects" || cmd === "proyectos") {
    return {
      lines: [
        { type: "blank", text: "" },
        ...PROJECTS.flatMap((p) => [
          { type: "output" as LineType, text: `  ▸ ${p.name}  [${p.status}]` },
          { type: "output" as LineType, text: `    ${p.desc}` },
          { type: "output" as LineType, text: `    ${p.tech.join("  ·  ")}` },
          { type: "blank" as LineType, text: "" },
        ]),
        { type: "system", text: "  Tip: abrir proyectos - para ver las tarjetas completas." },
        { type: "blank", text: "" },
      ],
    };
  }

  if (cmd === "experience" || cmd === "experiencia") {
    return {
      lines: [
        { type: "blank", text: "" },
        ...EXPERIENCE.flatMap((e) => [
          { type: "output" as LineType, text: `  ${e.role}  @  ${e.company}` },
          { type: "system" as LineType, text: `  ${e.period}` },
          { type: "output" as LineType, text: `  ${e.desc}` },
          { type: "blank" as LineType, text: "" },
        ]),
      ],
    };
  }

  if (cmd === "skills" || cmd === "habilidades") {
    return {
      lines: [
        { type: "blank", text: "" },
        ...Object.entries(SKILLS).flatMap(([cat, items]) => [
          { type: "system" as LineType, text: `  ${cat.toUpperCase()}` },
          { type: "output" as LineType, text: `  ${items.join("  ·  ")}` },
          { type: "blank" as LineType, text: "" },
        ]),
      ],
    };
  }

  if (cmd === "contact" || cmd === "contacto") {
    return {
      lines: [
        { type: "blank", text: "" },
        { type: "output", text: `  Email      ${CONTACT_INFO.email}` },
        { type: "output", text: `  GitHub     ${CONTACT_INFO.github}` },
        { type: "output", text: `  LinkedIn   ${CONTACT_INFO.linkedin}` },
        { type: "output", text: `  Ubicacion  ${CONTACT_INFO.location}` },
        { type: "blank", text: "" },
      ],
    };
  }

  if (cmd === "github") {
    window.open(GITHUB_URL, "_blank", "noopener,noreferrer");
    return { lines: [{ type: "system", text: "  Abriendo GitHub en una nueva pestana..." }] };
  }

  if (cmd === "linkedin") {
    window.open(LINKEDIN_URL, "_blank", "noopener,noreferrer");
    return { lines: [{ type: "system", text: "  Abriendo LinkedIn en una nueva pestana..." }] };
  }

  if (cmd === "download cv" || cmd === "descargar cv") {
    const link = document.createElement("a");
    link.href = CV_URL;
    link.download = "Maximo_Sposetti_CV.pdf";
    link.click();

    return {
      lines: [
        { type: "system", text: "  Descargando Maximo_Sposetti_CV.pdf..." },
        { type: "output", text: "  [████████████████████] 100%" },
        { type: "system", text: "  Listo. Revisa tu carpeta de descargas." },
      ],
    };
  }

  if (cmd.startsWith("open ") || cmd.startsWith("abrir ")) {
    const target = cmd.replace(/^(open|abrir)\s+/, "").trim();
    const map: Record<string, WinId> = {
      projects: "projects",
      proyectos: "projects",
      about: "about",
      "sobre-mi": "about",
      contact: "contact",
      contacto: "contact",
      explorer: "explorer",
      explorador: "explorer",
      settings: "settings",
      ajustes: "settings",
      terminal: "terminal",
    };
    if (map[target]) {
      openWindow(map[target]);
      return { lines: [{ type: "system", text: `  Abriendo ${target}...` }] };
    }
    return {
      lines: [
        { type: "error", text: `  App desconocida: "${target}"` },
        { type: "system", text: "  Disponibles: proyectos, sobre-mi, contacto, explorador, ajustes" },
      ],
    };
  }

  return {
    lines: [
      { type: "error", text: `  "${raw.trim()}" no se reconoce como comando.` },
      { type: "system", text: "  Escribe 'ayuda' para ver los comandos disponibles." },
    ],
  };
}

// ── OS WINDOW ─────────────────────────────────────────────────────────────────

function OsWindow({
  win,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  children,
}: {
  win: Win;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  children: React.ReactNode;
}) {
  const [pos, setPos] = useState(win.defaultPos);
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!dragging.current) return;
      setPos({
        x: Math.max(0, e.clientX - dragOffset.current.x),
        y: Math.max(0, e.clientY - dragOffset.current.y),
      });
    };
    const up = () => {
      dragging.current = false;
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
  }, []);

  if (!win.isOpen || win.isMinimized) return null;

  const posStyle = win.isMaximized
    ? { left: 0, top: 0, right: 0, bottom: 0, width: "auto", height: "auto" }
    : { left: pos.x, top: pos.y, width: win.defaultSize.w, height: win.defaultSize.h };

  return (
    <div
      className="absolute flex flex-col overflow-hidden"
      style={{
        ...posStyle,
        zIndex: win.zIndex,
        background: "#0f0f0f",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.8), 0 0 0 1px rgba(74,222,128,0.05)",
      }}
      onMouseDown={onFocus}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-3 shrink-0"
        style={{
          background: "#141414",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          height: 34,
          cursor: win.isMaximized ? "default" : "move",
          userSelect: "none",
        }}
        onMouseDown={(e) => {
          if (win.isMaximized) return;
          dragging.current = true;
          dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
          e.preventDefault();
        }}
      >
        <div className="flex items-center gap-2.5">
          <span style={{ fontSize: 11, color: "#4ade80", opacity: 0.8 }}>◉</span>
          <span
            className="font-mono"
            style={{ fontSize: 11, color: "#555", letterSpacing: "0.06em" }}
          >
            {win.title}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            className="flex items-center justify-center transition-colors hover:bg-white/5"
            style={{ width: 26, height: 26 }}
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
          >
            <Minus size={10} color="#444" />
          </button>
          <button
            className="flex items-center justify-center transition-colors hover:bg-white/5"
            style={{ width: 26, height: 26 }}
            onClick={(e) => {
              e.stopPropagation();
              onMaximize();
            }}
          >
            <Square size={10} color="#444" />
          </button>
          <button
            className="flex items-center justify-center transition-colors hover:bg-red-950/80"
            style={{ width: 26, height: 26 }}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <X size={10} color="#666" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

// ── TERMINAL WINDOW ───────────────────────────────────────────────────────────

function TerminalContent({ openWindow }: { openWindow: (id: WinId) => void }) {
  const [lines, setLines] = useState<TermLine[]>([
    { type: "system", text: "  Maximo/OS  [Version 1.0.0]" },
    { type: "system", text: "  (c) Maximo Developer. Todos los derechos reservados." },
    { type: "blank", text: "" },
    { type: "output", text: '  Escribe "ayuda" para ver los comandos disponibles.' },
    { type: "blank", text: "" },
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const submit = useCallback(() => {
    const result = execCommand(input, openWindow);
    const inputLine: TermLine = { type: "input", text: input };
    if (result.action === "clear") {
      setLines([]);
    } else {
      setLines((prev) => [...prev, inputLine, ...result.lines]);
    }
    if (input.trim()) {
      setCmdHistory((prev) => [input, ...prev.slice(0, 49)]);
    }
    setHistIdx(-1);
    setInput("");
  }, [input, openWindow]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, cmdHistory.length - 1);
      setHistIdx(next);
      if (cmdHistory[next] !== undefined) setInput(cmdHistory[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? "" : (cmdHistory[next] ?? ""));
    }
  };

  const lineColor = (type: LineType): string => {
    switch (type) {
      case "input":  return "#4ade80";
      case "output": return "#c8c8c8";
      case "error":  return "#f87171";
      case "system": return "#60a5fa";
      case "blank":  return "transparent";
    }
  };

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ background: "#080808", fontFamily: "'JetBrains Mono', monospace" }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Output area */}
      <div
        className="flex-1 overflow-y-auto p-3"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#222 transparent" }}
      >
        <div className="space-y-0.5">
          {lines.map((l, i) => (
            <div
              key={i}
              className="flex gap-2 text-xs leading-5"
              style={{ color: lineColor(l.type) }}
            >
              {l.type === "input" && (
                <span style={{ color: "#4ade80", opacity: 0.6, whiteSpace: "nowrap" }}>
                  C:\Users\Maximo&gt;
                </span>
              )}
              <span className="whitespace-pre-wrap break-all">{l.text}</span>
            </div>
          ))}
        </div>
        <div ref={bottomRef} />
      </div>
      {/* Input line */}
      <div
        className="flex items-center gap-2 px-3 py-2 shrink-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <span
          className="text-xs shrink-0"
          style={{ color: "#4ade80", opacity: 0.6, fontFamily: "'JetBrains Mono', monospace" }}
        >
          C:\Users\Maximo&gt;
        </span>
        <input
          ref={inputRef}
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-xs caret-green-400"
          style={{ color: "#4ade80", fontFamily: "'JetBrains Mono', monospace" }}
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
}

// ── PROJECTS WINDOW ───────────────────────────────────────────────────────────

function ProjectsContent() {
  return (
    <div
      className="h-full overflow-y-auto p-4"
      style={{ background: "#0a0a0a", scrollbarWidth: "thin", scrollbarColor: "#1e1e1e transparent" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "#4ade80" }}>
          Proyectos
        </span>
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
        <span className="text-xs font-mono" style={{ color: "#333" }}>
          {PROJECTS.length} proyectos
        </span>
      </div>
      <div className="space-y-3">
        {PROJECTS.map((p) => (
          <div
            key={p.id}
            className="p-4 transition-colors group"
            style={{
              background: "#111",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(74,222,128,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-bold" style={{ color: "#e0e0e0" }}>
                  {p.name}
                </span>
                <span
                  className="text-xs font-mono px-1.5 py-0.5"
                  style={{
                    background: p.status === "Produccion" ? "rgba(74,222,128,0.08)" : "rgba(96,165,250,0.08)",
                    color: p.status === "Produccion" ? "#4ade80" : "#60a5fa",
                    border: `1px solid ${p.status === "Produccion" ? "rgba(74,222,128,0.2)" : "rgba(96,165,250,0.2)"}`,
                  }}
                >
                  {p.status}
                </span>
              </div>
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <a
                  href={p.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs font-mono px-2 py-1 transition-colors"
                  style={{ color: "#666", border: "1px solid #222" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#4ade80";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(74,222,128,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#666";
                    (e.currentTarget as HTMLElement).style.borderColor = "#222";
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={9} />
                  Demo
                </a>
                <a
                  href={p.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs font-mono px-2 py-1 transition-colors"
                  style={{ color: "#666", border: "1px solid #222" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#4ade80";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(74,222,128,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#666";
                    (e.currentTarget as HTMLElement).style.borderColor = "#222";
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <GitBranch size={9} />
                  Codigo
                </a>
              </div>
            </div>
            <p className="text-xs font-mono mb-3 leading-relaxed" style={{ color: "#666" }}>
              {p.desc}
            </p>
            <div className="flex flex-wrap gap-1">
              {p.tech.map((t) => (
                <span
                  key={t}
                  className="text-xs font-mono px-2 py-0.5"
                  style={{ background: "#161616", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.12)" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ABOUT WINDOW ──────────────────────────────────────────────────────────────

function AboutContent() {
  return (
    <div
      className="h-full overflow-y-auto p-5"
      style={{
        background: "#0a0a0a",
        fontFamily: "'JetBrains Mono', monospace",
        scrollbarWidth: "thin",
        scrollbarColor: "#1e1e1e transparent",
      }}
    >
      <div className="mb-5">
        <div className="text-xl font-bold mb-1" style={{ color: "#e8e8e8", letterSpacing: "-0.02em" }}>
          Maximo
        </div>
        <div className="text-xs uppercase tracking-widest" style={{ color: "#4ade80" }}>
          Desarrollador Full Stack - Villa Constitucion, Santa Fe
        </div>
      </div>

      <p className="text-xs leading-relaxed mb-6" style={{ color: "#666" }}>
        Construyo aplicaciones web rapidas, limpias y escalables. Me enfoco en buena
        experiencia de usuario, arquitectura clara y detalles que hacen que un producto
        se sienta cuidado. Actualmente abierto a nuevas oportunidades.
      </p>

      <div className="mb-6">
        <div
          className="flex items-center gap-2 mb-3"
        >
          <span className="text-xs uppercase tracking-widest" style={{ color: "#4ade80" }}>
            Experiencia
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
        </div>
        <div className="space-y-4">
          {EXPERIENCE.map((e, i) => (
            <div key={i} className="flex gap-3">
              <div
                className="mt-1.5 w-px shrink-0"
                style={{ background: "#222", alignSelf: "stretch" }}
              />
              <div>
                <div className="text-xs font-bold mb-0.5" style={{ color: "#ccc" }}>
                  {e.role}
                </div>
                <div className="text-xs mb-1.5" style={{ color: "#4ade80" }}>
                  {e.company} · {e.period}
                </div>
                <div className="text-xs leading-relaxed" style={{ color: "#555" }}>
                  {e.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs uppercase tracking-widest" style={{ color: "#4ade80" }}>
            Habilidades
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
        </div>
        {Object.entries(SKILLS).map(([cat, items]) => (
          <div key={cat} className="mb-3">
            <div className="text-xs mb-1.5 uppercase tracking-wider" style={{ color: "#444" }}>
              {cat}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {items.map((s) => (
                <span
                  key={s}
                  className="text-xs px-2 py-0.5"
                  style={{
                    background: "#141414",
                    color: "#60a5fa",
                    border: "1px solid rgba(96,165,250,0.12)",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CONTACT WINDOW ────────────────────────────────────────────────────────────

function ContactContent() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const isSending = status === "sending";

  const inputStyle = {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.07)",
    color: "#ccc",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    padding: "8px 10px",
    width: "100%",
    outline: "none",
    transition: "border-color 0.15s",
  };

  const submitContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "No se pudo enviar el mensaje.");
      }

      setStatus("sent");
      setFeedback("Mensaje enviado correctamente. Tambien se envio una confirmacion a tu email.");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "No se pudo enviar el mensaje.");
    }
  };

  return (
    <div
      className="h-full overflow-y-auto p-5"
      style={{
        background: "#0a0a0a",
        fontFamily: "'JetBrains Mono', monospace",
        scrollbarWidth: "thin",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs uppercase tracking-widest" style={{ color: "#4ade80" }}>
          Contacto
        </span>
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
      </div>

      <div className="space-y-2 mb-6">
        {[
          { label: "Email", value: CONTACT_INFO.email },
          { label: "GitHub", value: CONTACT_INFO.github },
          { label: "LinkedIn", value: CONTACT_INFO.linkedin },
          { label: "Ubicacion", value: CONTACT_INFO.location },
        ].map(({ label, value }) => (
          <div key={label} className="flex gap-4 text-xs">
            <span className="w-20 shrink-0" style={{ color: "#333" }}>
              {label}
            </span>
            <span style={{ color: "#777" }}>{value}</span>
          </div>
        ))}
      </div>

      <div className="h-px mb-5" style={{ background: "rgba(255,255,255,0.04)" }} />

      {feedback && (
        <div
          className="text-xs p-3 mb-4"
          style={{
            background: status === "error" ? "rgba(248,113,113,0.06)" : "rgba(74,222,128,0.05)",
            border:
              status === "error"
                ? "1px solid rgba(248,113,113,0.18)"
                : "1px solid rgba(74,222,128,0.15)",
            color: status === "error" ? "#f87171" : "#4ade80",
          }}
        >
          {status === "error" ? "Error: " : "OK: "}
          {feedback}
        </div>
      )}

      <form className="space-y-3" onSubmit={submitContact}>
          {[
            { label: "Nombre", key: "name", type: "text" },
            { label: "Email", key: "email", type: "email" },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <div className="text-xs mb-1.5" style={{ color: "#333" }}>
                {label}
              </div>
              <input
                type={type}
                required
                disabled={isSending}
                value={form[key as keyof typeof form]}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [key]: e.target.value }))
                }
                style={inputStyle}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = "rgba(74,222,128,0.3)";
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.07)";
                }}
              />
            </div>
          ))}
          <div>
            <div className="text-xs mb-1.5" style={{ color: "#333" }}>
              Mensaje
            </div>
            <textarea
              required
              disabled={isSending}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              rows={4}
              style={{ ...inputStyle, resize: "none" }}
              onFocus={(e) => {
                (e.target as HTMLTextAreaElement).style.borderColor = "rgba(74,222,128,0.3)";
              }}
              onBlur={(e) => {
                (e.target as HTMLTextAreaElement).style.borderColor = "rgba(255,255,255,0.07)";
              }}
            />
          </div>
          <button
            type="submit"
            disabled={isSending}
            className="text-xs px-4 py-2 font-mono transition-all"
            style={{
              color: "#4ade80",
              border: "1px solid rgba(74,222,128,0.3)",
              background: isSending ? "rgba(74,222,128,0.08)" : "transparent",
              opacity: isSending ? 0.7 : 1,
              fontFamily: "'JetBrains Mono', monospace",
            }}
            onMouseEnter={(e) => {
              if (isSending) return;
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(74,222,128,0.08)";
            }}
            onMouseLeave={(e) => {
              if (isSending) return;
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }}
          >
            {isSending ? "enviando_mensaje()" : "enviar_mensaje()"}
          </button>
        </form>
    </div>
  );
}

// ── EXPLORER WINDOW ───────────────────────────────────────────────────────────

function ExplorerContent({ openWindow }: { openWindow: (id: WinId) => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  const apps = [
    { icon: "💻", label: "Terminal.exe", id: "terminal" as WinId, size: "4.2 KB", date: "2024-06-24" },
    { icon: "📁", label: "Proyectos", id: "projects" as WinId, size: "128 KB", date: "2024-06-20" },
    { icon: "👤", label: "Sobre-mi.txt", id: "about" as WinId, size: "12 KB", date: "2024-06-10" },
    { icon: "✉️", label: "Contacto.lnk", id: "contact" as WinId, size: "1 KB", date: "2024-06-24" },
    { icon: "⚙️", label: "Ajustes", id: "settings" as WinId, size: "3 KB", date: "2024-05-30" },
  ];

  return (
    <div className="h-full flex" style={{ background: "#0a0a0a", fontFamily: "'JetBrains Mono', monospace" }}>
      {/* Sidebar */}
      <div
        className="w-36 shrink-0 p-2"
        style={{ borderRight: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="text-xs uppercase tracking-widest mb-2 px-2" style={{ color: "#2a2a2a" }}>
          Lugares
        </div>
        {["Escritorio", "Documentos", "Descargas", "Papelera"].map((loc) => (
          <button
            key={loc}
            className="flex items-center gap-2 w-full px-2 py-1.5 text-xs text-left transition-colors"
            style={{ color: "#555" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#888";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#555";
            }}
          >
            <ChevronRight size={10} />
            {loc}
          </button>
        ))}
      </div>

      {/* File list */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Column headers */}
        <div
          className="flex items-center px-3 py-1.5 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
        >
          {["Nombre", "Tamano", "Modificado"].map((h, i) => (
            <div
              key={h}
              className="text-xs"
              style={{
                color: "#333",
                width: i === 0 ? "50%" : i === 1 ? "25%" : "25%",
              }}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Files */}
        <div className="flex-1 overflow-y-auto">
          {apps.map((app) => (
            <button
              key={app.id}
              className="flex items-center w-full px-3 py-2 text-xs text-left transition-colors"
              style={{
                background: selected === app.id ? "rgba(74,222,128,0.06)" : "transparent",
                borderBottom: "1px solid rgba(255,255,255,0.02)",
                color: selected === app.id ? "#ccc" : "#666",
              }}
              onClick={() => setSelected(app.id)}
              onDoubleClick={() => openWindow(app.id)}
            >
              <div className="flex items-center gap-2" style={{ width: "50%" }}>
                <span style={{ fontSize: 14 }}>{app.icon}</span>
                <span className="font-mono">{app.label}</span>
              </div>
              <div style={{ width: "25%", color: "#333" }}>{app.size}</div>
              <div style={{ width: "25%", color: "#333" }}>{app.date}</div>
            </button>
          ))}
        </div>

        {/* Status bar */}
        <div
          className="px-3 py-1 text-xs shrink-0"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.04)",
            color: "#2a2a2a",
          }}
        >
          {apps.length} elementos · Doble clic para abrir
        </div>
      </div>
    </div>
  );
}

// ── SETTINGS WINDOW ───────────────────────────────────────────────────────────

function SettingsContent() {
  const info = [
    { label: "OS", value: "Maximo/OS" },
    { label: "Version", value: "1.0.0" },
    { label: "Compilacion", value: "2024.06.24" },
    { label: "Motor", value: "React 19.2" },
    { label: "Consola", value: "MaximoSH 1.0" },
    { label: "Tema", value: "Dark Phosphor" },
    { label: "Fuente", value: "JetBrains Mono" },
    { label: "Actividad", value: "∞" },
  ];

  const downloadCv = () => {
    const link = document.createElement("a");
    link.href = CV_URL;
    link.download = "Maximo_Sposetti_CV.pdf";
    link.click();
  };

  const openGitHub = () => {
    window.open(GITHUB_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="h-full p-5 overflow-y-auto"
      style={{ background: "#0a0a0a", fontFamily: "'JetBrains Mono', monospace" }}
    >
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xs uppercase tracking-widest" style={{ color: "#4ade80" }}>
          Sistema
        </span>
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
      </div>

      <div className="space-y-0">
        {info.map(({ label, value }, i) => (
          <div
            key={label}
            className="flex justify-between py-2.5 text-xs"
            style={{
              borderBottom: i < info.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
            }}
          >
            <span style={{ color: "#444" }}>{label}</span>
            <span style={{ color: "#777" }}>{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2">
        <span className="text-xs uppercase tracking-widest" style={{ color: "#4ade80" }}>
          Enlaces
        </span>
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {[
          { label: "Descargar CV", icon: <Download size={10} />, onClick: downloadCv },
          { label: "Perfil de GitHub", icon: <GitBranch size={10} />, onClick: openGitHub },
        ].map(({ label, icon, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className="flex items-center gap-2 text-xs px-3 py-2 transition-colors text-left"
            style={{ color: "#555", border: "1px solid rgba(255,255,255,0.05)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#4ade80";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(74,222,128,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#555";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.05)";
            }}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── DESKTOP ICON ──────────────────────────────────────────────────────────────

function DesktopIcon({
  icon,
  label,
  onDblClick,
}: {
  icon: string;
  label: string;
  onDblClick: () => void;
}) {
  const [sel, setSel] = useState(false);

  return (
    <button
      className="flex flex-col items-center gap-1 p-2 w-[72px] transition-colors"
      style={{
        background: sel ? "rgba(74,222,128,0.08)" : "transparent",
        border: sel ? "1px solid rgba(74,222,128,0.15)" : "1px solid transparent",
        outline: "none",
        fontFamily: "'JetBrains Mono', monospace",
      }}
      onClick={() => setSel((s) => !s)}
      onDoubleClick={() => {
        setSel(false);
        onDblClick();
      }}
    >
      <span style={{ fontSize: 28, lineHeight: 1 }}>{icon}</span>
      <span
        className="text-center leading-tight"
        style={{
          fontSize: 10,
          color: "#aaa",
          textShadow: "0 1px 4px rgba(0,0,0,1)",
          wordBreak: "break-word",
        }}
      >
        {label}
      </span>
    </button>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────

const INITIAL_WINDOWS: Win[] = [
  {
    id: "terminal",
    title: "Terminal  —  C:\\Users\\Maximo",
    icon: "💻",
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    defaultPos: { x: 100, y: 50 },
    defaultSize: { w: 660, h: 420 },
  },
  {
    id: "projects",
    title: "Proyectos",
    icon: "📁",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 5,
    defaultPos: { x: 220, y: 90 },
    defaultSize: { w: 600, h: 460 },
  },
  {
    id: "about",
    title: "Sobre mi  —  Maximo",
    icon: "👤",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 5,
    defaultPos: { x: 320, y: 70 },
    defaultSize: { w: 460, h: 500 },
  },
  {
    id: "contact",
    title: "Contacto",
    icon: "✉️",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 5,
    defaultPos: { x: 380, y: 110 },
    defaultSize: { w: 400, h: 440 },
  },
  {
    id: "explorer",
    title: "Explorador",
    icon: "🗂️",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 5,
    defaultPos: { x: 170, y: 80 },
    defaultSize: { w: 540, h: 360 },
  },
  {
    id: "settings",
    title: "Ajustes",
    icon: "⚙️",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 5,
    defaultPos: { x: 360, y: 100 },
    defaultSize: { w: 360, h: 380 },
  },
];

export default function App() {
  const [windows, setWindows] = useState<Win[]>(INITIAL_WINDOWS);
  const [topZ, setTopZ] = useState(20);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const openWindow = useCallback(
    (id: WinId) => {
      const z = topZ + 1;
      setTopZ(z);
      setWindows((ws) =>
        ws.map((w) =>
          w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: z } : w
        )
      );
    },
    [topZ]
  );

  const closeWindow = (id: WinId) =>
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, isOpen: false } : w)));

  const minimizeWindow = (id: WinId) =>
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)));

  const maximizeWindow = (id: WinId) =>
    setWindows((ws) =>
      ws.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );

  const focusWindow = useCallback(
    (id: WinId) => {
      const z = topZ + 1;
      setTopZ(z);
      setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, zIndex: z } : w)));
    },
    [topZ]
  );

  const desktopIcons = [
    { icon: "💻", label: "Terminal", id: "terminal" as WinId },
    { icon: "🗂️", label: "Explorador", id: "explorer" as WinId },
    { icon: "📁", label: "Proyectos", id: "projects" as WinId },
    { icon: "👤", label: "Sobre mi", id: "about" as WinId },
    { icon: "✉️", label: "Contacto", id: "contact" as WinId },
    { icon: "⚙️", label: "Ajustes", id: "settings" as WinId },
  ];

  const openWins = windows.filter((w) => w.isOpen);

  const timeStr = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateStr = time.toLocaleDateString("es-AR", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="w-full h-screen overflow-hidden relative"
      style={{ background: "#060606", fontFamily: "'JetBrains Mono', monospace" }}
    >
      {/* Dot-grid wallpaper */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(74,222,128,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Desktop workspace */}
      <div className="absolute inset-0" style={{ bottom: 44 }}>
        {/* Desktop icons – left rail */}
        <div className="absolute top-4 left-4 flex flex-col gap-0.5">
          {desktopIcons.map((ic) => (
            <DesktopIcon
              key={ic.id}
              icon={ic.icon}
              label={ic.label}
              onDblClick={() => openWindow(ic.id)}
            />
          ))}
        </div>

        {/* OS watermark */}
        <div className="absolute top-4 right-5 text-right pointer-events-none select-none">
          <div
            style={{
              fontSize: 11,
              color: "rgba(74,222,128,0.25)",
              letterSpacing: "0.2em",
              fontWeight: 700,
            }}
          >
            MAXIMO/OS
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.1)", letterSpacing: "0.1em" }}>
            v1.0.0
          </div>
        </div>

        {/* Windows */}
        {windows.map((win) => (
          <OsWindow
            key={win.id}
            win={win}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onMaximize={() => maximizeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
          >
            {win.id === "terminal" && <TerminalContent openWindow={openWindow} />}
            {win.id === "projects" && <ProjectsContent />}
            {win.id === "about" && <AboutContent />}
            {win.id === "contact" && <ContactContent />}
            {win.id === "explorer" && <ExplorerContent openWindow={openWindow} />}
            {win.id === "settings" && <SettingsContent />}
          </OsWindow>
        ))}
      </div>

      {/* Taskbar */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3"
        style={{
          height: 44,
          background: "rgba(8,8,8,0.98)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Left: start + open windows */}
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-3 py-1.5 text-xs transition-colors"
            style={{
              color: "#4ade80",
              border: "1px solid rgba(74,222,128,0.2)",
              background: "rgba(74,222,128,0.04)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(74,222,128,0.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(74,222,128,0.04)";
            }}
          >
            ⊞ MAXIMO/OS
          </button>

          <div className="flex items-center gap-1">
            {openWins.map((win) => (
              <button
                key={win.id}
                onClick={() => {
                  if (win.isMinimized) {
                    openWindow(win.id);
                  } else {
                    focusWindow(win.id);
                  }
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs transition-all max-w-[130px] truncate"
                style={{
                  background: win.isMinimized ? "transparent" : "rgba(255,255,255,0.04)",
                  color: win.isMinimized ? "#333" : "#666",
                  border: `1px solid ${win.isMinimized ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.07)"}`,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                <span style={{ fontSize: 13 }}>{win.icon}</span>
                <span className="truncate" style={{ fontSize: 10 }}>
                  {win.title.split("—")[0].trim().split(" ")[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: clock */}
        <div
          className="flex flex-col items-end"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          <div style={{ fontSize: 11, color: "#666" }}>{timeStr}</div>
          <div style={{ fontSize: 10, color: "#333" }}>{dateStr}</div>
        </div>
      </div>
    </div>
  );
}
