"use client";

import { useMemo, useState } from "react";

type Candidate = {
  id: string;
  name: string;
  role: string;
  score: number;
  required: string;
  risk: string;
  status: "推荐复筛" | "需要核验" | "暂不优先";
};

const candidates: Candidate[] = [
  { id: "E01", name: "测试候选人 E01", role: "嵌入式软件", score: 82, required: "4/5", risk: "Linux 深度", status: "推荐复筛" },
  { id: "E03", name: "测试候选人 E03", role: "驱动开发", score: 78, required: "4/5", risk: "交付规模", status: "推荐复筛" },
  { id: "E05", name: "测试候选人 E05", role: "硬件测试", score: 64, required: "3/5", risk: "调试职责", status: "需要核验" },
  { id: "E04", name: "测试候选人 E04", role: "单片机开发", score: 57, required: "2/5", risk: "工作年限", status: "需要核验" },
  { id: "E02", name: "测试候选人 E02", role: "Python 应用", score: 39, required: "1/5", risk: "技术栈差异", status: "暂不优先" },
];

const evidenceByCandidate: Record<string, Array<{
  requirement: string;
  type: string;
  state: "满足" | "部分满足" | "未发现" | "待核验";
  evidence: string;
  reason: string;
  question: string;
}>> = {
  E01: [
    {
      requirement: "具备 C/C++ 嵌入式项目经验",
      type: "必备项 · 15%",
      state: "满足",
      evidence: "“使用 C 语言完成传感器采集模块，并负责接口联调。”",
      reason: "存在直接的 C 语言嵌入式项目证据。",
      question: "请介绍采集模块中最复杂的一次故障定位过程。",
    },
    {
      requirement: "熟悉 Linux 开发与调试",
      type: "必备项 · 15%",
      state: "部分满足",
      evidence: "“项目运行于 Linux 环境，使用交叉编译工具链。”",
      reason: "证明使用过 Linux，但未明确涉及驱动、系统移植或性能调试。",
      question: "你在 Linux 环境中具体负责了哪些开发和调试工作？",
    },
    {
      requirement: "具备 SPI / I²C 等外设经验",
      type: "核心能力 · 10%",
      state: "待核验",
      evidence: "“完成多个传感器接口联调。”",
      reason: "描述未说明具体总线和个人职责。",
      question: "请说明使用过的通信总线、调试工具以及遇到的时序问题。",
    },
  ],
  E03: [
    {
      requirement: "具备 C/C++ 嵌入式项目经验",
      type: "必备项 · 15%",
      state: "满足",
      evidence: "“独立完成 SPI 与 I²C 驱动开发及板级调试。”",
      reason: "存在直接的驱动开发与调试证据。",
      question: "驱动开发过程中如何处理异常和超时？",
    },
    {
      requirement: "熟悉 Linux 开发与调试",
      type: "必备项 · 15%",
      state: "满足",
      evidence: "“基于 Yocto 完成系统裁剪、交叉编译与镜像部署。”",
      reason: "证据覆盖系统构建和部署链路。",
      question: "系统裁剪时如何验证依赖完整性？",
    },
  ],
};

const statusClass: Record<string, string> = {
  满足: "state met",
  部分满足: "state partial",
  未发现: "state missing",
  待核验: "state verify",
};

export default function Home() {
  const [selectedId, setSelectedId] = useState("E01");
  const [mode, setMode] = useState<"混合模式" | "规则模式">("混合模式");
  const [activeView, setActiveView] = useState<"候选人" | "岗位画像" | "评估记录">("候选人");
  const selected = useMemo(
    () => candidates.find((candidate) => candidate.id === selectedId) ?? candidates[0],
    [selectedId],
  );
  const evidence = evidenceByCandidate[selectedId] ?? [
    {
      requirement: "核心岗位要求",
      type: "必备项",
      state: "未发现" as const,
      evidence: "当前测试简历中未找到可引用证据。",
      reason: "未发现不等于候选人不具备，需要人工复核。",
      question: "请结合具体项目说明相关经验。",
    },
  ];

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
                <option>混合模式</option>
                <option>规则模式</option>
              </select>
            </label>
            <button className="secondary-button">导出报告</button>
            <button className="primary-button">＋ 导入测试简历</button>
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
            <span>推荐复筛</span><strong>2</strong><small>仅供人工参考</small>
          </article>
          <article className="metric-card">
            <span>待核验项</span><strong>7</strong><small>已转为面试问题</small>
          </article>
          <article className="metric-card accent">
            <span>证据覆盖率</span><strong>86%</strong><small>有原文定位的判断</small>
          </article>
        </section>

        <div className="view-tabs" role="tablist">
          {(["候选人", "岗位画像", "评估记录"] as const).map((view) => (
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
              <div><span>结构校验</span><strong>20/20</strong><small>示例目标</small></div>
              <div><span>已定义错误类型</span><strong>12</strong><small>E01—E12</small></div>
              <div><span>敏感属性参与</span><strong>0</strong><small>设计约束</small></div>
            </div>
            <div className="notice">
              <strong>当前原型尚未接入真实大模型。</strong>
              <p>下一阶段将实现规则基线，再配置模型接口，对比证据正确率、无依据判断率、耗时与成本。</p>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
