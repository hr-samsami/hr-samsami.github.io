// Decision cards organized by event and actor
// Types: "yellow" (collaborate), "green" (invest), "red" (wait/block)
// Colors are for facilitator - after all actors choose, colors determine system health

// =============================================================================
// DECK 1: DEFAULT DECK (Original)
// =============================================================================
const DEFAULT_DECK = {
  name: "Default Deck",
  description: "Original decision cards with basic hire/invest/wait options",
  event1: {
    SME: [
      {
        id: 101,
        title: "Hire 10 Potential Employees",
        description: "You commit to hiring 10 potential employees matched by the Servicepunt.",
        type: "yellow",
        impact: { workersPlaced: 10, hire: 10 },
        requires: "Matching completed by Servicepunt"
      },
      {
        id: 102,
        title: "Invest in 5, Hire 5",
        description: "You invest in training 5 potential employees and commit to hiring 5 potential employees.",
        type: "green",
        impact: { workersPlaced: 5, invest: 5, hire: 5 },
        requires: "Training available"
      },
      {
        id: 103,
        title: "Wait and See",
        description: "You wait to see how the situation develops before committing.",
        type: "red",
        impact: { workersPlaced: 0, flowBlocked: true },
        requires: null
      }
    ],
    LARGE: [
      {
        id: 201,
        title: "Hire 20 Potential Employees",
        description: "You commit to hiring 20 potential employees matched by the Servicepunt.",
        type: "yellow",
        impact: { workersPlaced: 20, hire: 20 },
        requires: "Matching completed by Servicepunt"
      },
      {
        id: 202,
        title: "Invest in 20, Hire 20",
        description: "You invest in training 20 potential employees and commit to hiring all 20.",
        type: "green",
        impact: { workersPlaced: 20, invest: 20, hire: 20 },
        requires: "Training capacity available"
      },
      {
        id: 203,
        title: "Refuse Servicepunt Matching",
        description: "You refuse the matching services from Servicepunt, preferring your own recruitment channels.",
        type: "red",
        impact: { workersPlaced: 0, flowBlocked: true, refuseMatching: true },
        requires: null
      }
    ],
    EDUCATOR: [
      {
        id: 301,
        title: "Train 10 People",
        description: "You commit to training 10 people for the construction sector.",
        type: "yellow",
        impact: { trainingCapacity: 10, trained: 10 },
        requires: "Funding available"
      },
      {
        id: 302,
        title: "Support Training for 2",
        description: "You provide limited support to train 2 people with existing resources.",
        type: "green",
        impact: { trainingCapacity: 2, trained: 2 },
        requires: null
      },
      {
        id: 303,
        title: "Reduce Training Slots",
        description: "You reduce training slots until funding is secured.",
        type: "red",
        impact: { trainingCapacity: 0, trained: 0, flowBlocked: true },
        requires: null
      }
    ],
    INTERMEDIARY: [
      {
        id: 401,
        title: "Train 15, Match 15",
        description: "You train 15 potential employees and match 15 potential employees with employers.",
        type: "yellow",
        impact: { trained: 15, matched: 15, matchingActive: true },
        requires: "Employers are hiring"
      },
      {
        id: 402,
        title: "Match up to 26 Employees",
        description: "You focus on matching up to 26 potential employees to employers.",
        type: "green",
        impact: { matched: 26, matchingActive: true },
        requires: "Training completed, Employers are hiring"
      },
      {
        id: 403,
        title: "Pause Operations",
        description: "You pause operations until funding is secure.",
        type: "red",
        impact: { matchingActive: false, flowBlocked: true },
        requires: null
      }
    ],
    UWV: [
      {
        id: 501,
        title: "Give Incentives for 20 People",
        description: "You provide incentives to SMEs or Large enterprises for hiring 20 people.",
        type: "yellow",
        impact: { incentives: 20, employerSupport: true },
        requires: "Employers willing to hire"
      },
      {
        id: 502,
        title: "Pay Training for 3, Incentives for 10",
        description: "You pay for training 3 people and provide incentives for 10 people.",
        type: "green",
        impact: { trainingFunded: 3, incentives: 10, employerSupport: true },
        requires: "Training available"
      },
      {
        id: 503,
        title: "Tighten Subsidy Rules",
        description: "You tighten the rules for subsidies, making it harder to access support.",
        type: "red",
        impact: { subsidyRestriction: true, flowBlocked: true },
        requires: null
      }
    ],
    SECTOR: [
      {
        id: 601,
        title: "Fund Training for 25 People",
        description: "You provide funding to train 25 people through sector resources.",
        type: "yellow",
        impact: { trainingFunded: 25, sectorSupport: true },
        requires: "Educator has capacity"
      },
      {
        id: 602,
        title: "Invest for 5",
        description: "You invest resources to support training and placement of 5 people.",
        type: "green",
        impact: { invest: 5, trainingFunded: 5 },
        requires: null
      },
      {
        id: 603,
        title: "Refuse to Coordinate Training Cost",
        description: "You refuse to coordinate or fund training costs, leaving it to individual actors.",
        type: "red",
        impact: { sectorSupport: false, flowBlocked: true },
        requires: null
      }
    ]
  },
  event2: {
    SME: [
      {
        id: 111,
        title: "Contribute 3 Structural Tokens",
        description: "You invest 3 tokens from your reserves into the shared structural fund to sustain the ecosystem.",
        type: "green",
        impact: { structuralContribution: 3, fundingType: "structural" },
        requires: null
      },
      {
        id: 112,
        title: "Contribute 1 Token + Lobby for Subsidies",
        description: "You contribute 1 token but focus effort on lobbying for restored subsidies.",
        type: "yellow",
        impact: { structuralContribution: 1, lobbyEffect: true },
        requires: null
      },
      {
        id: 113,
        title: "No Contribution",
        description: "You choose not to invest in the structural fund, prioritizing your own reserves.",
        type: "red",
        impact: { structuralContribution: 0 },
        requires: null
      }
    ],
    LARGE: [
      {
        id: 211,
        title: "Contribute 8 Structural Tokens",
        description: "You make a major investment in the structural fund, showing leadership in sustaining the ecosystem.",
        type: "green",
        impact: { structuralContribution: 8, fundingType: "structural" },
        requires: null
      },
      {
        id: 212,
        title: "Contribute 4 Tokens + Conditional Support",
        description: "You contribute 4 tokens but require accountability measures from the Servicepunt.",
        type: "yellow",
        impact: { structuralContribution: 4, conditionalSupport: true },
        requires: null
      },
      {
        id: 213,
        title: "No Contribution",
        description: "You decline to invest, citing shareholder pressure and economic uncertainty.",
        type: "red",
        impact: { structuralContribution: 0 },
        requires: null
      }
    ],
    EDUCATOR: [
      {
        id: 311,
        title: "Contribute 4 Structural Tokens",
        description: "You invest 4 tokens from reserves and reallocate internal budget to support the fund.",
        type: "green",
        impact: { structuralContribution: 4, fundingType: "structural" },
        requires: null
      },
      {
        id: 312,
        title: "Contribute 2 Tokens + Reduce Programs",
        description: "You contribute 2 tokens but scale down some programs to manage costs.",
        type: "yellow",
        impact: { structuralContribution: 2, programReduction: true },
        requires: null
      },
      {
        id: 313,
        title: "No Contribution",
        description: "You cannot contribute due to budget constraints and accreditation pressures.",
        type: "red",
        impact: { structuralContribution: 0 },
        requires: null
      }
    ],
    INTERMEDIARY: [
      {
        id: 411,
        title: "Contribute 3 Structural Tokens",
        description: "You invest 3 tokens and commit to transparent fund management and reporting.",
        type: "green",
        impact: { structuralContribution: 3, fundingType: "structural", managementRole: true },
        requires: null
      },
      {
        id: 412,
        title: "Contribute 1 Token + Seek Grants",
        description: "You contribute 1 token while actively pursuing alternative grant funding.",
        type: "yellow",
        impact: { structuralContribution: 1, grantSeeking: true },
        requires: null
      },
      {
        id: 413,
        title: "No Contribution (At Risk)",
        description: "You cannot contribute and risk shutting down if the fund is not established.",
        type: "red",
        impact: { structuralContribution: 0, atRisk: true },
        requires: null
      }
    ],
    UWV: [
      {
        id: 511,
        title: "Contribute 4 Structural Tokens",
        description: "You allocate 4 tokens from public employment funds to support the ecosystem.",
        type: "green",
        impact: { structuralContribution: 4, fundingType: "structural" },
        requires: null
      },
      {
        id: 512,
        title: "Contribute 2 Tokens + Policy Support",
        description: "You contribute 2 tokens and provide policy advocacy for structural funding.",
        type: "yellow",
        impact: { structuralContribution: 2, policySupport: true },
        requires: null
      },
      {
        id: 513,
        title: "No Contribution",
        description: "You cannot contribute due to bureaucratic restrictions on fund allocation.",
        type: "red",
        impact: { structuralContribution: 0 },
        requires: null
      }
    ],
    SECTOR: [
      {
        id: 611,
        title: "Commit O&O Fund to Structural Pool",
        description: "You redirect 5 tokens from the sector O&O fund into the shared structural fund and lobby member companies.",
        type: "green",
        impact: { structuralContribution: 5, fundingType: "structural", employerMobilization: true },
        requires: null
      },
      {
        id: 612,
        title: "Partial Fund + Coalition Building",
        description: "You contribute 3 tokens and focus on building a coalition of employers with anti-poaching agreements.",
        type: "yellow",
        impact: { structuralContribution: 3, coalitionBuilding: true },
        requires: null
      },
      {
        id: 613,
        title: "Cannot Mobilize (Governance Deadlock)",
        description: "Social partners cannot agree on fund allocation. Governance deadlock prevents timely action.",
        type: "red",
        impact: { structuralContribution: 0, governanceDelay: true },
        requires: null
      }
    ]
  }
};

// =============================================================================
// DECK 2: PLAYTEST DECK (Based on December 2025 Playtest)
// =============================================================================
const PLAYTEST_DECK = {
  name: "Playtest Deck",
  description: "Decision cards based on stakeholder playtest feedback (Dec 2025)",
  event1: {
    SME: [
      {
        id: 101,
        title: "Hire 5 Entry-Level Employees",
        description: "Hire 5 entry-level employees with specific skills, not all at the same time. Provide practical onsite supervision.",
        type: "yellow",
        impact: { workersPlaced: 5, hire: 5 },
        requires: "Candidates available with specific skills"
      },
      {
        id: 102,
        title: "Hire 5 + Provide Supervision",
        description: "Hire 5 employees and invest time in providing practical onsite supervision and mentorship.",
        type: "green",
        impact: { workersPlaced: 5, hire: 5, supervision: true },
        requires: "Training completed"
      },
      {
        id: 103,
        title: "No Investment Until Structural Funding",
        description: "Wait until structured funding is secured before making any hiring commitments.",
        type: "red",
        impact: { workersPlaced: 0, flowBlocked: true },
        requires: null
      }
    ],
    LARGE: [
      {
        id: 201,
        title: "Hire 20 (HR Selects)",
        description: "Commit to hiring 20 employees by end of year, but your HR department will select the candidates.",
        type: "yellow",
        impact: { workersPlaced: 20, hire: 20, hrSelects: true },
        requires: "Candidates available for HR selection"
      },
      {
        id: 202,
        title: "Invest + Hire 20 (Fast Track)",
        description: "Invest in training and hire 20 employees, but only if you can select candidates and get them quickly with minimal time effort.",
        type: "green",
        impact: { workersPlaced: 20, hire: 20, invest: 20, fastTrack: true },
        requires: "Fast-track training available"
      },
      {
        id: 203,
        title: "Use Own Training Programs",
        description: "Refuse external collaboration - you have your own training programs and recruitment channels.",
        type: "red",
        impact: { workersPlaced: 0, flowBlocked: true, ownPrograms: true },
        requires: null
      }
    ],
    EDUCATOR: [
      {
        id: 301,
        title: "Pilot Training Program (10 people)",
        description: "Offer a pilot training program for 10 people - a 'look and feel' for a new program approach.",
        type: "yellow",
        impact: { trainingCapacity: 10, trained: 10, pilot: true },
        requires: "Funding secured"
      },
      {
        id: 302,
        title: "Structural Training Commitment",
        description: "Commit to a structural number of training slots for long-term sustainability (ongoing program).",
        type: "green",
        impact: { trainingCapacity: 15, trained: 15, structural: true },
        requires: "Long-term funding commitment"
      },
      {
        id: 303,
        title: "No Training Until Funding Secured",
        description: "Reduce training slots and wait until funding is secured first - cannot risk unfunded programs.",
        type: "red",
        impact: { trainingCapacity: 0, trained: 0, flowBlocked: true },
        requires: null
      }
    ],
    INTERMEDIARY: [
      {
        id: 401,
        title: "Train 10 + Match (With Guarantees)",
        description: "Collaborate with Educator to train 10 people, but need funding guarantee AND employer matching guarantee.",
        type: "yellow",
        impact: { trained: 10, matched: 10, matchingActive: true },
        requires: "Funding guarantee, Employer matching guarantee"
      },
      {
        id: 402,
        title: "Full Matching Service (26 people)",
        description: "Provide full matching services for up to 26 people if training and employer commitments are secured.",
        type: "green",
        impact: { matched: 26, matchingActive: true },
        requires: "Training secured, Employer commitments"
      },
      {
        id: 403,
        title: "Pause Until Guarantees Secured",
        description: "Pause operations - don't want to risk training people who end up unemployed without guarantees.",
        type: "red",
        impact: { matchingActive: false, flowBlocked: true },
        requires: null
      }
    ],
    UWV: [
      {
        id: 501,
        title: "Continue Subsidy During Training",
        description: "Provide continued income support (uitkering) during training when there is a job guarantee.",
        type: "yellow",
        impact: { incentives: 15, employerSupport: true, subsidyDuringTraining: true },
        requires: "Job guarantee from employers"
      },
      {
        id: 502,
        title: "Fund Training + Provide Incentives",
        description: "Invest: donate towards training costs (3 people) and provide hiring incentives (10 people).",
        type: "green",
        impact: { trainingFunded: 3, incentives: 10, employerSupport: true },
        requires: "Training programs available"
      },
      {
        id: 503,
        title: "Information Only (No Investment)",
        description: "Only collaborate by informing job seekers about possibilities, but make no financial commitments.",
        type: "red",
        impact: { informationOnly: true, flowBlocked: true },
        requires: null
      }
    ],
    SECTOR: [
      {
        id: 601,
        title: "Facilitate Collaboration (No Funding)",
        description: "Collaborate to facilitate connections between actors and coordinate efforts, but provide no direct funding - only for employee development.",
        type: "yellow",
        impact: { sectorSupport: true, facilitation: true },
        requires: "Actors willing to collaborate"
      },
      {
        id: 602,
        title: "Coordinate + Limited Investment",
        description: "Coordinate sector-wide efforts and invest limited resources for 5 people from sector funds.",
        type: "green",
        impact: { trainingFunded: 5, sectorSupport: true, invest: 5 },
        requires: null
      },
      {
        id: 603,
        title: "Focus on Long-Term Strategy Only",
        description: "Decline to coordinate immediate efforts, focusing only on long-term strategic planning for the sector.",
        type: "red",
        impact: { sectorSupport: false, flowBlocked: true, longTermOnly: true },
        requires: null
      }
    ]
  },
  event2: {
    SME: [
      {
        id: 111,
        title: "Contribute 3 Structural Tokens",
        description: "You invest 3 tokens from your reserves into the shared structural fund to sustain the ecosystem.",
        type: "green",
        impact: { structuralContribution: 3, fundingType: "structural" },
        requires: null
      },
      {
        id: 112,
        title: "Contribute 1 Token + Lobby for Subsidies",
        description: "You contribute 1 token but focus effort on lobbying for restored subsidies.",
        type: "yellow",
        impact: { structuralContribution: 1, lobbyEffect: true },
        requires: null
      },
      {
        id: 113,
        title: "No Contribution",
        description: "You choose not to invest in the structural fund, prioritizing your own reserves.",
        type: "red",
        impact: { structuralContribution: 0 },
        requires: null
      }
    ],
    LARGE: [
      {
        id: 211,
        title: "Contribute 8 Structural Tokens",
        description: "You make a major investment in the structural fund, showing leadership in sustaining the ecosystem.",
        type: "green",
        impact: { structuralContribution: 8, fundingType: "structural" },
        requires: null
      },
      {
        id: 212,
        title: "Contribute 4 Tokens + Conditional Support",
        description: "You contribute 4 tokens but require accountability measures from the Servicepunt.",
        type: "yellow",
        impact: { structuralContribution: 4, conditionalSupport: true },
        requires: null
      },
      {
        id: 213,
        title: "No Contribution",
        description: "You decline to invest, citing shareholder pressure and economic uncertainty.",
        type: "red",
        impact: { structuralContribution: 0 },
        requires: null
      }
    ],
    EDUCATOR: [
      {
        id: 311,
        title: "Contribute 4 Structural Tokens",
        description: "You invest 4 tokens from reserves and reallocate internal budget to support the fund.",
        type: "green",
        impact: { structuralContribution: 4, fundingType: "structural" },
        requires: null
      },
      {
        id: 312,
        title: "Contribute 2 Tokens + Reduce Programs",
        description: "You contribute 2 tokens but scale down some programs to manage costs.",
        type: "yellow",
        impact: { structuralContribution: 2, programReduction: true },
        requires: null
      },
      {
        id: 313,
        title: "No Contribution",
        description: "You cannot contribute due to budget constraints and accreditation pressures.",
        type: "red",
        impact: { structuralContribution: 0 },
        requires: null
      }
    ],
    INTERMEDIARY: [
      {
        id: 411,
        title: "Contribute 3 Structural Tokens",
        description: "You invest 3 tokens and commit to transparent fund management and reporting.",
        type: "green",
        impact: { structuralContribution: 3, fundingType: "structural", managementRole: true },
        requires: null
      },
      {
        id: 412,
        title: "Contribute 1 Token + Seek Grants",
        description: "You contribute 1 token while actively pursuing alternative grant funding.",
        type: "yellow",
        impact: { structuralContribution: 1, grantSeeking: true },
        requires: null
      },
      {
        id: 413,
        title: "No Contribution (At Risk)",
        description: "You cannot contribute and risk shutting down if the fund is not established.",
        type: "red",
        impact: { structuralContribution: 0, atRisk: true },
        requires: null
      }
    ],
    UWV: [
      {
        id: 511,
        title: "Contribute 4 Structural Tokens",
        description: "You allocate 4 tokens from public employment funds to support the ecosystem.",
        type: "green",
        impact: { structuralContribution: 4, fundingType: "structural" },
        requires: null
      },
      {
        id: 512,
        title: "Contribute 2 Tokens + Policy Support",
        description: "You contribute 2 tokens and provide policy advocacy for structural funding.",
        type: "yellow",
        impact: { structuralContribution: 2, policySupport: true },
        requires: null
      },
      {
        id: 513,
        title: "No Contribution",
        description: "You cannot contribute due to bureaucratic restrictions on fund allocation.",
        type: "red",
        impact: { structuralContribution: 0 },
        requires: null
      }
    ],
    SECTOR: [
      {
        id: 611,
        title: "Commit O&O Fund to Structural Pool",
        description: "You redirect 5 tokens from the sector O&O fund into the shared structural fund and lobby member companies.",
        type: "green",
        impact: { structuralContribution: 5, fundingType: "structural", employerMobilization: true },
        requires: null
      },
      {
        id: 612,
        title: "Partial Fund + Coalition Building",
        description: "You contribute 3 tokens and focus on building a coalition of employers with anti-poaching agreements.",
        type: "yellow",
        impact: { structuralContribution: 3, coalitionBuilding: true },
        requires: null
      },
      {
        id: 613,
        title: "Cannot Mobilize (Governance Deadlock)",
        description: "Social partners cannot agree on fund allocation. Governance deadlock prevents timely action.",
        type: "red",
        impact: { structuralContribution: 0, governanceDelay: true },
        requires: null
      }
    ]
  }
};

// =============================================================================
// AVAILABLE DECKS
// =============================================================================
export const AVAILABLE_DECKS = {
  default: DEFAULT_DECK,
  playtest: PLAYTEST_DECK
};

// Current active deck (can be changed at runtime)
let currentDeckId = 'default';

// Get the current deck
export function getCurrentDeck() {
  return AVAILABLE_DECKS[currentDeckId];
}

// Set the active deck
export function setCurrentDeck(deckId) {
  if (AVAILABLE_DECKS[deckId]) {
    currentDeckId = deckId;
    return true;
  }
  return false;
}

// Get current deck ID
export function getCurrentDeckId() {
  return currentDeckId;
}

// For backwards compatibility - returns the current deck's cards
export const DECISION_CARDS = {
  get event1() {
    return getCurrentDeck().event1;
  },
  get event2() {
    return getCurrentDeck().event2;
  }
};
