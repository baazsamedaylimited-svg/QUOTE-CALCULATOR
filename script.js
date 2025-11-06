function calculateQuote() {
  const vehicle = document.getElementById("vehicle").value;
  const miles = parseFloat(document.getElementById("miles").value);
  const deadzone = document.querySelector('input[name="deadzone"]:checked').value;
  const deadMiles = document.getElementById("deadMiles").value;
  const returnTrip = document.querySelector('input[name="return"]:checked').value;
  const backload = document.querySelector('input[name="backload"]:checked').value;
  const out = document.getElementById("result");

  if (!vehicle || isNaN(miles) || miles <= 0) {
    out.innerHTML = "⚠️ Please select a vehicle and enter valid miles.";
    return;
  }

  let rate = 0;
  let basePrice = 0;
  let minFixed = 0;
  let details = [];

  // Base per-mile rates
  if (vehicle === "luton") rate = deadzone === "yes" ? 1.8 : 1.5;
  if (vehicle === "7.5t") rate = deadzone === "yes" ? 3.5 : 3.0;
  if (vehicle === "18t" || vehicle === "26t") rate = deadzone === "yes" ? 4.5 : 3.7;

  // Short-distance fixed prices
  if (miles <= 30) {
    if (vehicle === "luton") { basePrice = 85; minFixed = 75; details.push("Luton short fixed (£75–95)"); }
    if (vehicle === "7.5t") { basePrice = 187.5; minFixed = 165; details.push("7.5T short fixed (£165–210)"); }
    if (vehicle === "18t" || vehicle === "26t") { basePrice = 302.5; minFixed = 280; details.push("18T/26T short fixed (£280–325)"); }
  } else {
    // Long distance or backload or >210 miles
    if (backload === "yes") {
      rate = (deadMiles === "short") ? 2.2 : 2.5;
      details.push(`Backload rate £${rate}/mile`);
    } else if (miles > 210) {
      rate = 2.6; // Long job flat rate
      details.push(`Long-distance rate £${rate}/mile`);
    }
    basePrice = miles * rate;
  }

  // Return Trip addition
  let returnExtra = 0;
  if (returnTrip === "yes") {
    returnExtra = miles * 2.5;
    details.push(`Return trip extra £2.5/mile = £${returnExtra.toFixed(2)}`);
  }

  // Dead Miles adjustment — no randomness now
  let adjPercent = 0;
  if (deadMiles === "short") adjPercent = -0.05;      // -5%
  else if (deadMiles === "far") adjPercent = 0.07;    // +7%
  else adjPercent = 0;                                // no change

  let adjusted = basePrice * (1 + adjPercent);

  // Total
  let total = adjusted + returnExtra;

  // Apply minimums
  if (vehicle === "luton") total = Math.max(total, 75);
  if (vehicle === "7.5t") total = Math.max(total, 165);
  if (vehicle === "18t" || vehicle === "26t") total = Math.max(total, 280);

  // Round to nearest £5
  total = Math.round(total / 5) * 5;

  out.innerHTML = `
    <div style="text-align:left">
      <p>💷 <strong>Estimated Price:</strong> £${total}</p>
      <p style="color:#cfe8ff">${details.join(" • ")}</p>
      <p style="font-size:0.9rem;color:#ccc">Note: consistent pricing — same inputs = same quote.</p>
    </div>
  `;
}
