const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// Excel file path
const excelFile = path.join(
  __dirname,
  "../data/A-Mobility Basement Rooms.xlsx"
);

// Read workbook
const workbook = XLSX.readFile(excelFile);

// First sheet
const sheet = workbook.Sheets[workbook.SheetNames[0]];

// Convert to JSON (skip first title row)
const rows = XLSX.utils.sheet_to_json(sheet, {
  range: 1
});

// Convert data
const locations = rows.map((row) => ({
  sno: row["S/NO"],
  zone: row["Zones"],
  doorName: row["Door's name"],
  code: row["FACP Code"],
}));

// Generate TypeScript file
const output = `export const locations = ${JSON.stringify(
  locations,
  null,
  2
)};`;

// Save
fs.writeFileSync(
  path.join(__dirname, "../data/locations.ts"),
  output
);

console.log("✅ locations.ts generated successfully!");