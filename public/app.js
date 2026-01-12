// Target: Thu, Apr 9, 2026 7:00 PM America/New_York
// We'll define it as an ISO with -04:00 offset (EDT). On April 9, NY is typically on DST.
// If you want it to be absolute “NY local time no matter what”, this is fine for this date.
const TARGET_ISO = "2026-04-09T19:00:00-04:00";
const target = new Date(TARGET_ISO);

const whenEl = document.getElementById("when");

function pad2(n) {
  return String(n).padStart(2, "0");
}

function createDigit(initialChar = "0") {
  const digit = document.createElement("div");
  digit.className = "digit";

  const card = document.createElement("div");
  card.className = "card";

  const hingeL = document.createElement("div");
  hingeL.className = "hinge";
  const hingeR = document.createElement("div");
  hingeR.className = "hinge r";

  const top = document.createElement("div");
  top.className = "half top";
  const topSpan = document.createElement("span");
  topSpan.className = "glyph";
  topSpan.textContent = initialChar;
  top.appendChild(topSpan);

  const bottom = document.createElement("div");
  bottom.className = "half bottom";
  const bottomSpan = document.createElement("span");
  bottomSpan.className = "glyph";
  bottomSpan.textContent = initialChar;
  bottom.appendChild(bottomSpan);

  card.appendChild(hingeL);
  card.appendChild(hingeR);
  card.appendChild(top);
  card.appendChild(bottom);
  digit.appendChild(card);

  // Store refs
  digit._topSpan = topSpan;
  digit._bottomSpan = bottomSpan;
  digit._current = initialChar;

  return digit;
}


function setDigit(digitEl, nextChar) {
  if (digitEl._current === nextChar) return;

  // No animation: just set both halves immediately
  digitEl._topSpan.textContent = nextChar;
  digitEl._bottomSpan.textContent = nextChar;

  digitEl._current = nextChar;

  // Optional tiny “blink” on change (comment out if you want dead-still)
  digitEl.classList.remove("blink");
  void digitEl.offsetWidth; // restart animation reliably
  digitEl.classList.add("blink");
  window.setTimeout(() => digitEl.classList.remove("blink"), 120);
}



function mountUnit(container, digitsCount, initialStr) {
  container.innerHTML = "";
  const digits = [];
  for (let i = 0; i < digitsCount; i++) {
    const d = createDigit(initialStr?.[i] ?? "0");
    container.appendChild(d);
    digits.push(d);
  }
  return digits;
}

// Render digits for each unit
const units = {
  days: document.querySelector('.flaps[data-unit="days"]'),
  hours: document.querySelector('.flaps[data-unit="hours"]'),
  minutes: document.querySelector('.flaps[data-unit="minutes"]'),
  seconds: document.querySelector('.flaps[data-unit="seconds"]'),
};

// Days: 3 digits (000-999+). Adjust if you want 4.
const dayDigits = mountUnit(units.days, 3, "000");
const hourDigits = mountUnit(units.hours, 2, "00");
const minDigits = mountUnit(units.minutes, 2, "00");
const secDigits = mountUnit(units.seconds, 2, "00");

function formatWhen(d) {
  // Friendly display (uses viewer’s locale but with explicit date)
  const opts = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  const datePart = d.toLocaleDateString(undefined, opts);
  const timePart = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return `${datePart} • ${timePart}`;
}

whenEl.textContent = `Target: ${formatWhen(target)} (NYC time)`;

function tick() {
  const now = new Date();
  let diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    // Party time
    const done = "000";
    dayDigits.forEach((d) => setDigit(d, "0"));
    hourDigits.forEach((d) => setDigit(d, "0"));
    minDigits.forEach((d) => setDigit(d, "0"));
    secDigits.forEach((d) => setDigit(d, "0"));
    whenEl.textContent = "IT’S TIME. GO BE ICONIC.";
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const dayStr = String(days).padStart(3, "0").slice(-3);
  const hrStr = pad2(hours);
  const minStr = pad2(minutes);
  const secStr = pad2(seconds);

  // Update digits with flip
  dayDigits.forEach((d, i) => setDigit(d, dayStr[i]));
  hourDigits.forEach((d, i) => setDigit(d, hrStr[i]));
  minDigits.forEach((d, i) => setDigit(d, minStr[i]));
  secDigits.forEach((d, i) => setDigit(d, secStr[i]));

  // Keep ticking
  requestAnimationFrame(() => {}); // tiny nudge for smoother flips
  setTimeout(tick, 250); // 4x/sec so flips feel snappy without overdoing it
}

tick();
