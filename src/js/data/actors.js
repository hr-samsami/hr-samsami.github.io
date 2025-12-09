// Role cards data - detailed information about each actor
export const ROLE_CARDS = [
  {
    id: 1,
    name: "SME Employer",
    subtitle: "Small Construction Company (≤50 employees)",
    color: "#E07A5F",
    icon: "🏗️",
    responsibilities: [
      "Hire entry-level workers",
      "Provide practical on-site supervision",
      "Participate in training collaborations"
    ],
    strengths: [
      "Flexible",
      "Close to workers",
      "Can hire faster"
    ],
    weaknesses: [
      "Very limited structural funding",
      "Risk-averse",
      "Cannot pre-finance training",
      "Over-dependent on subsidies"
    ],
    fundingPower: {
      structural: 20,
      temporary: 60
    },
    behaviorPattern: [
      "Wants workers NOW",
      "Avoids training costs",
      "Expects others (UWV, Educators, Sector Bodies) to fund training"
    ],
    systemInfluence: "Medium — important for hiring, weak in funding"
  },
  {
    id: 2,
    name: "Large Employer",
    subtitle: "Big Construction/Installation Firm (≥250 employees)",
    color: "#6366f1",
    icon: "🏢",
    responsibilities: [
      "Provide stable employment",
      "Influence hiring standards",
      "Potential to invest in training programs"
    ],
    strengths: [
      "High structural funding",
      "Strong HR capacity",
      "Can open large training capacity"
    ],
    weaknesses: [
      "Very strict hiring criteria",
      "Slower internal decision-making",
      "Often refuses low-skilled trainees"
    ],
    fundingPower: {
      structural: 90,
      temporary: 30
    },
    behaviorPattern: [
      "Wants \"experience\"",
      "Expects ready workers",
      "Avoids subsidized trainees unless others co-invest"
    ],
    systemInfluence: "High — their decisions shape the entire ecosystem"
  },
  {
    id: 3,
    name: "Sector Organisation",
    subtitle: "WijTechniek / Bouwend Nederland / Techniek Nederland",
    color: "#14b8a6",
    icon: "🤝",
    responsibilities: [
      "Coordinate sector-wide initiatives",
      "Support companies with funding schemes",
      "Promote long-term skills development"
    ],
    strengths: [
      "Moderate structural funding",
      "Ability to build coalitions",
      "Influence across many employers"
    ],
    weaknesses: [
      "Cannot enforce participation",
      "Funding is fragmented",
      "Slow governance processes"
    ],
    fundingPower: {
      structural: 60,
      temporary: 60
    },
    behaviorPattern: [
      "Strategic thinker",
      "Keeps ecosystem view",
      "Hesitant to support short-term emergencies"
    ],
    systemInfluence: "Medium-High — shapes strategic conditions"
  },
  {
    id: 4,
    name: "Servicepunt",
    subtitle: "Intermediary Matching Organization",
    color: "#eab308",
    icon: "🔗",
    responsibilities: [
      "Match jobseekers to employers",
      "Coordinate training pathways",
      "Help employers find candidates"
    ],
    strengths: [
      "Strong connector role",
      "High engagement with jobseekers",
      "Knows both sides (education & employers)"
    ],
    weaknesses: [
      "Almost no structural funding",
      "Dependent on temporary grants",
      "Cannot require employers to hire"
    ],
    fundingPower: {
      structural: 20,
      temporary: 85
    },
    behaviorPattern: [
      "Very proactive",
      "Can match many candidates quickly",
      "But limited power to influence funding or hiring"
    ],
    systemInfluence: "Medium — connector role but lacks authority"
  },
  {
    id: 5,
    name: "UWV (Government)",
    subtitle: "Labour Agency (Subsidies & Regulations)",
    color: "#3b82f6",
    icon: "🏛️",
    responsibilities: [
      "Release subsidies and retraining support",
      "Regulate eligibility",
      "Promote employment entry"
    ],
    strengths: [
      "High structural funding",
      "Authority",
      "Can stimulate training or hiring through incentives"
    ],
    weaknesses: [
      "Bureaucratic",
      "Slow rule changes",
      "Funding often temporary"
    ],
    fundingPower: {
      structural: 90,
      temporary: 90
    },
    behaviorPattern: [
      "Wants fast placement",
      "Uses subsidies to influence other actors",
      "Risk of sudden rule changes"
    ],
    systemInfluence: "Very High — controls funding environment"
  },
  {
    id: 6,
    name: "Educator",
    subtitle: "Education & Training Provider",
    color: "#22c55e",
    icon: "🎓",
    responsibilities: [
      "Train workers",
      "Provide instruction",
      "Maintain quality standards"
    ],
    strengths: [
      "Training expertise",
      "Can scale capacity with funding",
      "Creates skilled workers"
    ],
    weaknesses: [
      "Dependent on temporary funding",
      "Slow to open new programs",
      "Instructor shortages"
    ],
    fundingPower: {
      structural: 40,
      temporary: 60
    },
    behaviorPattern: [
      "Wants stable funding",
      "Cannot expand without structural backing"
    ],
    systemInfluence: "Medium-High — they produce workforce supply"
  }
];

// Simplified actors for gameplay
export const ACTORS = {
  SME: {
    id: "SME",
    name: "Small Employer (SME)",
    icon: "🏗️",
    color: "#f97316",
    description: "Low budget, high labor need, risk-averse, dependent on subsidies",
  },
  LARGE: {
    id: "LARGE",
    name: "Large Employer",
    icon: "🏢",
    color: "#6366f1",
    description: "Financially strong, high standards, slow to collaborate",
  },
  EDUCATOR: {
    id: "EDUCATOR",
    name: "Educator",
    icon: "🎓",
    color: "#22c55e",
    description: "Depends on government funding, slow to scale training",
  },
  INTERMEDIARY: {
    id: "INTERMEDIARY",
    name: "Servicepunt (Intermediary)",
    icon: "🔗",
    color: "#eab308",
    description: "Connects jobseekers → training → employers, project-funded",
  },
  UWV: {
    id: "UWV",
    name: "UWV / Government",
    icon: "🏛️",
    color: "#3b82f6",
    description: "Controls subsidies & regulations, bureaucratic",
  },
  SECTOR: {
    id: "SECTOR",
    name: "Sector Organisation",
    icon: "🤝",
    color: "#14b8a6",
    description: "Coordinates sector-wide initiatives, moderate funding, strategic thinker",
  },
};
