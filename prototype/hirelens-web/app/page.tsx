"use client";

import { useMemo, useState } from "react";
import { analyzeCandidate, buildJobProfileFromText, STATUS_LABELS } from "./lib/rule-engine.mjs";
import { embeddedCandidates, embeddedJob } from "./lib/sample-data.mjs";
import evaluationSummary from "./lib/evaluation-summary.json";

type Candidate = {
  id: string;
  name: string;
  role: string;
  score: number;
  required: string;
  risk: string;
  status: "推荐复筛" | "需要核验" | "暂不优先";
  resumeText: string;
  matches: Array<{
    requirementId: string;
    requirement: string;
    type: "required" | "core" | "bonus";
    weight: number;
    status: "met" | "partial" | "not_found" | "conflict" | "verify";
    evidence: string;
    confidence: number;
    reason: string;
    question: string;
  }>;
};

const candidates = embeddedCandidates
  .map((candidate) => analyzeCandidate(embeddedJob, candidate) as Candidate)
  .sort((a, b) => b.score - a.score);

const typeLabels = {
  required: "必备项",
  core: "核心能力",
  bonus: "加分项",
};

const statusClass: Record<string, string> = {
  满足: "state met",
  部分满足: "state partial",
  未发现: "state missing",
  待核验: "state verify",
  矛盾: "state conflict",
};

export default function Home() {
  const [selectedId, setSelectedId] = useState("E01");
  const [mode, setMode] = useState<"规则模式" | "混合模式（待接入）">("规则模式");
  const [activeView, setActiveView] = useState<"候选人" | "岗位画像" | "评估记录" | "规则实验室">("候选人");
  const [labJd, setLabJd] = useState(embeddedJob.rawJd);
  const [labResume, setLabResume] = useState(embeddedCandidates[0].resumeText);
  const [labResult, setLabResult] = useState<Candidate | null>(null);
  const [labRequirements, setLabRequirements] = useState<Array<{ text: string; weight: number }>>([]);
  const [labWarnings, setLabWarnings] = useState<string[]>([]);
  const selected = useMemo(
    () => candidates.find((candidate) => candidate.id === selectedId) ?? candidates[0],
    [selectedId],
  );
  const evidence = selected.matches.map((item) => ({
    ...item,
    type: `${typeLabels[item.type]} · ${item.weight}%`,
    state: STATUS_LABELS[item.status] as "满足" | "部分满足" | "未发现" | "待核验" | "矛盾",
  }));
  const recommendedCount = candidates.filter((candidate) => candidate.status === "推荐复筛").length;
  const verifyCount = candidates.reduce(
    (count, candidate) =>
      count + candidate.matches.filter((item) => ["partial", "verify", "conflict"].includes(item.status)).length,
    0,
  );
  const allMatches = candidates.flatMap((candidate) => candidate.matches);
  const evidenceCoverage = Math.round(
    (allMatches.filter((item) => item.status !== "not_found").length / allMatches.length) * 100,
  );

  function runRuleAnalysis() {
    const parsedJob = buildJobProfileFromText(labJd);
    setLabRequirements(parsedJob.requirements);
    setLabWarnings(parsedJob.warnings);
    if (!parsedJob.requirements.length) {
      setLabResult(null);
      return;
    }
    setLabResult(analyzeCandidate(parsedJob, {
      id: "CUSTOM-01",
      name: "自定义测试候选人",
      role: "用户输入文本",
      resumeText: labResume,
    }) as Candidate);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">H</span>
          <div>
            <strong>HireLens</strong>
            <span>AI 招聘助手</span>
          </div>
        </div>

        <nav aria-label="主导航">
          <button className="nav-item active"><span>▦</span>招聘项目</button>
          <button className="nav-item"><span>◇</span>岗位模板</button>
          <button className="nav-item"><span>◫</span>评估中心</button>
          <button className="nav-item"><span>⚙</span>系统设置</button>
        </nav>

        <div className="privacy-card">
          <span className="privacy-icon">✓</span>
          <div>
            <strong>测试数据模式</strong>
            <p>当前页面仅使用人工构造、脱敏的候选人数据。</p>
          </div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <div className="eyebrow">招聘项目 / EMBEDDED-01</div>
            <h1>嵌入式工程师招聘分析</h1>
          </div>
          <div className="top-actions">
            <label className="mode-switch">
              <span>分析模式</span>
              <select value={mode} onChange={(event) => setMode(event.target.value as typeof mode)}>
                <option>规则模式</option>
                <option disabled>混合模式（待接入）</option>
              </select>
            </label>
            <button className="secondary-button">导出报告</button>
            <button className="primary-button" onClick={() => setActiveView("规则实验室")}>＋ 输入测试简历</button>
          </div>
        </header>

        <section className="progress-strip" aria-label="分析进度">
          <div className="progress-step done"><span>1</span><div><b>岗位画像</b><small>已确认 8 项要求</small></div></div>
          <i />
          <div className="progress-step done"><span>2</span><div><b>简历解析</b><small>5 份测试简历</small></div></div>
          <i />
          <div className="progress-step current"><span>3</span><div><b>匹配分析</b><small>{mode}</small></div></div>
          <i />
          <div className="progress-step"><span>4</span><div><b>人工复核</b><small>待完成</small></div></div>
        </section>

        <section className="summary-grid">
          <article className="metric-card">
            <span>候选人</span><strong>5</strong><small>人工构造测试数据</small>
          </article>
          <article className="metric-card">
            <span>推荐复筛</span><strong>{recommendedCount}</strong><small>规则引擎结果，仅供人工参考</small>
          </article>
          <article className="metric-card">
            <span>待核验项</span><strong>{verifyCount}</strong><small>已转为面试问题</small>
          </article>
          <article className="metric-card accent">
            <span>证据覆盖率</span><strong>{evidenceCoverage}%</strong><small>规则运行后有原文定位的判断</small>
          </article>
        </section>

        <div className="view-tabs" role="tablist">
          {(["候选人", "岗位画像", "评估记录", "规则实验室"] as const).map((view) => (
            <button
              key={view}
              className={activeView === view ? "active" : ""}
              onClick={() => setActiveView(view)}
              role="tab"
            >
              {view}
            </button>
          ))}
        </div>

        {activeView === "候选人" && (
          <section className="content-grid">
            <article className="panel candidate-panel">
              <div className="panel-header">
                <div>
                  <h2>候选人排序</h2>
                  <p>分数用于辅助排序，不代表录用结论</p>
                </div>
                <button className="ghost-button">横向对比</button>
              </div>
              <div className="candidate-table">
                <div className="table-head">
                  <span>候选人</span><span>匹配</span><span>必备项</span><span>主要风险</span>
                </div>
                {candidates.map((candidate) => (
                  <button
                    key={candidate.id}
                    className={`candidate-row ${selectedId === candidate.id ? "selected" : ""}`}
                    onClick={() => setSelectedId(candidate.id)}
                  >
                    <span className="candidate-name">
                      <b>{candidate.name}</b>
                      <small>{candidate.role} · {candidate.status}</small>
                    </span>
                    <span className="score">{candidate.score}</span>
                    <span>{candidate.required}</span>
                    <span className="risk">{candidate.risk}</span>
                  </button>
                ))}
              </div>
            </article>

            <article className="panel detail-panel">
              <div className="candidate-hero">
                <div>
                  <span className="test-badge">测试候选人</span>
                  <h2>{selected.name}</h2>
                  <p>{selected.role} · 系统建议：{selected.status}</p>
                </div>
                <div className="score-ring" style={{ "--score": `${selected.score * 3.6}deg` } as React.CSSProperties}>
                  <div><strong>{selected.score}</strong><small>匹配分</small></div>
                </div>
              </div>

              <div className="evidence-list">
                {evidence.map((item, index) => (
                  <details key={`${selectedId}-${index}`} open={index === 0}>
                    <summary>
                      <div>
                        <b>{item.requirement}</b>
                        <small>{item.type}</small>
                      </div>
                      <span className={statusClass[item.state]}>{item.state}</span>
                    </summary>
                    <div className="evidence-body">
                      <div className="evidence-quote">
                        <span>简历证据</span>
                        <p>{item.evidence}</p>
                      </div>
                      <div className="reason-row">
                        <span>判断理由</span>
                        <p>{item.reason}</p>
                      </div>
                      <div className="question-box">
                        <span>建议面试核验</span>
                        <p>{item.question}</p>
                        <button>复制问题</button>
                      </div>
                      <div className="feedback-row">
                        <span>这个判断准确吗？</span>
                        <button>准确</button><button>不准确</button><button>待面试确认</button>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </article>
          </section>
        )}

        {activeView === "岗位画像" && (
          <section className="panel profile-view">
            <div className="panel-header">
              <div><h2>岗位画像</h2><p>由原始 JD 提取，确认后才用于候选人排序</p></div>
              <button className="primary-button">确认并重新分析</button>
            </div>
            {[
              ["必备项", "C/C++ 嵌入式项目经验", "15%"],
              ["必备项", "Linux 开发与调试", "15%"],
              ["核心能力", "SPI / I²C 等外设与板级调试", "10%"],
              ["核心能力", "问题定位与工程交付", "10%"],
              ["加分项", "机器人或智能硬件行业经验", "5%"],
            ].map(([type, text, weight]) => (
              <div className="requirement-row" key={text}>
                <span>{type}</span><b>{text}</b><button>{weight}⌄</button>
              </div>
            ))}
            <div className="clarify-box">
              <strong>需要业务负责人确认</strong>
              <p>Linux 经验更关注驱动开发、应用开发，还是系统移植？</p>
            </div>
          </section>
        )}

        {activeView === "评估记录" && (
          <section className="panel evaluation-view">
            <div className="panel-header">
              <div><h2>模型评估记录</h2><p>结果来自 v0.1 人工构造测试集，不代表真实业务准确率</p></div>
              <span className="version-badge">Schema v0.1</span>
            </div>
            <div className="evaluation-grid">
              <div><span>测试判断</span><strong>20</strong><small>两类岗位</small></div>
              <div><span>状态一致</span><strong>{evaluationSummary.correct_cases}/{evaluationSummary.total_cases}</strong><small>当前人工构造集</small></div>
              <div><span>单条耗时</span><strong>{evaluationSummary.average_ms_per_case} ms</strong><small>本地规则基线</small></div>
              <div><span>模型成本</span><strong>0 元</strong><small>未调用大模型</small></div>
            </div>
            <div className="notice">
              <strong>规则基线已运行，但不能把当前结果解释为真实业务准确率。</strong>
              <p>20 条用例与规则在同一开发周期内设计，存在过拟合风险。下一轮需要盲测样本、第二标注者和大模型对照实验。</p>
            </div>
          </section>
        )}

        {activeView === "规则实验室" && (
          <section className="panel lab-view">
            <div className="panel-header">
              <div>
                <h2>规则匹配实验室</h2>
                <p>输入脱敏测试文本，浏览器本地计算；内容不会上传或保存。</p>
              </div>
              <span className="version-badge">Rule baseline v0.1</span>
            </div>
            <div className="lab-grid">
              <div className="lab-input">
                <label>
                  岗位 JD
                  <textarea
                    value={labJd}
                    onChange={(event) => setLabJd(event.target.value)}
                    rows={6}
                    placeholder="请粘贴岗位描述"
                  />
                </label>
                <label>
                  脱敏简历文本
                  <textarea
                    value={labResume}
                    onChange={(event) => setLabResume(event.target.value)}
                    rows={9}
                    placeholder="请粘贴脱敏后的测试简历文本"
                  />
                </label>
                <button className="primary-button analyze-button" onClick={runRuleAnalysis}>
                  运行规则分析
                </button>
                <p className="lab-hint">请勿输入真实候选人的姓名、电话、邮箱或其他未授权信息。</p>
                {!!labRequirements.length && (
                  <div className="parsed-requirements">
                    <strong>已识别 {labRequirements.length} 项要求</strong>
                    {labRequirements.map((item) => (
                      <span key={item.text}>{item.text} · {item.weight}%</span>
                    ))}
                  </div>
                )}
                {labWarnings.map((warning) => (
                  <p className="lab-warning" key={warning}>{warning}</p>
                ))}
              </div>

              <div className="lab-output">
                {!labResult ? (
                  <div className="empty-result">
                    <strong>等待分析</strong>
                    <p>运行后将输出匹配分、逐项证据、风险和面试核验问题。</p>
                  </div>
                ) : (
                  <>
                    <div className="lab-score">
                      <div>
                        <span>规则匹配分</span>
                        <strong>{labResult.score}</strong>
                      </div>
                      <div>
                        <span>系统建议</span>
                        <b>{labResult.status}</b>
                      </div>
                      <div>
                        <span>主要风险</span>
                        <b>{labResult.risk}</b>
                      </div>
                    </div>
                    <div className="lab-matches">
                      {labResult.matches.map((item) => {
                        const state = STATUS_LABELS[item.status] as string;
                        return (
                          <article key={item.requirementId}>
                            <header>
                              <b>{item.requirement}</b>
                              <span className={statusClass[state]}>{state}</span>
                            </header>
                            <p><strong>证据：</strong>{item.evidence}</p>
                            <p><strong>理由：</strong>{item.reason}</p>
                            <p><strong>核验：</strong>{item.question}</p>
                            <small>规则置信度 {Math.round(item.confidence * 100)}%</small>
                          </article>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
