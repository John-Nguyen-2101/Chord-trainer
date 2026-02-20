"use client";

import React, { useEffect, useRef, useState } from "react";

type Token = { lyric: string; chord?: string | null; beat: 1 | 2 | 3 | 4 };
type Line = { tokens: Token[] };
type Song = { title: string; bpm: number; timeSig: [4, 4]; lines: Line[] };

const demoSong: Song = {
  title: "Demo Song",
  bpm: 80,
  timeSig: [4, 4],
  lines: [
    {
      tokens: [
        { lyric: "Mừng", chord: "C", beat: 1 },
        { lyric: "tết ", chord: null, beat: 2 },
        { lyric: "đến", chord: null, beat: 3 },
        { lyric: "mang  lộc", chord: null, beat: 4 },
      ],
    },
    {
      tokens: [
        { lyric: "đến", chord: "G", beat: 1 },
        { lyric: "nhà", chord: null, beat: 2 },
        { lyric: "nhà", chord: null, beat: 3 },
        { lyric: "cánh  mai", chord: null, beat: 4 },
      ],
    },
    {
      tokens: [
        { lyric: "vàng", chord: "Am", beat: 1 },
        { lyric: "cành "+" "+" đào", chord: null, beat: 2 },
        { lyric: "hồng", chord: null, beat: 3 },
        { lyric: "thắm ", chord: null, beat: 4 },
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
  const [activeLine, setActiveLine] = useState(0); // ✅ nằm trong component

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

    // tick ngay beat 1
    click(ctx, true);

    let currentBeat: 1 | 2 | 3 | 4 = 1;
    let currentLine = 0;

    timerRef.current = window.setInterval(() => {
      // nếu vừa kết thúc beat 4 -> sang dòng mới
      if (currentBeat === 4) {
        currentLine = (currentLine + 1) % demoSong.lines.length;
        setActiveLine(currentLine);
      }

      // advance beat
      currentBeat =
        currentBeat === 4 ? 1 : ((currentBeat + 1) as 1 | 2 | 3 | 4);

      setBeat(currentBeat);
      click(ctx, currentBeat === 1);
    }, 60000 / bpm);
  };

  // Khi đổi BPM lúc đang play: restart timer nhưng giữ beat + activeLine hiện tại
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

      currentBeat =
        currentBeat === 4 ? 1 : ((currentBeat + 1) as 1 | 2 | 3 | 4);

      setBeat(currentBeat);
      click(ctx, currentBeat === 1);
    }, 60000 / bpm);

    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bpm]);

  // cleanup on unmount
  useEffect(() => {
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.h1}>{demoSong.title}</h1>
        <p style={styles.muted}>
          MVP: Lời + hợp âm + tempo + metronome + highlight tuần tự từng dòng (4/4)
        </p>
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

          <div style={{ marginLeft: 10, opacity: 0.75 }}>
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
          <div style={styles.sliderHint}>
            Tip: tập chậm (60–80) rồi tăng dần.
          </div>
        </div>
      </section>

      <section style={styles.songBox}>
        {demoSong.lines.map((line, lineIdx) => {
          const dim = isPlaying && lineIdx !== activeLine;
          return (
            <div
              key={lineIdx}
              style={{
                ...styles.line,
                opacity: dim ? 0.35 : 1,
              }}
            >
              {line.tokens.map((t, idx) => {
                const hasChord = !!t.chord;
                const isCurrentLine = lineIdx === activeLine;
                const isChordBeatActive =
                  isPlaying && isCurrentLine && hasChord && t.beat === beat;

                // Không có hợp âm: chỉ chữ thường
                if (!hasChord) {
                  return (
                    <span key={idx} style={styles.plainLyric}>
                      {t.lyric}
                    </span>
                  );
                }

                // Có hợp âm: box chord + lyric, chỉ highlight khi tới beat đó (của dòng hiện tại)
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
      </section>

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
  muted: { margin: "8px 0 0", opacity: 0.7 },

  controls: {
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  row: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" },
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
    opacity: 0.6,
    userSelect: "none",
  },
  beatChipActive: { opacity: 1, fontWeight: 800 },

  sliderRow: { marginTop: 14 },
  label: { display: "block", marginBottom: 8 },
  slider: { width: "100%" },
  sliderHint: { marginTop: 6, opacity: 0.7, fontSize: 13 },

  songBox: {
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: 16,
    padding: 16,
  },
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
    opacity: 0.9,
  },

  chordToken: {
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: 36,
    padding: "6px 10px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.16)",
  },

  chordTokenActive: {
    border: "2px solid rgba(0,0,0,0.55)",
    transform: "translateY(-1px)",
  },

  chord: {
    fontWeight: 800,
    fontSize: 14,
    lineHeight: "16px",
    minHeight: 16,
  },
  lyric: { fontSize: 14, lineHeight: "18px", opacity: 0.9 },

  notes: {
    marginTop: 16,
    border: "1px dashed rgba(0,0,0,0.18)",
    borderRadius: 16,
    padding: 16,
    opacity: 0.9,
  },
  noteTitle: { fontWeight: 800, marginBottom: 8 },
  ul: { margin: 0, paddingLeft: 18 },
};  