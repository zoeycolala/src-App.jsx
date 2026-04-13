import { useState } from "react";

const SIGNS = [
  { name: "白羊座", emoji: "♈", dates: "3/21-4/19" },
  { name: "金牛座", emoji: "♉", dates: "4/20-5/20" },
  { name: "双子座", emoji: "♊", dates: "5/21-6/21" },
  { name: "巨蟹座", emoji: "♋", dates: "6/22-7/22" },
  { name: "狮子座", emoji: "♌", dates: "7/23-8/22" },
  { name: "处女座", emoji: "♍", dates: "8/23-9/22" },
  { name: "天秤座", emoji: "♎", dates: "9/23-10/23" },
  { name: "天蝎座", emoji: "♏", dates: "10/24-11/22" },
  { name: "射手座", emoji: "♐", dates: "11/23-12/21" },
  { name: "摩羯座", emoji: "♑", dates: "12/22-1/19" },
  { name: "水瓶座", emoji: "♒", dates: "1/20-2/18" },
  { name: "双鱼座", emoji: "♓", dates: "2/19-3/20" },
];

const COLORS = ["#b388ff","#80cbc4","#f48fb1","#ffcc80","#90caf9","#a5d6a7","#ef9a9a","#ce93d8","#80deea","#ffab91","#c5e1a5","#80d8ff"];

function StarRating({ score }) {
  return (
    <span style={{ letterSpacing: 1 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= score ? "#ffd54f" : "#555", fontSize: 14 }}>★</span>
      ))}
    </span>
  );
}

function CardView({ result, sign, date }) {
  const accent = COLORS[SIGNS.findIndex(s => s.name === sign.name)];
  return (
    <div style={{
      background: "linear-gradient(145deg, #0d0d1a 0%, #121228 60%, #0a1520 100%)",
      borderRadius: 18,
      padding: "28px 24px 24px",
      color: "#e8e8f0",
      fontFamily: "sans-serif",
      maxWidth: 360,
      margin: "0 auto",
      border: `1.5px solid ${accent}44`,
      boxShadow: `0 0 32px ${accent}22`,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: `${accent}18`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: `${accent}10`, pointerEvents: "none" }} />

      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 36, marginBottom: 4 }}>{sign.emoji}</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: accent, letterSpacing: 2 }}>{sign.name}</div>
        <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{date} · 每日运势</div>
      </div>

      <div style={{
        background: "#ffffff08",
        borderRadius: 12,
        padding: "14px 16px",
        marginBottom: 16,
        borderLeft: `3px solid ${accent}`,
        fontSize: 14,
        lineHeight: 1.75,
        color: "#ccd0e0",
      }}>
        {result.summary}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {[
          { label: "爱情", score: result.love },
          { label: "事业", score: result.career },
          { label: "财运", score: result.money },
          { label: "健康", score: result.health },
        ].map(item => (
          <div key={item.label} style={{
            background: "#ffffff08",
            borderRadius: 10,
            padding: "10px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}>
            <div style={{ fontSize: 11, color: "#888" }}>{item.label}</div>
            <StarRating score={item.score} />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[
          { label: "幸运色", value: result.luckyColor },
          { label: "幸运数", value: result.luckyNumber },
          { label: "关键词", value: result.keyword },
        ].map(item => (
          <div key={item.label} style={{
            flex: 1,
            minWidth: 80,
            background: `${accent}18`,
            border: `1px solid ${accent}33`,
            borderRadius: 8,
            padding: "8px 10px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 10, color: "#888", marginBottom: 3 }}>{item.label}</div>
            <div style={{ fontSize: 13, color: accent, fontWeight: 600 }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 16, fontSize: 10, color: "#444" }}>✦ 仅供娱乐参考 ✦</div>
    </div>
  );
}

export default function App() {
  const today = new Date().toISOString().slice(0, 10);
  const [sign, setSign] = useState(null);
  const [date, setDate] = useState(today);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function generate() {
    if (!sign) return;
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const prompt = `你是一位专业的星座运势占卜师。请为${sign.name}生成${date}的每日运势。
请严格只返回如下JSON格式，不要有任何多余文字或markdown符号：
{
  "summary": "2-3句综合运势描述，语气神秘而温柔，带有星象意象",
  "love": 爱情运势分数1-5的整数,
  "career": 事业运势分数1-5的整数,
  "money": 财运分数1-5的整数,
  "health": 健康运势分数1-5的整数,
  "luckyColor": "一种幸运颜色（2-4字）",
  "luckyNumber": "幸运数字（1-2位数）",
  "keyword": "今日关键词（2-4字）"
}`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await res.json();
      const text = data.content.map(b => b.text || "").join("").replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(text);
      setResult(parsed);
    } catch (e) {
      setError("生成失败，请重试");
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: "20px 16px", maxWidth: 480, margin: "0 auto", fontFamily: "sans-serif", background: "#0a0a14", minHeight: "100vh" }}>
      <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 4, color: "#e8e8f0" }}>每日星座运势</h2>
      <p style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>选择星座，生成卡片，截图发群</p>

      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 6 }}>日期</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #333",
            background: "#1a1a2e",
            color: "#e8e8f0",
            fontSize: 14,
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 8 }}>星座</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {SIGNS.map((s, i) => (
            <div
              key={s.name}
              onClick={() => setSign(s)}
              style={{
                cursor: "pointer",
                borderRadius: 10,
                padding: "8px 4px",
                textAlign: "center",
                border: sign?.name === s.name ? `2px solid ${COLORS[i]}` : "1.5px solid #2a2a3e",
                background: sign?.name === s.name ? `${COLORS[i]}18` : "#1a1a2e",
                transition: "all 0.15s",
              }}
            >
              <div style={{ fontSize: 18 }}>{s.emoji}</div>
              <div style={{ fontSize: 11, color: "#ccc", marginTop: 2 }}>{s.name}</div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={generate}
        disabled={!sign || loading}
        style={{
          width: "100%",
          padding: "11px",
          borderRadius: 10,
          border: "none",
          background: sign ? "#5c6bc0" : "#2a2a3e",
          color: sign ? "#fff" : "#555",
          fontSize: 14,
          fontWeight: 500,
          cursor: sign ? "pointer" : "not-allowed",
          marginBottom: 24,
        }}
      >
        {loading ? "占卜中..." : "生成运势卡片"}
      </button>

      {error && <div style={{ color: "#ef9a9a", fontSize: 13, marginBottom: 16 }}>{error}</div>}
      {result && sign && <CardView result={result} sign={sign} date={date} />}
    </div>
  );
}
