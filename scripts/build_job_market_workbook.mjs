import fs from "node:fs/promises";
import { Workbook, SpreadsheetFile } from "@oai/artifact-tool";

const projectDir = "G:/findwork/PM/AI技术人才招聘助手";
const csvPath = `${projectDir}/data/public_jobs.csv`;
const outputDir = `${projectDir}/outputs`;
const csvText = await fs.readFile(csvPath, "utf8");

const workbook = await Workbook.fromCSV(csvText, { sheetName: "岗位样本" });
const data = workbook.worksheets.getItem("岗位样本");
const summary = workbook.worksheets.add("市场分析");

data.showGridLines = false;
data.freezePanes.freezeRows(1);
data.getRange("A1:P61").format.font = { name: "Microsoft YaHei", size: 9 };
data.getRange("A1:P1").format = {
  fill: "#17324D",
  font: { name: "Microsoft YaHei", size: 9, bold: true, color: "#FFFFFF" },
  verticalAlignment: "center",
  wrapText: true,
};
data.getRange("A1:P61").format.borders = {
  insideHorizontal: { style: "thin", color: "#E5E7EB" },
  bottom: { style: "thin", color: "#CBD5E1" },
};
data.getRange("A2:A61").format.horizontalAlignment = "center";
data.getRange("B2:D61").format.horizontalAlignment = "center";
data.getRange("H2:L61").format.horizontalAlignment = "center";
data.getRange("A1:P61").format.verticalAlignment = "center";
data.getRange("A1:P61").format.wrapText = true;
data.getRange("A:A").format.columnWidth = 12;
data.getRange("B:B").format.columnWidth = 13;
data.getRange("C:C").format.columnWidth = 12;
data.getRange("D:E").format.columnWidth = 11;
data.getRange("F:F").format.columnWidth = 28;
data.getRange("G:G").format.columnWidth = 22;
data.getRange("H:L").format.columnWidth = 15;
data.getRange("M:M").format.columnWidth = 30;
data.getRange("N:N").format.columnWidth = 36;
data.getRange("O:O").format.columnWidth = 18;
data.getRange("P:P").format.columnWidth = 24;
data.getRange("1:1").format.rowHeight = 36;

summary.showGridLines = false;
summary.getRange("A1:H1").merge();
summary.getRange("A1").values = [["AI 产品经理岗位市场样本分析"]];
summary.getRange("A1:H1").format = {
  fill: "#17324D",
  font: { name: "Microsoft YaHei", size: 18, bold: true, color: "#FFFFFF" },
  verticalAlignment: "center",
};
summary.getRange("A1:H1").format.rowHeight = 36;
summary.getRange("A2:H2").merge();
summary.getRange("A2").values = [[
  "目的抽样｜采集日期 2026-07-23｜公开岗位摘要，不代表完整市场"
]];
summary.getRange("A2:H2").format = {
  fill: "#EAF0F6",
  font: { name: "Microsoft YaHei", size: 10, color: "#334155" },
};

summary.getRange("A4:B4").values = [["样本总数", "城市数"]];
summary.getRange("A5").formulas = [["=COUNTA('岗位样本'!$A$2:$A$61)"]];
summary.getRange("B5").values = [[5]];
summary.getRange("A4:B4").format = {
  fill: "#DCE8F2",
  font: { name: "Microsoft YaHei", bold: true, color: "#17324D" },
};
summary.getRange("A5:B5").format = {
  fill: "#F8FAFC",
  font: { name: "Microsoft YaHei", size: 16, bold: true, color: "#0F766E" },
  horizontalAlignment: "center",
};

summary.getRange("A7:B7").values = [["城市", "岗位数"]];
summary.getRange("A8:A12").values = [["北京"], ["成都"], ["重庆"], ["杭州"], ["深圳"]];
summary.getRange("B8").formulas = [["=COUNTIF('岗位样本'!$D$2:$D$61,A8)"]];
summary.getRange("B8:B12").fillDown();

summary.getRange("D7:E7").values = [["招聘阶段", "岗位数"]];
summary.getRange("D8:D13").values = [["社招"], ["经验不限"], ["校招/应届"], ["实习"], ["实习/校招"], ["未知"]];
summary.getRange("E8").formulas = [["=COUNTIF('岗位样本'!$K$2:$K$61,D8)"]];
summary.getRange("E8:E13").fillDown();

summary.getRange("A15:B15").values = [["产品方向", "岗位数"]];
summary.getRange("A16:A25").values = [
  ["B端AI"], ["AI Agent"], ["AI应用"], ["C端AI"], ["金融AI"],
  ["AI教育"], ["AI硬件"], ["工业AI"], ["电商AI"], ["B端/C端AI"]
];
summary.getRange("B16").formulas = [["=COUNTIF('岗位样本'!$L$2:$L$61,A16)"]];
summary.getRange("B16:B25").fillDown();

summary.getRange("D15:H15").merge();
summary.getRange("D15").values = [["研究结论（仅适用于当前目的样本）"]];
summary.getRange("D16:H21").merge(true);
summary.getRange("D16:H21").values = [
  ["1. 样本以社招为主，校招与实习岗位稀缺，求职材料必须突出可运行 Demo 和端到端项目证据。"],
  ["2. B端AI与Agent方向占比较高，招聘助手项目与目标岗位场景一致。"],
  ["3. 高频能力集中在需求/市场/用户研究、产品规划、跨团队推进，以及模型评估和工作流设计。"],
  ["4. 北京、杭州、深圳机会明显多于当前采集到的成都、重庆；城市差异不能仅凭本样本推断整体市场。"],
  ["5. 聚合页摘要字段有限，下一阶段需要增加企业官方岗位和完整JD作为高证据样本。"],
  ["6. 薪资未统一折算，避免把日薪、月薪和不同薪数混为同一指标。"],
];

for (const headerRange of ["A7:B7", "D7:E7", "A15:B15", "D15:H15"]) {
  summary.getRange(headerRange).format = {
    fill: "#2C5F7C",
    font: { name: "Microsoft YaHei", bold: true, color: "#FFFFFF" },
    verticalAlignment: "center",
  };
}
summary.getRange("A7:B12").format.borders = { preset: "all", style: "thin", color: "#D7E0E8" };
summary.getRange("D7:E13").format.borders = { preset: "all", style: "thin", color: "#D7E0E8" };
summary.getRange("A15:B25").format.borders = { preset: "all", style: "thin", color: "#D7E0E8" };
summary.getRange("D16:H21").format = {
  fill: "#F8FAFC",
  font: { name: "Microsoft YaHei", size: 10, color: "#334155" },
  wrapText: true,
  verticalAlignment: "center",
  borders: { preset: "outside", style: "thin", color: "#D7E0E8" },
};
summary.getRange("A1:H25").format.font = { name: "Microsoft YaHei" };
summary.getRange("A:A").format.columnWidth = 17;
summary.getRange("B:B").format.columnWidth = 11;
summary.getRange("C:C").format.columnWidth = 3;
summary.getRange("D:D").format.columnWidth = 17;
summary.getRange("E:E").format.columnWidth = 11;
summary.getRange("F:H").format.columnWidth = 15;
summary.getRange("16:21").format.rowHeight = 34;

const cityChart = summary.charts.add("bar", summary.getRange("A7:B12"));
cityChart.title = "城市样本分布";
cityChart.hasLegend = false;
cityChart.xAxis = { axisType: "textAxis", textStyle: { fontSize: 9 } };
cityChart.yAxis = { numberFormatCode: "0" };
cityChart.setPosition("G4", "N14");

await fs.mkdir(outputDir, { recursive: true });
const preview = await workbook.render({
  sheetName: "市场分析",
  range: "A1:N25",
  scale: 1.5,
  format: "png",
});
await fs.writeFile(`${outputDir}/岗位市场分析_preview.png`, new Uint8Array(await preview.arrayBuffer()));

const dataPreview = await workbook.render({
  sheetName: "岗位样本",
  range: "A1:P61",
  scale: 0.65,
  format: "png",
});
await fs.writeFile(`${outputDir}/岗位样本_preview.png`, new Uint8Array(await dataPreview.arrayBuffer()));

const exported = await SpreadsheetFile.exportXlsx(workbook);
await exported.save(`${outputDir}/AI产品经理岗位市场分析.xlsx`);

const check = await workbook.inspect({
  kind: "table",
  range: "市场分析!A1:H25",
  include: "values,formulas",
  tableMaxRows: 25,
  tableMaxCols: 8,
  maxChars: 8000,
});
console.log(check.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "final formula error scan",
});
console.log(errors.ndjson);
