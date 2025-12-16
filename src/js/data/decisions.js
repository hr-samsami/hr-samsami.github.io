// Decision cards organized by event and actor
// New Yes/No + Conditions system:
// - YES (green): Unconditional support - actor commits without conditions
// - NO (red): Not willing, but has conditions that would change answer to YES
//
// Game Flow:
// 1. Each actor chooses YES or NO
// 2. If NO, they reveal their conditions
// 3. Negotiation round: actors discuss how to meet each other's conditions
// 4. When conditions are met, NO becomes YES

// Condition types (from Simon7 meeting):
// Three broader groups for conditions:
// - funding: Need financial support/resources
// - expertise: Need skills/teachers/capacity from others (also called "capacity")
// - influence: Need a certain level of influence or path in the system (may require Wild Card)

// =============================================================================
// DECK 1: DEFAULT DECK - Yes/No with Conditions
// =============================================================================
const DEFAULT_DECK = {
  name: "Default Deck",
  description: "Yes/No decisions with conditions for negotiation",
  event1: {
    SME: {
      question: "Will you hire workers from the Servicepunt pipeline?",
      commitment: "Hire up to 10 workers",
      yes: {
        id: 101,
        type: "green",
        title: "Yes, I will hire",
        description: "I commit to hiring up to 10 workers matched by the Servicepunt without conditions.",
        impact: { workersPlaced: 10, hire: 10 }
      },
      no: {
        id: 102,
        type: "red",
        title: "No, not yet",
        description: "I cannot commit to hiring right now, but I could if certain conditions are met.",
        impact: { workersPlaced: 0, flowBlocked: true },
        conditions: [
          { id: "sme-c1", type: "funding", text: "I need hiring incentives/subsidies from UWV or Sector Body", canBeMet: ["UWV", "SECTOR"] },
          { id: "sme-c2", type: "expertise", text: "Workers must be trained with specific skills I need", canBeMet: ["EDUCATOR", "INTERMEDIARY"] },
          { id: "sme-c3", type: "funding", text: "I need salary support for the first 6 months", canBeMet: ["UWV", "SECTOR"] }
        ]
      }
    },
    LARGE: {
      question: "Will you participate in the workforce placement program?",
      commitment: "Hire up to 20 workers",
      yes: {
        id: 201,
        type: "green",
        title: "Yes, I will participate",
        description: "I commit to hiring up to 20 workers and will work with the ecosystem partners.",
        impact: { workersPlaced: 20, hire: 20, invest: 20 }
      },
      no: {
        id: 202,
        type: "red",
        title: "No, not yet",
        description: "I prefer my own recruitment channels, but could participate under certain conditions.",
        impact: { workersPlaced: 0, flowBlocked: true },
        conditions: [
          { id: "large-c1", type: "expertise", text: "My HR department must be able to select the candidates", canBeMet: ["INTERMEDIARY"] },
          { id: "large-c2", type: "expertise", text: "I need a fast-track process with minimal time investment", canBeMet: ["INTERMEDIARY", "EDUCATOR"] },
          { id: "large-c3", type: "expertise", text: "Training quality must meet our company standards", canBeMet: ["EDUCATOR"] }
        ]
      }
    },
    EDUCATOR: {
      question: "Will you provide training for the construction sector?",
      commitment: "Train up to 30 people",
      yes: {
        id: 301,
        type: "green",
        title: "Yes, I will train",
        description: "I commit to providing training for up to 30 people using existing resources.",
        impact: { trainingCapacity: 30, trained: 30 }
      },
      no: {
        id: 302,
        type: "red",
        title: "No, not yet",
        description: "I cannot commit to training without certain conditions being met first.",
        impact: { trainingCapacity: 0, trained: 0, flowBlocked: true },
        conditions: [
          { id: "edu-c1", type: "funding", text: "I need funding to cover training costs", canBeMet: ["UWV", "SECTOR", "LARGE"] },
          { id: "edu-c2", type: "expertise", text: "I need expert teachers from industry (large employers)", canBeMet: ["LARGE", "SME"] },
          { id: "edu-c3", type: "expertise", text: "I need guaranteed job placements for graduates", canBeMet: ["SME", "LARGE", "INTERMEDIARY"] }
        ]
      }
    },
    INTERMEDIARY: {
      question: "Will you provide matching services for workers and employers?",
      commitment: "Match up to 26 workers with employers",
      yes: {
        id: 401,
        type: "green",
        title: "Yes, I will match",
        description: "I commit to providing full matching services for up to 26 workers.",
        impact: { matched: 26, matchingActive: true }
      },
      no: {
        id: 402,
        type: "red",
        title: "No, not yet",
        description: "I cannot operate without guarantees - I don't want to train people who end up unemployed.",
        impact: { matchingActive: false, flowBlocked: true },
        conditions: [
          { id: "int-c1", type: "funding", text: "I need operational funding guarantee", canBeMet: ["UWV", "SECTOR"] },
          { id: "int-c2", type: "expertise", text: "I need employer commitment to hire matched workers", canBeMet: ["SME", "LARGE"] },
          { id: "int-c3", type: "expertise", text: "I need training capacity from Educator", canBeMet: ["EDUCATOR"] }
        ]
      }
    },
    UWV: {
      question: "Will you provide subsidies and incentives for hiring?",
      commitment: "Provide incentives for up to 20 placements",
      yes: {
        id: 501,
        type: "green",
        title: "Yes, I will provide incentives",
        description: "I commit to providing subsidies and hiring incentives without conditions.",
        impact: { incentives: 20, employerSupport: true, trainingFunded: 5 }
      },
      no: {
        id: 502,
        type: "red",
        title: "No, not yet",
        description: "Bureaucratic restrictions limit what I can do, but there are conditions that could help.",
        impact: { subsidyRestriction: true, flowBlocked: true },
        conditions: [
          { id: "uwv-c1", type: "expertise", text: "Employers must guarantee job placements", canBeMet: ["SME", "LARGE"] },
          { id: "uwv-c2", type: "expertise", text: "Training programs must be accredited", canBeMet: ["EDUCATOR"] },
          { id: "uwv-c3", type: "influence", text: "I need more influence at national level to change regulations (Wild Card)", canBeMet: ["WILDCARD"] }
        ]
      }
    },
    SECTOR: {
      question: "Will you coordinate sector-wide support and funding?",
      commitment: "Provide coordination and fund training for 25 people",
      yes: {
        id: 601,
        type: "green",
        title: "Yes, I will coordinate and fund",
        description: "I commit to coordinating efforts and providing funding from sector resources.",
        impact: { trainingFunded: 25, sectorSupport: true, invest: 5 }
      },
      no: {
        id: 602,
        type: "red",
        title: "No, not yet",
        description: "O&O fund has restrictions, and I need certain conditions to release funding.",
        impact: { sectorSupport: false, flowBlocked: true },
        conditions: [
          { id: "sec-c1", type: "expertise", text: "Educator must have training capacity available", canBeMet: ["EDUCATOR"] },
          { id: "sec-c2", type: "expertise", text: "Employers must commit to hiring graduates", canBeMet: ["SME", "LARGE"] },
          { id: "sec-c3", type: "funding", text: "Other actors must also contribute to shared fund", canBeMet: ["SME", "LARGE", "UWV"] }
        ]
      }
    }
  },
  event2: {
    SME: {
      question: "Will you contribute to the structural fund?",
      commitment: "Contribute up to 3 tokens",
      yes: {
        id: 111,
        type: "green",
        title: "Yes, I will contribute",
        description: "I commit to contributing 3 tokens to the structural fund.",
        impact: { structuralContribution: 3, fundingType: "structural" }
      },
      no: {
        id: 112,
        type: "red",
        title: "No, not yet",
        description: "My reserves are limited, but I could contribute under certain conditions.",
        impact: { structuralContribution: 0 },
        conditions: [
          { id: "sme2-c1", type: "funding", text: "Large employers must contribute first", canBeMet: ["LARGE"] },
          { id: "sme2-c2", type: "funding", text: "I need co-funding support from Sector Body", canBeMet: ["SECTOR"] },
          { id: "sme2-c3", type: "expertise", text: "I need guaranteed return on investment (trained workers)", canBeMet: ["INTERMEDIARY", "EDUCATOR"] }
        ]
      }
    },
    LARGE: {
      question: "Will you contribute to the structural fund?",
      commitment: "Contribute up to 8 tokens",
      yes: {
        id: 211,
        type: "green",
        title: "Yes, I will contribute",
        description: "I commit to contributing 8 tokens, showing leadership in ecosystem sustainability.",
        impact: { structuralContribution: 8, fundingType: "structural" }
      },
      no: {
        id: 212,
        type: "red",
        title: "No, not yet",
        description: "Shareholder pressure and economic uncertainty make this difficult without conditions.",
        impact: { structuralContribution: 0 },
        conditions: [
          { id: "large2-c1", type: "expertise", text: "Servicepunt must provide accountability measures", canBeMet: ["INTERMEDIARY"] },
          { id: "large2-c2", type: "funding", text: "Other employers must also contribute fairly", canBeMet: ["SME"] },
          { id: "large2-c3", type: "expertise", text: "I need influence over how funds are spent", canBeMet: ["SECTOR", "INTERMEDIARY"] }
        ]
      }
    },
    EDUCATOR: {
      question: "Will you contribute to the structural fund?",
      commitment: "Contribute up to 4 tokens",
      yes: {
        id: 311,
        type: "green",
        title: "Yes, I will contribute",
        description: "I commit to contributing 4 tokens by reallocating internal budget.",
        impact: { structuralContribution: 4, fundingType: "structural" }
      },
      no: {
        id: 312,
        type: "red",
        title: "No, not yet",
        description: "Budget constraints and accreditation pressures limit what I can contribute.",
        impact: { structuralContribution: 0 },
        conditions: [
          { id: "edu2-c1", type: "funding", text: "I need guaranteed student enrollment numbers", canBeMet: ["INTERMEDIARY", "UWV"] },
          { id: "edu2-c2", type: "funding", text: "Sector Body must match my contribution", canBeMet: ["SECTOR"] },
          { id: "edu2-c3", type: "expertise", text: "Employers must provide internship placements", canBeMet: ["SME", "LARGE"] }
        ]
      }
    },
    INTERMEDIARY: {
      question: "Will you contribute to the structural fund?",
      commitment: "Contribute up to 3 tokens",
      yes: {
        id: 411,
        type: "green",
        title: "Yes, I will contribute",
        description: "I commit to contributing 3 tokens and providing transparent fund management.",
        impact: { structuralContribution: 3, fundingType: "structural", managementRole: true }
      },
      no: {
        id: 412,
        type: "red",
        title: "No, not yet",
        description: "I risk shutting down without this fund, but need conditions to contribute.",
        impact: { structuralContribution: 0, atRisk: true },
        conditions: [
          { id: "int2-c1", type: "funding", text: "I need operational funding first to survive", canBeMet: ["UWV", "SECTOR"] },
          { id: "int2-c2", type: "expertise", text: "Employers must commit to long-term partnership", canBeMet: ["SME", "LARGE"] },
          { id: "int2-c3", type: "funding", text: "I need multi-year funding commitment", canBeMet: ["SECTOR", "UWV"] }
        ]
      }
    },
    UWV: {
      question: "Will you contribute to the structural fund?",
      commitment: "Contribute up to 4 tokens",
      yes: {
        id: 511,
        type: "green",
        title: "Yes, I will contribute",
        description: "I commit to allocating 4 tokens from public employment funds.",
        impact: { structuralContribution: 4, fundingType: "structural" }
      },
      no: {
        id: 512,
        type: "red",
        title: "No, not yet",
        description: "Bureaucratic restrictions limit fund allocation without meeting conditions.",
        impact: { structuralContribution: 0 },
        conditions: [
          { id: "uwv2-c1", type: "expertise", text: "Fund must have clear employment outcomes", canBeMet: ["INTERMEDIARY"] },
          { id: "uwv2-c2", type: "expertise", text: "Training must lead to accredited qualifications", canBeMet: ["EDUCATOR"] },
          { id: "uwv2-c3", type: "influence", text: "I need more influence to get approval for structural allocation (Wild Card)", canBeMet: ["WILDCARD"] }
        ]
      }
    },
    SECTOR: {
      question: "Will you commit O&O fund to the structural pool?",
      commitment: "Contribute up to 5 tokens from O&O fund",
      yes: {
        id: 611,
        type: "green",
        title: "Yes, I will commit O&O fund",
        description: "I redirect 5 tokens from sector O&O fund and lobby member companies.",
        impact: { structuralContribution: 5, fundingType: "structural", employerMobilization: true }
      },
      no: {
        id: 612,
        type: "red",
        title: "No, not yet",
        description: "Governance deadlock between social partners prevents timely action.",
        impact: { structuralContribution: 0, governanceDelay: true },
        conditions: [
          { id: "sec2-c1", type: "expertise", text: "Employers must show commitment first", canBeMet: ["SME", "LARGE"] },
          { id: "sec2-c2", type: "funding", text: "Other funders must contribute to shared pool", canBeMet: ["UWV", "LARGE"] },
          { id: "sec2-c3", type: "influence", text: "I need more influence at national level for support (Wild Card)", canBeMet: ["WILDCARD"] }
        ]
      }
    }
  }
};

// =============================================================================
// DECK 2: PLAYTEST DECK - Based on December 2025 Playtest
// =============================================================================
const PLAYTEST_DECK = {
  name: "Playtest Deck",
  description: "Yes/No decisions based on stakeholder playtest feedback (Dec 2025)",
  event1: {
    SME: {
      question: "Will you hire entry-level workers?",
      commitment: "Hire up to 5 entry-level workers",
      yes: {
        id: 101,
        type: "green",
        title: "Yes, I will hire",
        description: "I commit to hiring 5 entry-level employees and providing practical supervision.",
        impact: { workersPlaced: 5, hire: 5, supervision: true }
      },
      no: {
        id: 102,
        type: "red",
        title: "No, not yet",
        description: "I need structural funding secured before making hiring commitments.",
        impact: { workersPlaced: 0, flowBlocked: true },
        conditions: [
          { id: "sme-c1", type: "funding", text: "I need structural funding commitment (not project-based)", canBeMet: ["UWV", "SECTOR"] },
          { id: "sme-c2", type: "expertise", text: "Workers must have specific skills I need", canBeMet: ["EDUCATOR"] },
          { id: "sme-c3", type: "funding", text: "I can only hire 5, not all at once - need phased approach", canBeMet: ["INTERMEDIARY"] }
        ]
      }
    },
    LARGE: {
      question: "Will you participate in the hiring program?",
      commitment: "Hire up to 20 workers",
      yes: {
        id: 201,
        type: "green",
        title: "Yes, I will hire 20",
        description: "I commit to hiring 20 employees with fast-track training investment.",
        impact: { workersPlaced: 20, hire: 20, invest: 20, fastTrack: true }
      },
      no: {
        id: 202,
        type: "red",
        title: "No, I use own programs",
        description: "I prefer my own training programs and recruitment channels.",
        impact: { workersPlaced: 0, flowBlocked: true, ownPrograms: true },
        conditions: [
          { id: "large-c1", type: "expertise", text: "My HR must select candidates - not Servicepunt", canBeMet: ["INTERMEDIARY"] },
          { id: "large-c2", type: "expertise", text: "Fast process with minimal time investment from my side", canBeMet: ["INTERMEDIARY", "EDUCATOR"] },
          { id: "large-c3", type: "expertise", text: "Quality guarantee - people must be work-ready", canBeMet: ["EDUCATOR"] }
        ]
      }
    },
    EDUCATOR: {
      question: "Will you provide training programs?",
      commitment: "Train up to 15 people structurally",
      yes: {
        id: 301,
        type: "green",
        title: "Yes, structural commitment",
        description: "I commit to structural training slots for long-term sustainability.",
        impact: { trainingCapacity: 15, trained: 15, structural: true }
      },
      no: {
        id: 302,
        type: "red",
        title: "No, funding first",
        description: "I cannot risk unfunded programs - show me the money first.",
        impact: { trainingCapacity: 0, trained: 0, flowBlocked: true },
        conditions: [
          { id: "edu-c1", type: "funding", text: "Funding must be secured before I start", canBeMet: ["UWV", "SECTOR", "LARGE"] },
          { id: "edu-c2", type: "funding", text: "Long-term funding commitment (not project-based)", canBeMet: ["SECTOR"] },
          { id: "edu-c3", type: "expertise", text: "Expert teachers from industry needed", canBeMet: ["LARGE"] }
        ]
      }
    },
    INTERMEDIARY: {
      question: "Will you provide training and matching services?",
      commitment: "Train 10 + Match up to 26 workers",
      yes: {
        id: 401,
        type: "green",
        title: "Yes, full service",
        description: "I provide full matching services for up to 26 people.",
        impact: { trained: 10, matched: 26, matchingActive: true }
      },
      no: {
        id: 402,
        type: "red",
        title: "No, need guarantees",
        description: "I don't want to train people who end up unemployed - need guarantees.",
        impact: { matchingActive: false, flowBlocked: true },
        conditions: [
          { id: "int-c1", type: "funding", text: "I need funding guarantee", canBeMet: ["UWV", "SECTOR"] },
          { id: "int-c2", type: "expertise", text: "Employers must guarantee to hire matched workers", canBeMet: ["SME", "LARGE"] },
          { id: "int-c3", type: "expertise", text: "Training capacity must be available", canBeMet: ["EDUCATOR"] }
        ]
      }
    },
    UWV: {
      question: "Will you fund training and provide incentives?",
      commitment: "Fund 3 training spots + incentives for 10",
      yes: {
        id: 501,
        type: "green",
        title: "Yes, fund + incentives",
        description: "I donate towards training costs and provide hiring incentives.",
        impact: { trainingFunded: 3, incentives: 10, employerSupport: true }
      },
      no: {
        id: 502,
        type: "red",
        title: "No, information only",
        description: "I can only inform job seekers, no financial commitments possible.",
        impact: { informationOnly: true, flowBlocked: true },
        conditions: [
          { id: "uwv-c1", type: "expertise", text: "Job guarantee from employers required", canBeMet: ["SME", "LARGE"] },
          { id: "uwv-c2", type: "expertise", text: "Training programs must be accredited/available", canBeMet: ["EDUCATOR"] },
          { id: "uwv-c3", type: "expertise", text: "Continue uitkering during training only with job guarantee", canBeMet: ["SME", "LARGE"] }
        ]
      }
    },
    SECTOR: {
      question: "Will you coordinate and invest from sector funds?",
      commitment: "Coordinate + invest for 5 people",
      yes: {
        id: 601,
        type: "green",
        title: "Yes, coordinate + invest",
        description: "I coordinate sector-wide efforts and invest limited resources.",
        impact: { trainingFunded: 5, sectorSupport: true, invest: 5 }
      },
      no: {
        id: 602,
        type: "red",
        title: "No, long-term only",
        description: "I can only focus on long-term strategy, not immediate coordination.",
        impact: { sectorSupport: false, flowBlocked: true, longTermOnly: true },
        conditions: [
          { id: "sec-c1", type: "expertise", text: "Actors must be willing to collaborate", canBeMet: ["SME", "LARGE", "EDUCATOR", "INTERMEDIARY"] },
          { id: "sec-c2", type: "funding", text: "O&O fund is only for employee development - cannot fund directly", canBeMet: [] },
          { id: "sec-c3", type: "expertise", text: "Employers must show commitment first", canBeMet: ["SME", "LARGE"] }
        ]
      }
    }
  },
  event2: {
    SME: {
      question: "Will you contribute to the structural fund?",
      commitment: "Contribute up to 3 tokens",
      yes: {
        id: 111,
        type: "green",
        title: "Yes, I will contribute",
        description: "I invest 3 tokens from reserves into the structural fund.",
        impact: { structuralContribution: 3, fundingType: "structural" }
      },
      no: {
        id: 112,
        type: "red",
        title: "No, not yet",
        description: "I prioritize my own reserves, but could contribute under conditions.",
        impact: { structuralContribution: 0 },
        conditions: [
          { id: "sme2-c1", type: "funding", text: "Large employers must lead with their contribution", canBeMet: ["LARGE"] },
          { id: "sme2-c2", type: "funding", text: "Need matching funds from sector", canBeMet: ["SECTOR"] }
        ]
      }
    },
    LARGE: {
      question: "Will you contribute to the structural fund?",
      commitment: "Contribute up to 8 tokens",
      yes: {
        id: 211,
        type: "green",
        title: "Yes, I will lead",
        description: "I make a major investment showing leadership in sustainability.",
        impact: { structuralContribution: 8, fundingType: "structural" }
      },
      no: {
        id: 212,
        type: "red",
        title: "No, shareholder pressure",
        description: "Economic uncertainty and shareholder pressure prevent contribution.",
        impact: { structuralContribution: 0 },
        conditions: [
          { id: "large2-c1", type: "expertise", text: "Servicepunt must provide accountability/transparency", canBeMet: ["INTERMEDIARY"] },
          { id: "large2-c2", type: "expertise", text: "I need influence over fund allocation", canBeMet: ["SECTOR"] }
        ]
      }
    },
    EDUCATOR: {
      question: "Will you contribute to the structural fund?",
      commitment: "Contribute up to 4 tokens",
      yes: {
        id: 311,
        type: "green",
        title: "Yes, I will contribute",
        description: "I reallocate internal budget to support the fund.",
        impact: { structuralContribution: 4, fundingType: "structural" }
      },
      no: {
        id: 312,
        type: "red",
        title: "No, budget constraints",
        description: "Accreditation pressures limit what I can contribute.",
        impact: { structuralContribution: 0 },
        conditions: [
          { id: "edu2-c1", type: "funding", text: "Sector Body must match my contribution", canBeMet: ["SECTOR"] },
          { id: "edu2-c2", type: "expertise", text: "Guaranteed student enrollment from Servicepunt", canBeMet: ["INTERMEDIARY"] }
        ]
      }
    },
    INTERMEDIARY: {
      question: "Will you contribute to the structural fund?",
      commitment: "Contribute up to 3 tokens",
      yes: {
        id: 411,
        type: "green",
        title: "Yes, with transparency",
        description: "I contribute and commit to transparent fund management.",
        impact: { structuralContribution: 3, fundingType: "structural", managementRole: true }
      },
      no: {
        id: 412,
        type: "red",
        title: "No, at risk",
        description: "I risk shutting down - cannot contribute without survival funding.",
        impact: { structuralContribution: 0, atRisk: true },
        conditions: [
          { id: "int2-c1", type: "funding", text: "I need operational funding to survive first", canBeMet: ["UWV", "SECTOR"] },
          { id: "int2-c2", type: "expertise", text: "Long-term partnership commitment from employers", canBeMet: ["SME", "LARGE"] }
        ]
      }
    },
    UWV: {
      question: "Will you contribute to the structural fund?",
      commitment: "Contribute up to 4 tokens",
      yes: {
        id: 511,
        type: "green",
        title: "Yes, I will allocate",
        description: "I allocate public employment funds to support the ecosystem.",
        impact: { structuralContribution: 4, fundingType: "structural" }
      },
      no: {
        id: 512,
        type: "red",
        title: "No, bureaucratic limits",
        description: "Restrictions prevent structural fund allocation.",
        impact: { structuralContribution: 0 },
        conditions: [
          { id: "uwv2-c1", type: "expertise", text: "Clear employment outcomes required", canBeMet: ["INTERMEDIARY"] },
          { id: "uwv2-c2", type: "influence", text: "More influence needed for structural allocation (Wild Card)", canBeMet: ["WILDCARD"] }
        ]
      }
    },
    SECTOR: {
      question: "Will you commit O&O fund to structural pool?",
      commitment: "Contribute up to 5 tokens from O&O fund",
      yes: {
        id: 611,
        type: "green",
        title: "Yes, redirect O&O fund",
        description: "I redirect O&O fund and lobby member companies.",
        impact: { structuralContribution: 5, fundingType: "structural", employerMobilization: true }
      },
      no: {
        id: 612,
        type: "red",
        title: "No, governance deadlock",
        description: "Social partners cannot agree on fund allocation.",
        impact: { structuralContribution: 0, governanceDelay: true },
        conditions: [
          { id: "sec2-c1", type: "expertise", text: "Employers must show commitment first", canBeMet: ["SME", "LARGE"] },
          { id: "sec2-c2", type: "influence", text: "National level influence needed (Wild Card)", canBeMet: ["WILDCARD"] }
        ]
      }
    }
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

// Helper to get actor's decision options for current event
export function getActorDecision(actorId, eventNum) {
  const deck = getCurrentDeck();
  const eventKey = `event${eventNum}`;
  return deck[eventKey]?.[actorId] || null;
}

// For backwards compatibility - returns array format [yes, no] for old code
export const DECISION_CARDS = {
  get event1() {
    const deck = getCurrentDeck();
    const result = {};
    for (const actorId of Object.keys(deck.event1)) {
      const actor = deck.event1[actorId];
      result[actorId] = [actor.yes, actor.no];
    }
    return result;
  },
  get event2() {
    const deck = getCurrentDeck();
    const result = {};
    for (const actorId of Object.keys(deck.event2)) {
      const actor = deck.event2[actorId];
      result[actorId] = [actor.yes, actor.no];
    }
    return result;
  }
};
