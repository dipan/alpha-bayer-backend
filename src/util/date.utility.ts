class DateUtility {
  static getFormattedDate(
    format: string = "yyyyMMdd",
    timestamp?: number
  ): string {
    const currentDate = timestamp ? new Date(timestamp) : new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed
    const day = String(currentDate.getDate()).padStart(2, "0");

    switch (format) {
      case "yyyyMMdd":
        return `${year}${month}${day}`;
      case "yyyyMM":
        return `${year}${month}`;
      case "yyyyMMM":
        return `${year} ${currentDate.toLocaleString("default", {
          month: "short",
        })}`;
      case "yyMM":
        return `${String(year).slice(2)}${month}`;
      default:
        throw new Error("Invalid date format");
    }
  }

  static getDateObject(inputDate?: Date): {
    year: number;
    month: number;
    date: number;
    dayOfWeek: number;
    hour: number;
  } {
    if (!inputDate) {
      inputDate = new Date();
    }
    const year = inputDate.getFullYear();
    const month = inputDate.getMonth();
    const date = inputDate.getDate();
    const dayOfWeek = inputDate.getDay();
    const hour = inputDate.getHours();
    return { year, month, date, dayOfWeek, hour };
  }
}

export default DateUtility;
