import * as XLSX from "xlsx";
import * as fs from "fs";
import * as ExcelJS from "exceljs";

export default class ExportImportUtility {
  static async exportJSONToExcel(
    jsonData: any[],
    excelFilePath: string,
    sheetName: string = "Sheet1"
  ) {
    try {
      // Check if the file exists
      if (!fs.existsSync(excelFilePath)) {
        throw new Error(`File does not exist at ${excelFilePath}`);
      }

      // Read the existing Excel file
      const workbook = XLSX.readFile(excelFilePath);

      // Get the specific worksheet (sheetName) where you want to add data
      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet) {
        throw new Error(
          `Worksheet ${sheetName} does not exist in the Excel file.`
        );
      }

      // Convert the JSON data to an Excel-compatible format (array of arrays)
      //   const headers = Object.keys(jsonData[0]);
      const headers = [
        "Resident Name*",
        "Mobile Number*",
        "Building/Tower*",
        "Wing/Block*",
        "Flat Number*",
        "Occupant Type*",
      ];
      const dataToExport = [
        // headers, // The first row will be the headers
        ...jsonData.map((obj) => {
          obj = obj._doc;
          const flat = obj.flatId._doc;
          const flatNumber = flat.flatNumber;
          return [
            obj.name,
            obj.phone?.substring(3),
            `${flatNumber.substring(0, 1)} BLOCK`,
            flat.flatNumber.substring(0, 1),
            flat.flatNumber.substring(1),
            "OWNER_FAMILY",
          ];
        }), // Rows with actual data
      ];

      // Append new JSON data into the sheet
      //   XLSX.utils.sheet_add_aoa(worksheet, dataToExport, { origin: -1 }); // -1 adds new data at the end of the existing sheet

      //   // Write the updated workbook back to the same file
      //   XLSX.writeFile(workbook, excelFilePath);

      const excelJsWorkbook = new ExcelJS.Workbook();
      let rowNumber = 2;
      excelJsWorkbook.xlsx
        .readFile(excelFilePath)
        .then(() => {
          const excelJsWorksheet = excelJsWorkbook.getWorksheet(1); // Get the first worksheet

          if (excelJsWorksheet) {
            dataToExport.forEach((row) => {
              excelJsWorksheet.insertRow(rowNumber++, row);
            });
          }

          excelJsWorkbook.xlsx.writeFile(excelFilePath);
        })
        .catch((error) => {
          console.log(error);
        });

      console.log(`Data successfully written to ${excelFilePath}`);
    } catch (error) {
      console.error("Error exporting data to Excel:", error);
    }
  }
}
