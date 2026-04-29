function normalizeStatus(status = "") {
  return String(status || "").trim().toLowerCase();
}

export function isLiveMatchStatus(status = "") {
  const safeStatus = normalizeStatus(status);

  return [
    "live",
    "ongoing",
    "active",
    "in_progress",
    "in progress",
  ].includes(safeStatus);
}

export function isCompletedMatchStatus(status = "") {
  const safeStatus = normalizeStatus(status);

  return [
    "completed",
    "done",
    "finished",
    "result",
    "closed",
  ].includes(safeStatus);
}

export function getActiveMatchesCount(fixtures = []) {
  return fixtures.filter((fixture) => isLiveMatchStatus(fixture?.status)).length;
}

export function getCompletedMatchesCount(fixtures = []) {
  return fixtures.filter((fixture) => isCompletedMatchStatus(fixture?.status)).length;
}

function parseCurrencyNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  const safeValue = value.trim();

  if (!safeValue) {
    return null;
  }

  const numericToken = safeValue.match(/-?[\d,.]+(?:\.\d+)?/);

  if (!numericToken) {
    return null;
  }

  const parsedValue = Number.parseFloat(numericToken[0].replace(/,/g, ""));

  if (!Number.isFinite(parsedValue)) {
    return null;
  }

  const lowerValue = safeValue.toLowerCase();

  if (
    lowerValue.includes("crore") ||
    /(?:^|[^a-z])cr(?:$|[^a-z])/i.test(lowerValue)
  ) {
    return parsedValue * 10000000;
  }

  if (
    lowerValue.includes("lakh") ||
    lowerValue.includes("lac") ||
    /[0-9]\s*l\b/i.test(lowerValue)
  ) {
    return parsedValue * 100000;
  }

  if (
    lowerValue.includes("thousand") ||
    /(?:^|[^a-z])k(?:$|[^a-z])/i.test(lowerValue)
  ) {
    return parsedValue * 1000;
  }

  return parsedValue;
}

function getSponsorAmountValue(sponsor = {}) {
  const candidateKeys = [
    "amount",
    "sponsor_amount",
    "sponsorship_amount",
    "revenue",
    "revenue_amount",
    "paid_amount",
    "amount_paid",
    "price",
    "value",
  ];

  for (const key of candidateKeys) {
    const parsedValue = parseCurrencyNumber(sponsor?.[key]);

    if (parsedValue !== null) {
      return parsedValue;
    }
  }

  return null;
}

export function getSponsorsRevenueTotal(sponsors = []) {
  let total = 0;
  let hasAnyAmount = false;

  sponsors.forEach((sponsor) => {
    const amountValue = getSponsorAmountValue(sponsor);

    if (amountValue !== null) {
      total += amountValue;
      hasAnyAmount = true;
    }
  });

  return hasAnyAmount ? total : null;
}

export function formatCompactRupees(value, fallbackValue = "₹0") {
  if (!Number.isFinite(value)) {
    return fallbackValue;
  }

  if (value >= 10000000) {
    const crores = value / 10000000;
    return `₹${crores.toFixed(crores >= 10 ? 1 : 2).replace(/\.0$/, "").replace(/\.00$/, "")}Cr`;
  }

  if (value >= 100000) {
    const lakhs = value / 100000;
    return `₹${lakhs.toFixed(lakhs >= 10 ? 1 : 2).replace(/\.0$/, "").replace(/\.00$/, "")}L`;
  }

  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}
