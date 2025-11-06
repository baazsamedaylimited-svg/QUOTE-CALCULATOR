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

  let ratePerMile = 0;
  let basePrice = 0;
  let priceRange = [0, 0];

  // 🔹 Base rate depending on vehicle type and dead zone
  if (isDeadZone) {
    if (vehicle === "luton") ratePerMile = 1.8;
    else if (vehicle === "7.5t") ratePerMile = 3.5;
    else ratePerMile = 4.5;
  } else {
    if (vehicle === "luton") ratePerMile = 1.5;
    else if (vehicle === "7.5t") ratePerMile = 3;
    else ratePerMile = 3.7;
  }

  // 🔹 Fixed prices for short distances (0–30 miles)
  if (miles <= 30) {
    if (vehicle === "luton") priceRange = [75, 95];
    else if (vehicle === "7.5t") priceRange = [165, 210];
    else priceRange = [280, 325];
    basePrice = randomInRange(priceRange);
  }

  // 🔹 100–130 mile jobs special range
  else if (miles >= 100 && miles <= 130) {
    if (vehicle === "7.5t") priceRange = [320, 345];
    else if (vehicle === "luton") priceRange = [285, 325];
    else priceRange = [400, 460];
    basePrice = randomInRange(priceRange);

    // Add £25 only if far dead miles and miles <= 130
    if (deadMiles === "far" && miles <= 130) {
      basePrice += 25;
    }
  }

  // 🔹 Jobs above 130 miles – normal rate, no surcharge
  else {
    if (isBackload) {
      ratePerMile = randomInRange([2.2, 2.5]);
    } else if (miles > 210) {
      ratePerMile = randomInRange([2.5, 2.7]);
    }
    basePrice = miles * ratePerMile;
  }

  // 🔹 Return trip calculation
  if (isReturnTrip) {
    basePrice = miles * 2.5 * 2; // return = double miles × 2.5 rate
  }

  // 🔹 Small random variation (+/- up to 10)
  const randomVariation = randomInRange([-10, 10]);
  const finalPrice = Math.max(0, Math.round(basePrice + randomVariation));

  document.getElementById("result").innerHTML =
    `<strong>Estimated Quote:</strong> £${finalPrice}`;
}

function randomInRange(range) {
  if (Array.isArray(range)) {
    const [min, max] = range;
    return Math.random() * (max - min) + min;
  }
  return range;
}
