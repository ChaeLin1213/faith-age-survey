import React, { useMemo, useState, useEffect } from "react";

// Vite 기본 템플릿 기준: src/App.jsx 교체 → npm run dev

// 안전한 localStorage 헬퍼
const storage = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch {}
  },
};

export default function App() {
  // 1) 설문 데이터 ------------------------------------------------------
  const sections = useMemo(
    () => [
      {
        id: "rel",
        title: "1. 하나님과의 관계",
        icon: "📖",
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
        icon: "✨",
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
        icon: "🌿",
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
        icon: "🕊️",
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
        icon: "🌍",
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
  const maxPoints = totalQuestions * 5; // 35문항 → 175점

  // 2) 상태 ------------------------------------------------------------
  const [answers, setAnswers] = useState(() => storage.get("faith_survey_answers", {}));
  const [formKey, setFormKey] = useState(0); // 초기화 시 리마운트용

  useEffect(() => {
    storage.set("faith_survey_answers", answers);
  }, [answers]);

  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / totalQuestions) * 100);

  // 3) 점수 계산 --------------------------------------------------------
  const { sectionScores, sectionAverages, totalScore, averageScore } = useMemo(() => {
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
  }, [answers, sections]);

  // 4) 해석 구간(180점 기준 → 비율 환산) -------------------------------
  const ratioThresholds = {
    adult: 150 / 180,   // 장년기
    youth: 120 / 180,   // 청년기
    child: 90 / 180,    // 아동기
    toddler: 60 / 180,  // 유아기
  };

  const displayRanges = useMemo(() => {
    const adultMin = Math.ceil(ratioThresholds.adult * maxPoints);
    const youthMin = Math.ceil(ratioThresholds.youth * maxPoints);
    const childMin = Math.ceil(ratioThresholds.child * maxPoints);
    const toddlerMin = Math.ceil(ratioThresholds.toddler * maxPoints);
    const adult = { min: adultMin, max: maxPoints };
    const youth = { min: youthMin, max: Math.max(adultMin - 1, youthMin) };
    const child = { min: childMin, max: Math.max(youthMin - 1, childMin) };
    const toddler = { min: toddlerMin, max: Math.max(childMin - 1, toddlerMin) };
    const infant = { min: 0, max: Math.max(toddlerMin - 1, 0) };
    return { adult, youth, child, toddler, infant };
  }, [maxPoints]);

  function stageFromTotal(score, max) {
    const r = score / max;
    if (r >= ratioThresholds.adult)
      return {
        key: "adult",
        label: "믿음의 장년기 (성숙한 어른)",
        desc: "믿음 안에서 분별하고 다른 사람을 세우며 돌보는 단계",
        verse: "“너희 아비들아, 너희가 태초부터 계신 이를 알았음이라” – 요한일서 2:13",
      };
    if (r >= ratioThresholds.youth)
      return {
        key: "youth",
        label: "신앙 청년기 (훈련받는 일꾼)",
        desc: "세상과 죄를 이기고 말씀으로 무장한 상태",
        verse: "“너희 청년들아, 너희가 강하고 하나님의 말씀이 너희 안에 거하시며, 너희가 흉악한 자를 이기었음이라” – 요한일서 2:14",
      };
    if (r >= ratioThresholds.child)
      return {
        key: "child",
        label: "신앙 아동기 (기초를 세우는 시기)",
        desc: "하나님을 아버지로 인식하고 말씀을 배우는 시기",
        verse: "“너희 어린 자녀들아, 너희가 아버지를 알았음이라” – 요한일서 2:13",
      };
    if (r >= ratioThresholds.toddler)
      return {
        key: "toddler",
        label: "신앙 유아기 (새싹 단계)",
        desc: "의의 말씀에 익숙지 않고, 기초를 배우는 단계",
        verse: "“젖이나 먹는 자마다 의의 말씀을 경험하지 못한 자요 어린 아이니라” – 히브리서 5:13",
      };
    return {
      key: "infant",
      label: "신앙 영아기 (씨앗 상태)",
      desc: "신앙이 아직 시작되지 않았거나 극히 미약한 상태",
      verse: "“그들이 하나님의 생명에서 떠나 있는 것은 그들 속에 무지함과 마음의 굳어짐 때문이다” – 에베소서 4:18",
    };
  }
  const overallStage = stageFromTotal(totalScore, maxPoints);

  // 5) 실천 제안 템플릿 (요청문구 반영) --------------------------------
  const actionPlanTemplates = {
    adult: {
      title: "믿음의 장년기 (성숙한 어른)",
      state: `“너희 아비들아, 너희가 태초부터 계신 이를 알았음이라” (요한일서 2:13)
하나님을 깊이 알고, 삶으로 복음을 살아내며 다른 이들을 돌보는 인도자의 위치에 있습니다.
공동체를 세우고, 다음 세대를 양육하며, 지속적으로 하나님의 뜻을 분별하는 삶을 살아가고 계십니다.`,
      actions: [
        "말씀과 기도로 누군가를 양육해보세요",
        "공동체 안에서 리더십의 자리를 감당해보세요",
        "교회 밖에서도 영향력을 발휘할 섬김을 기도해보세요",
        "나의 은사를 통해 누구를 세울 수 있을지 고민해보세요",
        "(직접 작성) 나만의 적용: _______________________________________",
      ],
    },
    youth: {
      title: "신앙 청년기 (훈련받는 일꾼)",
      state: `“너희 청년들아, 너희가 강하고 하나님의 말씀이 너희 안에 거하시며, 너희가 흉악한 자를 이기었음이라” (요한일서 2:14)
하나님의 말씀 안에서 훈련받고, 세상의 유혹과 싸우며 이기는 과정을 걷고 있는 단계입니다.
신앙이 삶 속에서 구체화되기 시작했고, 하나님께서 주시는 소명을 붙들고 실천해 나아가는 시기입니다.`,
      actions: [
        "매일 말씀 묵상 루틴 만들기 (10분이라도!)",
        "기도제목 노트를 만들어 기도 응답 체크하기",
        "정기적으로 교회 사역에 자원해 보기",
        "멘토/멘티로서의 관계 맺기",
        "(직접 작성) 나만의 적용: _______________________________________",
      ],
    },
    child: {
      title: "신앙 아동기 (기초 세우는 시기)",
      state: `“어린 자녀들아, 너희가 아버지를 알았음이라” (요한일서 2:13)
하나님을 점점 더 알아가고, 말씀과 기도를 통해 신앙의 기초를 세워가는 시기입니다.
삶 속에서 하나님의 존재를 인식하고, 신앙이 일상에 뿌리내리기 시작하는 중요한 단계입니다.
이 시기를 잘 지나면, 더욱 단단한 신앙으로 성장할 수 있습니다.`,
      actions: [
        "매일 정해진 시간에 성경 한 장 읽기",
        "하루 1번 감사 제목 적기",
        "주일예배 정시 참석 & 말씀 필기하기",
        "신앙 일기 쓰기 (하루 1줄도 OK!)",
        "(직접 작성) 나만의 적용: _______________________________________",
      ],
    },
    toddler: {
      title: "신앙 유아기 (새싹 단계)",
      state: `“젖이나 먹는 자마다 의의 말씀을 경험하지 못한 자요 어린아이니라” (히브리서 5:13)
지금은 신앙의 기초를 하나씩 배워가는 새싹 같은 시기입니다.
하나님에 대한 갈망이 생기기 시작했고, 말씀과 예배가 아직 낯설 수 있지만,
이 시작이 하나님의 인도하심이라는 사실만으로도 충분히 귀한 걸음입니다.`,
      actions: [
        "매주 주일예배 빠지지 않고 참석해 보기",
        "말씀이나 찬양 중 마음에 남는 구절 1개 적어 보기",
        "교회 소그룹 또는 청년모임 참여 신청하기",
        "짧은 기도라도 하루에 한 번 해보기",
        "(직접 작성) 나만의 적용: _______________________________________",
      ],
    },
    infant: {
      title: "신앙 영아기 (씨앗 상태)",
      state: `“그들이 하나님의 생명에서 떠나 있는 것은 그들 속에 무지함과 그들의 마음의 굳어짐 때문이라” (에베소서 4:18)
아직은 신앙이 삶 속에 깊이 자리 잡기 전이지만, 하나님께 마음을 열고 싶다는 갈망의 씨앗이 심겨진 상태입니다.
지금 이 피드백지를 받고 있는 것도 결코 우연이 아닙니다. 이 씨앗이 하나님의 은혜로 자라나 큰 나무가 될 수 있습니다.`,
      actions: [
        '하루에 한 번 "하나님, 계시다면 저와 함께 해주세요"라고 말해보기',
        "찬양이나 설교 영상 하나 들어보기",
        "누군가에게 기도 부탁해보기",
        "교회 예배나 모임에 참석해보기 (처음은 보기만 해도 좋아요)",
        "(직접 작성) 나만의 적용: _______________________________________",
      ],
    },
  };

  // 6) UI 토큰/스타일 ---------------------------------------------------
  const ui = {
    bg: "linear-gradient(120deg, #EEF2FF 0%, #FDF2F8 55%, #ECFEFF 100%)",
    cardBg: "rgba(255,255,255,0.65)",
    border: "1px solid rgba(255,255,255,0.55)",
    blur: "saturate(1.2) blur(8px)",
    radius: 16,
    shadow: "0 10px 30px rgba(0,0,0,0.08)",
    accent: "linear-gradient(90deg,#7C3AED,#06B6D4)",
    accentSoft: "linear-gradient(90deg,#C4B5FD,#99F6E4)",
    textGrad: "linear-gradient(90deg,#1F2937,#4F46E5)",
    chipBg: "#111827",
  };

  const styles = {
    container: {
      maxWidth: 980,
      margin: "0 auto",
      padding: "28px 16px 72px",
      fontFamily:
        "Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif",
      lineHeight: 1.6,
      color: "#0F172A",
      backgroundImage: ui.bg,
      minHeight: "100vh",
    },
    glassCard: {
      background: ui.cardBg,
      border: ui.border,
      borderRadius: ui.radius,
      padding: 20,
      boxShadow: ui.shadow,
      backdropFilter: ui.blur,
      WebkitBackdropFilter: ui.blur,
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 900,
      margin: "6px 0 8px",
      backgroundImage: ui.textGrad,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
    },
    badge: {
      display: "inline-block",
      padding: "6px 10px",
      borderRadius: 999,
      background: "rgba(79,70,229,0.08)",
      color: "#4338CA",
      fontWeight: 700,
      fontSize: 12,
    },
    small: { color: "#6b7280" },
    scale: { fontSize: 14, color: "#374151" },
    progressWrap: {
      margin: "10px 0 16px",
      height: 10,
      background: "rgba(17,24,39,0.08)",
      borderRadius: 999,
      overflow: "hidden",
    },
    progressBar: {
      height: 10,
      backgroundImage: ui.accent,
      borderRadius: 999,
      transition: "width .25s",
    },
    btnRow: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 },
    btn: {
      padding: "10px 14px",
      borderRadius: 12,
      border: "none",
      backgroundImage: ui.accent,
      color: "white",
      cursor: "pointer",
      fontWeight: 800,
      boxShadow: "0 8px 16px rgba(124,58,237,0.25)",
      transition: "transform .12s ease",
    },
    btnGhost: {
      padding: "10px 14px",
      borderRadius: 12,
      border: "1px solid rgba(17,24,39,0.08)",
      background: "rgba(255,255,255,0.9)",
      color: "#111827",
      cursor: "pointer",
      fontWeight: 800,
      transition: "transform .12s ease, background .2s ease",
    },
    table: { width: "100%", borderCollapse: "collapse" },
    th: {
      background: "rgba(255,255,255,0.6)",
      fontWeight: 700,
      padding: 10,
      borderBottom: "1px solid rgba(17,24,39,0.06)",
      textAlign: "left",
      whiteSpace: "nowrap",
    },
    td: { padding: 10, borderBottom: "1px solid rgba(17,24,39,0.04)", verticalAlign: "top" },
    radioRow: { display: "flex", gap: 12, alignItems: "center", justifyContent: "center" },

    recGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: 12,
      marginTop: 8,
    },
    recCard: {
      background: "rgba(255,255,255,0.9)",
      border: "1px solid rgba(17,24,39,0.06)",
      borderRadius: 14,
      padding: 14,
      boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
      transition: "transform .12s ease",
    },
    recIcon: { fontSize: 18, opacity: 0.85, marginRight: 8 },
    recTitle: { fontWeight: 800, display: "flex", alignItems: "center" },
    recMeta: { fontSize: 12, color: "#6b7280", marginTop: 4 },
    recBarWrap: { marginTop: 10, height: 8, background: "rgba(17,24,39,0.08)", borderRadius: 999, overflow: "hidden" },
    recBar: { height: 8, backgroundImage: ui.accentSoft },
    chip: {
      display: "inline-block",
      marginTop: 10,
      padding: "6px 10px",
      borderRadius: 999,
      background: ui.chipBg,
      color: "white",
      fontWeight: 800,
      fontSize: 12,
    },

    donutWrap: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      flexWrap: "wrap",
      marginTop: 8,
    },
    donut: (percent) => ({
      width: 112,
      height: 112,
      borderRadius: "50%",
      background: `conic-gradient(#7C3AED ${percent*3.6}deg, #E5E7EB 0deg)`,
      display: "grid",
      placeItems: "center",
      boxShadow: "0 8px 22px rgba(124,58,237,0.25)",
    }),
    donutInner: {
      width: 86,
      height: 86,
      borderRadius: "50%",
      background: "white",
      display: "grid",
      placeItems: "center",
      fontWeight: 900,
      color: "#7C3AED",
    },

    interpGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: 12, marginTop: 8 },
    interpCard: (active) => ({
      background: active ? "linear-gradient(180deg,#FFFFFF, #F5F3FF)" : "rgba(255,255,255,0.9)",
      border: active ? "2px solid rgba(124,58,237,0.45)" : "1px solid rgba(17,24,39,0.06)",
      borderRadius: 14,
      padding: 14,
      boxShadow: active ? "0 10px 26px rgba(124,58,237,0.2)" : "0 6px 18px rgba(0,0,0,0.06)",
      transform: active ? "translateY(-2px)" : "none",
      transition: "all .15s ease",
    }),
    rangePill: {
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: 999,
      background: "rgba(124,58,237,0.08)",
      color: "#6D28D9",
      fontWeight: 800,
      fontSize: 12,
      marginBottom: 8,
    },
    stageName: { fontWeight: 900 },
    verse: { fontSize: 12, color: "#6b7280", marginTop: 6 },
  };

  // 7) 유틸: 인쇄/저장 --------------------------------------------------
  // (1) 결과만 PDF: body에 클래스 부여 → 결과 섹션만 보이도록 @media print
  const printResultsOnly = () => {
    document.body.classList.add("print-results-only");
    window.print();
    // 인쇄 대화상자 닫힌 뒤 클래스 제거
    setTimeout(() => document.body.classList.remove("print-results-only"), 200);
  };

  // (2) 단계별 실천 제안 PDF 생성 (새 창에 미려한 레이아웃 렌더 후 인쇄)
  const openActionPlanPDF = () => {
    const tpl = actionPlanTemplates[overallStage.key] || actionPlanTemplates.infant;
    const today = new Date().toLocaleDateString("ko-KR");
    const percent = Math.round((totalScore / maxPoints) * 100);

    const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<title>${tpl.title} - 다음걸음 계획</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  @page { size: A4; margin: 16mm; }
  :root{
    --ink:#0F172A; --sub:#6b7280; --pri:#7C3AED; --mint:#06B6D4; --line:#E5E7EB;
  }
  body{
    font-family: Pretendard, -apple-system, BlinkMacSystemFont,'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans KR', sans-serif;
    color: var(--ink);
    background: linear-gradient(120deg,#EEF2FF 0%,#FDF2F8 60%,#ECFEFF 100%);
  }
  .sheet{ max-width: 780px; margin: 0 auto; }
  .head{
    background: linear-gradient(90deg, rgba(124,58,237,.85), rgba(6,182,212,.85));
    color:#fff; padding:18px 20px; border-radius:14px;
    display:flex; align-items:center; justify-content:space-between; gap:12px;
  }
  .title{ font-size:20px; font-weight:900; }
  .meta{ font-size:12px; opacity:.9 }
  .chip{ display:inline-block; padding:6px 10px; border-radius:999px; background:rgba(255,255,255,.18); font-weight:800; }
  .card{ background:#fff; border:1px solid rgba(17,24,39,.06); border-radius:14px; box-shadow:0 6px 18px rgba(0,0,0,.06); padding:16px; margin-top:12px; }
  .h{ font-size:16px; font-weight:900; margin-bottom:8px; }
  .verse{ font-size:12px; color:var(--sub); margin-top:6px; white-space:pre-wrap; }
  .p{ white-space:pre-wrap; }
  .list{ margin-top:6px; }
  .list div{ margin:6px 0; }
  .ck::before{ content:'☐'; margin-right:8px; }
  .line{ border-bottom:1px dashed var(--line); height:20px; margin:8px 0; }
  .grid{ display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .donut{
    width:88px; height:88px; border-radius:50%; background: conic-gradient(var(--pri) ${percent*3.6}deg, #E5E7EB 0deg);
    display:grid; place-items:center; box-shadow:0 8px 22px rgba(124,58,237,.25);
  }
  .donut-in{ width:68px; height:68px; border-radius:50%; background:#fff; display:grid; place-items:center; color:var(--pri); font-weight:900; }
  .small{ font-size:12px; color:var(--sub); }
  .foot{ margin-top:12px; display:flex; justify-content:space-between; gap:8px; align-items:center; }
</style>
</head>
<body>
  <div class="sheet">
    <div class="head">
      <div>
        <div class="title">다음걸음 계획 • ${tpl.title}</div>
        <div class="meta">작성일 ${today} · 총점 ${totalScore}/${maxPoints}</div>
      </div>
      <div class="donut"><div class="donut-in">${totalScore}</div></div>
    </div>

    <div class="card">
      <div class="h">📖 나의 현재 신앙 상태</div>
      <div class="p">${tpl.state}</div>
    </div>

    <div class="card">
      <div class="h">🔥 다음 단계로 나아가기 위한 실천 제안</div>
      <div class="list">
        ${tpl.actions.map(a => `<div class="ck">${a}</div>`).join("")}
      </div>
    </div>

    <div class="card">
      <div class="h">✍ 나의 결단 (이번 달)</div>
      <div class="line"></div>
      <div class="line"></div>
    </div>

    <div class="card">
      <div class="h">📅 한 달 뒤 돌아보기</div>
      <div class="small">- 내가 꾸준히 실천한 것:</div><div class="line"></div>
      <div class="small">- 도전이 되었던 것:</div><div class="line"></div>
      <div class="small">- 하나님이 주신 은혜:</div><div class="line"></div>
    </div>

    <div class="foot small">
      <span>© Faith Self-Assessment</span>
      <span>단계: ${overallStage.label}</span>
    </div>
  </div>
  <script>window.print();</script>
</body>
</html>`;

    const win = window.open("", "_blank", "width=920,height=1200");
    if (!win) return;
    win.document.open();
    win.document.write(html);
    win.document.close();
  };

  // 8) 초기화/상태 ------------------------------------------------------
  const setAnswer = (sectionId, index, value) => {
    const key = `${sectionId}-${index}`;
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const resetAll = () => {
    const ok = typeof window !== "undefined" && window.confirm
      ? window.confirm("모든 응답을 초기화할까요?")
      : true;
    if (!ok) return;
    setAnswers({});
    storage.remove("faith_survey_answers");
    setFormKey((k) => k + 1); // 라디오 DOM 상태까지 리셋
  };

  const allAnswered = answeredCount === totalQuestions;

  // 9) 렌더 -------------------------------------------------------------
  return (
    <div style={styles.container}>
      {/* 결과만 인쇄하기 위한 CSS */}
      <style>{`
        @media print {
          body.print-results-only * { visibility: hidden !important; }
          body.print-results-only #results-section,
          body.print-results-only #results-section * { visibility: visible !important; }
          body.print-results-only #results-section { position: absolute; left:0; top:0; width:100%; }
        }
      `}</style>

      {/* HEADER */}
      <header style={{ ...styles.glassCard, padding: 24 }}>
        <div style={styles.badge}>✍ 신앙 자가진단지</div>
        <h1 style={styles.headerTitle}>당신의 신앙나이는 몇 살인가요?</h1>
        <p style={{ marginTop: 6 }}>
          아래 각 문항을 읽고, 본인의 현재 상태에 가장 가까운 점수(1~5점)를 체크해 주세요. 각 문항은 하나만 선택합니다.
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
          {/* 결과만 PDF로 */}
          <button
            type="button"
            style={styles.btnGhost}
            onClick={printResultsOnly}
            onMouseDown={(e)=> (e.currentTarget.style.transform='scale(0.98)')}
            onMouseUp={(e)=> (e.currentTarget.style.transform='scale(1)')}
          >
            결과 PDF
          </button>
          <button
            type="button"
            style={styles.btnGhost}
            onClick={resetAll}
            onMouseDown={(e)=> (e.currentTarget.style.transform='scale(0.98)')}
            onMouseUp={(e)=> (e.currentTarget.style.transform='scale(1)')}
          >
            ♻ 전체 초기화
          </button>
        </div>
      </header>

      {/* 설문 표 */}
      <div key={formKey}>
        {sections.map((sec) => (
          <section key={`${sec.id}-${formKey}`} style={styles.glassCard}>
            <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>{sec.title}</h2>
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
                    return (
                      <tr key={key}>
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
              <span style={{ ...styles.badge, background: "rgba(14,165,233,0.08)", color: "#0EA5E9" }}>
                섹션 평균 {sectionAverages[sec.id]?.toFixed(2) || "0.00"}점
              </span>
            </div>
          </section>
        ))}

        {/* ===== 결과지 (리디자인) ===== */}
        <section id="results-section" style={{ ...styles.glassCard, background: "rgba(255,255,255,0.8)" }}>
          <h2 style={{ fontSize: 20, fontWeight: 900 }}>결과 요약</h2>
          {!allAnswered && (
            <p style={{ color: "#B45309", fontWeight: 700, marginTop: 6 }}>
              모든 문항에 응답하면 정확한 결과를 볼 수 있어요. (현재 {answeredCount}/{totalQuestions})
            </p>
          )}

          {/* ✅ 점수 기록표 (카드형) */}
          <h3 style={{ fontSize: 16, fontWeight: 900, marginTop: 12 }}>✅ 점수 기록표</h3>
          <div style={styles.recGrid}>
            {sections.map((sec) => {
              const qCount = sec.questions.length;
              const max = qCount * 5;
              const sum = sectionScores[sec.id] || 0;
              const rate = Math.min(100, Math.round((sum / max) * 100));
              return (
                <div
                  key={`rec-${sec.id}-${formKey}`}
                  style={styles.recCard}
                  onMouseEnter={(e)=> (e.currentTarget.style.transform='translateY(-2px)')}
                  onMouseLeave={(e)=> (e.currentTarget.style.transform='translateY(0)')}
                >
                  <div style={styles.recTitle}><span style={styles.recIcon}>{sec.icon}</span>{sec.title}</div>
                  <div style={styles.recMeta}>{qCount}문항 · 최대 {max}점</div>
                  <div style={styles.recBarWrap}>
                    <div style={{ ...styles.recBar, width: `${rate}%` }} />
                  </div>
                  <div style={styles.chip}>{sum} 점</div>
                </div>
              );
            })}
          </div>

          {/* ✅ 총점 (도넛 진행율) */}
          <div style={{ marginTop: 18 }}>
            <h3 style={{ fontSize: 16, fontWeight: 900 }}>✅ 총점 (총 {maxPoints}점 만점)</h3>
            <div style={styles.donutWrap}>
              <div style={styles.donut(Math.round((totalScore / maxPoints) * 100))}>
                <div style={styles.donutInner}>
                  <div style={{ lineHeight: 1.1, textAlign: "center" }}>
                    <div style={{ fontSize: 18 }}>{totalScore}</div>
                    <div style={{ fontSize: 11, opacity: 0.8 }}>/{maxPoints}</div>
                  </div>
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 900, marginBottom: 2 }}>현재 신앙나이</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ ...styles.badge, background: "rgba(124,58,237,0.1)", color: "#6D28D9" }}>
                    {overallStage.label}
                  </span>
                </div>
                <div style={{ marginTop: 6 }}>{overallStage.desc}</div>
                <div style={{ ...styles.verse }}>{overallStage.verse}</div>
              </div>
            </div>
          </div>

          {/* 🔎 점수 해석표 (스텝 카드) */}
          <div style={{ marginTop: 18 }}>
            <h3 style={{ fontSize: 16, fontWeight: 900 }}>🔎 점수 해석표</h3>
            <div style={styles.interpGrid}>
              {[
                {
                  key: "adult",
                  range: `${displayRanges.adult.min} ~ ${displayRanges.adult.max}점`,
                  name: "믿음의 장년기 (성숙한 어른)",
                  desc: "믿음 안에서 분별하고 다른 사람을 세우며 돌보는 단계",
                  verse: "“너희 아비들아, 너희가 태초부터 계신 이를 알았음이라” – 요한일서 2:13",
                },
                {
                  key: "youth",
                  range: `${displayRanges.youth.min} ~ ${displayRanges.youth.max}점`,
                  name: "신앙 청년기 (훈련받는 일꾼)",
                  desc: "세상과 죄를 이기고 말씀으로 무장한 상태",
                  verse: "“너희 청년들아, 너희가 강하고 하나님의 말씀이 너희 안에 거하시며, 너희가 흉악한 자를 이기었음이라” – 요한일서 2:14",
                },
                {
                  key: "child",
                  range: `${displayRanges.child.min} ~ ${displayRanges.child.max}점`,
                  name: "신앙 아동기 (기초를 세우는 시기)",
                  desc: "하나님을 아버지로 인식하고 말씀을 배우는 시기",
                  verse: "“너희 어린 자녀들아, 너희가 아버지를 알았음이라” – 요한일서 2:13",
                },
                {
                  key: "toddler",
                  range: `${displayRanges.toddler.min} ~ ${displayRanges.toddler.max}점`,
                  name: "신앙 유아기 (새싹 단계)",
                  desc: "의의 말씀에 익숙지 않고, 기초를 배우는 단계",
                  verse: "“젖이나 먹는 자마다 의의 말씀을 경험하지 못한 자요 어린 아이니라” – 히브리서 5:13",
                },
                {
                  key: "infant",
                  range: `${displayRanges.infant.min} ~ ${displayRanges.infant.max}점`,
                  name: "신앙 영아기 (씨앗 상태)",
                  desc: "신앙이 아직 시작되지 않았거나 극히 미약한 상태",
                  verse: "“그들이 하나님의 생명에서 떠나 있는 것은 그들 속에 무지함과 마음의 굳어짐 때문이다” – 에베소서 4:18",
                },
              ].map((row) => {
                const active = row.key === overallStage.key;
                return (
                  <div key={row.key} style={styles.interpCard(active)}>
                    <div style={styles.rangePill}>{row.range}</div>
                    <div style={styles.stageName}>{row.name}</div>
                    <div style={{ marginTop: 4 }}>{row.desc}</div>
                    <div style={styles.verse}>{row.verse}</div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* 하단 버튼들 */}
          <div style={{ ...styles.btnRow, marginTop: 16 }}>
            <button
              type="button"
              style={styles.btn}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              onMouseDown={(e)=> (e.currentTarget.style.transform='scale(0.98)')}
              onMouseUp={(e)=> (e.currentTarget.style.transform='scale(1)')}
            >
              맨 위로
            </button>
            <button
              type="button"
              style={styles.btnGhost}
              onClick={resetAll}
              onMouseDown={(e)=> (e.currentTarget.style.transform='scale(0.98)')}
              onMouseUp={(e)=> (e.currentTarget.style.transform='scale(1)')}
            >
              응답 초기화
            </button>
            {/* 새 버튼: 단계별 실천 제안 PDF */}
            <button
              type="button"
              style={styles.btnGhost}
              onClick={openActionPlanPDF}
              onMouseDown={(e)=> (e.currentTarget.style.transform='scale(0.98)')}
              onMouseUp={(e)=> (e.currentTarget.style.transform='scale(1)')}
              title="현재 단계에 맞춘 다음 걸음 계획을 PDF로 저장"
            >
              다음걸음 PDF
            </button>
          </div>
        </section>
      </div>

      <footer style={{ textAlign: "center", color: "#6b7280", marginTop: 28 }}>
        <small>© {new Date().getFullYear()} Faith Self-Assessment • 로컬에 자동 저장됩니다.</small>
      </footer>
    </div>
  );
}
