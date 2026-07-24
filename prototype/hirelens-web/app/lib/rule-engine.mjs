const ACTION_WORDS = [
  "开发", "实现", "完成", "负责", "搭建", "建立", "设计", "调试", "部署",
  "推动", "确认", "交付", "复盘", "优化", "裁剪", "编译", "联调",
];

const SKILL_ONLY_WORDS = ["技能", "熟悉", "精通", "了解", "掌握", "使用过"];

export const RULE_LIBRARY = {
  c_cpp: {
    label: "C/C++ 项目经验",
    aliases: ["c++", "c语言", "c 语言"],
    strong: ["嵌入式", "固件", "传感器", "采集模块"],
    question: "请结合一个具体项目说明你使用 C/C++ 完成的模块、个人职责和交付结果。",
  },
  linux: {
    label: "Linux 开发与调试",
    aliases: ["linux", "yocto", "内核", "kernel"],
    strong: ["yocto", "驱动", "系统裁剪", "镜像部署", "内核", "性能调试"],
    weak: ["linux 环境", "linux环境", "交叉编译"],
    question: "请说明你在 Linux 环境中具体负责的开发、调试或系统工作。",
  },
  embedded: {
    label: "嵌入式工程经验",
    aliases: ["嵌入式", "stm32", "单片机", "mcu", "固件"],
    strong: ["量产", "交付", "上线", "商用"],
    weak: ["课程", "demo", "原型"],
    question: "该嵌入式项目是否完成真实交付？你承担了哪些工程化工作？",
  },
  driver: {
    label: "驱动开发经验",
    aliases: ["驱动", "spi", "i2c", "i²c"],
    strong: ["驱动开发", "板级调试", "spi", "i2c", "i²c"],
    question: "请说明一次驱动开发中的异常处理、时序调试和验证过程。",
  },
  c_language: {
    label: "C 语言能力",
    aliases: ["c语言", "c 语言", "c++"],
    strong: ["模块", "开发", "实现", "固件", "嵌入式"],
    question: "请用一个可验证的项目说明你的 C 语言能力，而不只是技能熟练度。",
  },
  hardware_debug: {
    label: "硬件调试经验",
    aliases: ["硬件调试", "示波器", "逻辑分析仪", "万用表", "板级调试"],
    strong: ["故障定位", "板级调试", "时序", "信号完整性"],
    weak: ["使用过示波器", "了解硬件调试"],
    question: "请说明你使用调试仪器定位并解决过的具体硬件问题。",
  },
  beijing: {
    label: "北京到岗",
    aliases: ["北京", "到岗", "工作地点"],
    strong: ["可到岗", "接受北京", "北京工作"],
    question: "你是否接受在北京工作，预计何时可以到岗？",
  },
  rag: {
    label: "RAG 项目经验",
    aliases: ["rag", "向量检索", "知识库", "检索增强"],
    strong: ["向量检索", "重排", "引用链路", "召回", "知识库"],
    question: "请说明 RAG 项目的检索、重排、引用和效果评估链路。",
  },
  agent_workflow: {
    label: "Agent 工作流",
    aliases: ["agent", "智能体", "工具调用"],
    strong: ["多步骤", "编排", "状态管理", "多agent", "多 agent"],
    weak: ["单agent", "单 agent", "工具调用", "demo"],
    question: "请说明 Agent 的任务拆解、状态管理、工具调用与异常处理机制。",
  },
  prompt_eval: {
    label: "Prompt 评估",
    aliases: ["prompt", "提示词"],
    strong: ["测试集", "badcase", "评估", "复盘", "指标"],
    question: "请说明 Prompt 测试集、评价标准以及 badcase 迭代方法。",
  },
  python: {
    label: "Python 能力",
    aliases: ["python", "fastapi", "django", "flask"],
    strong: ["服务", "接口", "开发", "实现", "fastapi"],
    question: "请介绍一个 Python 工程项目的架构、接口和部署方式。",
  },
  model_eval: {
    label: "模型评估",
    aliases: ["模型评估", "测试集", "准确率", "召回率", "badcase"],
    strong: ["测试集", "指标", "准确率", "召回率", "badcase"],
    question: "请说明你如何建立模型评测集、指标和错误分析闭环。",
  },
  collaboration: {
    label: "跨团队协作",
    aliases: ["跨团队", "算法团队", "业务团队", "协作", "对接"],
    strong: ["验收标准", "推动交付", "共同确认", "跨团队"],
    question: "请说明一次跨团队目标不一致时，你如何确认标准并推动交付。",
  },
  agent_project: {
    label: "Agent 项目经验",
    aliases: ["agent", "智能体", "dify", "coze"],
    strong: ["部署", "上线", "工作流", "编排", "状态管理"],
    weak: ["低代码", "demo", "未部署", "单 agent", "单agent"],
    question: "该 Agent 项目是否部署和真实使用？你负责了哪些关键设计？",
  },
  gender: {
    label: "候选人性别",
    sensitive: true,
    aliases: ["性别", "男", "女"],
    question: "该属性与岗位能力无关，不应采集或参与匹配。",
  },
};

export const STATUS_LABELS = {
  met: "满足",
  partial: "部分满足",
  not_found: "未发现",
  conflict: "矛盾",
  verify: "待核验",
};

const JOB_RULE_DETECTORS = [
  { ruleId: "c_cpp", pattern: /(c\+\+|c语言|c 语言)/i, type: "required", baseWeight: 20 },
  { ruleId: "linux", pattern: /(linux|yocto|内核|kernel)/i, type: "required", baseWeight: 18 },
  { ruleId: "driver", pattern: /(驱动|spi|i2c|i²c)/i, type: "core", baseWeight: 16 },
  { ruleId: "hardware_debug", pattern: /(硬件调试|板级调试|示波器|逻辑分析仪)/i, type: "core", baseWeight: 14 },
  { ruleId: "rag", pattern: /(rag|向量检索|知识库|检索增强)/i, type: "required", baseWeight: 20 },
  { ruleId: "agent_workflow", pattern: /(agent|智能体).*(工作流|编排|工具调用)|(工作流|编排).*(agent|智能体)/i, type: "core", baseWeight: 18 },
  { ruleId: "prompt_eval", pattern: /(prompt|提示词).*(评估|测试|badcase)|(评估|测试).*(prompt|提示词)/i, type: "core", baseWeight: 16 },
  { ruleId: "python", pattern: /(python|fastapi|django|flask)/i, type: "required", baseWeight: 18 },
  { ruleId: "model_eval", pattern: /(模型评估|测试集|准确率|召回率|badcase)/i, type: "core", baseWeight: 14 },
  { ruleId: "collaboration", pattern: /(跨团队|协作|对接业务|推动交付)/i, type: "bonus", baseWeight: 10 },
  { ruleId: "beijing", pattern: /(北京).*(到岗|工作|办公)|(到岗|工作地点).*(北京)/i, type: "bonus", baseWeight: 10 },
];

const CHINESE_NUMBER = { 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6 };

const STATUS_SCORE = {
  met: 1,
  partial: 0.65,
  verify: 0.4,
  not_found: 0,
  conflict: 0,
};

function normalize(text) {
  return String(text ?? "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[，。；：、]/g, " ");
}

export function buildJobProfileFromText(rawJd) {
  const text = String(rawJd ?? "").trim();
  const detected = JOB_RULE_DETECTORS
    .filter((item) => item.pattern.test(text))
    .map((item, index) => ({
      id: `AUTO-${String(index + 1).padStart(2, "0")}`,
      ruleId: item.ruleId,
      text: RULE_LIBRARY[item.ruleId].label,
      type: item.type,
      baseWeight: item.baseWeight,
    }));

  const yearMatch = text.match(/([1-6一二两三四五六])\s*年以上/);
  if (yearMatch) {
    const requiredYears = Number(yearMatch[1]) || CHINESE_NUMBER[yearMatch[1]];
    detected.push({
      id: `AUTO-${String(detected.length + 1).padStart(2, "0")}`,
      ruleId: detected.some((item) => ["rag", "agent_workflow", "python"].includes(item.ruleId))
        ? "agent_project"
        : "embedded",
      text: `${requiredYears} 年以上相关经验`,
      type: "required",
      baseWeight: 18,
      requiredYears,
    });
  }

  const totalBaseWeight = detected.reduce((sum, item) => sum + item.baseWeight, 0) || 1;
  let assignedWeight = 0;
  const requirements = detected.map((item, index) => {
    const weight = index === detected.length - 1
      ? 100 - assignedWeight
      : Math.round((item.baseWeight / totalBaseWeight) * 100);
    assignedWeight += weight;
    const { baseWeight, ...requirement } = item;
    return { ...requirement, weight };
  });

  const warnings = [];
  if (/(性别|男性|女性|婚育|婚姻|民族)/.test(text)) {
    warnings.push("检测到与岗位能力无关的敏感属性，已排除出匹配要求。");
  }
  if (!requirements.length) {
    warnings.push("当前规则库未识别出可计算的岗位要求，需要人工结构化或使用语义模型。");
  }

  return {
    id: "CUSTOM-JOB",
    title: "自定义岗位",
    rawJd: text,
    requirements,
    warnings,
  };
}

function includesAny(text, terms = []) {
  return terms.some((term) => text.includes(normalize(term)));
}

function sentences(text) {
  return String(text ?? "")
    .split(/[\n。；;！!？?]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function findEvidence(resumeText, terms = []) {
  const matched = sentences(resumeText).find((sentence) =>
    includesAny(normalize(sentence), terms),
  );
  return matched ? `“${matched}”` : "当前简历中未找到可引用证据。";
}

function onlySkillClaim(sentence) {
  const normalized = normalize(sentence);
  return (
    includesAny(normalized, SKILL_ONLY_WORDS) &&
    !includesAny(normalized, ACTION_WORDS)
  );
}

function analyzeYears(resumeText, requiredYears) {
  const normalized = normalize(resumeText);
  const explicit = [...normalized.matchAll(/(\d+(?:\.\d+)?)\s*年/g)].map((item) =>
    Number(item[1]),
  );
  if (!explicit.length) {
    return {
      status: "not_found",
      evidence: "当前简历中未找到可验证的相关工作年限。",
      confidence: 0.86,
      reason: `岗位要求至少 ${requiredYears} 年相关经验，简历没有明确年限证据。`,
    };
  }
  const years = Math.max(...explicit);
  const conflict = years < requiredYears;
  return {
    status: conflict ? "conflict" : "met",
    evidence: findEvidence(resumeText, ["年"]),
    confidence: 0.96,
    reason: conflict
      ? `简历明确写明约 ${years} 年，低于岗位要求的 ${requiredYears} 年。`
      : `简历明确写明约 ${years} 年，达到岗位年限要求。`,
  };
}

export function analyzeRequirement(requirement, resumeText) {
  const rule = RULE_LIBRARY[requirement.ruleId];
  if (!rule) {
    return {
      requirementId: requirement.id,
      requirement: requirement.text,
      type: requirement.type,
      weight: requirement.weight,
      status: "verify",
      evidence: "当前规则库尚未覆盖该要求。",
      confidence: 0.3,
      reason: "需要人工复核或交由语义模型判断。",
      question: `请结合具体项目说明：${requirement.text}`,
    };
  }

  if (rule.sensitive) {
    return {
      requirementId: requirement.id,
      requirement: requirement.text,
      type: requirement.type,
      weight: requirement.weight,
      status: "not_found",
      evidence: "敏感属性不读取、不推断、不参与评分。",
      confidence: 1,
      reason: "该属性与岗位能力无关，规则引擎主动忽略。",
      question: rule.question,
    };
  }

  if (requirement.requiredYears) {
    const yearResult = analyzeYears(resumeText, requirement.requiredYears);
    return {
      requirementId: requirement.id,
      requirement: requirement.text,
      type: requirement.type,
      weight: requirement.weight,
      ...yearResult,
      question: rule.question ?? `请核验与“${requirement.text}”相关的实际年限。`,
    };
  }

  const normalized = normalize(resumeText);
  const hasAlias = includesAny(normalized, rule.aliases);
  const evidence = findEvidence(resumeText, [...(rule.strong ?? []), ...rule.aliases]);
  const evidenceRaw = evidence.replace(/[“”]/g, "");
  const evidenceNormalized = normalize(evidenceRaw);
  const hasStrong = includesAny(evidenceNormalized, rule.strong);
  const hasWeak = includesAny(evidenceNormalized, rule.weak);
  const hasAction = includesAny(evidenceNormalized, ACTION_WORDS);
  const skillOnly = onlySkillClaim(evidenceRaw);
  const negatedOnly =
    /(未包含|没有|未涉及|尚无|不具备|无相关)/.test(evidenceNormalized) &&
    !hasAction;

  let status = "not_found";
  let confidence = 0.88;
  let reason = "简历中未发现与该要求相关的可定位证据；未发现不等于不具备。";

  if (hasAlias && negatedOnly) {
    status = "not_found";
    confidence = 0.9;
    reason = "简历明确说明未包含相关经历，因此不把否定表达误判为能力证据。";
  } else if (hasAlias && hasWeak) {
    status = "partial";
    confidence = 0.84;
    reason = "存在相关经历，但项目深度、个人职责或交付结果不完整。";
  } else if (hasAlias && skillOnly) {
    status = "verify";
    confidence = 0.78;
    reason = "仅在技能或自我描述中出现关键词，没有项目行为和结果证据。";
  } else if (hasAlias && hasStrong && hasAction) {
    status = "met";
    confidence = 0.91;
    reason = "存在可定位的项目行为和直接能力证据。";
  } else if (hasAlias && hasAction) {
    status = "partial";
    confidence = 0.76;
    reason = "存在相关项目行为，但证据对岗位要求的覆盖不完整。";
  } else if (hasAlias) {
    status = "verify";
    confidence = 0.7;
    reason = "出现相关关键词，但缺少足以支持能力判断的上下文。";
  }

  return {
    requirementId: requirement.id,
    requirement: requirement.text,
    type: requirement.type,
    weight: requirement.weight,
    status,
    evidence: status === "not_found" ? "当前简历中未找到可引用证据。" : evidence,
    confidence,
    reason,
    question: rule.question,
  };
}

export function analyzeCandidate(jobProfile, candidate) {
  const matches = jobProfile.requirements.map((requirement) =>
    analyzeRequirement(requirement, candidate.resumeText),
  );
  const scoreBase = matches.reduce(
    (sum, item) => sum + item.weight * STATUS_SCORE[item.status],
    0,
  );
  const weightTotal = matches.reduce((sum, item) => sum + item.weight, 0) || 1;
  const overallScore = Math.round((scoreBase / weightTotal) * 100);
  const required = matches.filter((item) => item.type === "required");
  const requiredMet = required.filter((item) => item.status === "met").length;
  const conflicts = matches.filter((item) => item.status === "conflict");
  const uncertain = matches.filter((item) =>
    ["partial", "verify"].includes(item.status),
  );

  let recommendation = "暂不优先";
  if (!conflicts.length && overallScore >= 70 && requiredMet >= Math.ceil(required.length / 2)) {
    recommendation = "推荐复筛";
  } else if (overallScore >= 40 || uncertain.length) {
    recommendation = "需要核验";
  }

  const risk = conflicts[0]?.requirement
    ?? uncertain[0]?.requirement
    ?? matches.find((item) => item.status === "not_found")?.requirement
    ?? "暂无明显风险";

  return {
    ...candidate,
    score: overallScore,
    required: `${requiredMet}/${required.length}`,
    risk,
    status: recommendation,
    matches,
  };
}
