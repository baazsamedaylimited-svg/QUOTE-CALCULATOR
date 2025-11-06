document.getElementById("calculateBtn").addEventListener("click", function() {
  const vehicle = document.getElementById("vehicle").value;
  const miles = parseFloat(document.getElementById("miles").value);
  const deadZone = document.querySelector('input[name="deadZone"]:checked').value;
  const returnTrip = document.querySelector('input[name="returnTrip"]:checked').value;
  const deadMiles = document.getElementById("deadMiles").value;
  const resultDiv = document.getElementById("result");

  if (!vehicle || !miles) {
    resultDiv.textContent = "⚠️ Please select a vehicle and enter miles.";
    return;
  }

  let total = 0;
  let rate = 0;
  let fixedMin = 0;
  let fixedMax = 0;
  let details = "";

  // === Base Pricing Logic ===
  if (vehicle === "luton") {
    if (miles <= 30) {
      fixedMin = 75;
      fixedMax = 95;
      total = adjustByDeadMiles(getAverage(fixedMin, fixedMax), deadMiles, 10);
      details = `Short trip range £${fixedMin}–£${fixedMax}`;
    } else {
      rate = deadZone === "yes" ? 1.8 : 1.5;
      total = miles * rate;
      total = adjustByDeadMiles(total, deadMiles, 15);
      details = `Rate £${rate}/mile`;
    }
  }

  if (vehicle === "7.5t") {
    if (miles <= 30) {
      fixedMin = 165;
      fixedMax = 210;
      total = adjustByDeadMiles(getAverage(fixedMin, fixedMax), deadMiles, 20);
      details = `Short trip range £${fixedMin}–£${fixedMax}`;
    } else if (miles <= 100) {
      fixedMin = 275;
      fixedMax = 325;
      total = adjustByDeadMiles(getAverage(fixedMin, fixedMax), deadMiles, 25);
      details = `Medium trip range £${fixedMin}–£${fixedMax}`;
    } else {
      rate = deadZone === "yes" ? 3.5 : 3.0;
      total = miles * rate;
      total = adjustByDeadMiles(total, deadMiles, 30);
      details = `Rate £${rate}/mile`;
    }
  }

  if (vehicle === "18t" || vehicle === "26t") {
    if (miles <= 30) {
      fixedMin = 280;
      fixedMax = 325;
      total = adjustByDeadMiles(getAverage(fixedMin, fixedMax), deadMiles, 30);
      details = `Short trip range £${fixedMin}–£${fixedMax}`;
    } else {
      rate = deadZone === "yes" ? 4.5 : 3.7;
      total = miles * rate;
      total = adjustByDeadMiles(total, deadMiles, 40);
      details = `Rate £${rate}/mile`;
    }
  }

  // === Return Trip Adjustment (adds £2.5 per mile) ===
  if (returnTrip === "yes") {
    const returnCharge = miles * 2.5;
    total += returnCharge;
    details += ` + Return Trip (£2.5/mile = £${returnCharge.toFixed(2)})`;
  }

  const formatted = total.toFixed(2);
  resultDiv.innerHTML = `
    💷 <strong>Estimated Quote:</strong> £${formatted}<br>
    <small>${vehicle.toUpperCase()} • ${miles} miles • ${deadZone === "yes" ? "Dead Zone" : "Normal"} • ${deadMiles.toUpperCase()} Collection</small><br>
    <small>${details}</small>
  `;
});

function getAverage(min, max) {
  return (min + max) / 2;
}

// Adjust price by collection distance (dead miles)
function adjustByDeadMiles(price, level, adjust) {
  if (level === "near") return price - adjust;
  if (level === "far") return price + adjust;
  return price;
}
