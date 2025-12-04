// Decision cards organized by event and actor
export const DECISION_CARDS = {
  // Event 1: Workforce Shock
  event1: {
    SME: [
      {
        id: 101,
        title: "Hire 10 Trained Workers",
        description: "You commit to hiring 10 trained candidates matched by the Servicepunt. You provide mentorship and pay training wages.",
        type: "cooperative",
        impact: { workersPlaced: 10, smeSatisfied: true },
        requires: "Training available and matching completed"
      },
      {
        id: 102,
        title: "Hire Fewer, Invest More",
        description: "You hire only 5 workers but invest extra in their long-term retention and development.",
        type: "cautious",
        impact: { workersPlaced: 5, retention: "high" },
        requires: "At least some training available"
      },
      {
        id: 103,
        title: "Delay Hiring",
        description: "You wait to see if subsidies improve. No hires this round.",
        type: "blocking",
        impact: { workersPlaced: 0, flowBlocked: true },
        requires: null
      }
    ],
    LARGE: [
      {
        id: 201,
        title: "Hire 20 Trained Workers",
        description: "You commit to hiring 20 trained candidates. You fund part of the training and coordinate with the Servicepunt.",
        type: "cooperative",
        impact: { workersPlaced: 20, largeSatisfied: true },
        requires: "Training capacity available"
      },
      {
        id: 202,
        title: "Hire 10 Workers + Fund Training",
        description: "You hire 10 workers but also contribute funding to expand training for future rounds.",
        type: "investment",
        impact: { workersPlaced: 10, trainingBoost: true },
        requires: "Educator has baseline capacity"
      },
      {
        id: 203,
        title: "Postpone All Hiring",
        description: "You freeze hiring due to uncertainty. No workers placed this round.",
        type: "blocking",
        impact: { workersPlaced: 0, flowBlocked: true },
        requires: null
      }
    ],
    EDUCATOR: [
      {
        id: 301,
        title: "Run Full Training Program",
        description: "You train 30 jobseekers using existing resources and partnerships. Training takes full capacity.",
        type: "cooperative",
        impact: { trainingCapacity: 30, trained: 30 },
        requires: "Servicepunt sends candidates, Employers commit to hire"
      },
      {
        id: 302,
        title: "Run Partial Training (20)",
        description: "You train only 20 candidates to reduce cost and risk.",
        type: "cautious",
        impact: { trainingCapacity: 20, trained: 20 },
        requires: "Servicepunt sends candidates"
      },
      {
        id: 303,
        title: "Suspend Training",
        description: "You pause training programs due to lack of commitment from employers.",
        type: "blocking",
        impact: { trainingCapacity: 0, trained: 0, flowBlocked: true },
        requires: null
      }
    ],
    INTERMEDIARY: [
      {
        id: 401,
        title: "Full Matching Support",
        description: "You match all available trained jobseekers to employer vacancies and provide onboarding support.",
        type: "cooperative",
        impact: { matchingActive: true, matchQuality: "high" },
        requires: "Educator trains candidates, Employers are hiring"
      },
      {
        id: 402,
        title: "Limited Matching",
        description: "You match only verified, high-certainty candidates. Slower but more reliable.",
        type: "cautious",
        impact: { matchingActive: true, matchQuality: "medium", matchLimit: 15 },
        requires: "Some training completed"
      },
      {
        id: 403,
        title: "Pause Matching Services",
        description: "You halt matching due to funding concerns or lack of employer interest.",
        type: "blocking",
        impact: { matchingActive: false, flowBlocked: true },
        requires: null
      }
    ],
    UWV: [
      {
        id: 501,
        title: "Send 30 Jobseekers to Training",
        description: "You refer 30 motivated jobseekers to the Educator and coordinate with the Servicepunt.",
        type: "cooperative",
        impact: { jobseekersSent: 30, pipeline: "full" },
        requires: "Training is available"
      },
      {
        id: 502,
        title: "Send 15 Pre-Screened Jobseekers",
        description: "You refer only 15 pre-screened candidates to improve success rates.",
        type: "cautious",
        impact: { jobseekersSent: 15, pipeline: "partial" },
        requires: "Some training capacity"
      },
      {
        id: 503,
        title: "Withhold Referrals",
        description: "You do not refer any jobseekers due to capacity concerns or policy constraints.",
        type: "blocking",
        impact: { jobseekersSent: 0, flowBlocked: true },
        requires: null
      }
    ],
    SECTOR: [
      {
        id: 601,
        title: "Activate TeamWork + OSR Subsidies",
        description: "You unlock O&O fund subsidies: TeamWork reimburses employers for onboarding zij-instromers (career switchers), and OSR provides per-employee training bonuses. You coordinate with ROC for fast-track programs.",
        type: "cooperative",
        impact: { subsidiesActive: true, employerReimbursement: 15, trainingSubsidy: true, zijInstroom: 20 },
        requires: "Employers commit to hiring, ROC has capacity"
      },
      {
        id: 602,
        title: "Launch Regional STO Partnership",
        description: "You co-fund a Sterk Techniekonderwijs (STO) regional program connecting vmbo/mbo schools with member companies. Slower to impact current crisis but builds sustainable pipeline.",
        type: "cautious",
        impact: { stoPartnership: true, pipelineBoost: 10, longTermCapacity: true },
        requires: "Schools willing to participate"
      },
      {
        id: 603,
        title: "Focus on Long-Term Strategy Only",
        description: "You decline emergency support, arguing that short-term fixes don't solve structural problems. You focus resources on 5-year workforce planning and sector forecasting instead.",
        type: "blocking",
        impact: { immediateSupport: false, strategicPlanning: true, flowBlocked: true },
        requires: null
      }
    ]
  },
  
  // Event 2: Funding Crisis
  event2: {
    SME: [
      {
        id: 111,
        title: "Contribute 3 Structural Tokens",
        description: "You invest 3 tokens from your reserves into the shared structural fund to sustain the ecosystem.",
        type: "cooperative",
        impact: { structuralContribution: 3, fundingType: "structural" },
        requires: null
      },
      {
        id: 112,
        title: "Contribute 1 Token + Lobby for Subsidies",
        description: "You contribute 1 token but focus effort on lobbying for restored subsidies.",
        type: "cautious",
        impact: { structuralContribution: 1, lobbyEffect: true },
        requires: null
      },
      {
        id: 113,
        title: "No Contribution",
        description: "You choose not to invest in the structural fund, prioritizing your own reserves.",
        type: "blocking",
        impact: { structuralContribution: 0 },
        requires: null
      }
    ],
    LARGE: [
      {
        id: 211,
        title: "Contribute 8 Structural Tokens",
        description: "You make a major investment in the structural fund, showing leadership in sustaining the ecosystem.",
        type: "cooperative",
        impact: { structuralContribution: 8, fundingType: "structural" },
        requires: null
      },
      {
        id: 212,
        title: "Contribute 4 Tokens + Conditional Support",
        description: "You contribute 4 tokens but require accountability measures from the Servicepunt.",
        type: "cautious",
        impact: { structuralContribution: 4, conditionalSupport: true },
        requires: null
      },
      {
        id: 213,
        title: "No Contribution",
        description: "You decline to invest, citing shareholder pressure and economic uncertainty.",
        type: "blocking",
        impact: { structuralContribution: 0 },
        requires: null
      }
    ],
    EDUCATOR: [
      {
        id: 311,
        title: "Contribute 4 Structural Tokens",
        description: "You invest 4 tokens from reserves and reallocate internal budget to support the fund.",
        type: "cooperative",
        impact: { structuralContribution: 4, fundingType: "structural" },
        requires: null
      },
      {
        id: 312,
        title: "Contribute 2 Tokens + Reduce Programs",
        description: "You contribute 2 tokens but scale down some programs to manage costs.",
        type: "cautious",
        impact: { structuralContribution: 2, programReduction: true },
        requires: null
      },
      {
        id: 313,
        title: "No Contribution",
        description: "You cannot contribute due to budget constraints and accreditation pressures.",
        type: "blocking",
        impact: { structuralContribution: 0 },
        requires: null
      }
    ],
    INTERMEDIARY: [
      {
        id: 411,
        title: "Contribute 3 Structural Tokens",
        description: "You invest 3 tokens and commit to transparent fund management and reporting.",
        type: "cooperative",
        impact: { structuralContribution: 3, fundingType: "structural", managementRole: true },
        requires: null
      },
      {
        id: 412,
        title: "Contribute 1 Token + Seek Grants",
        description: "You contribute 1 token while actively pursuing alternative grant funding.",
        type: "cautious",
        impact: { structuralContribution: 1, grantSeeking: true },
        requires: null
      },
      {
        id: 413,
        title: "No Contribution (At Risk)",
        description: "You cannot contribute and risk shutting down if the fund is not established.",
        type: "blocking",
        impact: { structuralContribution: 0, atRisk: true },
        requires: null
      }
    ],
    UWV: [
      {
        id: 511,
        title: "Contribute 4 Structural Tokens",
        description: "You allocate 4 tokens from public employment funds to support the ecosystem.",
        type: "cooperative",
        impact: { structuralContribution: 4, fundingType: "structural" },
        requires: null
      },
      {
        id: 512,
        title: "Contribute 2 Tokens + Policy Support",
        description: "You contribute 2 tokens and provide policy advocacy for structural funding.",
        type: "cautious",
        impact: { structuralContribution: 2, policySupport: true },
        requires: null
      },
      {
        id: 513,
        title: "No Contribution",
        description: "You cannot contribute due to bureaucratic restrictions on fund allocation.",
        type: "blocking",
        impact: { structuralContribution: 0 },
        requires: null
      }
    ],
    SECTOR: [
      {
        id: 611,
        title: "Commit O&O Fund to Structural Pool",
        description: "You redirect 5 tokens from the sector O&O fund (employer contributions) into the shared structural fund. You also lobby member companies to increase their payroll contribution percentage.",
        type: "cooperative",
        impact: { structuralContribution: 5, fundingType: "structural", employerMobilization: true, ooFundCommitment: true },
        requires: null
      },
      {
        id: 612,
        title: "Partial Fund + Coalition Building",
        description: "You contribute 3 tokens and focus on building a coalition of employers (like the successful SME training consortium model). You negotiate anti-poaching agreements between members.",
        type: "cautious",
        impact: { structuralContribution: 3, coalitionBuilding: true, antiPoachingAgreement: true },
        requires: null
      },
      {
        id: 613,
        title: "Cannot Mobilize (Governance Deadlock)",
        description: "Social partners (employers' associations and unions) cannot agree on fund allocation. Slow governance processes and fragmented decision-making prevent timely action.",
        type: "blocking",
        impact: { structuralContribution: 0, governanceDelay: true, socialPartnerConflict: true },
        requires: null
      }
    ]
  }
};
