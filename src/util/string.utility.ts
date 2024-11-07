class StringUtility {
  static testRegexPattern(pattern: string, text: string): boolean {
    const regex = new RegExp(pattern);
    return regex.test(text);
  }

  static parseStringWithPlaceholders(
    source: string,
    ...values: string[]
  ): string {
    values.forEach((value, i) => {
      source = source?.replace(`$${i + 1}`, value);
    });
    return source;
  }

  static isEmptyOrNull(str: string | null | undefined): boolean {
    return (
      str === undefined ||
      str === "undefined" ||
      str === null ||
      str === "null" ||
      str.trim() === ""
    );
  }
}

export default StringUtility;
