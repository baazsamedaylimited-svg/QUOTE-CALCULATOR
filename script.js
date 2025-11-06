function calculateQuote() {
  const vehicle = document.getElementById("vehicle").value;
  const miles = parseFloat(document.getElementById("miles").value);
  const deadzone = document.querySelector('input[name="deadzone"]:checked').value;
  const deadMiles = document.getElementById("deadMiles").value; // "short" | "medium" | "far"
  const returnTrip = document.querySelector('input[name="return"]:checked').value;
  const backload = document.querySelector('input[name="backload"]:checked').value;

  const out = document.getElementById("result");

  if (!vehicle || isNaN(miles) || miles <= 0) {
    out.innerHTML = "⚠️ Please select a vehicle and enter valid miles.";
    return;
  }

  // Helper: random integer between min and max inclusive
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Helper: clamp value between min and max
  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  // Base price calculation variables
  let baseRate = 0;
  let price = 0;
  let details = [];

  // 1) Choose base per-mile rate depending on vehicle and deadzone
  if (vehicle === "luton") baseRate = deadzone === "yes" ? 1.8 : 1.5;
  else if (vehicle === "7.5t") baseRate = deadzone === "yes" ? 3.5 : 3.0;
  else if (vehicle === "18t" || vehicle === "26t") baseRate = deadzone === "yes" ? 4.5 : 3.7;

  // 2) Short-distance fixed prices (under or equal 30 miles)
  if (miles <= 30) {
    if (vehicle === "luton") {
      // fixed range 75-95 => take midpoint
      price = 85;
      details.push("Luton short fixed (75–95)");
    } else if (vehicle === "7.5t") {
      price = 187.5; // midpoint of 165-210
      details.push("7.5T short fixed (165–210)");
    } else if (vehicle === "18t" || vehicle === "26t") {
      price = 302.5; // midpoint of 280-325
      details.push("18T/26T short fixed (280–325)");
    }
  } else {
    // 3) Long-distance rules
    if (backload === "yes") {
      // Backload special rates: near -> 2.2, else 2.5
      const backloadRate = (deadMiles === "short") ? 2.2 : 2.5;
      price = miles * backloadRate;
      details.push(`Backload rate £${backloadRate}/mile`);
    } else if (miles > 210) {
      // Long job special rate 2.5 - 2.7 -> pick midpoint 2.6
      const longRate = 2.6;
      price = miles * longRate;
      details.push(`Long-distance rate £${longRate}/mile`);
    } else {
      // Normal per-mile price
      price = miles * baseRate;
      details.push(`Base rate £${baseRate}/mile`);
    }
  }

  // 4) RETURN TRIP: add £2.5 * miles (extra charge) if selected
  let returnExtra = 0;
  if (returnTrip === "yes") {
    returnExtra = miles * 2.5;
    details.push(`Return extra £2.5/mile = £${returnExtra.toFixed(2)}`);
  }

  // 5) Dead-miles adjustment: small variance between -10..+10 depending on near/medium/far
  //    - near: decrease by 1..10
  //    - medium: +/- 1..5
  //    - far: increase by 1..10
  let deadAdj = 0;
  if (deadMiles === "short") {
    deadAdj = -randInt(1, 10);
    details.push(`Dead miles (near) adjustment: ${deadAdj}`);
  } else if (deadMiles === "medium") {
    deadAdj = randInt(-5, 5);
    if (deadAdj >= 0) details.push(`Dead miles (medium) +${deadAdj}`);
    else details.push(`Dead miles (medium) ${deadAdj}`);
  } else { // far
    deadAdj = randInt(1, 10);
    details.push(`Dead miles (far) adjustment: +${deadAdj}`);
  }

  // Combine base price + return extra + deadAdj
  let rawTotal = price + returnExtra + deadAdj;

  // 6) Safety: ensure we don't drop below minimal sensible price for that vehicle/short trip
  //    We'll enforce minimums based on earlier fixed minima:
  let minAllowed = 0;
  if (vehicle === "luton") minAllowed = 60;       // don't go lower than £60
  if (vehicle === "7.5t") minAllowed = 140;       // don't go lower than £140
  if (vehicle === "18t" || vehicle === "26t") minAllowed = 250;

  rawTotal = clamp(rawTotal, minAllowed, Number.POSITIVE_INFINITY);

  // 7) Round to nearest whole £ (or to nearest 5 if you prefer)
  const finalTotal = Math.round(rawTotal); // round to nearest £
  // const finalTotal = Math.round(rawTotal / 5) * 5; // nearest £5 (optional)

  // 8) Output
  out.innerHTML = `
    <div style="text-align:left">
      <p>💷 <strong>Estimated Price:</strong> £${finalTotal}</p>
      <p style="color:#dfeffd">${details.join(" • ")}</p>
      <p style="font-size:0.9rem;color:#cfe8ff">Note: price includes a small ±£1–£10 adjustment based on collection distance.</p>
    </div>
  `;
}
