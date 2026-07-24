export const embeddedJob = {
  id: "EMBEDDED-01",
  title: "嵌入式工程师",
  rawJd: "负责嵌入式软件开发；具备 C/C++ 项目经验，熟悉 Linux 开发与调试；具备 SPI、I²C 外设和硬件调试经验；三年以上相关经验；可在北京到岗。",
  requirements: [
    { id: "EMB-C", ruleId: "c_cpp", text: "具备 C/C++ 嵌入式项目经验", type: "required", weight: 25 },
    { id: "EMB-LINUX", ruleId: "linux", text: "熟悉 Linux 开发与调试", type: "required", weight: 20 },
    { id: "EMB-DRIVER", ruleId: "driver", text: "具备 SPI / I²C 等外设经验", type: "core", weight: 20 },
    { id: "EMB-DEBUG", ruleId: "hardware_debug", text: "具备硬件调试与问题定位能力", type: "core", weight: 20 },
    { id: "EMB-LOCATION", ruleId: "beijing", text: "可在北京到岗", type: "bonus", weight: 15 },
  ],
};

export const embeddedCandidates = [
  {
    id: "E01",
    name: "测试候选人 E01",
    role: "嵌入式软件",
    resumeText: "项目经历：使用 C 语言开发嵌入式传感器采集模块，并负责接口联调。项目运行于 Linux 环境，使用交叉编译工具链。",
  },
  {
    id: "E02",
    name: "测试候选人 E02",
    role: "Python 应用",
    resumeText: "项目经历：使用 Python 开发数据处理工具。完成基于 STM32 的单片机课程设计，未参与量产或工程交付。",
  },
  {
    id: "E03",
    name: "测试候选人 E03",
    role: "驱动开发",
    resumeText: "项目经历：使用 C++ 独立完成 SPI 与 I2C 驱动开发及板级调试。基于 Yocto 完成 Linux 系统裁剪、交叉编译与镜像部署。",
  },
  {
    id: "E04",
    name: "测试候选人 E04",
    role: "单片机开发",
    resumeText: "相关工作经历 1 年。技能：精通 C 语言。完成单片机课程项目。",
  },
  {
    id: "E05",
    name: "测试候选人 E05",
    role: "硬件测试",
    resumeText: "技能：了解硬件调试，使用过示波器。协助完成传感器测试，未说明具体故障定位任务。",
  },
];

export const evaluationCandidates = {
  E01: embeddedCandidates[0].resumeText,
  E02: embeddedCandidates[1].resumeText,
  E03: embeddedCandidates[2].resumeText,
  E04: embeddedCandidates[3].resumeText,
  E05: embeddedCandidates[4].resumeText,
  A01: "项目经历：实现 RAG 向量检索、重排和答案引用链路。使用单 Agent 工具调用完成搜索 Demo，未涉及多步骤编排。",
  A02: "项目经历：基于 Python 和 FastAPI 完成接口服务。建立 Prompt 测试集，记录 badcase 并复盘。",
  A03: "技能：RAG、LangChain。项目经历未包含测试集、模型评估或评估指标。",
  A04: "相关经历 1 年。2024.01—2024.12 项目一；2024.03—2024.12 项目二，两个项目同期重叠。与算法和业务团队共同确认验收标准并推动交付。",
  A05: "使用 Dify 低代码平台搭建单 Agent Demo，完成工具调用，但尚未部署。",
};

