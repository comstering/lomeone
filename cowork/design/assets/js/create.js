/* C-29 MeetCreateForm 프로토타입 (C-04 + C-07 + C-05 + C-06 + 버튼)
   SCR-02(랜딩 안)와 SCR-03(단독)에서 같은 컴포넌트를 쓴다.
   v1.3: `edit` 옵션 = mode="edit" 변형 (모임 수정, Q-23 · PRD R-01-9). edit: "empty"(응답 0명) | "has"(응답 있음) | "confirmed"(확정됨)
   기준일(오늘) = 2026-10-28 (수) 고정 */
(function () {
  const TODAY = new Date(2026, 9, 28), DOW = ["일", "월", "화", "수", "목", "금", "토"];
  const MAX = 31;
  window.createForm = function (root, opt) {
    const E = (opt && opt.edit) || null, HAS = E === "has" || E === "confirmed", CONF = E === "confirmed";
    const SEED = ["2026-10-29", "2026-10-30", "2026-10-31", "2026-11-01"];                       // 수정 샘플: 팀플 회의 4일 (앞 3일에 응답 있음)
    const LOCKS = E === "has" ? new Set(SEED.slice(0, 3)) : new Set();
    const LOCK_CAP = "응답이 있는 날짜는 뺄 수 없어요";
    const o = Object.assign({ name: "우리 모임", mode: "time", from: "09:00", to: "22:00", by: "date", compact: false }, opt);
    const times = []; for (let m = 0; m <= 24 * 60; m += 30) { const h = String(Math.floor(m / 60)).padStart(2, "0"), mm = m % 60 ? "30" : "00"; times.push(`${h}:${mm}`); }
    const opts = (sel, side) => times.map((t) => `<option ${t === sel ? "selected" : ""} ${HAS && ((side === "f" && t > o.from) || (side === "t" && t < o.to)) ? "disabled" : ""}>${t}</option>`).join("");
    root.innerHTML = `
    <form class="stack-lg" novalidate>
      <div class="field"><label for="mn">모임 이름 <span class="counter" id="cnt" hidden></span></label>
        <input class="input" id="mn" name="title" maxlength="40" value="${o.name}" placeholder="우리 모임" autocomplete="off" spellcheck="false">${E ? "" : `<span class="hint">비워 두면 "우리 모임"으로 만들어져요</span>`}</div>
      ${CONF ? `<div class="banner info" role="status">${icon("lock")}<span style="flex:1;min-width:0">날짜를 바꾸려면 먼저 확정을 취소해 주세요</span><a class="btn secondary" href="m.html?v=confirmed-admin&sheet=uncf">확정 취소</a></div>` : ""}
      <div class="stack" style="gap:var(--s-2)"><div class="seg" role="radiogroup" aria-label="모드" id="mode" ${HAS ? "data-locked" : ""}>
        <button type="button" role="radio" aria-checked="${o.mode === "time"}" data-v="time">날짜+시간</button>
        <button type="button" role="radio" aria-checked="${o.mode === "date"}" data-v="date">날짜만</button></div>${E === "has" ? `<span class="lockcap">${icon("lock")}응답이 있어서 바꿀 수 없어요. 새 모임을 만들어 주세요</span>` : ""}</div>
      <div class="stack${CONF ? " locked-area" : ""}" ${CONF ? "inert" : ""}>
        <div class="lbl t-label">언제 중에 고를까요?</div>
        <div class="seg" role="radiogroup" aria-label="날짜 방식" id="by" ${HAS ? "data-locked" : ""}>
          <button type="button" role="radio" aria-checked="${o.by === "date"}" data-v="date">날짜로</button>
          <button type="button" role="radio" aria-checked="${o.by === "dow"}" data-v="dow">요일로</button></div>
        <div class="chips" id="quick" role="group" aria-label="빠른 날짜 선택"><button type="button" class="chip" data-q="we0">이번 주말</button><button type="button" class="chip" data-q="wd1">다음 주 평일</button><button type="button" class="chip" data-q="we1">다음 주말</button></div>
        <div id="cal-box"></div>
        <div class="cal-sum" id="sum" aria-live="polite"></div>
        <span class="err" id="maxerr" hidden>날짜는 최대 31일까지 고를 수 있어요</span>${E === "has" ? `<span class="lockcap">${icon("lock")}${LOCK_CAP}</span>` : ""}
      </div>
      <div class="stack${CONF ? " locked-area" : ""}" id="time-box" ${o.mode === "date" ? "hidden" : ""} ${CONF ? "inert" : ""}>
        <div class="lbl t-label">몇 시 사이에?</div>
        <div class="time-range"><select class="select" id="tf" aria-label="시작 시간">${opts(o.from, "f")}</select><span>~</span><select class="select" id="tt" aria-label="종료 시간">${opts(o.to, "t")}</select></div>
        <span class="field"><span class="err" id="terr" hidden>끝나는 시간은 시작 시간보다 늦어야 해요</span><span class="hint">끝나는 시간은 24:00까지 고를 수 있어요</span>${E === "has" ? `<span class="lockcap">${icon("lock")}${LOCK_CAP}</span>` : ""}</span>
      </div>
      <details class="more"${o.more || E ? " open" : ""}><summary>더 설정하기</summary>
        <div class="stack" style="margin-top:var(--s-3)" id="dl-box">
          <div class="row" style="justify-content:space-between;gap:var(--s-3)"><div><div class="t-label" id="dl-l">응답 마감 정하기</div><span class="hint" style="font-size:13px;color:var(--text-subtle)">마감 뒤에는 응답을 받지 않고 결과만 볼 수 있어요</span></div>
            <button type="button" class="switch" role="switch" aria-checked="false" aria-labelledby="dl-l" id="dl-sw"><i></i></button></div>
          <div id="dl-body" hidden class="stack">
            <div id="dl-cal"></div>
            <div class="time-range" style="grid-template-columns:1fr"><select class="select" id="dl-t" aria-label="마감 시각"></select></div>
            <div class="cal-sum" id="dl-sum" aria-live="polite"></div>
          </div></div></details>
      <div class="banner error" id="neterr" hidden>${icon("warn")}<span>연결이 불안정해요. 입력한 내용은 그대로 있어요.</span><button type="button" class="btn secondary" data-retry>다시 보내기</button></div>
      <div class="submit-bar"><div class="inner"><span class="trust" id="why" role="status">날짜를 하나 이상 골라 주세요</span><button class="btn primary lg block" type="submit" id="go" aria-disabled="true">${E ? "변경 저장" : "링크 만들기"}</button></div></div>
    </form>`;

    const $ = (s) => root.querySelector(s), picked = new Set(); let by = o.by, start = 0;
    const key = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    let sum = () => {
      const n = picked.size;
      $("#sum").textContent = !n ? "" : by === "dow" ? "매주 " + [...picked].sort((a, b) => a - b).map((i) => DOW[(i + 1) % 7]).join("·") : `${n}일 선택됨`;
      $("#go").setAttribute("aria-disabled", !n); $("#why").hidden = n > 0;
      $("#maxerr").hidden = !(by === "date" && n >= MAX);
    };
    const renderCal = (keep) => {
      if (!keep) picked.clear();
      $("#quick").hidden = by === "dow";
      if (by === "dow") {
        $("#cal-box").innerHTML = `<div class="dow-toggles">${["월", "화", "수", "목", "금", "토", "일"].map((w, i) => `<button type="button" class="day" aria-pressed="false" data-i="${i}">${w}</button>`).join("")}</div>`;
      } else {
        const wide = matchMedia("(min-width:1024px)").matches, span = wide ? 35 : 14, first = new Date(TODAY); first.setDate(first.getDate() + start * 14);
        const lead = (first.getDay() + 6) % 7; let cells = "";
        for (let i = 0; i < lead; i++) cells += `<span class="day pad"></span>`;
        for (let i = 0; i < span; i++) {
          const d = new Date(first); d.setDate(first.getDate() + i); const past = d < TODAY, t = key(d) === key(TODAY);
          const lk = LOCKS.has(key(d));
          cells += `<button type="button" class="day${t ? " today" : ""}${lk ? " locked" : ""}" aria-pressed="${picked.has(key(d))}" ${past ? 'aria-disabled="true"' : ""} data-k="${key(d)}" aria-label="${d.getMonth() + 1}월 ${d.getDate()}일 ${DOW[d.getDay()]}요일${lk ? ", 응답이 있어서 뺄 수 없어요" : ""}">${d.getDate()}${lk ? icon("lock") : ""}</button>`;
        }
        const last = new Date(first); last.setDate(first.getDate() + span - 1);
        $("#cal-box").innerHTML = `<div class="cal"><div class="cal-head"><button type="button" class="icon-btn" data-nav="-1" aria-label="이전 2주" ${start === 0 ? "disabled" : ""}>${icon("left")}</button><strong>${first.getMonth() + 1}월 ${first.getDate()}일 ~ ${last.getMonth() + 1}월 ${last.getDate()}일</strong><button type="button" class="icon-btn" data-nav="1" aria-label="다음 2주">${icon("right")}</button></div>
          <div class="cal-dow">${["월", "화", "수", "목", "금", "토", "일"].map((w) => `<span>${w}</span>`).join("")}</div><div class="cal-days">${cells}</div></div>`;
      }
      sum();
    };
    // 탭 + 드래그로 여러 날 선택
    let drag = null;
    root.addEventListener("pointerdown", (e) => { const b = e.target.closest(".day[data-k],.day[data-i]"); if (!b) return; drag = b.getAttribute("aria-pressed") !== "true"; toggle(b, drag); });
    root.addEventListener("pointerover", (e) => { if (drag === null || e.buttons !== 1) return; const b = e.target.closest(".day[data-k],.day[data-i]"); b && toggle(b, drag); });
    document.addEventListener("pointerup", () => (drag = null));
    function toggle(b, on) {
      const id = b.dataset.k || +b.dataset.i;
      if (!on && LOCKS.has(id)) { toast(LOCK_CAP); return; }
      if (on && picked.size >= MAX && by === "date") { toast("날짜는 최대 31일까지 고를 수 있어요"); return; }
      b.setAttribute("aria-pressed", on); on ? picked.add(id) : picked.delete(id); sum();
    }
    root.addEventListener("click", (e) => {
      const n = e.target.closest("[data-nav]"); if (n) { start = Math.max(0, start + +n.dataset.nav); renderCal(true); }
      const qk = e.target.closest("[data-q]");
      if (qk) {   // S-05 빠른 선택: 오늘(수 10/28) 기준 이번 주말 / 다음 주 평일 / 다음 주말
        const days = { we0: ["2026-10-31", "2026-11-01"], wd1: ["2026-11-02", "2026-11-03", "2026-11-04", "2026-11-05", "2026-11-06"], we1: ["2026-11-07", "2026-11-08"] }[qk.dataset.q];
        days.forEach((k) => picked.add(k)); renderCal(true);
      }
      const s = e.target.closest(".seg button"); if (!s) return;
      if (s.closest("[data-locked]")) { toast("응답이 있어서 바꿀 수 없어요. 새 모임을 만들어 주세요"); return; }
      s.parentElement.querySelectorAll("button").forEach((b) => b.setAttribute("aria-checked", b === s));
      if (s.parentElement.id === "mode") $("#time-box").hidden = s.dataset.v === "date";
      if (s.parentElement.id === "by") { by = s.dataset.v; start = 0; renderCal(); }
    });
    $("#mn").addEventListener("input", (e) => { const l = e.target.value.length; $("#cnt").hidden = l < 30; $("#cnt").textContent = `${l}/40`; });
    const timeChk = () => { const bad = $("#tt").value <= $("#tf").value; $("#terr").hidden = !bad; $("#go").setAttribute("aria-disabled", bad || !picked.size); };
    $("#tf").addEventListener("change", timeChk); $("#tt").addEventListener("change", timeChk);
    root.querySelector("form").addEventListener("submit", (e) => {
      e.preventDefault(); const b = $("#go");
      if (!picked.size) { toast("날짜를 하나 이상 골라 주세요"); return; }                      // E-05: 비활성 이유 안내
      if ($("#tt").value <= $("#tf").value) { toast("끝나는 시간은 시작 시간보다 늦어야 해요"); return; }
      if (E) {   // 모임 수정: 저장 (Q-23)
        if (snap() === base) { toast("바꾼 내용이 없어요"); return; }
        const grew = [...picked].some((k) => !seedSet.has(k)) || $("#tf").value < o.from || $("#tt").value > o.to;
        b.classList.add("loading"); b.textContent = "저장하는 중";
        setTimeout(() => root.dispatchEvent(new CustomEvent("saved", { detail: { grew } })), 700); return;
      }
      b.classList.add("loading"); b.textContent = "만드는 중";
      setTimeout(() => { b.classList.remove("loading"); b.textContent = "링크 만들기"; root.dispatchEvent(new CustomEvent("created", { detail: { name: $("#mn").value || "우리 모임", n: picked.size } })); }, 700);
    });
    renderCal();

    /* ===== 응답 마감 (Q-20): C-05 단일 선택 변형 + C-06 단일 시각 변형. 기본 = 마감 없음 (토글) =====
       범위: 지금 + 1시간 ~ 마지막 후보 날짜 23:30 (요일 모드는 오늘부터 4주). 시안의 "지금"은 2026-10-28 14:00 고정 */
    const NOW = new Date(2026, 9, 28, 14, 0), MIN = new Date(NOW.getTime() + 3600e3);
    let dlDate = null, dlStart = 0;
    const dlMax = () => by === "dow" ? new Date(TODAY.getTime() + 27 * 864e5) : picked.size ? new Date([...picked].sort().pop() + "T00:00:00") : null;
    const dlKey = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    const fmt12 = (t) => { const [h, m] = t.split(":").map(Number); return `${h < 12 ? "오전" : "오후"} ${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")}`; };
    function dlTimes() {
      const sel = $("#dl-t"), prev = sel.value || "22:00"; let h = "";
      for (let m = 0; m < 24 * 60; m += 30) { const t = `${String(Math.floor(m / 60)).padStart(2, "0")}:${m % 60 ? "30" : "00"}`; const dt = dlDate ? new Date(dlDate.getFullYear(), dlDate.getMonth(), dlDate.getDate(), Math.floor(m / 60), m % 60) : null;
        h += `<option value="${t}" ${dt && dt < MIN ? "disabled" : ""} ${t === prev ? "selected" : ""}>${fmt12(t)}</option>`; }
      sel.innerHTML = h; if (sel.selectedOptions[0] && sel.selectedOptions[0].disabled) sel.value = [...sel.options].find((x) => !x.disabled).value;
    }
    function dlSummary() {
      const el = $("#dl-sum"); if (!dlDate) { el.textContent = ""; return; }
      el.textContent = `${dlDate.getMonth() + 1}월 ${dlDate.getDate()}일 (${DOW[dlDate.getDay()]}) ${fmt12($("#dl-t").value)}에 마감`; }
    function dlRender() {
      const max = dlMax(), box = $("#dl-cal");
      if (!max) { box.innerHTML = `<div class="banner info">${icon("info")}<span>날짜를 먼저 골라 주세요. 마감은 마지막 후보 날짜까지 정할 수 있어요</span></div>`; $("#dl-t").disabled = true; dlSummary(); return; }
      $("#dl-t").disabled = false;
      if (dlDate && dlDate > max) dlDate = null;
      const first = new Date(TODAY); first.setDate(first.getDate() + dlStart * 14); const lead = (first.getDay() + 6) % 7; let cells = "";
      for (let i = 0; i < lead; i++) cells += `<span class="day pad"></span>`;
      for (let i = 0; i < 14; i++) { const d = new Date(first); d.setDate(first.getDate() + i); const out = d < new Date(MIN.getFullYear(), MIN.getMonth(), MIN.getDate()) || d > max;   // 범위 밖은 비활성
        cells += `<button type="button" class="day${dlKey(d) === dlKey(TODAY) ? " today" : ""}" data-dk="${dlKey(d)}" aria-pressed="${!!dlDate && dlKey(d) === dlKey(dlDate)}" ${out ? 'aria-disabled="true"' : ""} aria-label="${d.getMonth() + 1}월 ${d.getDate()}일 ${DOW[d.getDay()]}요일">${d.getDate()}</button>`; }
      const last = new Date(first); last.setDate(first.getDate() + 13);
      box.innerHTML = `<div class="cal"><div class="cal-head"><button type="button" class="icon-btn" data-dnav="-1" aria-label="이전 2주" ${dlStart === 0 ? "disabled" : ""}>${icon("left")}</button><strong>${first.getMonth() + 1}월 ${first.getDate()}일 ~ ${last.getMonth() + 1}월 ${last.getDate()}일</strong><button type="button" class="icon-btn" data-dnav="1" aria-label="다음 2주" ${last >= max ? "disabled" : ""}>${icon("right")}</button></div>
        <div class="cal-dow">${["월", "화", "수", "목", "금", "토", "일"].map((w) => `<span>${w}</span>`).join("")}</div><div class="cal-days">${cells}</div></div>`;
      dlTimes(); dlSummary();
    }
    root.addEventListener("click", (e) => {
      const sw = e.target.closest("#dl-sw"); if (sw) { const on = sw.getAttribute("aria-checked") !== "true"; sw.setAttribute("aria-checked", on); $("#dl-body").hidden = !on; if (on) dlRender(); else { dlDate = null; } return; }
      const k = e.target.closest("[data-dk]"); if (k && k.getAttribute("aria-disabled") !== "true") { dlDate = new Date(k.dataset.dk + "T00:00:00"); dlRender(); return; }
      const n = e.target.closest("[data-dnav]"); if (n) { dlStart = Math.max(0, dlStart + +n.dataset.dnav); dlRender(); }
    });
    $("#dl-t").addEventListener("change", dlSummary);
    // 후보 날짜가 바뀌면 범위도 다시 계산
    const _sum = sum; sum = () => { _sum(); if ($("#dl-sw").getAttribute("aria-checked") === "true") dlRender(); };
    if (o.dlOpen) { $("#dl-sw").click(); }
    if (o.dlPick) { dlDate = new Date(o.dlPick + "T00:00:00"); dlRender(); }

    /* ===== 모임 수정 (mode="edit") ===== */
    let snap = () => "", base = "", seedSet = new Set();
    if (E) {
      const n0 = o.over31 ? 31 : SEED.length; seedSet = new Set(o.over31 ? Array.from({ length: 31 }, (_, i) => key(new Date(2026, 9, 28 + i))) : SEED);
      seedSet.forEach((k) => picked.add(k)); renderCal(true);
      snap = () => JSON.stringify([$("#mn").value, [...picked].sort(), $("#tf").value, $("#tt").value, dlDate ? dlKey(dlDate) + $("#dl-t").value : null]);
      base = snap();
      const refresh = () => {
        const n = picked.size, bad = $("#tt").value <= $("#tf").value, changed = snap() !== base;
        const why = !n ? "날짜를 하나 이상 골라 주세요" : bad ? "끝나는 시간은 시작 시간보다 늦어야 해요" : !changed ? "바꾼 내용이 없어요" : "";
        $("#go").setAttribute("aria-disabled", !!why); $("#why").hidden = !why; $("#why").textContent = why;
      };
      ["click", "input", "change"].forEach((ev) => root.addEventListener(ev, () => setTimeout(refresh, 0)));
      refresh();
      $("#dl-box").insertAdjacentHTML("beforeend", `<span class="hint" style="color:var(--text-subtle)">마감을 미래로 바꾸면 다시 응답을 받아요</span>`);
      if (o.changed) { $("#mn").value = o.changed; $("#mn").dispatchEvent(new Event("input", { bubbles: true })); }
      if (o.saving) { const g = $("#go"); setTimeout(() => { g.classList.add("loading"); g.textContent = "저장하는 중"; g.setAttribute("aria-disabled", "true"); root.querySelector("form").setAttribute("aria-busy", "true"); }, 20); }
    }
  };
})();

/* SCR-04 / C-12 ShareSheet — 모임 생성 직후 열린다
   2차(E-08·Q-09): 360×640 첫 화면 안에 [카카오톡으로 보내기] + [카톡 '나와의 채팅'에 저장]까지 보이게 썸네일을 작게(가로 배치) */
(function () {
  window.mountShareSheet = function () {
    if (document.getElementById("share")) return;
    document.body.insertAdjacentHTML("beforeend", `
    <div class="sheet tall" id="share" role="dialog" aria-modal="true" aria-labelledby="sh-t">
      <div class="handle"></div>
      <div class="stack" style="gap:var(--s-3)">
        <div class="row" style="gap:10px;justify-content:space-between"><div class="row" style="gap:10px"><span class="badge confirmed" style="padding:6px">${icon("check")}</span><h2 class="t-h2" id="sh-t">링크가 만들어졌어요</h2></div><button class="icon-btn" data-close aria-label="닫기" style="margin-right:-8px">${icon("close")}</button></div>
        <div class="og-row" aria-label="단톡방 미리보기"><div class="og-mini-img"><b id="og-n"></b><span>가능한 시간을 알려주세요</span></div><div class="og-side"><b id="sh-n"></b><span class="t-caption">단톡방에 이렇게 보여요</span></div></div>
        <button class="btn kakao lg block" data-toast="카카오톡 공유 창이 열려요 (시안)">${icon("chat")} 카카오톡으로 보내기</button>
        <div class="row"><button class="btn secondary" style="flex:1" data-copy="링크를 복사했어요">링크 복사</button><button class="btn secondary" style="flex:1" data-toast="기기 공유 창이 열려요 (Web Share 지원 시에만 노출)">다른 앱</button></div>
        <div class="admin-box">
          <b class="t-label" style="display:flex;gap:6px;align-items:center">${icon("key")} 총무 링크도 챙겨 두세요</b>
          <p class="muted" style="font-size:13px;line-height:18px">다른 폰·PC에서도 확정하고 관리할 수 있는 링크예요</p>
          <button class="btn secondary block" data-toast="카카오 공유 창이 열려요. 받는 곳으로 '나와의 채팅'을 골라 주세요 (시안)">${icon("chat")} 카톡 '나와의 채팅'에 저장</button>
          <div class="row" style="justify-content:space-between"><button class="btn ghost" style="min-height:36px;padding:0 8px" data-copy="총무 링크를 복사했어요">총무 링크 복사</button><span class="t-caption" style="display:flex;gap:4px;align-items:center;color:var(--warning)">${icon("warn")} 이 링크는 단톡방에 올리지 마세요</span></div>
        </div>
        <a class="btn ghost block" href="m.html?v=admin-empty">모임 페이지로 가기</a>
      </div>
    </div>
    <style>.og-row{display:grid;grid-template-columns:132px 1fr;gap:12px;align-items:center;border:1px solid var(--border);border-radius:var(--r-md);overflow:hidden;background:var(--bg-subtle);padding-right:12px}.og-mini-img{aspect-ratio:1200/630;width:132px;background:var(--accent-subtle);display:flex;flex-direction:column;justify-content:center;gap:2px;padding:0 10px;color:var(--accent-ink)}.og-mini-img b{font-size:13px;line-height:16px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.og-mini-img span{font-size:8px;line-height:10px}.og-side{display:flex;flex-direction:column;gap:2px;min-width:0}.og-side b{font-size:14px;line-height:20px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.admin-box{display:flex;flex-direction:column;gap:8px;padding:12px;border:1px dashed var(--border-strong);border-radius:var(--r-md);background:var(--bg-subtle)}</style>`);
    if (!document.querySelector(".scrim")) { const s = document.createElement("div"); s.className = "scrim"; document.body.appendChild(s); }
  };
})();
