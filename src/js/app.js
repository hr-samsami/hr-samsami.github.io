// Main application entry point
import { ACTORS } from './data/actors.js';
import { EVENT_CARDS } from './data/events.js';
import { DECISION_CARDS } from './data/decisions.js';
import { clampHealth } from './helpers.js';
import { 
  renderSetupScreen, 
  renderMainScreen, 
  renderCollapsedScreen, 
  renderVictoryScreen 
} from './renderers.js';

// Game Constants
const MAX_ROUNDS = 2;

// Game State
let gameState = "setup"; // "setup" | "event" | "collapsed" | "victory"
let round = 1;
let ecosystemHealth = 50;
let currentEvent = null;
let selectedDecisions = {};
let history = [];
let selectedActor = null;
let showResults = false;
let workersPlaced = 0;
let structuralFund = 0;

// Get event decisions for current round
function getEventDecisions() {
  return round === 1 ? DECISION_CARDS.event1 : DECISION_CARDS.event2;
}

// Draw event card
function drawEvent() {
  currentEvent = EVENT_CARDS.find((e) => e.id === round);
  showResults = false;
}

// Start game
function startGame() {
  gameState = "event";
  round = 1;
  ecosystemHealth = 50;
  history = [];
  selectedDecisions = {};
  selectedActor = null;
  workersPlaced = 0;
  structuralFund = 0;
  drawEvent();
  render();
}

// Process round
function processRound() {
  if (!currentEvent) return;

  let success = false;

  if (round === 1) {
    // Workforce Shock - count workers enabled
    workersPlaced = 0;
    let hasFlowBlock = false;

    Object.values(selectedDecisions).forEach((d) => {
      const impact = d.impact || {};
      workersPlaced += impact.workersPlaced || 0;
      if (impact.trainingCapacity) workersPlaced += impact.trainingCapacity;
      if (impact.trained) workersPlaced = Math.min(workersPlaced, impact.trained);
      if (impact.flowBlocked) hasFlowBlock = true;
    });

    // Apply flow block penalty
    if (hasFlowBlock) workersPlaced = Math.floor(workersPlaced * 0.5);

    workersPlaced = Math.min(30, workersPlaced);
    success = workersPlaced >= 25;
  } else {
    // Funding Crisis - count fund contributions
    structuralFund = 0;
    Object.values(selectedDecisions).forEach((d) => {
      const impact = d.impact || {};
      structuralFund += impact.structuralContribution || 0;
    });
    success = structuralFund >= 20;
  }

  // Update ecosystem health based on success
  let healthChange = success ? 10 : -10;
  let newHealth = ecosystemHealth + healthChange;
  newHealth = clampHealth(newHealth);

  history = [
    ...history,
    {
      round,
      event: currentEvent,
      decisions: { ...selectedDecisions },
      health: newHealth,
      success,
      metrics: {
        workersPlaced: round === 1 ? workersPlaced : undefined,
        targetWorkers: round === 1 ? 25 : undefined,
        structuralFund: round === 2 ? structuralFund : undefined,
        targetFund: round === 2 ? 20 : undefined
      }
    },
  ];

  ecosystemHealth = newHealth;
  showResults = true;

  render();
}

// Next round
function nextRound() {
  if (round >= MAX_ROUNDS) {
    const round1 = history.find(h => h.round === 1);
    const round2 = history.find(h => h.round === 2);
    const bothSuccess = round1?.success && round2?.success;
    
    if (bothSuccess || ecosystemHealth >= 50) {
      gameState = "victory";
    } else {
      gameState = "collapsed";
    }
    render();
    return;
  }
  
  round += 1;
  selectedDecisions = {};
  selectedActor = null;
  gameState = "event";
  showResults = false;
  drawEvent();
  render();
}

// Reset game
function resetGame() {
  gameState = "setup";
  round = 1;
  ecosystemHealth = 50;
  currentEvent = null;
  selectedDecisions = {};
  history = [];
  selectedActor = null;
  showResults = false;
  workersPlaced = 0;
  structuralFund = 0;
  render();
}

// Select actor
function selectActor(actorId) {
  selectedActor = actorId;
  render();
}

// Select decision
function selectDecision(actorId, decisionId) {
  const eventDecisions = getEventDecisions();
  const parsedDecisionId = parseInt(decisionId, 10);
  const decision = eventDecisions[actorId].find((d) => d.id === parsedDecisionId) || null;
  if (!decision) return;
  selectedDecisions = { ...selectedDecisions, [actorId]: decision };
  render();
}

// Main render function
function render() {
  const app = document.getElementById("app");
  let html = "";

  if (gameState === "setup") {
    html = renderSetupScreen();
  } else if (gameState === "collapsed") {
    html = renderCollapsedScreen(history, ecosystemHealth);
  } else if (gameState === "victory") {
    html = renderVictoryScreen(history, ecosystemHealth);
  } else {
    // Build state object for main screen
    const state = {
      round,
      ecosystemHealth,
      currentEvent,
      selectedDecisions,
      selectedActor,
      showResults,
      history,
      workersPlaced,
      structuralFund,
      MAX_ROUNDS
    };
    html = renderMainScreen(state);
  }

  app.innerHTML = html;
  wireEvents();
}

// Wire up event handlers
function wireEvents() {
  const root = document.getElementById("app");

  const startBtn = root.querySelector('[data-action="start-game"]');
  if (startBtn) {
    startBtn.addEventListener("click", startGame);
  }

  const resetBtn = root.querySelector('[data-action="reset-game"]');
  if (resetBtn) {
    resetBtn.addEventListener("click", resetGame);
  }

  const processBtn = root.querySelector('[data-action="process-round"]');
  if (processBtn) {
    processBtn.addEventListener("click", () => {
      if (!processBtn.disabled) processRound();
    });
  }

  const nextBtn = root.querySelector('[data-action="next-round"]');
  if (nextBtn) {
    nextBtn.addEventListener("click", nextRound);
  }

  root.querySelectorAll('[data-action="select-actor"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      const actorId = btn.getAttribute("data-actor-id");
      selectActor(actorId);
    });
  });

  root.querySelectorAll('[data-action="select-decision"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      const actorId = btn.getAttribute("data-actor-id");
      const decisionId = btn.getAttribute("data-decision-id");
      selectDecision(actorId, decisionId);
    });
  });
}

// Initialize the app
render();
