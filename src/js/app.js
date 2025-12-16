// Main application entry point
import { ACTORS, ROLE_CARDS } from './data/actors.js';
import { EVENT_CARDS } from './data/events.js';
import { DECISION_CARDS, setCurrentDeck, getActorDecision } from './data/decisions.js';
import { clampHealth, calculateSystemHealth } from './helpers.js';
import {
  renderSetupScreen,
  renderMainScreen,
  renderCollapsedScreen,
  renderVictoryScreen,
  renderRoleCard
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
let lastSystemHealth = null; // Stores the color-based system health after each round
let shuffledDecisions = { event1: {}, event2: {} }; // Stores shuffled decision cards per event

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Initialize shuffled decisions for all actors and events
function initializeShuffledDecisions() {
  shuffledDecisions = { event1: {}, event2: {} };

  // Shuffle event1 decisions for each actor
  Object.keys(DECISION_CARDS.event1).forEach(actorId => {
    shuffledDecisions.event1[actorId] = shuffleArray(DECISION_CARDS.event1[actorId]);
  });

  // Shuffle event2 decisions for each actor
  Object.keys(DECISION_CARDS.event2).forEach(actorId => {
    shuffledDecisions.event2[actorId] = shuffleArray(DECISION_CARDS.event2[actorId]);
  });
}

// Get event decisions for current round (returns pre-shuffled decisions)
function getEventDecisions() {
  return round === 1 ? DECISION_CARDS.event1 : DECISION_CARDS.event2;
}

// Get shuffled decisions for current round
function getShuffledDecisions() {
  return round === 1 ? shuffledDecisions.event1 : shuffledDecisions.event2;
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
  lastSystemHealth = null;
  initializeShuffledDecisions(); // Shuffle cards once at game start
  drawEvent();
  render();
}

// Process round
function processRound() {
  if (!currentEvent) return;

  // Calculate system health based on card colors
  lastSystemHealth = calculateSystemHealth(selectedDecisions);

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
  lastSystemHealth = null;
  render();
}

// Select actor
function selectActor(actorId) {
  selectedActor = actorId;
  render();
}

// Select decision (Yes/No system)
function selectDecision(actorId, decisionId) {
  const parsedDecisionId = parseInt(decisionId, 10);
  const actorDecision = getActorDecision(actorId, round);

  if (!actorDecision) return;

  // Find if it's the yes or no decision
  let decision = null;
  if (actorDecision.yes.id === parsedDecisionId) {
    decision = actorDecision.yes;
  } else if (actorDecision.no.id === parsedDecisionId) {
    decision = actorDecision.no;
  }

  if (!decision) return;
  selectedDecisions = { ...selectedDecisions, [actorId]: decision };
  render();
}

// Modal functions
function showRoleModal(roleId) {
  const parsedId = parseInt(roleId, 10);
  const role = ROLE_CARDS.find(r => r.id === parsedId);
  if (!role) return;

  const modalHtml = `
    <div class="modal-overlay" data-action="close-modal">
      <div class="modal-content modal-stop-propagation" style="max-width: 500px;">
        <button class="modal-close-btn" data-action="close-modal">×</button>
        ${renderRoleCard(role)}
      </div>
    </div>
  `;

  // Append modal to body
  const modalContainer = document.createElement('div');
  modalContainer.id = 'modal-container';
  modalContainer.innerHTML = modalHtml;
  document.body.appendChild(modalContainer);

  // Wire close events
  wireModalEvents();
}

function showEventModal(roundNum) {
  const eventData = EVENT_CARDS.find(e => e.id === parseInt(roundNum));
  if (!eventData) return;

  // Render event card content based on round
  const eventContent = roundNum === 1 || roundNum === '1'
    ? renderEvent1CardForModal(eventData)
    : renderEvent2CardForModal(eventData);

  const modalHtml = `
    <div class="modal-overlay" data-action="close-modal">
      <div class="modal-content modal-stop-propagation" style="max-width: 900px;">
        <button class="modal-close-btn" data-action="close-modal">×</button>
        ${eventContent}
      </div>
    </div>
  `;

  const modalContainer = document.createElement('div');
  modalContainer.id = 'modal-container';
  modalContainer.innerHTML = modalHtml;
  document.body.appendChild(modalContainer);

  wireModalEvents();
}

function renderEvent1CardForModal(event) {
  return `
    <div class="new-event-card" style="margin: 0;">
      <div class="new-event-header event-red">
        <span class="new-event-star">★</span>
        <div class="new-event-title">
          <h2>EVENT CARD 1 — ${event.title}: "${event.subtitle}"</h2>
        </div>
      </div>
      <div class="new-event-body">
        <div class="new-event-left">
          <div class="flow-diagram">
            <div class="flow-demand-row">
              <div class="demand-box">
                <div class="demand-label">SME Demand:</div>
                <div class="demand-value">${event.smeDemand} WORKERS</div>
              </div>
              <div class="demand-box">
                <div class="demand-label">Large Employer Demand:</div>
                <div class="demand-value">${event.largeDemand} WORKERS</div>
              </div>
            </div>
            <div class="flow-process">
              <div class="flow-node">
                <div class="flow-icon blue">👤</div>
                <div class="flow-label">JOBSEEKER</div>
              </div>
              <span class="flow-arrow">→</span>
              <div class="flow-node">
                <div class="flow-icon green">🎓</div>
                <div class="flow-label">TRAINING<br>Educator</div>
              </div>
              <span class="flow-arrow">→</span>
              <div class="flow-node">
                <div class="flow-icon orange">🏢</div>
                <div class="flow-label">EMPLOYMENT<br>Employer</div>
              </div>
              <span class="flow-arrow">→</span>
              <div class="flow-node">
                <div class="flow-icon yellow">🤝</div>
                <div class="flow-label">Servicepunt</div>
              </div>
            </div>
          </div>
          <div class="event-rules-section">
            <div class="event-rules-title">DESCRIPTION</div>
            <p style="color: #d1d5db; font-size: 12px; line-height: 1.6; margin: 0;">
              ${event.description}
            </p>
          </div>
          <div class="event-rules-section">
            <div class="event-rules-title">RULES</div>
            <ul class="event-rules-list">
              ${event.rules.map(r => `<li>${r}</li>`).join("")}
            </ul>
          </div>
        </div>
        <div class="new-event-right">
          <div class="progress-tracker">
            <div class="progress-title">TARGET</div>
            <div style="font-size: 24px; font-weight: 700; color: #22c55e; text-align: center;">
              25 / 30 WORKERS
            </div>
          </div>
          <div class="factors-box" style="margin-bottom: 12px;">
            <div class="factors-title success">SUCCESS FACTORS</div>
            <ul class="factors-list">
              ${event.successFactors.map(f => `<li class="success"><span class="factor-icon">✅</span>${f}</li>`).join("")}
            </ul>
          </div>
          <div class="factors-box">
            <div class="factors-title failure">FAILURE FACTORS</div>
            <ul class="factors-list">
              ${event.failureFactors.map(f => `<li class="failure"><span class="factor-icon">✘</span>${f}</li>`).join("")}
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderEvent2CardForModal(event) {
  return `
    <div class="new-event-card" style="margin: 0;">
      <div class="new-event-header event-orange">
        <span class="new-event-star">★</span>
        <div class="new-event-title">
          <h2>EVENT CARD 2 — ${event.title}:</h2>
          <div class="subtitle">"${event.subtitle}"</div>
        </div>
      </div>
      <div class="new-event-body">
        <div class="new-event-left">
          <div class="fund-visual">
            <div class="fund-title">SHARED STRUCTURAL FUND</div>
            <div class="fund-goal">GOAL: ${event.targetFund} STRUCTURAL-EQUIVALENT TOKENS</div>
          </div>
          <div class="event-rules-section">
            <div class="event-rules-title">RULES</div>
            <ul class="event-rules-list">
              ${event.rules.map(r => `<li>${r}</li>`).join("")}
            </ul>
          </div>
        </div>
        <div class="new-event-right">
          <div class="event-rules-section">
            <div class="event-rules-title">DESCRIPTION</div>
            <p style="color: #d1d5db; font-size: 12px; line-height: 1.6; margin: 0;">
              ${event.description}
            </p>
          </div>
          <div class="factors-box" style="margin-bottom: 12px;">
            <div class="factors-title success">SUCCESS FACTORS</div>
            <ul class="factors-list">
              ${event.successFactors.map(f => `<li class="success"><span class="factor-icon">✅</span>${f}</li>`).join("")}
            </ul>
          </div>
          <div class="factors-box">
            <div class="factors-title failure">FAILURE FACTORS</div>
            <ul class="factors-list">
              ${event.failureFactors.map(f => `<li class="failure"><span class="factor-icon">✘</span>${f}</li>`).join("")}
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
}

function closeModal() {
  const modalContainer = document.getElementById('modal-container');
  if (modalContainer) {
    modalContainer.remove();
  }
}

function wireModalEvents() {
  const modalContainer = document.getElementById('modal-container');
  if (!modalContainer) return;

  // Stop propagation on modal content to prevent closing when clicking inside
  modalContainer.querySelectorAll('.modal-stop-propagation').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });

  // Close on overlay click or close button
  modalContainer.querySelectorAll('[data-action="close-modal"]').forEach(el => {
    el.addEventListener('click', closeModal);
  });

  // Close on Escape key
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
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
      lastSystemHealth,
      shuffledDecisions: getShuffledDecisions(),
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

  // Deck selection
  root.querySelectorAll('[data-action="select-deck"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      const deckId = btn.getAttribute("data-deck-id");
      if (setCurrentDeck(deckId)) {
        render();
      }
    });
  });

  // Role modal (on setup screen)
  root.querySelectorAll('[data-action="show-role-modal"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      const roleId = btn.getAttribute("data-role-id");
      showRoleModal(roleId);
    });
  });

  // Event modal (on results screen)
  root.querySelectorAll('[data-action="show-event-modal"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      const roundNum = btn.getAttribute("data-round");
      showEventModal(roundNum);
    });
  });
}

// Initialize the app
render();
