class NumberUtility {
  static roundToNDecimalPoints(
    value: number,
    fractionDigits: number = 2
  ): number {
    return parseFloat(value.toFixed(fractionDigits));
  }
}

export default NumberUtility;
