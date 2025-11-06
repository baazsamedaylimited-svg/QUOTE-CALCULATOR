function calculateQuote() {
  const vehicle = document.getElementById("vehicle").value;
  const miles = parseFloat(document.getElementById("miles").value);
  const isDeadZone = document.querySelector('input[name="deadZone"]:checked')?.value === "yes";
  const deadMiles = document.getElementById("deadMiles").value;
  const isReturnTrip = document.querySelector('input[name="returnTrip"]:checked')?.value === "yes";
  const isBackload = document.querySelector('input[name="backload"]:checked')?.value === "yes";

  if (!vehicle || isNaN(miles)) {
    alert("Please select a vehicle and enter valid miles.");
    return;
  }

  let price = 0;

  // 🔹 Base per-mile rate setup
  let ratePerMile = 0;
  if (isDeadZone) {
    if (vehicle === "luton") ratePerMile = 1.8;
    else if (vehicle === "7.5t") ratePerMile = 3.5;
    else ratePerMile = 4.5;
  } else {
    if (vehicle === "luton") ratePerMile = 1.5;
    else if (vehicle === "7.5t") ratePerMile = 3;
    else ratePerMile = 3.7;
  }

  // 🔹 For 0–30 miles fixed price
  if (miles <= 30) {
    if (vehicle === "luton") price = 85; // midpoint 75–95
    else if (vehicle === "7.5t") price = 185; // midpoint 165–210
    else price = 300; // midpoint 280–325
  }

  // 🔹 For 100–130 miles
  else if (miles >= 100 && miles <= 130) {
    if (vehicle === "luton") price = 305;
    else if (vehicle === "7.5t") price = 335;
    else price = 430;

    // Add £25 only when "far" and ≤130
    if (deadMiles === "far" && miles <= 130) {
      price += 25;
    }
  }

  // 🔹 For 130+ miles
  else {
    if (isBackload) ratePerMile = 2.35; // avg 2.2–2.5
    else if (miles > 210) ratePerMile = 2.6; // avg 2.5–2.7
    price = miles * ratePerMile;
  }

  // 🔹 Return trip logic
  if (isReturnTrip) {
    price = miles * 2.4 * 2;
  }

  // 🔹 Small, fixed variation (stable look)
  const variation = getStableVariation(miles, vehicle);
  const finalPrice = Math.round(price + variation);

  document.getElementById("result").innerHTML = `
    <div class="quote-box">
      <strong>Estimated Quote:</strong> £${finalPrice}
    </div>
  `;
}

// 🔸 Stable variation based on simple hash, so price stays same on repeat clicks
function getStableVariation(miles, vehicle) {
  const hash = (miles + vehicle.length * 7) % 20 - 10; // -10 to +10
  return hash;
}
