/* Lomeone design mock · C-08 SlotGrid 프로토타입
   모드: input(칠하기) / heatmap(결과) / highlight(응답자·추천 구간 강조)
   인터랙션 규칙은 LM-PRD-01 §6 SCR-06 그대로 (D-8 A안: 셀 = 칠하기, 시간축·헤더·바깥 = 스크롤)
   ※ 시안용 코드. 실제 구현은 Pointer Events + touch-action:none 기준으로 옮길 것. */
(function () {
  const DAYS = [
    { d: "10/29", w: "수", full: "10월 29일 수요일" },
    { d: "10/30", w: "목", full: "10월 30일 목요일" },
    { d: "10/31", w: "금", full: "10월 31일 금요일" },
    { d: "11/1", w: "토", full: "11월 1일 토요일" },
    { d: "11/2", w: "일", full: "11월 2일 일요일" },
    { d: "11/3", w: "월", full: "11월 3일 월요일" },
    { d: "11/4", w: "화", full: "11월 4일 화요일" },
    { d: "11/5", w: "수", full: "11월 5일 수요일" },
  ];
  /* 데모 응답 (PRD §6 SCR-07 예시와 같은 값). [시작시, 끝시] 24시간제 */
  const PEOPLE = {
    지원: [[[19, 22]], [[10, 12]], [[19, 21]]],
    민수: [[[18, 22]], [[14, 18]], [[19, 21]]],
    서연: [[[19, 21.5]], [[10, 12]], [[17, 19]]],
    하준: [[[19, 23]], [[10, 12]], [[19, 21]]],
    예린: [[[19, 21]], [[10, 12]], [[19, 21]]],
  };
  const hm = (r) => `${Math.floor(r)}:${r % 1 ? "30" : "00"}`;
  const ampm = (h) => `${h < 12 ? "오전" : "오후"} ${((h + 11) % 12) + 1}시`;

  function avail(name, day, row, from, data) {
    const t = from + row / 2, ranges = ((data || PEOPLE)[name] || [])[day] || [];
    return ranges.some(([a, b]) => t >= a && t < b);
  }

  function build(el, opt) {
    const o = Object.assign({ mode: "input", days: 3, from: 9, to: 23, people: Object.keys(opt && opt.data || PEOPLE) }, opt);
    const days = DAYS.slice(0, o.days), rows = (o.to - o.from) * 2;
    el.classList.add("slot"); el.dataset.mode = o.mode; el.style.setProperty("--days", days.length);
    const sel = new Set(), total = o.people.length;
    let html = `<div class="slot-scroll"><div class="slot-table" role="grid" aria-label="${o.mode === "input" ? "가능한 시간 칠하기" : "응답 히트맵"}" aria-colcount="${days.length}" ${o.mode === "input" ? 'aria-multiselectable="true"' : ""}><div class="slot-head" role="row"><div role="presentation"></div>${days.map((d, i) => `<div role="columnheader"><button type="button" data-day="${i}" aria-label="${d.full} 전부 토글"><span class="d">${d.d}</span><span class="w">${d.w}</span></button></div>`).join("")}</div>`;
    for (let r = 0; r < rows; r++) {
      const hour = r % 2 === 0, t = o.from + r / 2;
      html += `<div class="slot-row" role="row" aria-label="${ampm(t)}${t % 1 ? " 30분" : ""}"><div class="ax" role="rowheader" ${hour ? "" : 'aria-hidden="true"'}>${hour ? t + "시" : ""}</div>`;
      for (let d = 0; d < days.length; d++) {
        let cls = "cell" + (hour ? " hour" : ""), extra = "";
        if (o.mode !== "input") {
          const names = o.people.filter((n) => avail(n, d, r, o.from, o.data)), c = names.length;
          cls += c === total && total > 0 ? " hAc" : c > 0 ? ` h${Math.min(5, Math.max(1, Math.ceil((c / total) * 5)))}c` : "";
          extra = ` data-c="${c}" data-names="${names.join(",")}"`;
        } else if (o.others) {   // 다른 사람 보기용 옅은 히트
          const c = Object.keys(PEOPLE).filter((n) => avail(n, d, r, o.from)).length;
          if (c) cls += ` h${Math.min(5, Math.ceil((c / 5) * 5))}c`;
        }
        html += `<div class="${cls}" role="gridcell" tabindex="${r === 0 && d === 0 ? 0 : -1}" data-d="${d}" data-r="${r}" aria-label="${days[d].full} ${ampm(t)}${t % 1 ? " 30분" : ""}${o.mode !== "input" ? `, ${(extra.match(/data-c="(\d+)"/) || [])[1]}/${total}명 가능` : ""}"${extra}></div>`;
      }
      html += `</div>`;
    }
    html += `</div></div>`;
    el.innerHTML = html + (days.length > 5 ? `<div class="slot-pos">← 옆으로 넘겨 보세요 · 1–5 / ${days.length}일</div>` : "");
    const scroller = el.querySelector(".slot-scroll"), cells = [...el.querySelectorAll(".cell")];
    const at = (d, r) => cells[r * days.length + d];

    if (o.mode === "input") {
      let start = null, painting = true, last = null, bubble = document.querySelector(".drag-bubble");
      if (!bubble) { bubble = document.createElement("div"); bubble.className = "drag-bubble"; document.body.appendChild(bubble); }
      const apply = (arr, on) => arr.forEach((c) => { c.classList.toggle("on", on); c.setAttribute("aria-selected", on); });
      const range = (a, b) => { const out = []; for (let r = Math.min(a.r, b.r); r <= Math.max(a.r, b.r); r++) for (let d = Math.min(a.d, b.d); d <= Math.max(a.d, b.d); d++) out.push(at(d, r)); return out; };
      const pos = (c) => ({ d: +c.dataset.d, r: +c.dataset.r });
      const clearPrev = () => cells.forEach((c) => c.classList.remove("prev-paint", "prev-erase"));
      const changed = () => el.dispatchEvent(new CustomEvent("slotchange", { detail: { count: cells.filter((c) => c.classList.contains("on")).length } }));
      let raf;
      const autoscroll = (y) => {
        cancelAnimationFrame(raf);
        const rect = scroller.getBoundingClientRect(); let dy = 0;
        if (y < rect.top + 48) dy = -8; else if (y > rect.bottom - 48) dy = 8;
        if (dy && start) { scroller.scrollTop += dy; raf = requestAnimationFrame(() => autoscroll(y)); }
      };
      el.addEventListener("pointerdown", (e) => {
        const c = e.target.closest(".cell"); if (!c || el.classList.contains("paint-off")) return; e.preventDefault();
        start = pos(c); painting = !c.classList.contains("on"); last = c; draw(c, e);
      });
      document.addEventListener("pointermove", (e) => {
        if (!start) return; const t = document.elementFromPoint(e.clientX, e.clientY), c = t && t.closest && t.closest(".cell");
        autoscroll(e.clientY); if (c && el.contains(c)) { last = c; draw(c, e); }
      });
      function draw(c, e) {
        clearPrev(); const rg = range(start, pos(c));
        rg.forEach((x) => x.classList.add(painting ? "prev-paint" : "prev-erase"));
        const p = pos(c), a = Math.min(start.r, p.r), b = Math.max(start.r, p.r) + 1, d0 = days[Math.min(start.d, p.d)];
        bubble.textContent = `${d0.w} ${hm(o.from + a / 2)}–${hm(o.from + b / 2)}`;
        bubble.style.left = e.clientX + "px"; bubble.style.top = e.clientY + "px"; bubble.style.display = "block";
      }
      const end = () => {
        if (!start) return; const rg = range(start, pos(last)); clearPrev(); apply(rg, painting);
        start = null; bubble.style.display = "none"; cancelAnimationFrame(raf); changed();
      };
      document.addEventListener("pointerup", end); document.addEventListener("pointercancel", end);
      el.querySelectorAll("[data-day]").forEach((b) => b.addEventListener("click", () => {
        const col = cells.filter((c) => +c.dataset.d === +b.dataset.day), all = col.every((c) => c.classList.contains("on")); apply(col, !all); changed();
      }));
      el.addEventListener("keydown", (e) => {   // 방향키 이동 · 스페이스 토글 (§11)
        const c = e.target.closest(".cell"); if (!c) return; const p = pos(c);
        const mv = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] }[e.key];
        if (mv) { e.preventDefault(); const n = at(p.d + mv[0], p.r + mv[1]); if (n) { c.tabIndex = -1; n.tabIndex = 0; n.focus(); } }
        if (e.key === " " || e.key === "Enter") { e.preventDefault(); apply([c], !c.classList.contains("on")); changed(); }
      });
      el.api = {
        fillAll: (on) => { apply(cells, on); changed(); }, count: () => cells.filter((c) => c.classList.contains("on")).length,
        preset: (list) => { list.forEach(([d, a, b]) => { for (let r = (a - o.from) * 2; r < (b - o.from) * 2; r++) apply([at(d, r)], true); }); changed(); },
        others: (on) => el.classList.toggle("show-others", on),
      };
    } else {
      let tip = document.querySelector(".cell-tip");
      if (!tip) { tip = document.createElement("div"); tip.className = "cell-tip"; document.body.appendChild(tip); }
      el.addEventListener("click", (e) => {
        const c = e.target.closest(".cell"); if (!c) return;
        const names = c.dataset.names ? c.dataset.names.split(",") : [], miss = o.people.filter((n) => !names.includes(n)), t = o.from + c.dataset.r / 2;
        tip.innerHTML = `${days[c.dataset.d].w} ${hm(t)} · ${c.dataset.c}/${total}명${miss.length ? " · " + miss.join("·") + " 빠짐" : " · 전원 가능"}`;
        const r = c.getBoundingClientRect(); tip.style.left = r.left + r.width / 2 + "px"; tip.style.top = r.top + "px"; tip.style.display = "block";
        clearTimeout(tip._t); tip._t = setTimeout(() => (tip.style.display = "none"), 2500);
      });
      el.api = {
        person(name) { cells.forEach((c) => { const on = !name || (c.dataset.names || "").split(",").includes(name); c.classList.toggle("dim", !on && !!name); }); },
        range(d, a, b) {
          cells.forEach((c) => c.classList.remove("hl"));
          if (d == null) return;
          for (let r = (a - o.from) * 2; r < (b - o.from) * 2; r++) at(d, r).classList.add("hl");
          const first = at(d, (a - o.from) * 2); first && first.scrollIntoView({ block: "center", behavior: "smooth" });
        },
      };
    }
    return el;
  }
  window.LM = { buildGrid: build, PEOPLE, DAYS };
})();
