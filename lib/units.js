export const INCH_TO_CM = 2.54;

export const toFeet = (inches) => inches / 12;
export const toCm = (inches) => Math.round(inches * INCH_TO_CM);

export const formatInches = (value) => `${value}\"`;
export const formatFeet = (value) => {
  const feet = toFeet(value);
  const rounded = Math.round(feet * 10) / 10; // 1 decimal place
  return `${rounded} ft`;
};
export const formatCm = (value) => `${toCm(value)} cm`;

export const formatPair = (pair, unit = "in") => {
  const [l, w] = pair;
  if (unit === "ft") {
    return `${formatFeet(l)} x ${formatFeet(w)}`;
  }
  if (unit === "cm") {
    return `${formatCm(l)} x ${formatCm(w)}`;
  }
  return `${formatInches(l)} x ${formatInches(w)}`; // default inches
};

export const formatThickness = (inches, unit = "in") => {
  if (unit === "ft") return formatFeet(inches);
  if (unit === "cm") return formatCm(inches);
  return formatInches(inches);
};

export const normalizeUnit = (u) => (u === "ft" || u === "cm" ? u : "in");

export const makeVariantKey = ({ productId, category, thicknessIn, sizeIn, unit }) => {
  const unitSafe = normalizeUnit(unit);
  const sizeSafe = Array.isArray(sizeIn) ? `${sizeIn[0]}x${sizeIn[1]}in` : "unknown";
  const thickSafe = `${thicknessIn}in`;
  const catSafe = (category || "Generic").replace(/\s+/g, "_");
  return `${productId}__${catSafe}_${thickSafe}_${sizeSafe}_${unitSafe}`;
};

export const parseSizeLabel = (label) => {
  // not used currently; helper if needed later
  return label;
};