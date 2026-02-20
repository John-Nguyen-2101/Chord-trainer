"use client";

import React, { useEffect, useRef, useState } from "react";

type Token = { lyric: string; chord?: string | null; beat: 1 | 2 | 3 | 4 };
type Line = { tokens: Token[] } | { section: string };

type Song = {
  title: string;
  author: string;
  style: string; // điệu/genre
  recommendedTempo: string; // tempo khuyên dùng (text)
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
    { section: "ĐIỆP KHÚC" },

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
    { tokens: [{ lyric: "tươi", chord: "Em", beat: 1 }, { lyric: "", chord: null, beat: 2 }] },

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
    { tokens: [{ lyric: "nay", chord: "Em", beat: 1 }, { lyric: "", chord: null, beat: 2 }] },
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

export default function Page() {
  const [bpm, setBpm] = useState<number>(demoSong.bpm);
  const [isPlaying, setIsPlaying] = useState(false);
  const [beat, setBeat] = useState<1 | 2 | 3 | 4>(1);
  const [activeLine, setActiveLine] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stop = () => {
    clearTimer();
    setIsPlaying(false);
    setBeat(1);
    setActiveLine(0);
  };

  const start = async () => {
    const ctx = ensureAudioContext(audioCtxRef);
    if (ctx.state === "suspended") await ctx.resume();

    clearTimer();

    setBeat(1);
    setActiveLine(0);
    setIsPlaying(true);

    click(ctx, true);

    let currentBeat: 1 | 2 | 3 | 4 = 1;
    let currentLine = 0;

    timerRef.current = window.setInterval(() => {
      if (currentBeat === 4) {
        currentLine = (currentLine + 1) % demoSong.lines.length;
        setActiveLine(currentLine);
      }

      currentBeat = currentBeat === 4 ? 1 : ((currentBeat + 1) as 1 | 2 | 3 | 4);
      setBeat(currentBeat);
      click(ctx, currentBeat === 1);
    }, 60000 / bpm);
  };

  useEffect(() => {
    if (!isPlaying) return;

    clearTimer();
    const ctx = ensureAudioContext(audioCtxRef);

    let currentBeat: 1 | 2 | 3 | 4 = beat;
    let currentLine = activeLine;

    timerRef.current = window.setInterval(() => {
      if (currentBeat === 4) {
        currentLine = (currentLine + 1) % demoSong.lines.length;
        setActiveLine(currentLine);
      }

      currentBeat = currentBeat === 4 ? 1 : ((currentBeat + 1) as 1 | 2 | 3 | 4);
      setBeat(currentBeat);
      click(ctx, currentBeat === 1);
    }, 60000 / bpm);

    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bpm]);

  useEffect(() => {
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render 1 group (tối đa 3 dòng lyric). Section KHÔNG đi vào group này.
  const renderGroup = (group: { tokens: Token[] }[], key: string) => {
    return (
      <div key={key} style={styles.groupRow}>
        {group.map((line, idxInGroup) => {
          const lineIdx = group[idxInGroup].__lineIdx as number; // gắn tạm bên dưới
          const dim = isPlaying && lineIdx !== activeLine;

          return (
            <div
              key={lineIdx}
              style={{
                ...styles.line,
                opacity: dim ? 0.9 : 1, // không mờ quá (mắt yếu vẫn thấy)
              }}
            >
              {line.tokens.map((t, idx) => {
                const hasChord = !!t.chord;
                const isCurrentLine = lineIdx === activeLine;
                const isChordBeatActive = isPlaying && isCurrentLine && hasChord && t.beat === beat;

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
    let buffer: ({ tokens: Token[]; __lineIdx: number }[]) = [];
    let groupCount = 0;

    demoSong.lines.forEach((line, index) => {
      // Section: flush buffer + render section
      if ("section" in line) {
        if (buffer.length > 0) {
          elements.push(renderGroup(buffer as any, `group-${groupCount++}`));
          buffer = [];
        }

        elements.push(
          <div key={`section-${index}`} style={styles.sectionTitle}>
            {line.section}
          </div>
        );
        return;
      }

      // Tokens line: push to buffer
      buffer.push({ tokens: line.tokens, __lineIdx: index });

      // Enough 3 lines => render a row
      if (buffer.length === 3) {
        elements.push(renderGroup(buffer as any, `group-${groupCount++}`));
        buffer = [];
      }
    });

    // Remaining lines
    if (buffer.length > 0) {
      elements.push(renderGroup(buffer as any, `group-${groupCount++}`));
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

          <div style={{ marginLeft: 10, opacity: 0.85 }}>
            Line: <b>{activeLine + 1}</b>/{demoSong.lines.length}
          </div>
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

  beatBox: { display: "flex", gap: 8, marginLeft: 8 },
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
    border: "2px solid rgba(0,0,0,0.16)",
  },

  // highlight beat token (viền xanh)
  chordTokenActive: {
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

  // section full width
  sectionTitle: {
    fontWeight: 800,
    fontSize: 18,
    letterSpacing: 1,
    margin: "18px 0 10px 0",
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
};