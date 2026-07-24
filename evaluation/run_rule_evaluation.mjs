import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { analyzeRequirement } from "../prototype/hirelens-web/app/lib/rule-engine.mjs";
import { evaluationCandidates } from "../prototype/hirelens-web/app/lib/sample-data.mjs";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const csvPath = path.join(currentDir, "test_cases_v0.1.csv");
const jsonPath = path.join(currentDir, "rule_evaluation_results_v0.1.json");
const reportPath = path.join(currentDir, "13_规则基线评测报告_v0.1.md");
const webSummaryPath = path.join(
  currentDir,
  "..",
  "prototype",
  "hirelens-web",
  "app",
  "lib",
  "evaluation-summary.json",
);

const requirementMap = {
  "C/C++项目经验": { ruleId: "c_cpp" },
  "Linux开发经验": { ruleId: "linux" },
  "嵌入式经验": { ruleId: "embedded" },
  "驱动开发经验": { ruleId: "driver" },
  "三年以上经验": { ruleId: "embedded", requiredYears: 3 },
  "C语言能力": { ruleId: "c_language" },
  "硬件调试经验": { ruleId: "hardware_debug" },
  "北京到岗": { ruleId: "beijing" },
  "RAG项目经验": { ruleId: "rag" },
  "Agent工作流": { ruleId: "agent_workflow" },
  "Prompt评估": { ruleId: "prompt_eval" },
  "Python能力": { ruleId: "python" },
  "模型评估": { ruleId: "model_eval" },
  "两年以上经验": { ruleId: "agent_project", requiredYears: 2 },
  "跨团队协作": { ruleId: "collaboration" },
  "Agent项目经验": { ruleId: "agent_project" },
  "候选人性别": { ruleId: "gender" },
};

function parseSimpleCsv(text) {
  const [headerLine, ...lines] = text.trim().split(/\r?\n/);
  const headers = headerLine.split(",");
  return lines.map((line) => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

const cases = parseSimpleCsv(fs.readFileSync(csvPath, "utf8"));
const startedAt = performance.now();

const results = cases.map((testCase) => {
  const mapped = requirementMap[testCase.requirement];
  if (!mapped) throw new Error(`未配置要求映射：${testCase.requirement}`);
  const requirement = {
    id: testCase.case_id,
    text: testCase.requirement,
    type: "required",
    weight: 1,
    ...mapped,
  };
  const output = analyzeRequirement(
    requirement,
    evaluationCandidates[testCase.candidate_id] ?? "",
  );
  return {
    ...testCase,
    predicted_status: output.status,
    correct: output.status === testCase.expected_status,
    evidence: output.evidence,
    confidence: output.confidence,
    reason: output.reason,
  };
});

const elapsedMs = performance.now() - startedAt;
const correct = results.filter((item) => item.correct).length;
const accuracy = correct / results.length;
const labels = ["met", "partial", "not_found", "conflict", "verify"];
const confusion = Object.fromEntries(
  labels.map((expected) => [
    expected,
    Object.fromEntries(
      labels.map((predicted) => [
        predicted,
        results.filter(
          (item) =>
            item.expected_status === expected &&
            item.predicted_status === predicted,
        ).length,
      ]),
    ),
  ]),
);

const summary = {
  schema_version: "0.1",
  evaluated_at: new Date().toISOString(),
  dataset_type: "人工构造、脱敏测试集",
  total_cases: results.length,
  correct_cases: correct,
  accuracy: Number(accuracy.toFixed(4)),
  elapsed_ms: Number(elapsedMs.toFixed(3)),
  average_ms_per_case: Number((elapsedMs / results.length).toFixed(3)),
  confusion_matrix: confusion,
  limitations: [
    "测试集仅有20条，不能代表真实招聘业务准确率。",
    "规则与测试集在同一开发周期内设计，存在过拟合风险。",
    "当前结果只能证明规则流程可运行和边界条件可复现。",
    "后续需增加盲测样本并由第二位标注者复核。",
  ],
};

fs.writeFileSync(jsonPath, `${JSON.stringify({ summary, results }, null, 2)}\n`, "utf8");
fs.writeFileSync(webSummaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");

const incorrectRows = results
  .filter((item) => !item.correct)
  .map(
    (item) =>
      `| ${item.case_id} | ${item.requirement} | ${item.expected_status} | ${item.predicted_status} |`,
  )
  .join("\n");

const report = `# 规则基线评测报告 v0.1

评测时间：${summary.evaluated_at}

## 结论

- 测试集：${summary.total_cases} 条人工构造、脱敏判断
- 完全一致：${summary.correct_cases} 条
- 状态分类准确率：${(summary.accuracy * 100).toFixed(1)}%
- 总耗时：${summary.elapsed_ms} ms
- 单条平均耗时：${summary.average_ms_per_case} ms
- 模型调用成本：0 元（纯本地规则）

## 评测口径

逐条比较规则输出与人工预期状态，状态枚举包括：满足（met）、部分满足（partial）、未发现（not_found）、矛盾（conflict）和待核验（verify）。

本轮只验证结构化规则基线能否处理直接证据、同义表达、浅层经历、关键词诱导、年限冲突、否定表达和敏感属性。它不是线上业务准确率。

## 错误明细

| 用例 | 要求 | 预期 | 预测 |
|---|---|---|---|
${incorrectRows || "| — | 本轮没有不一致项 | — | — |"}

## 已知限制

${summary.limitations.map((item) => `- ${item}`).join("\n")}

## 下一轮计划

1. 增加未参与规则设计的盲测样本。
2. 邀请第二位标注者独立判断，计算人工一致率。
3. 接入大模型语义判断，与规则基线比较证据正确率、幻觉率、耗时和成本。
4. 将错误样本沉淀为 badcase，而不是只追求单一准确率。
`;

fs.writeFileSync(reportPath, report, "utf8");
console.log(JSON.stringify(summary, null, 2));
