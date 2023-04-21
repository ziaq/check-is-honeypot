function roundNumber(number: number): string {
  const exponent = Math.floor(Math.log10(number));
  const factor = Math.pow(10, exponent);
  const rounded = Math.round(number / factor * 1000) / 1000 * factor;

  if (rounded >= 1000000000) {
    const billions = Math.floor(rounded / 1000000000);
    return billions + "b";
  } else if (rounded >= 1000000) {
    const millions = Math.floor(rounded / 1000000);
    return millions + "m";
  } else if (rounded >= 1000) {
    const thousands = Math.floor(rounded / 1000);
    return thousands + "k";
  }

  return rounded.toString();
}

export default roundNumber;