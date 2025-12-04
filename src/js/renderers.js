// Rendering functions for the game UI
import { ACTORS, ROLE_CARDS } from './data/actors.js';
import { EVENT_CARDS } from './data/events.js';
import { DECISION_CARDS } from './data/decisions.js';
import { getSeverityColor, getDecisionTypeColor, calcESI, getESIStatus, clampHealth } from './helpers.js';

// Get event-specific decisions
function getEventDecisions(round) {
  return round === 1 ? DECISION_CARDS.event1 : DECISION_CARDS.event2;
}

// Render ecosystem health bar
export function renderEcosystemHealthBar(value) {
  const safeValue = clampHealth(value);
  const esi = calcESI({ SME: { health: value }, LARGE: { health: value }, EDUCATOR: { health: value }, INTERMEDIARY: { health: value }, UWV: { health: value } });
  const status = getESIStatus(esi);

  return `
    <div class="metric-bar">
      <div class="metric-bar-header">
        <span class="metric-bar-label">🏗️ Ecosystem Health</span>
        <span class="metric-bar-value" style="color:${status.color}; font-weight:700;">
          ${status.label}
        </span>
      </div>
      <div class="metric-bar-track">
        <div class="metric-bar-fill" style="width:${safeValue}%; background:${status.color}"></div>
      </div>
    </div>
  `;
}

// Render history
export function renderHistory(history) {
  if (history.length === 0) {
    return `<p style="font-size:12px; color:#9CA3AF; font-style:italic;">No rounds yet</p>`;
  }

  return `
    <div class="history-list">
      ${history
        .map((h, index) => {
          const rowColor = index % 2 === 0 ? "#F9FAFB" : "#FFFFFF";
          const statusIcon = h.success ? "✅" : "❌";
          return `
            <div class="history-item" style="background:${rowColor}">
              <div class="history-round">
                R${h.round}: ${h.event.icon} ${h.event.title}
              </div>
              <div style="font-weight:600; font-size:11px;">
                ${statusIcon} ${h.success ? "Success" : "Failed"}
                ${h.metrics?.workersPlaced !== undefined ? ` (${h.metrics.workersPlaced}/${h.metrics.targetWorkers} workers)` : ""}
                ${h.metrics?.structuralFund !== undefined ? ` (${h.metrics.structuralFund}/${h.metrics.targetFund} tokens)` : ""}
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

// Render Event 1 Card (Workforce Shock)
export function renderEvent1Card(event, workersPlaced) {
  return `
    <div class="new-event-card">
      <div class="new-event-header event-red">
        <span class="new-event-star">★</span>
        <div class="new-event-title">
          <h2>EVENT CARD 1 — ${event.title}: "${event.subtitle}"</h2>
        </div>
      </div>
      <div class="new-event-body">
        <div class="new-event-left">
          <!-- Flow Diagram -->
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
          <!-- Description -->
          <div class="event-rules-section">
            <div class="event-rules-title">DESCRIPTION</div>
            <p style="color: #d1d5db; font-size: 12px; line-height: 1.6; margin: 0;">
              ${event.description}
            </p>
          </div>
          <!-- Rules -->
          <div class="event-rules-section">
            <div class="event-rules-title">RULES</div>
            <ul class="event-rules-list">
              ${event.rules.map(r => `<li>${r}</li>`).join("")}
            </ul>
          </div>

          <!-- Success/Failure Factors -->
          <!-- Success/Failure Factors removed from left column; moved to right column -->
        </div>
        <div class="new-event-right">
          <!-- Progress Tracker -->
          <div class="progress-tracker">
            <div class="progress-title">WORKERS PLACED</div>
            <div class="progress-bar-container">
              <div class="progress-bar-fill" style="width: ${Math.min(100, (workersPlaced / 30) * 100)}%"></div>
              <div class="progress-bar-text">${workersPlaced} / 30</div>
            </div>
            <div class="progress-labels">
              <span class="progress-label">0</span>
              <span class="progress-label" style="color: #22c55e; font-weight: 700;">Goal: 25</span>
              <span class="progress-label">30</span>
            </div>
          </div>

          <!-- Success/Failure Factors (moved from left) -->
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

// Render Event 2 Card (Funding Crisis)
export function renderEvent2Card(event, structuralFund) {
  const fundPercent = Math.min(100, (structuralFund / event.targetFund) * 100);
  
  return `
    <div class="new-event-card">
      <div class="new-event-header event-orange">
        <span class="new-event-star">★</span>
        <div class="new-event-title">
          <h2>EVENT CARD 2 — ${event.title}:</h2>
          <div class="subtitle">"${event.subtitle}"</div>
        </div>
      </div>
      <div class="new-event-body">
        <div class="new-event-left">
          <!-- Fund Visualization -->
          <div class="fund-visual">
            <div class="fund-title">SHARED STRUCTURAL FUND</div>
            <div class="fund-container">
              <div class="fund-cylinder">
                <div class="fund-level" style="height: ${fundPercent}%"></div>
              </div>
            </div>
            <div class="fund-goal">GOAL: ${event.targetFund} STRUCTURAL-EQUIVALENT TOKENS</div>
            <div style="font-size: 24px; font-weight: 700; color: ${structuralFund >= event.targetFund ? '#22c55e' : '#fbbf24'};">
              ${structuralFund} / ${event.targetFund}
            </div>
            <div class="fund-indicators">
              <div class="fund-indicator">
                <div class="fund-indicator-icon yellow">💰</div>
                <div class="fund-indicator-label">TEMPORARY FUNDING</div>
              </div>
              <div class="fund-indicator">
                <div class="fund-indicator-icon green">💵</div>
                <div class="fund-indicator-label">SERVICEPUNT FUNDING</div>
              </div>
              <div class="fund-indicator">
                <div class="fund-indicator-icon red">⚠️</div>
                <div class="fund-indicator-label">EDUCATOR CAPACITY</div>
              </div>
            </div>
          </div>

          <!-- Rules -->
          <div class="event-rules-section">
            <div class="event-rules-title">RULES</div>
            <ul class="event-rules-list">
              ${event.rules.map(r => `<li>${r}</li>`).join("")}
            </ul>
          </div>
        </div>
        <div class="new-event-right">
          <!-- Description -->
          <div class="event-rules-section">
            <div class="event-rules-title">DESCRIPTION</div>
            <p style="color: #d1d5db; font-size: 12px; line-height: 1.6; margin: 0;">
              ${event.description}
            </p>
          </div>

          <!-- Success/Failure Factors -->
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

// Render influence gauge SVG
function renderInfluenceGauge(role) {
  const level = getInfluenceLevel(role.systemInfluence);
  const rotation = -90 + (level / 100) * 180;
  return `
    <svg viewBox="0 0 100 60" class="influence-gauge-svg">
      <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke="#e5e7eb" stroke-width="8" stroke-linecap="round"/>
      <path d="M 10 55 A 40 40 0 0 1 30 20" fill="none" stroke="#22c55e" stroke-width="8" stroke-linecap="round"/>
      <path d="M 30 20 A 40 40 0 0 1 50 15" fill="none" stroke="#84cc16" stroke-width="8"/>
      <path d="M 50 15 A 40 40 0 0 1 70 20" fill="none" stroke="#eab308" stroke-width="8"/>
      <path d="M 70 20 A 40 40 0 0 1 90 55" fill="none" stroke="#ef4444" stroke-width="8" stroke-linecap="round"/>
      <line x1="50" y1="55" x2="50" y2="25" stroke="#1f2937" stroke-width="3" stroke-linecap="round"
        transform="rotate(${rotation}, 50, 55)"/>
      <circle cx="50" cy="55" r="5" fill="#1f2937"/>
    </svg>
  `;
}

function getInfluenceLevel(influence) {
  if (influence.includes("Very High")) return 95;
  if (influence.includes("High")) return 75;
  if (influence.includes("Medium-High")) return 65;
  if (influence.includes("Medium")) return 50;
  return 30;
}

// Render role card
export function renderRoleCard(role) {
  const fundingStructuralPercent = Math.min(100, role.fundingPower.structural);
  const fundingTemporaryPercent = Math.min(100, role.fundingPower.temporary);
  
  return `
    <div class="role-card">
      <div class="role-card-header" style="background: ${role.color}">
        <div class="role-icon">${role.icon}</div>
        <div class="role-title-wrap">
          <h3>${role.name}</h3>
          <div class="role-subtitle">(${role.subtitle})</div>
        </div>
      </div>
      <div class="role-card-body">
        <div class="role-three-columns">
          <div class="role-column">
            <div class="role-column-title">Responsibilities</div>
            <div class="role-column-list">
              ${role.responsibilities.map(r => `<div class="role-column-item">• ${r}</div>`).join("")}
            </div>
          </div>
          <div class="role-column">
            <div class="role-column-title">Strengths</div>
            <div class="role-column-list">
              ${role.strengths.map(s => `<div class="role-column-item">• ${s}</div>`).join("")}
            </div>
          </div>
          <div class="role-column">
            <div class="role-column-title">Weaknesses</div>
            <div class="role-column-list">
              ${role.weaknesses.map(w => `<div class="role-column-item">• ${w}</div>`).join("")}
            </div>
          </div>
        </div>
        <div class="role-bottom-section">
          <div class="role-funding-section">
            <div class="role-funding-title">Funding Power</div>
            <div class="role-funding-bars">
              <div class="role-funding-bar">
                <span class="role-funding-label">Structural</span>
                <div class="role-funding-track">
                  <div class="role-funding-fill" style="width: ${fundingStructuralPercent}%; background: ${role.color}"></div>
                </div>
              </div>
              <div class="role-funding-bar">
                <span class="role-funding-label">Temporary</span>
                <div class="role-funding-track">
                  <div class="role-funding-fill" style="width: ${fundingTemporaryPercent}%; background: ${role.color}"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="role-influence-section">
            <div class="role-influence-title">Influence</div>
            <div class="role-influence-gauge">
              ${renderInfluenceGauge(role)}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Render main game screen
export function renderMainScreen(state) {
  const { round, ecosystemHealth, currentEvent, selectedDecisions, selectedActor, showResults, history, workersPlaced, structuralFund, MAX_ROUNDS } = state;
  
  const esi = ecosystemHealth;
  const esiStatus = getESIStatus(esi);
  const selectedCount = Object.keys(selectedDecisions).length;
  const processDisabled = selectedCount < 5;
  const eventDecisions = getEventDecisions(round);

  // EVENT CARD
  let eventSection = "";
  if (currentEvent) {
    eventSection = round === 1 
      ? renderEvent1Card(currentEvent, workersPlaced) 
      : renderEvent2Card(currentEvent, structuralFund);
  }

  // Decision selection UI
  if (!showResults) {
    eventSection += `
      <div style="background: #fff; border-radius: 12px; padding: 20px; margin-top: 16px;">
        <p style="font-size:14px; font-weight:600; color:#374151; margin-bottom:10px;">
          Choose decisions for each actor:
        </p>
        <div class="actors-chooser">
          ${Object.values(ACTORS)
            .map((a) => {
              const selected = selectedActor === a.id;
              const hasDecision = !!selectedDecisions[a.id];
              const borderColor = selected ? a.color : "#E5E7EB";
              const bgColor = hasDecision ? `${a.color}20` : "#FFFFFF";
              return `
                <button
                  class="actor-button"
                  style="border-color:${borderColor}; background:${bgColor}"
                  data-action="select-actor"
                  data-actor-id="${a.id}"
                >
                  <div style="font-size:20px;">${a.icon}</div>
                    <div class="actor-id" style="color:${a.color}">${a.id === 'INTERMEDIARY' ? 'Servicepunt' : (a.id === 'SECTOR' ? 'Sector Body' : a.id)}</div>
                  ${hasDecision ? `<div class="actor-selected-check">✓</div>` : ""}
                </button>
              `;
            })
            .join("")}
        </div>
      `;

    if (selectedActor) {
      const actor = ACTORS[selectedActor];
      const decisions = eventDecisions[selectedActor];
      const currentSelected = selectedDecisions[selectedActor];

      eventSection += `
        <div class="selected-actor-card" style="margin-top: 16px; border: 2px solid ${actor.color}20;">
          <div class="selected-actor-header">
            <span style="font-size:28px;">${actor.icon}</span>
            <div>
              <h3 class="selected-actor-name" style="color:${actor.color};">
                ${actor.name}
              </h3>
              <p class="selected-actor-desc">${actor.description}</p>
            </div>
          </div>
          <div class="decision-grid">
            ${decisions
              .map((d) => {
                const selected = currentSelected && currentSelected.id === d.id;
                const borderColor = selected ? actor.color : "#E5E7EB";
                const bgColor = selected ? `${actor.color}10` : "#FFFFFF";
                const typeColor = getDecisionTypeColor(d.type);

                const impact = d.impact || {};
                let metricHtml = "";
                if (round === 1 && (impact.workersPlaced > 0 || impact.trainingCapacity > 0)) {
                  const workers = impact.workersPlaced || impact.trainingCapacity || 0;
                  metricHtml = `<span style="background:#22c55e20; color:#16a34a; padding:2px 6px; border-radius:4px; font-size:10px;">+${workers} workers</span>`;
                } else if (round === 2 && impact.structuralContribution > 0) {
                  metricHtml = `<span style="background:#3b82f620; color:#2563eb; padding:2px 6px; border-radius:4px; font-size:10px;">+${impact.structuralContribution} tokens</span>`;
                }

                return `
                  <button
                    class="decision-card"
                    style="border-color:${borderColor}; background:${bgColor};"
                    data-action="select-decision"
                    data-actor-id="${actor.id}"
                    data-decision-id="${d.id}"
                  >
                    <div class="decision-header">
                      <span class="decision-title">${d.title}</span>
                      <span
                        class="decision-risk"
                        style="background:${typeColor}20; color:${typeColor};"
                      >
                        ${d.type}
                      </span>
                    </div>
                    <p class="decision-desc">${d.description}</p>
                    <div class="decision-effects">
                      ${metricHtml}
                      ${impact.flowBlocked ? `<span style="background:#ef444420; color:#dc2626; padding:2px 6px; border-radius:4px; font-size:10px;">⚠️ Blocks flow</span>` : ""}
                    </div>
                  </button>
                `;
              })
              .join("")}
          </div>
        </div>
      `;
    }

    eventSection += `
        <div class="process-round">
          <button
            class="btn btn-primary"
            data-action="process-round"
            ${processDisabled ? "disabled" : ""}
          >
            ${processDisabled ? `Select decisions (${selectedCount}/5)` : "▶️ Process Round"}
          </button>
        </div>
      </div>
    `;
  } else {
    // Round results
    const lastHistory = history[history.length - 1];
    const success = lastHistory?.success;
    
    let resultMetric = "";
    if (round === 1) {
      resultMetric = `
        <div style="margin-bottom: 16px;">
          <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">Workers Placed</div>
          <div style="font-size: 48px; font-weight: 800; color: ${workersPlaced >= 25 ? '#22c55e' : '#ef4444'};">
            ${workersPlaced} / 30
          </div>
          <div style="font-size: 14px; color: ${workersPlaced >= 25 ? '#22c55e' : '#ef4444'};">
            ${workersPlaced >= 25 ? '✅ Goal Achieved (25+ workers)' : '❌ Goal Not Met (needed 25)'}
          </div>
        </div>
      `;
    } else {
      resultMetric = `
        <div style="margin-bottom: 16px;">
          <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">Structural Fund</div>
          <div style="font-size: 48px; font-weight: 800; color: ${structuralFund >= 20 ? '#22c55e' : '#ef4444'};">
            ${structuralFund} / 20
          </div>
          <div style="font-size: 14px; color: ${structuralFund >= 20 ? '#22c55e' : '#ef4444'};">
            ${structuralFund >= 20 ? '✅ Goal Achieved (20+ tokens)' : '❌ Goal Not Met (needed 20)'}
          </div>
        </div>
      `;
    }

    eventSection += `
      <div class="round-results-card">
        <h3 class="round-results-title">📊 Round ${round} Results</h3>
        <div class="round-decisions-chips">
          ${Object.entries(selectedDecisions)
            .map(([actorId, d]) => {
              const actor = ACTORS[actorId];
              return `
                <span
                  class="round-chip"
                  style="background:${actor.color}20; color:${actor.color};"
                >
                  ${actor.icon} ${d.title}
                </span>
              `;
            })
            .join("")}
        </div>
        <div
          class="round-esi-summary"
          style="background:${success ? '#22c55e15' : '#ef444415'}; border-color:${success ? '#22c55e' : '#ef4444'}; padding:24px;"
        >
          ${resultMetric}
          <div style="font-size: 24px; margin-top: 12px;">
            ${success ? '🎉 Round Success!' : '💥 Round Failed'}
          </div>
        </div>
        <div style="text-align:center;">
          <button class="btn btn-success" data-action="next-round">
            ${round >= MAX_ROUNDS ? "🏆 See Final Results" : "➡️ Next Event"}
          </button>
        </div>
      </div>
    `;
  }

  // Header
  const header = `
    <div class="header">
      <div class="header-inner">
        <div>
          <h1 class="header-title">🏗️ Construction Ecosystem</h1>
          <p class="header-round">Round ${round}/${MAX_ROUNDS} — ${currentEvent?.title || ""}</p>
        </div>
        <div class="header-metrics">
          <div style="text-align:center; background:${esiStatus.color}20; padding:8px 16px; border-radius:8px;">
            <div class="header-esi-label" style="font-size:11px; color:#6b7280;">Status</div>
            <div
              class="header-esi-value"
              style="color:${esiStatus.color}; font-size:20px;"
            >
              ${esiStatus.label}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  return `
    ${header}
    <div class="main">
      <div style="grid-column: 1 / -1;">${eventSection}</div>
    </div>
  `;
}

// Render setup screen
export function renderSetupScreen() {
  return `
    <div class="screen-setup" style="align-items: flex-start; padding-top: 40px;">
      <div class="setup-container" style="max-width: 1400px;">
        <div style="font-size:60px; margin-bottom:16px;">🏗️</div>
        <h1 style="font-size:32px; margin-bottom:8px;">
          Construction Ecosystem Simulation
        </h1>
        <p style="color:#94A3B8; margin-bottom:20px; font-size:16px;">
          Experience the fragility of the Dutch construction labor market.
        </p>
        
        <h2 style="font-size:24px; margin-bottom:20px;">👥 The Actors</h2>
        <div class="role-cards-grid" style="margin-bottom: 30px;">
          ${ROLE_CARDS.map(role => renderRoleCard(role)).join("")}
        </div>
        
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <button
            class="btn btn-primary"
            data-action="start-game"
            style="padding:14px 40px; font-size:16px;"
          >
            🚀 Start Simulation
          </button>
        </div>
      </div>
    </div>
  `;
}

// Render collapsed screen
export function renderCollapsedScreen(history, ecosystemHealth) {
  const round1 = history.find(h => h.round === 1);
  const round2 = history.find(h => h.round === 2);

  return `
    <div class="screen-collapsed">
      <div class="end-container">
        <div style="font-size:70px; margin-bottom:20px;">💥</div>
        <h1 style="font-size:36px; margin-bottom:12px;">
          Ecosystem Collapsed
        </h1>
        <p style="color:#FCA5A5; font-size:18px; margin-bottom:24px;">
          The construction labor ecosystem failed to stabilize
        </p>
        
        <div class="card" style="margin-bottom: 20px;">
          <h3 style="color:#374151; margin-bottom:16px;">📊 Round Results</h3>
          <div style="display: grid; gap: 12px;">
            ${round1 ? `
              <div style="padding: 12px; background: ${round1.success ? '#f0fdf4' : '#fef2f2'}; border-radius: 8px; border-left: 4px solid ${round1.success ? '#22c55e' : '#ef4444'};">
                <div style="font-weight: 700; color: #374151;">Round 1: Workforce Shock</div>
                <div style="color: ${round1.success ? '#16a34a' : '#dc2626'}; font-size: 14px;">
                  ${round1.success ? '✅' : '❌'} ${round1.metrics?.workersPlaced || 0}/${round1.metrics?.targetWorkers || 25} workers placed
                </div>
              </div>
            ` : ''}
            ${round2 ? `
              <div style="padding: 12px; background: ${round2.success ? '#f0fdf4' : '#fef2f2'}; border-radius: 8px; border-left: 4px solid ${round2.success ? '#22c55e' : '#ef4444'};">
                <div style="font-weight: 700; color: #374151;">Round 2: Funding Crisis</div>
                <div style="color: ${round2.success ? '#16a34a' : '#dc2626'}; font-size: 14px;">
                  ${round2.success ? '✅' : '❌'} ${round2.metrics?.structuralFund || 0}/${round2.metrics?.targetFund || 20} tokens raised
                </div>
              </div>
            ` : ''}
          </div>
        </div>
        
        <div class="card">
          <h3 style="color:#991B1B; margin-bottom:10px;">💡 Key Lessons</h3>
          <ul class="lessons-list">
            <li><strong>Collaboration</strong> is essential - no actor can succeed alone</li>
            <li><strong>"Wait & See"</strong> decisions often block critical flows</li>
            <li><strong>Structural funding</strong> must replace temporary subsidies</li>
            <li><strong>All actors</strong> must contribute for system resilience</li>
          </ul>
        </div>
        <button
          class="btn btn-danger"
          style="padding:14px 40px; font-size:16px;"
          data-action="reset-game"
        >
          🔄 Try Again
        </button>
      </div>
    </div>
  `;
}

// Render victory screen
export function renderVictoryScreen(history, ecosystemHealth) {
  const round1 = history.find(h => h.round === 1);
  const round2 = history.find(h => h.round === 2);

  return `
    <div class="screen-victory">
      <div class="end-container">
        <div style="font-size:70px; margin-bottom:20px;">🎉</div>
        <h1 style="font-size:36px; margin-bottom:12px;">
          Ecosystem Stabilized!
        </h1>
        <p style="color:#86EFAC; font-size:18px; margin-bottom:24px;">
          Successfully navigated both crises!
        </p>
        
        <div class="card" style="margin-bottom: 20px;">
          <h3 style="color:#374151; margin-bottom:16px;">📊 Round Results</h3>
          <div style="display: grid; gap: 12px;">
            ${round1 ? `
              <div style="padding: 12px; background: ${round1.success ? '#f0fdf4' : '#fef2f2'}; border-radius: 8px; border-left: 4px solid ${round1.success ? '#22c55e' : '#ef4444'};">
                <div style="font-weight: 700; color: #374151;">Round 1: Workforce Shock</div>
                <div style="color: ${round1.success ? '#16a34a' : '#dc2626'}; font-size: 14px;">
                  ${round1.success ? '✅' : '❌'} ${round1.metrics?.workersPlaced || 0}/${round1.metrics?.targetWorkers || 25} workers placed
                </div>
              </div>
            ` : ''}
            ${round2 ? `
              <div style="padding: 12px; background: ${round2.success ? '#f0fdf4' : '#fef2f2'}; border-radius: 8px; border-left: 4px solid ${round2.success ? '#22c55e' : '#ef4444'};">
                <div style="font-weight: 700; color: #374151;">Round 2: Funding Crisis</div>
                <div style="color: ${round2.success ? '#16a34a' : '#dc2626'}; font-size: 14px;">
                  ${round2.success ? '✅' : '❌'} ${round2.metrics?.structuralFund || 0}/${round2.metrics?.targetFund || 20} tokens raised
                </div>
              </div>
            ` : ''}
          </div>
        </div>
        
        <div class="card">
          <h3 style="color:#166534; margin-bottom:12px;">🏆 Success Factors</h3>
          <ul class="lessons-list">
            <li><strong>Coordinated response</strong> across all actors</li>
            <li><strong>Investment decisions</strong> over passive waiting</li>
            <li><strong>Collaborative approaches</strong> maximized impact</li>
            <li><strong>Structural commitments</strong> ensured sustainability</li>
          </ul>
        </div>
        <button
          class="btn btn-success"
          style="padding:14px 40px; font-size:16px;"
          data-action="reset-game"
        >
          🔄 Play Again
        </button>
      </div>
    </div>
  `;
}
