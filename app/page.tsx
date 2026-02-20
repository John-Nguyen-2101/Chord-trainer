"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Beat = 1 | 2 | 3 | 4;
type Token = { lyric: string; chord?: string | null; beat: Beat };
type Line =
  | { tokens: Token[] }
  | { section: string; id?: string };

type Song = {
  title: string;
  author: string;
  style: string;
  recommendedTempo: string;
  bpm: number;
  timeSig: [4, 4];
  lines: Line[];
};

const demoSong: Song = {
  title: "Ngày xuân long phụng sum vầy",
  author: "Quang Huy",
  style: "Ballad / 4-4 (đệm chậm, dễ tập)",
  recommendedTempo: "60–80 BPM (mới tập), 80–96 BPM (chuẩn hơn)",
  bpm: 80,
  timeSig: [4, 4],
  lines: [
    { section: "ĐIỆP KHÚC", id: "section1" },

    {
      tokens: [
        { lyric: "Mừng", chord: "C", beat: 1 },
        { lyric: "tết", chord: null, beat: 1 },
        { lyric: "đến", chord: null, beat: 3 },
        { lyric: "mang", chord: null, beat: 2 },
        { lyric: "lộc", chord: null, beat: 2 },
      ],
    },
    {
      tokens: [
        { lyric: "đến", chord: "G", beat: 1 },
        { lyric: "nhà", chord: null, beat: 1 },
        { lyric: "nhà", chord: null, beat: 2 },
        { lyric: "cánh", chord: null, beat: 2 },
        { lyric: "mai", chord: null, beat: 2 },
      ],
    },
    {
      tokens: [
        { lyric: "vàng", chord: "Am", beat: 1 },
        { lyric: "cành", chord: null, beat: 1 },
        { lyric: "đào", chord: null, beat: 1 },
        { lyric: "hồng", chord: null, beat: 2 },
        { lyric: "thắm", chord: null, beat: 2 },
      ],
    },
    {
      tokens: [
        { lyric: "tươi", chord: "Em", beat: 1 },
        { lyric: "", chord: null, beat: 2 },
      ],
    },

    {
      tokens: [
        { lyric: "Chúc", chord: "F", beat: 1 },
        { lyric: "cụ", chord: null, beat: 1 },
        { lyric: "già", chord: null, beat: 2 },
        { lyric: "được", chord: null, beat: 2 },
        { lyric: "sống", chord: null, beat: 2 },
      ],
    },
    {
      tokens: [
        { lyric: "lâu", chord: "C", beat: 1 },
        { lyric: "sống", chord: null, beat: 1 },
        { lyric: "khỏe", chord: null, beat: 2 },
        { lyric: "cùng", chord: null, beat: 2 },
        { lyric: "con", chord: null, beat: 2 },
      ],
    },
    {
      tokens: [
        { lyric: "Cháu", chord: "F", beat: 1 },
        { lyric: "sang", chord: null, beat: 1 },
        { lyric: "năm", chord: null, beat: 2 },
        { lyric: "lại", chord: null, beat: 2 },
      ],
    },
    {
      tokens: [
        { lyric: "đón", chord: "G", beat: 1 },
        { lyric: "tết", chord: null, beat: 1 },
        { lyric: "sang", chord: null, beat: 2 },
      ],
    },
    {
      tokens: [
        { lyric: "Và", chord: "C", beat: 1 },
        { lyric: "kính", chord: null, beat: 1 },
        { lyric: "chúc", chord: null, beat: 2 },
        { lyric: "người", chord: null, beat: 2 },
        { lyric: "người", chord: null, beat: 2 },
      ],
    },
    {
      tokens: [
        { lyric: "sẽ", chord: "G", beat: 1 },
        { lyric: "gặp", chord: null, beat: 1 },
        { lyric: "lành", chord: null, beat: 2 },
        { lyric: "tết", chord: null, beat: 2 },
        { lyric: "sau", chord: null, beat: 2 },
      ],
    },
    {
      tokens: [
        { lyric: "được", chord: "Am", beat: 1 },
        { lyric: "nhiều", chord: null, beat: 1 },
        { lyric: "lộc", chord: null, beat: 1 },
        { lyric: "hơn", chord: null, beat: 2 },
        { lyric: "tết", chord: null, beat: 2 },
      ],
    },
    {
      tokens: [
        { lyric: "nay", chord: "Em", beat: 1 },
        { lyric: "", chord: null, beat: 2 },
      ],
    },
    {
      tokens: [
        { lyric: "tết", chord: "F", beat: 1 },
        { lyric: "đến", chord: null, beat: 1 },
        { lyric: "đoàn", chord: null, beat: 1 },
        { lyric: "tụ", chord: null, beat: 2 },
        { lyric: "cùng", chord: null, beat: 2 },
        { lyric: "ở", chord: null, beat: 2 },
      ],
    },
    {
      tokens: [
        { lyric: "bên", chord: "C", beat: 1 },
        { lyric: "bếp", chord: null, beat: 1 },
        { lyric: "hồng", chord: null, beat: 2 },
        { lyric: "và", chord: null, beat: 2 },
        { lyric: "nồi", chord: null, beat: 2 },
      ],
    },
    {
      tokens: [
        { lyric: "bánh", chord: "F", beat: 1 },
        { lyric: "chưng", chord: null, beat: 1 },
        { lyric: "xanh", chord: null, beat: 2 },
        { lyric: "chờ", chord: null, beat: 2 },
      ],
    },
    {
      tokens: [
        { lyric: "xuân", chord: "C", beat: 1 },
        { lyric: "đang", chord: null, beat: 1 },
        { lyric: "sang", chord: null, beat: 2 },
      ],
    },
    { section: "VERSE", id: "verse1"  },

    {
      tokens: [
        { lyric: "Mừng", chord: "C", beat: 1 },
        { lyric: "tết", chord: null, beat: 1 },
        { lyric: "đến", chord: null, beat: 3 },
        { lyric: "mang", chord: null, beat: 2 },
        { lyric: "lộc", chord: null, beat: 2 },
      ],
    },
    {
      tokens: [
        { lyric: "đến", chord: "G", beat: 1 },
        { lyric: "nhà", chord: null, beat: 1 },
        { lyric: "nhà", chord: null, beat: 2 },
        { lyric: "cánh", chord: null, beat: 2 },
        { lyric: "mai", chord: null, beat: 2 },
      ],
    },
    {
      tokens: [
        { lyric: "vàng", chord: "Am", beat: 1 },
        { lyric: "cành", chord: null, beat: 1 },
        { lyric: "đào", chord: null, beat: 1 },
        { lyric: "hồng", chord: null, beat: 2 },
        { lyric: "thắm", chord: null, beat: 2 },
      ],
    },
    {
      tokens: [
        { lyric: "tươi", chord: "Em", beat: 1 },
        { lyric: "", chord: null, beat: 2 },
      ],
    },

    {
      tokens: [
        { lyric: "Chúc", chord: "F", beat: 1 },
        { lyric: "cụ", chord: null, beat: 1 },
        { lyric: "già", chord: null, beat: 2 },
        { lyric: "được", chord: null, beat: 2 },
        { lyric: "sống", chord: null, beat: 2 },
      ],
    },
    {
      tokens: [
        { lyric: "lâu", chord: "C", beat: 1 },
        { lyric: "sống", chord: null, beat: 1 },
        { lyric: "khỏe", chord: null, beat: 2 },
        { lyric: "cùng", chord: null, beat: 2 },
        { lyric: "con", chord: null, beat: 2 },
      ],
    },
    {
      tokens: [
        { lyric: "Cháu", chord: "F", beat: 1 },
        { lyric: "sang", chord: null, beat: 1 },
        { lyric: "năm", chord: null, beat: 2 },
        { lyric: "lại", chord: null, beat: 2 },
      ],
    },
    {
      tokens: [
        { lyric: "đón", chord: "G", beat: 1 },
        { lyric: "tết", chord: null, beat: 1 },
        { lyric: "sang", chord: null, beat: 2 },
      ],
    },
    {
      tokens: [
        { lyric: "Và", chord: "C", beat: 1 },
        { lyric: "kính", chord: null, beat: 1 },
        { lyric: "chúc", chord: null, beat: 2 },
        { lyric: "người", chord: null, beat: 2 },
        { lyric: "người", chord: null, beat: 2 },
      ],
    },
    {
      tokens: [
        { lyric: "sẽ", chord: "G", beat: 1 },
        { lyric: "gặp", chord: null, beat: 1 },
        { lyric: "lành", chord: null, beat: 2 },
        { lyric: "tết", chord: null, beat: 2 },
        { lyric: "sau", chord: null, beat: 2 },
      ],
    },
    {
      tokens: [
        { lyric: "được", chord: "Am", beat: 1 },
        { lyric: "nhiều", chord: null, beat: 1 },
        { lyric: "lộc", chord: null, beat: 1 },
        { lyric: "hơn", chord: null, beat: 2 },
        { lyric: "tết", chord: null, beat: 2 },
      ],
    },
    {
      tokens: [
        { lyric: "nay", chord: "Em", beat: 1 },
        { lyric: "", chord: null, beat: 2 },
      ],
    },
    {
      tokens: [
        { lyric: "tết", chord: "F", beat: 1 },
        { lyric: "đến", chord: null, beat: 1 },
        { lyric: "đoàn", chord: null, beat: 1 },
        { lyric: "tụ", chord: null, beat: 2 },
        { lyric: "cùng", chord: null, beat: 2 },
        { lyric: "ở", chord: null, beat: 2 },
      ],
    },
    {
      tokens: [
        { lyric: "bên", chord: "C", beat: 1 },
        { lyric: "bếp", chord: null, beat: 1 },
        { lyric: "hồng", chord: null, beat: 2 },
        { lyric: "và", chord: null, beat: 2 },
        { lyric: "nồi", chord: null, beat: 2 },
      ],
    },
    {
      tokens: [
        { lyric: "bánh", chord: "F", beat: 1 },
        { lyric: "chưng", chord: null, beat: 1 },
        { lyric: "xanh", chord: null, beat: 2 },
        { lyric: "chờ", chord: null, beat: 2 },
      ],
    },
    {
      tokens: [
        { lyric: "xuân", chord: "C", beat: 1 },
        { lyric: "đang", chord: null, beat: 1 },
        { lyric: "sang", chord: null, beat: 2 },
      ],
    },
  
  ],
};

// ---- metronome click (Web Audio API) ----
function ensureAudioContext(ref: React.MutableRefObject<AudioContext | null>) {
  if (!ref.current) {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    ref.current = new Ctx();
  }
  return ref.current!;
}

function click(ctx: AudioContext, accent: boolean) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "square";
  osc.frequency.value = accent ? 1200 : 800;

  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(accent ? 0.25 : 0.18, now + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.035);
}

type PlayPhase = "idle" | "countin" | "play";

type TokenLine = { tokens: Token[]; __lineIdx: number };

export default function Page() {
  const [bpm, setBpm] = useState<number>(demoSong.bpm);
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState<PlayPhase>("idle");

  const [countIn, setCountIn] = useState<number | null>(null); // 4-3-2-1
  const [beat, setBeat] = useState<Beat>(1);

  // activeLine là INDEX TRONG demoSong.lines (để render đúng)
  const [activeLine, setActiveLine] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);

  // refs để restart timer khi đổi bpm mà không phá logic
  const phaseRef = useRef<PlayPhase>("idle");
  const remainingRef = useRef<number>(0);
  const currentBeatRef = useRef<Beat>(1);

  // pos chạy trong tokenLineIndexes (chỉ tokens, bỏ section)
  const tokenLineIndexes = useMemo(() => {
    return demoSong.lines
      .map((l, i) => ("tokens" in l ? i : -1))
      .filter((i) => i !== -1) as number[];
  }, []);

  const posRef = useRef<number>(0);

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stop = () => {
    clearTimer();
    setIsPlaying(false);
    setPhase("idle");
    phaseRef.current = "idle";

    setBeat(1);
    currentBeatRef.current = 1;

    setCountIn(null);
    remainingRef.current = 0;

    posRef.current = 0;
    setActiveLine(tokenLineIndexes[0] ?? 0);
  };

  const tick = (ctx: AudioContext) => {
    // ---- PHASE 1: COUNT-IN (4-3-2-1) ----
    if (phaseRef.current === "countin") {
      click(ctx, currentBeatRef.current === 1);
      setBeat(currentBeatRef.current);

      // advance beat
      currentBeatRef.current =
        currentBeatRef.current === 4 ? 1 : ((currentBeatRef.current + 1) as Beat);

      // giảm remaining theo tick (1 tick = 1 beat)
      remainingRef.current -= 1;

      if (remainingRef.current > 0) {
        setCountIn(remainingRef.current);
        return;
      }

      // hết count-in -> vào bài
      setCountIn(null);
      setPhase("play");
      phaseRef.current = "play";

      // reset beat + line
      currentBeatRef.current = 1;
      setBeat(1);

      posRef.current = 0;
      const firstLine = tokenLineIndexes[0] ?? 0;
      setActiveLine(firstLine);

      // báo vào bài
      click(ctx, true);
      return;
    }

    // ---- PHASE 2: PLAY ----
    if (phaseRef.current === "play") {
      // nếu vừa kết thúc beat 4 -> sang dòng token tiếp theo
      if (currentBeatRef.current === 4) {
        posRef.current = (posRef.current + 1) % tokenLineIndexes.length;
        setActiveLine(tokenLineIndexes[posRef.current]);
      }

      // advance beat
      currentBeatRef.current =
        currentBeatRef.current === 4 ? 1 : ((currentBeatRef.current + 1) as Beat);

      setBeat(currentBeatRef.current);
      click(ctx, currentBeatRef.current === 1);
    }
  };

  const start = async () => {
    const ctx = ensureAudioContext(audioCtxRef);
    if (ctx.state === "suspended") await ctx.resume();

    clearTimer();

    setIsPlaying(true);

    // bắt đầu count-in
    setPhase("countin");
    phaseRef.current = "countin";

    remainingRef.current = 4;
    setCountIn(4);

    currentBeatRef.current = 1;
    setBeat(1);

    // activeLine set về dòng token đầu tiên (không phải section)
    posRef.current = 0;
    const firstLine = tokenLineIndexes[0] ?? 0;
    setActiveLine(firstLine);

    // click đầu để “bắt nhịp”
    click(ctx, true);

    timerRef.current = window.setInterval(() => tick(ctx), 60000 / bpm);
  };

  // restart interval khi đổi BPM (giữ phase/beat/line)
  useEffect(() => {
    if (!isPlaying) return;
    const ctx = ensureAudioContext(audioCtxRef);

    clearTimer();
    timerRef.current = window.setInterval(() => tick(ctx), 60000 / bpm);

    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bpm]);

  useEffect(() => {
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render 1 group (tối đa 3 dòng lyric). Section KHÔNG đi vào group này.
  const renderGroup = (group: TokenLine[], key: string) => {
    return (
      <div key={key} style={styles.groupRow}>
        {group.map((line) => {
          const lineIdx = line.__lineIdx;
          const dim = isPlaying && lineIdx !== activeLine;

          return (
            <div
              key={lineIdx}
              style={{
                ...styles.line,
                opacity: dim ? 0.95 : 1, // không mờ nhiều
              }}
            >
              {line.tokens.map((t, idx) => {
                const hasChord = !!t.chord;
                const isCurrentLine = lineIdx === activeLine;
                const isChordBeatActive =
                  isPlaying && phase !== "countin" && isCurrentLine && hasChord && t.beat === beat;

                if (!hasChord) {
                  return (
                    <span key={idx} style={styles.plainLyric}>
                      {t.lyric}
                    </span>
                  );
                }

                return (
                  <span
                    key={idx}
                    style={{
                      ...styles.chordToken,
                      ...(isChordBeatActive ? styles.chordTokenActive : {}),
                    }}
                  >
                    <span style={styles.chord}>{t.chord}</span>
                    <span style={styles.lyric}>{t.lyric}</span>
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  // Build UI elements: section full width, lyrics grouped 3 lines/row
  const buildSongElements = () => {
    const elements: React.ReactNode[] = [];
    let buffer: TokenLine[] = [];
    let groupCount = 0;

    demoSong.lines.forEach((line, index) => {
      if ("section" in line) {
        if (buffer.length > 0) {
          elements.push(renderGroup(buffer, `group-${groupCount++}`));
          buffer = [];
        }
        elements.push(
          <div key={`section-${index}`} style={styles.sectionWrapper}>
            <div style={styles.sectionTitle}>{line.section}</div>
        
            {phase === "countin" && countIn !== null && line.id === "section1" && (
              <div style={styles.sectionCountIn}>{countIn}</div>
            )}
          </div>
        );
        return;
      }

      buffer.push({ tokens: line.tokens, __lineIdx: index });

      if (buffer.length === 3) {
        elements.push(renderGroup(buffer, `group-${groupCount++}`));
        buffer = [];
      }
    });

    if (buffer.length > 0) {
      elements.push(renderGroup(buffer, `group-${groupCount++}`));
    }

    return elements;
  };

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.h1}>{demoSong.title}</h1>

        <div style={styles.metaRow}>
          <span style={styles.metaPill}>👤 {demoSong.author}</span>
          <span style={styles.metaPill}>🎼 {demoSong.style}</span>
          <span style={styles.metaPill}>✅ Tempo gợi ý: {demoSong.recommendedTempo}</span>
          <span style={styles.metaPill}>⏱ Đang tập: {bpm} BPM</span>
          <span style={styles.metaPill}>
            {demoSong.timeSig[0]}/{demoSong.timeSig[1]}
          </span>
        </div>
      </header>

      <section style={styles.controls}>
        <div style={styles.row}>
          <button
            onClick={() => (isPlaying ? stop() : start())}
            style={{
              ...styles.button,
              ...(isPlaying ? styles.buttonStop : styles.buttonPlay),
            }}
          >
            {isPlaying ? "Stop" : "Play"}
          </button>

          <div style={styles.beatBox}>
            {[1, 2, 3, 4].map((b) => (
              <span
                key={b}
                style={{
                  ...styles.beatChip,
                  ...(beat === b ? styles.beatChipActive : {}),
                }}
              >
                {b}
              </span>
            ))}

          
          </div>

          {/* <div style={{ marginLeft: 10, opacity: 0.9 }}>
            Line: <b>{activeLine + 1}</b>/{demoSong.lines.length}
          </div> */}
        </div>

        <div style={styles.sliderRow}>
          <label style={styles.label}>
            Tempo: <b>{bpm} BPM</b>
          </label>
          <input
            type="range"
            min={40}
            max={200}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            style={styles.slider}
          />
          <div style={styles.sliderHint}>Tip: tập chậm (60–80) rồi tăng dần.</div>
        </div>
      </section>

      <section style={styles.songBox}>{buildSongElements()}</section>

      <section style={styles.notes}>
        <div style={styles.noteTitle}>Gợi ý nâng cấp sau:</div>
        <ul style={styles.ul}>
          <li>Count-in 1 ô nhịp trước khi chạy</li>
          <li>Subdivision: 1-&amp;-2-&amp; để người mới dễ vào</li>
          <li>Auto-scroll theo dòng đang tập</li>
          <li>Audio hợp âm (block chord) + điệu rải</li>
          <li>Mỗi dòng có nhiều bars (không chỉ 1 bar)</li>
        </ul>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "24px 16px 64px",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
  },

  header: { marginBottom: 16 },
  h1: { margin: 0, fontSize: 28, lineHeight: 1.2 },

  controls: {
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },

  row: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },

  button: {
    border: "1px solid rgba(0,0,0,0.18)",
    borderRadius: 12,
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 700,
    background: "white",
  },
  buttonPlay: {},
  buttonStop: { background: "rgba(0,0,0,0.06)" },

  beatBox: { display: "flex", gap: 8, marginLeft: 8, alignItems: "center" },
  beatChip: {
    width: 30,
    height: 30,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.16)",
    opacity: 0.95,
    userSelect: "none",
  },
  beatChipActive: { opacity: 1, fontWeight: 800 },

  sliderRow: { marginTop: 14 },
  label: { display: "block", marginBottom: 8 },
  slider: { width: "100%" },
  sliderHint: { marginTop: 6, opacity: 0.9, fontSize: 13 },

  songBox: {
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: 16,
    padding: 16,
  },

  // 3 lines per row
  groupRow: { display: "flex", gap: 20, marginBottom: 10 },

  line: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },

  plainLyric: {
    display: "inline-block",
    padding: "10px 4px",
    fontSize: 14,
    lineHeight: "18px",
    opacity: 0.95,
  },

  chordToken: {
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: 36,
    padding: "4px 10px",
    borderRadius: 12,
    // giữ border LUÔN 2px -> highlight không làm nhảy layout
    border: "2px solid rgba(0,0,0,0.16)",
    boxSizing: "border-box",
  },

  chordTokenActive: {
    // chỉ đổi màu border, không đổi độ dày
    border: "2px solid rgba(34, 234, 121, 0.85)",
    transform: "translateY(-1px)",
  },

  chord: {
    fontWeight: 800,
    fontSize: 14,
    lineHeight: "16px",
    minHeight: 16,
  },
  lyric: { fontSize: 14, lineHeight: "18px", opacity: 0.95 },

  sectionTitle: {
    fontWeight: 800,
    fontSize: 18,
    letterSpacing: 1,
    color: "rgb(34, 234, 121)",
    borderLeft: "4px solid rgb(34, 234, 121)",
    paddingLeft: 10,
  },

  notes: {
    marginTop: 16,
    border: "1px dashed rgba(0,0,0,0.18)",
    borderRadius: 16,
    padding: 16,
    opacity: 0.95,
  },
  noteTitle: { fontWeight: 800, marginBottom: 8 },
  ul: { margin: 0, paddingLeft: 18 },

  metaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
    marginBottom: 6,
  },
  metaPill: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(0,0,0,0.03)",
    fontSize: 13,
    opacity: 0.95,
  },
  countInPill: {
    marginLeft: 10,
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(246, 7, 7, 0.05)",
    fontSize: 13,
    fontWeight: 800,
  },
  sectionWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    margin: "18px 0 10px 0",
  },
  
  sectionCountIn: {
    fontWeight: 900,
    color: "rgb(34, 234, 121)",
    width: 30,           // dùng width cố định thay vì minWidth
    textAlign: "center",
    background: "rgba(145, 145, 145, 0.1)",
    borderRadius: 50,
    border: "1px solid rgba(140, 135, 135, 0.12)",
    fontVariantNumeric: "tabular-nums", // số đều nhau
  },
};