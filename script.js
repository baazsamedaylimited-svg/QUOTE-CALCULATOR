function calculateQuote() {
  const vehicle = document.getElementById("vehicle").value;
  const miles = parseFloat(document.getElementById("miles").value);
  const deadzone = document.querySelector('input[name="deadzone"]:checked')?.value;
  const deadMiles = document.getElementById("deadMiles").value; // "near" or "far"
  const returnTrip = document.querySelector('input[name="return"]:checked')?.value;
  const backload = document.querySelector('input[name="backload"]:checked')?.value;
  const out = document.getElementById("result");

  if (!vehicle || isNaN(miles) || miles <= 0) {
    out.innerHTML = "⚠️ Please select a vehicle and enter valid miles.";
    return;
  }

  let rate = 0;
  let basePrice = 0;
  const details = [];

  // === Base per-mile rates ===
  if (vehicle === "luton") rate = deadzone === "yes" ? 1.8 : 1.5;
  else if (vehicle === "7.5t") rate = deadzone === "yes" ? 3.5 : 3.0;
  else if (vehicle === "18t" || vehicle === "26t") rate = deadzone === "yes" ? 4.5 : 3.7;

  // === Short distance (<=30 miles) ===
  if (miles <= 30) {
    if (vehicle === "luton") basePrice = 85;
    else if (vehicle === "7.5t") basePrice = 187.5;
    else basePrice = 302.5;
    details.push("Short distance fixed rate (≤30 miles)");
  }

  // === 100–130 mile special band ===
  else if (miles > 100 && miles <= 130) {
    basePrice = deadMiles === "far" ? 345 : 320;
    details.push("100–130 mile special rate (£320–£345)");
  }

  // === Long distance (>210 miles) ===
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

  // === Normal mid-distance calculation ===
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

  // === Dead Miles adjustment (5% cheaper if near, 7% higher if far) ===
  let adjustedPrice = basePrice;
  if (deadMiles === "near") adjustedPrice *= 0.95;
  else if (deadMiles === "far") adjustedPrice *= 1.07;

  // === £25 surcharge only if far AND miles between 50–130 ===
  let extraFarCharge = 0;
  if (deadMiles === "far" && miles > 50 && miles <= 130) {
    extraFarCharge = 25;
    details.push("+£25 surcharge (Far collection over 50 miles)");
  }

  // === Total calculation ===
  let total = adjustedPrice + returnExtra + extraFarCharge;

  // === Minimum safeguard per vehicle ===
  if (vehicle === "luton" && total < 75) total = 75;
  else if (vehicle === "7.5t" && total < 165) total = 165;
  else if ((vehicle === "18t" || vehicle === "26t") && total < 280) total = 280;

  // === Round to nearest £5 ===
  total = Math.round(total / 5) * 5;

  // === Output ===
  out.innerHTML = `
    <div style="text-align:left">
      <p>💷 <strong>Estimated Price:</strong> £${total}</p>
      <p style="color:#cfe8ff">${details.join(" • ")}</p>
      <p style="font-size:0.9rem;color:#ccc">Consistent & fair pricing — same inputs = same quote.</p>
    </div>
  `;
}
