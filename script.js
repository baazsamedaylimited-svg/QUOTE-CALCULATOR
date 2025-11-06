function calculateQuote() {
  const vehicle = document.getElementById("vehicle").value;
  const miles = parseFloat(document.getElementById("miles").value);
  const deadzone = document.querySelector('input[name="deadzone"]:checked').value;
  const deadMiles = document.getElementById("deadMiles").value; // "near" or "far"
  const returnTrip = document.querySelector('input[name="return"]:checked').value;
  const backload = document.querySelector('input[name="backload"]:checked').value;
  const out = document.getElementById("result");

  if (!vehicle || isNaN(miles) || miles <= 0) {
    out.innerHTML = "⚠️ Please select a vehicle and enter valid miles.";
    return;
  }

  let rate = 0;
  let basePrice = 0;
  let details = [];

  // === Base rate setup ===
  if (vehicle === "luton") rate = deadzone === "yes" ? 1.8 : 1.5;
  if (vehicle === "7.5t") rate = deadzone === "yes" ? 3.5 : 3.0;
  if (vehicle === "18t" || vehicle === "26t") rate = deadzone === "yes" ? 4.5 : 3.7;

  // === Short distance (<=30 miles) ===
  if (miles <= 50) {
    if (vehicle === "luton") basePrice = 85;
    else if (vehicle === "7.5t") basePrice = 187.5;
    else basePrice = 302.5;
    details.push("Short distance fixed rate (≤30 miles)");
  }

  // === 100–130 mile special range ===
  else if (miles > 100 && miles <= 130) {
    // Price band £320–£345
    let base = 320;
    if (deadMiles === "far") base = 345;
    basePrice = base;
    details.push("100–130 mile special rate (£320–£345)");
  }

  // === Long distance >210 miles ===
  else if (miles > 210) {
    rate = 2.6;
    basePrice = miles * rate;
    details.push("Long distance rate £2.6/mile");
  }

  // === Backload option ===
  else if (backload === "yes") {
    rate = deadMiles === "near" ? 2.2 : 2.5;
    basePrice = miles * rate;
    details.push(`Backload rate £${rate}/mile`);
  }

  // === Normal route ===
  else {
    basePrice = miles * rate;
    details.push(`Base rate £${rate}/mile`);
  }

  // === Return trip ===
  let returnExtra = 0;
  if (returnTrip === "yes") {
    returnExtra = miles * 2.5;
    details.push(`Return trip extra £2.5/mile = £${returnExtra.toFixed(2)}`);
  }

  // === Dead miles adjustment ===
  let adjPercent = 0;
  if (deadMiles === "near") adjPercent = -0.05; // near: -5%
  if (deadMiles === "far") adjPercent = 0.07;   // far: +7%
  let adjusted = basePrice * (1 + adjPercent);

  // === Final total ===
  let total = adjusted + returnExtra;

  // Minimum safeguard per vehicle
  if (vehicle === "luton") total = Math.max(total, 75);
  if (vehicle === "7.5t") total = Math.max(total, 165);
  if (vehicle === "18t" || vehicle === "26t") total = Math.max(total, 280);

  // Round to nearest £5
  total = Math.round(total / 5) * 5;

  out.innerHTML = `
    <div style="text-align:left">
      <p>💷 <strong>Estimated Price:</strong> £${total}</p>
      <p style="color:#cfe8ff">${details.join(" • ")}</p>
      <p style="font-size:0.9rem;color:#ccc">Consistent & stable pricing — same inputs = same quote.</p>
    </div>
  `;
}

