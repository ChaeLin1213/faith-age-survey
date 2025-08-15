import React, { useMemo, useState, useEffect } from "react";

// 단일 파일(App.jsx)로 붙여 넣어 사용하세요.
// Vite 기본 템플릿 기준: src/App.jsx 를 이 파일 내용으로 교체 → npm run dev

export default function App() {
  // 1) 설문 데이터 정의 -----------------------------------------------
  const sections = useMemo(
    () => [
      {
        id: "rel",
        title: "1. 하나님과의 관계",
        questions: [
          "나는 매일 성경을 읽는 시간을 갖고 있다.",
          "나는 하루에 한 번 이상 기도하고 있다.",
          "나는 찬양을 자주 듣거나 부르며 하나님께 집중한다.",
          "나는 아침에 일어나서 기도로 하루를 시작한다.",
          "나는 잠자기 전 하나님께 기도하는 습관이 있다.",
          "나는 식사 전 기도를 한다.",
        ],
      },
      {
        id: "presence",
        title: "2. 하나님과의 임재 연습",
        questions: [
          "나는 말씀을 묵상하며 하나님과 교제하는 시간을 갖고 있다.",
          "나는 일상 속에서 하나님을 자주 떠올리고 인식하며 산다.",
          "나는 하나님과 가까운 관계 속에 있다고 느낀다.",
          "나는 기도할 때 하나님이 들으시고 응답하신다는 확신이 있다.",
          "어려운 일을 겪어도 하나님 안에서 기쁨을 유지하려고 노력한다.",
          "나는 평소 삶 속에서 감사의 표현이 자주 나온다.",
          "나는 낙심하거나 우울할 때 믿음으로 감정을 다스리려 한다.",
        ],
      },
      {
        id: "maturity",
        title: "3. 영적 성숙",
        questions: [
          "나는 신앙의 기쁨이 내 안에 자주 넘친다고 느낀다.",
          "나는 다른 사람을 기꺼이 섬기려는 태도를 가지고 있다.",
          "나는 다른 사람을 쉽게 판단하거나 비난하지 않고, 격려하려 노력한다.",
          "나는 힘들거나 꺼려지는 일을 기꺼이 먼저 하려 한다.",
          "나는 바쁠 때에도 하나님 안에서 평안을 유지하려 한다.",
          "나는 도움이 필요한 이웃에게 적극적으로 다가가려 한다.",
          "나는 영적으로 성장하면서 오는 기쁨을 실제로 경험하고 있다.",
          "나는 예배 시간에 하나님과 깊이 교제하는 기쁨을 느낀다.",
        ],
      },
      {
        id: "practice",
        title: "4. 영적 능력의 실천",
        questions: [
          "나는 일상에서 하나님이 나와 함께하심을 실제로 경험하고 있다.",
          "나는 공동체 안에서 나에게 주어진 사역을 충실히 감당하고 있다.",
          "나는 예배와 찬양 시간에 집중하고 열정적으로 참여한다.",
          "나는 세상의 유혹과 가치관을 분별하며 멀리하려 한다.",
          "나는 복음을 전하고 싶은 마음이 있으며 실제로 실천하려 한다.",
          "나는 예배를 어떻게 드려야 하나님께 영광이 되는지 고민하고 준비한다.",
          "나는 겸손한 태도와 자비로운 행동을 실천하려 한다.",
          "나는 교회와 공동체 활동에 적극적으로 참여하고 있다.",
        ],
      },
      {
        id: "influence",
        title: "5. 삶에서 영향력을 끼치기",
        questions: [
          "나는 가족과 이웃을 위해 기도하는 시간을 자주 갖는다.",
          "나는 도움이 필요한 이웃에게 실제로 도움을 주려고 노력한다.",
          "나는 다른 사람의 상황을 위해 기도(중보기도)하는 습관이 있다.",
          "나는 선교사들을 위해 기도하거나 후원하고 있다.",
          "나는 병든 자나 어려운 사람들을 찾아가거나 도우려 한다.",
          "나의 섬김과 사역이 점점 넓어지고 풍성해지고 있다고 느낀다.",
        ],
      },
    ],
    []
  );

  const totalQuestions = useMemo(
    () => sections.reduce((sum, s) => sum + s.questions.length, 0),
    [sections]
  );

  // 2) 응답 상태 --------------------------------------------------------
  // answers: { `${sectionId}-${qIdx}`: 1~5 }
  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem("faith_survey_answers");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("faith_survey_answers", JSON.stringify(answers));
  }, [answers]);

  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / totalQuestions) * 100);

  // 3) 점수 계산 --------------------------------------------------------
  const { sectionScores, sectionAverages, totalScore, averageScore } = useMemo(
    () => {
      const sectionScores = {};
      const sectionAverages = {};
      let total = 0;
      let count = 0;
      sections.forEach((sec) => {
        let s = 0;
        sec.questions.forEach((_, i) => {
          const key = `${sec.id}-${i}`;
          if (answers[key]) {
            s += Number(answers[key]);
            total += Number(answers[key]);
            count += 1;
          }
        });
        sectionScores[sec.id] = s;
        sectionAverages[sec.id] = s / sec.questions.length || 0;
      });
      return {
        sectionScores,
        sectionAverages,
        totalScore: total,
        averageScore: count ? total / count : 0,
      };
    },
    [answers, sections]
  );

  // 4) 신앙 나이(비유) 매핑 --------------------------------------------
  function stageFromAverage(avg) {
    // 평균 점수 기준 예시 (필요 시 구간 조정하세요)
    if (avg >= 4.7) return { label: "장년기", desc: "깊은 신앙의 성숙과 열매가 안정적으로 드러나는 단계" };
    if (avg >= 4.3) return { label: "청년기", desc: "지속적 성장과 헌신이 뚜렷해지는 단계" };
    if (avg >= 3.5) return { label: "청소년기", desc: "성장 욕구가 크고 훈련을 통해 빨리 성숙할 수 있는 단계" };
    if (avg >= 2.5) return { label: "아동기", desc: "기초 습관을 다지며 배움이 즐거운 단계" };
    if (avg >= 1.5) return { label: "유아기", desc: "돌봄과 기본 훈련이 많이 필요한 시작 단계" };
    return { label: "영아기", desc: "첫 걸음을 떼는 단계, 작은 실천부터 차근차근" };
  }

  const overallStage = stageFromAverage(averageScore);

  // 5) 유틸 -------------------------------------------------------------
  const setAnswer = (sectionId, index, value) => {
    const key = `${sectionId}-${index}`;
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const resetAll = () => {
    if (confirm("모든 응답을 초기화할까요?")) {
      setAnswers({});
      localStorage.removeItem("faith_survey_answers");
    }
  };

  const allAnswered = answeredCount === totalQuestions;

  // 6) 스타일(간단) ----------------------------------------------------
  const styles = {
    container: {
      maxWidth: 960,
      margin: "0 auto",
      padding: "24px 16px 64px",
      fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif",
      lineHeight: 1.6,
      color: "#111827",
    },
    card: {
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 16,
      padding: 20,
      boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
      marginBottom: 16,
    },
    h1: { fontSize: 28, margin: "0 0 8px", fontWeight: 800 },
    h2: { fontSize: 20, margin: "20px 0 8px", fontWeight: 700 },
    small: { color: "#6b7280" },
    scale: { fontSize: 14, color: "#374151" },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { background: "#f9fafb", fontWeight: 700, padding: 10, borderBottom: "1px solid #e5e7eb", textAlign: "left" },
    td: { padding: 10, borderBottom: "1px solid #f3f4f6" },
    qRow: { background: "#fff" },
    radioRow: { display: "flex", gap: 12, alignItems: "center" },
    badge: {
      display: "inline-block",
      padding: "6px 10px",
      borderRadius: 999,
      background: "#eef2ff",
      color: "#3730a3",
      fontWeight: 700,
      fontSize: 12,
    },
    progressWrap: { margin: "8px 0 16px", height: 8, background: "#f3f4f6", borderRadius: 999 },
    progressBar: { height: 8, background: "#4f46e5", borderRadius: 999, transition: "width .25s" },
    btnRow: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 },
    btn: {
      padding: "10px 14px",
      borderRadius: 12,
      border: "1px solid #e5e7eb",
      background: "#111827",
      color: "white",
      cursor: "pointer",
      fontWeight: 700,
    },
    ghostBtn: {
      padding: "10px 14px",
      borderRadius: 12,
      border: "1px solid #e5e7eb",
      background: "white",
      color: "#111827",
      cursor: "pointer",
      fontWeight: 700,
    },
    warn: { color: "#b45309", fontWeight: 600 },
    scoreBox: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginTop: 8 },
    scoreCard: { border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, background: "#fafafa" },
  };

  // 7) 렌더 -------------------------------------------------------------
  return (
    <div style={styles.container}>
      <header style={{ ...styles.card, padding: 24 }}>
        <div style={styles.badge}>✍ 신앙 자가진단지</div>
        <h1 style={styles.h1}>당신의 신앙나이는 몇 살인가요?</h1>
        <p style={{ marginTop: 6 }}>
          아래 각 문항을 읽고, 본인의 현재 상태에 가장 가까운 점수(1~5점)를 체크해 주세요. 각 문항은
          하나만 선택합니다.
        </p>
        <p style={styles.scale}>
          <strong>✅ 점수 기준</strong> (이 삶의 모습이 내게 얼마나 자주 나타납니까?)<br />
          1점: 전혀 하지 않음 | 2점: 가끔 함 | 3점: 어느 정도 함 | 4점: 자주 함 | 5점: 항상 실천함
        </p>
        <div style={styles.progressWrap}>
          <div style={{ ...styles.progressBar, width: `${progress}%` }} />
        </div>
        <p style={styles.small}>
          진행률: <strong>{answeredCount}</strong>/<strong>{totalQuestions}</strong> ({progress}%)
        </p>
        <div style={styles.btnRow}>
          <button style={styles.ghostBtn} onClick={() => window.print()}>🖨️ 인쇄/저장(PDF)</button>
          <button style={styles.ghostBtn} onClick={resetAll}>♻ 초기화</button>
        </div>
      </header>

      {sections.map((sec) => (
        <section key={sec.id} style={styles.card}>
          <h2 style={styles.h2}>{sec.title}</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>문항</th>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <th key={n} style={{ ...styles.th, textAlign: "center" }}>{n}점</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sec.questions.map((q, i) => {
                  const key = `${sec.id}-${i}`;
                  const val = answers[key] || 0;
                  const rowStyle = styles.qRow;
                  return (
                    <tr key={key} style={rowStyle}>
                      <td style={styles.td}>{q}</td>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <td key={n} style={{ ...styles.td, textAlign: "center" }}>
                          <label style={styles.radioRow}>
                            <input
                              type="radio"
                              name={key}
                              value={n}
                              checked={val === n}
                              onChange={() => setAnswer(sec.id, i, n)}
                              aria-label={`${q} - ${n}점`}
                            />
                          </label>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={styles.small}>
              섹션 평균: <strong>{sectionAverages[sec.id]?.toFixed(2) || "0.00"}</strong>점
            </div>
          </div>
        </section>
      ))}

      <section style={{ ...styles.card, background: "#f8fafc" }}>
        <h2 style={styles.h2}>결과 요약</h2>
        {!allAnswered && (
          <p style={styles.warn}>
            모든 문항에 응답하면 정확한 결과를 볼 수 있어요. (현재 {answeredCount}/{totalQuestions})
          </p>
        )}
        <div style={styles.scoreBox}>
          {sections.map((sec) => (
            <div key={sec.id} style={styles.scoreCard}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{sec.title}</div>
              <div>합계: <strong>{sectionScores[sec.id] || 0}</strong></div>
              <div>평균: <strong>{(sectionAverages[sec.id] || 0).toFixed(2)}</strong></div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>총평</div>
          <p>
            총점: <strong>{totalScore}</strong> / 최대 {totalQuestions * 5}점 &nbsp;|&nbsp; 전체 평균: {" "}
            <strong>{averageScore.toFixed(2)}</strong>점
          </p>
          <p>
            신앙 나이(비유): {" "}
            <span style={styles.badge}>{overallStage.label}</span> — {overallStage.desc}
          </p>
        </div>

        <details style={{ marginTop: 12 }}>
          <summary style={{ cursor: "pointer", fontWeight: 700 }}>해석 가이드 보기</summary>
          <ul style={{ marginTop: 8, paddingLeft: 18 }}>
            <li><strong>영아기</strong> (평균 &lt; 1.5): 첫 걸음. 아주 작은 실천부터 시작해요 — 하루 5분 말씀/기도.</li>
            <li><strong>유아기</strong> (1.5–2.49): 기본 습관 세우기. 같은 시간, 같은 장소에서 규칙성 만들기.</li>
            <li><strong>아동기</strong> (2.5–3.49): 배움을 확장. 공동체 나눔/멘토링 참여해 보기.</li>
            <li><strong>청소년기</strong> (3.5–4.29): 훈련의 계절. 사역/섬김의 영역을 한 단계 확장.</li>
            <li><strong>청년기</strong> (4.3–4.69): 헌신의 길. 꾸준함을 유지하고 주변을 세우는 리더십.</li>
            <li><strong>장년기</strong> (≥ 4.7): 성숙과 열매. 다음 세대를 세우는 동반자 사역에 집중.</li>
          </ul>
        </details>

        <div style={styles.btnRow}>
          <button style={styles.btn} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>맨 위로</button>
          <button style={styles.ghostBtn} onClick={resetAll}>응답 초기화</button>
        </div>
      </section>

      <footer style={{ textAlign: "center", color: "#9ca3af", marginTop: 24 }}>
        <small>© {new Date().getFullYear()} Faith Self-Assessment • 로컬에 자동 저장됩니다.</small>
      </footer>
    </div>
  );
}
