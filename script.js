function calculateQuote() {
  const vehicle = document.getElementById("vehicle").value;
  const miles = parseFloat(document.getElementById("miles").value);
  const deadzone = document.querySelector('input[name="deadzone"]:checked').value;
  const deadMiles = document.getElementById("deadMiles").value;
  const returnTrip = document.querySelector('input[name="return"]:checked').value;
  const backload = document.querySelector('input[name="backload"]:checked').value;

  if (!vehicle || isNaN(miles) || miles <= 0) {
    document.getElementById("result").innerText = "⚠️ Please enter valid details.";
    return;
  }

  let rate = 0;
  let baseRate = 0;
  let message = "";

  // Vehicle base rates
  if (vehicle === "luton") baseRate = 1.5;
  else if (vehicle === "7.5t") baseRate = 3.0;
  else if (vehicle === "18t" || vehicle === "26t") baseRate = 3.7;

  // Adjust if Dead Zone
  if (deadzone === "yes") {
    if (vehicle === "luton") baseRate = 1.8;
    else if (vehicle === "7.5t") baseRate = 3.5;
    else baseRate = 4.5;
    message += "Dead Zone applied. ";
  }

  // Fixed short distance prices
  if (miles <= 30) {
    if (vehicle === "luton") rate = 85; // average 75-95
    else if (vehicle === "7.5t") rate = 190; // average 165-210
    else if (vehicle === "18t" || vehicle === "26t") rate = 300; // 280-325
  } else {
    rate = baseRate * miles;
  }

  // Adjust for Dead Miles
  if (deadMiles === "short") rate -= 10;
  else if (deadMiles === "far") rate += 20;

  // Backload Calculation
  if (backload === "yes") {
    message += "Backload pricing applied. ";
    if (deadMiles === "short") rate = miles * 2.2;
    else rate = miles * 2.5;
  }

  // Long distance adjustment (>210 miles)
  if (miles > 210 && backload === "no") {
    message += "Long distance rate applied. ";
    rate = miles * (Math.random() * (2.7 - 2.5) + 2.5); // random 2.5–2.7
  }

  // Return Trip logic
  if (returnTrip === "yes" && backload === "no") {
    rate = miles * 2.5;
    message += "Return trip rate applied. ";
  }

  // Round to nearest £5
  rate = Math.round(rate / 5) * 5;

  // Show result
  document.getElementById("result").innerHTML =
    `<p>💷 Estimated Price: <b>£${rate}</b></p>
     <small>${message}</small>`;
}
