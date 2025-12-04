// Game state management and logic
import { ACTORS } from './data/actors.js';
import { EVENT_CARDS } from './data/events.js';
import { DECISION_CARDS } from './data/decisions.js';
import { clampHealth } from './helpers.js';

// Game constants
export const MAX_ROUNDS = 2;

// Initial game state
export function createInitialState() {
  return {
    phase: 'setup', // 'setup', 'event', 'collapsed', 'victory'
    round: 1,
    currentEvent: null,
    actors: JSON.parse(JSON.stringify(ACTORS)), // Deep clone
    selectedActors: [],
    decisionsThisRound: {},
    decisionHistory: [],
    roundResults: []
  };
}

// Global game state (will be initialized in app.js)
export let gameState = createInitialState();

// State setters
export function setGameState(newState) {
  gameState = { ...gameState, ...newState };
}

export function resetGameState() {
  gameState = createInitialState();
}

// Get current event card
export function getCurrentEvent() {
  return EVENT_CARDS[gameState.round - 1] || null;
}

// Get decisions for current event and actor
export function getDecisionsForActor(actorKey) {
  const eventKey = `event${gameState.round}`;
  return DECISION_CARDS[eventKey]?.[actorKey] || [];
}

// Check if actor has made a decision this round
export function hasActorDecided(actorKey) {
  return gameState.decisionsThisRound.hasOwnProperty(actorKey);
}

// Record a decision
export function recordDecision(actorKey, decision) {
  gameState.decisionsThisRound[actorKey] = decision;
  gameState.decisionHistory.push({
    round: gameState.round,
    actor: actorKey,
    decision: decision,
    timestamp: Date.now()
  });
}

// Check if all active actors have made decisions
export function allActorsDecided() {
  const activeActors = gameState.selectedActors.length > 0 
    ? gameState.selectedActors 
    : Object.keys(gameState.actors);
  
  return activeActors.every(actor => hasActorDecided(actor));
}

// Process the round and calculate results
export function processRound() {
  const decisions = gameState.decisionsThisRound;
  const event = getCurrentEvent();
  let result = {
    round: gameState.round,
    event: event,
    decisions: { ...decisions },
    success: false,
    metrics: {}
  };

  if (gameState.round === 1) {
    // Event 1: Workforce Shock - count workers placed
    let workersPlaced = 0;
    let flowBlocked = false;
    let trainingAvailable = false;
    let matchingActive = false;

    Object.entries(decisions).forEach(([actor, decision]) => {
      const impact = decision.impact || {};
      
      if (impact.workersPlaced) workersPlaced += impact.workersPlaced;
      if (impact.flowBlocked) flowBlocked = true;
      if (impact.trainingCapacity > 0 || impact.trained > 0) trainingAvailable = true;
      if (impact.matchingActive) matchingActive = true;
    });

    result.metrics = {
      workersPlaced,
      targetWorkers: event.targetWorkers || 25,
      flowBlocked,
      trainingAvailable,
      matchingActive
    };
    
    result.success = workersPlaced >= (event.targetWorkers || 25) && !flowBlocked;
    
  } else if (gameState.round === 2) {
    // Event 2: Funding Crisis - count structural fund contributions
    let structuralFund = 0;
    
    Object.entries(decisions).forEach(([actor, decision]) => {
      const impact = decision.impact || {};
      if (impact.structuralContribution) {
        structuralFund += impact.structuralContribution;
      }
    });

    result.metrics = {
      structuralFund,
      targetFund: event.targetFund || 20
    };
    
    result.success = structuralFund >= (event.targetFund || 20);
  }

  // Apply health impacts based on decisions
  Object.entries(decisions).forEach(([actorKey, decision]) => {
    if (decision.type === 'blocking') {
      gameState.actors[actorKey].health = clampHealth(gameState.actors[actorKey].health - 15);
    } else if (decision.type === 'cooperative') {
      gameState.actors[actorKey].health = clampHealth(gameState.actors[actorKey].health + 5);
    }
  });

  // Store round result
  gameState.roundResults.push(result);

  return result;
}

// Advance to next round or end game
export function advanceRound() {
  const result = processRound();
  
  // Check for game end conditions
  if (!result.success) {
    gameState.phase = 'collapsed';
    return { ended: true, victory: false, result };
  }
  
  if (gameState.round >= MAX_ROUNDS) {
    // All rounds completed successfully
    gameState.phase = 'victory';
    return { ended: true, victory: true, result };
  }
  
  // Advance to next round
  gameState.round++;
  gameState.currentEvent = getCurrentEvent();
  gameState.decisionsThisRound = {};
  
  return { ended: false, result };
}

// Start the game
export function startGame(selectedActors = []) {
  resetGameState();
  gameState.phase = 'event';
  gameState.selectedActors = selectedActors.length > 0 ? selectedActors : Object.keys(ACTORS);
  gameState.currentEvent = getCurrentEvent();
}

// Export data for renderers
export { ACTORS, EVENT_CARDS, DECISION_CARDS };
