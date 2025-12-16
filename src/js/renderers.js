// Rendering functions for the game UI
import { ACTORS, ROLE_CARDS } from './data/actors.js';
import { AVAILABLE_DECKS, getCurrentDeck, getCurrentDeckId, getActorDecision } from './data/decisions.js';
import { clampHealth, calculateSystemHealth } from './helpers.js';

// Render event title bar (clickable, for results page)
function renderEventTitleBar(event, round) {
  const colorClass = round === 1 ? 'event-red' : 'event-orange';
  const icon = round === 1 ? '⚡' : '💰';

  return `
    <div class="event-title-bar ${colorClass}" data-action="show-event-modal" data-round="${round}">
      <div class="event-title-info">
        <div class="event-title-icon">${icon}</div>
        <div class="event-title-text">
          <h3>EVENT ${round}: ${event.title}</h3>
          <p>"${event.subtitle}"</p>
        </div>
      </div>
      <div class="event-title-expand">
        <span>View Details</span>
        <span>→</span>
      </div>
    </div>
  `;
}

// Generate summary analysis based on decisions (Yes/No system)
function generateSummaryAnalysis(selectedDecisions, systemHealth, round) {
  const summaryItems = [];

  // Analyze decisions by type (Yes = green, No = red)
  const noDecisions = Object.entries(selectedDecisions).filter(([, d]) => d.type.toLowerCase() === 'red');
  const yesDecisions = Object.entries(selectedDecisions).filter(([, d]) => d.type.toLowerCase() === 'green');

  // Main status explanation
  if (systemHealth.status === 'red') {
    summaryItems.push({
      type: 'negative',
      icon: '🚫',
      title: 'System Collapsed: Too Many "No" Responses',
      desc: `${noDecisions.length} actors said "No" with conditions. When 2 or more actors cannot commit, the ecosystem cannot function without negotiation.`
    });

    // List who said No and their conditions
    if (noDecisions.length > 0) {
      const blockers = noDecisions.map(([actorId]) => `${ACTORS[actorId].icon} ${ACTORS[actorId].name}`).join(', ');
      summaryItems.push({
        type: 'negative',
        icon: '⛔',
        title: 'Actors with Conditions',
        desc: `${blockers} said "No" - they have conditions that must be met before they can participate.`
      });
    }
  } else if (systemHealth.status === 'yellow') {
    summaryItems.push({
      type: 'warning',
      icon: '⚠️',
      title: 'System Fragile: Mixed Responses',
      desc: `Some actors said "Yes" but others have conditions. The system needs negotiation to become sustainable.`
    });

    if (noDecisions.length > 0) {
      summaryItems.push({
        type: 'warning',
        icon: '🤝',
        title: 'Negotiation Needed',
        desc: `${noDecisions.length} actors have conditions that could be met through negotiation. Can the "Yes" actors help meet these conditions?`
      });
    }
  } else {
    summaryItems.push({
      type: 'positive',
      icon: '✅',
      title: 'System Sustainable: Strong Commitment',
      desc: `Majority of actors said "Yes" without conditions. The ecosystem has enough unconditional commitment to function.`
    });

    if (yesDecisions.length > 0) {
      const supporters = yesDecisions.map(([actorId]) => `${ACTORS[actorId].icon} ${ACTORS[actorId].name}`).join(', ');
      summaryItems.push({
        type: 'positive',
        icon: '💪',
        title: 'Unconditional Supporters',
        desc: `${supporters} committed without conditions, providing the foundation for ecosystem stability.`
      });
    }
  }

  // Round-specific insights
  if (round === 1) {
    summaryItems.push({
      type: systemHealth.status === 'red' ? 'negative' : (systemHealth.status === 'yellow' ? 'warning' : 'positive'),
      icon: '👷',
      title: 'Workforce Flow Impact',
      desc: systemHealth.status === 'red'
        ? 'The labor pipeline is broken. Training and hiring cannot proceed without coordinated commitment from employers, educators, and the intermediary.'
        : systemHealth.status === 'yellow'
        ? 'The labor pipeline is constrained. Conditional agreements mean workers may fall through the cracks.'
        : 'The labor pipeline is healthy. Workers can flow from training to employment with strong support.'
    });
  } else {
    summaryItems.push({
      type: systemHealth.status === 'red' ? 'negative' : (systemHealth.status === 'yellow' ? 'warning' : 'positive'),
      icon: '💵',
      title: 'Funding Sustainability',
      desc: systemHealth.status === 'red'
        ? 'No structural funding secured. The system remains dependent on temporary project subsidies that will eventually end.'
        : systemHealth.status === 'yellow'
        ? 'Partial funding secured, but still reliant on temporary sources. Long-term sustainability unclear.'
        : 'Strong structural funding commitments. The ecosystem can sustain itself beyond project timelines.'
    });
  }

  return summaryItems;
}

// Render the summary section
function renderSummarySection(selectedDecisions, systemHealth, round) {
  const summaryItems = generateSummaryAnalysis(selectedDecisions, systemHealth, round);
  const colorEmoji = { green: '🟢', yellow: '🟡', red: '🔴' };

  return `
    <div class="system-summary">
      <div class="summary-header">
        <span style="font-size: 24px;">📋</span>
        <h3>Analysis: Why is the system ${systemHealth.label}?</h3>
      </div>
      <div class="summary-content">
        ${summaryItems.map(item => `
          <div class="summary-item ${item.type}">
            <div class="summary-item-icon">${item.icon}</div>
            <div class="summary-item-text">
              <div class="summary-item-title">${item.title}</div>
              <div class="summary-item-desc">${item.desc}</div>
            </div>
          </div>
        `).join('')}

        <!-- Actor decisions breakdown -->
        <div class="summary-item">
          <div class="summary-item-icon">👥</div>
          <div class="summary-item-text">
            <div class="summary-item-title">Individual Actor Decisions</div>
            <div class="actor-contributions">
              ${Object.entries(selectedDecisions).map(([actorId, d]) => {
                const actor = ACTORS[actorId];
                const isYes = d.type.toLowerCase() === 'green';
                      </div>
                    </div>
                    ${!isYes && conditions.length > 0 ? `
                      <div class="actor-conditions" style="margin-left: 40px; margin-top: 8px; padding: 8px; background: #fef3c7; border-radius: 6px; font-size: 11px;">
                        <div style="font-weight: 600; color: #92400e; margin-bottom: 4px;">Conditions to change to YES:</div>
                        <ul style="margin: 0; padding-left: 16px; color: #78350f;">
                          ${conditions.map(c => `<li>${c.text}</li>`).join('')}
                        </ul>
                      </div>
                    ` : ''}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Render ecosystem health bar
export function renderEcosystemHealthBar(value) {
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

// Render role card (full version for modal)
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

// Render clickable role card (full version for setup screen, opens modal on click)
function renderRoleCardClickable(role) {
  const fundingStructuralPercent = Math.min(100, role.fundingPower.structural);
  const fundingTemporaryPercent = Math.min(100, role.fundingPower.temporary);

  return `
    <div class="role-card role-card-clickable" data-action="show-role-modal" data-role-id="${role.id}">
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
  const { round, currentEvent, selectedDecisions, selectedActor, showResults, workersPlaced, structuralFund, lastSystemHealth, shuffledDecisions, MAX_ROUNDS } = state;

  // Use lastSystemHealth if available (after first round), otherwise show neutral
  const headerStatus = lastSystemHealth
    ? { label: lastSystemHealth.label, color: lastSystemHealth.color }
    : { label: 'Starting', color: '#6b7280' };
  const selectedCount = Object.keys(selectedDecisions).length;
  const processDisabled = selectedCount < 5;

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
      const actorDecision = getActorDecision(selectedActor, round);
      const currentSelected = selectedDecisions[selectedActor];

      // New Yes/No UI
      if (actorDecision) {
        const yesSelected = currentSelected && currentSelected.type === 'green';
        const noSelected = currentSelected && currentSelected.type === 'red';

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

            <!-- Question -->
            <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
              <div style="font-size: 16px; font-weight: 600; color: #374151; margin-bottom: 8px;">
                ${actorDecision.question}
              </div>
              <div style="font-size: 13px; color: #6b7280;">
                Commitment: <strong>${actorDecision.commitment}</strong>
              </div>
            </div>

            <!-- Yes/No Buttons -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              <!-- YES Button -->
              <button
                class="decision-card"
                style="border: 3px solid ${yesSelected ? '#22c55e' : '#E5E7EB'}; background: ${yesSelected ? '#dcfce7' : '#FFFFFF'}; padding: 20px;"
                data-action="select-decision"
                data-actor-id="${actor.id}"
                data-decision-id="${actorDecision.yes.id}"
              >
                <div style="text-align: center;">
                  <div style="font-size: 48px; margin-bottom: 8px;">✅</div>
                  <div style="font-size: 24px; font-weight: 700; color: #22c55e; margin-bottom: 8px;">YES</div>
                  <div style="font-size: 14px; font-weight: 600; color: #166534; margin-bottom: 8px;">${actorDecision.yes.title}</div>
                  <p style="font-size: 12px; color: #6b7280; margin: 0;">${actorDecision.yes.description}</p>
                </div>
              </button>

              <!-- NO Button -->
              <button
                class="decision-card"
                style="border: 3px solid ${noSelected ? '#ef4444' : '#E5E7EB'}; background: ${noSelected ? '#fee2e2' : '#FFFFFF'}; padding: 20px;"
                data-action="select-decision"
                data-actor-id="${actor.id}"
                data-decision-id="${actorDecision.no.id}"
              >
                <div style="text-align: center;">
                  <div style="font-size: 48px; margin-bottom: 8px;">❌</div>
                  <div style="font-size: 24px; font-weight: 700; color: #ef4444; margin-bottom: 8px;">NO</div>
                  <div style="font-size: 14px; font-weight: 600; color: #991b1b; margin-bottom: 8px;">${actorDecision.no.title}</div>
                  <p style="font-size: 12px; color: #6b7280; margin: 0;">${actorDecision.no.description}</p>
                </div>
              </button>
            </div>

            <!-- Conditions (shown when NO is selected) -->
            ${noSelected && actorDecision.no.conditions ? `
              <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 16px;">
                <div style="font-size: 14px; font-weight: 700; color: #92400e; margin-bottom: 12px;">
                  ⚠️ Conditions to change my answer to YES:
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  ${actorDecision.no.conditions.map(c => `
                    <div style="display: flex; align-items: flex-start; gap: 8px; background: #fff; padding: 10px; border-radius: 6px;">
                      <span style="font-size: 14px;">${c.type === 'funding' ? '💰' : c.type === 'expertise' ? '🎓' : '📋'}</span>
                      <div>
                        <div style="font-size: 13px; color: #374151;">${c.text}</div>
                        ${c.canBeMet && c.canBeMet.length > 0 ? `
                          <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">
                            Can be met by: ${c.canBeMet.map(actorId => {
                              if (actorId === 'WILDCARD') return '🃏 Wild Card';
                              const a = ACTORS[actorId];
                              return a ? `${a.icon} ${a.name}` : actorId;
                            }).join(', ')}
                          </div>
                        ` : ''}
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        `;
      }
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
    // Round results - Calculate system health based on card colors
    const systemHealth = calculateSystemHealth(selectedDecisions);

    // Replace full event card with clickable title bar
    eventSection = renderEventTitleBar(currentEvent, round);

    eventSection += `
      <div class="round-results-card">
        <h3 class="round-results-title">📊 Round ${round} Results</h3>

        <!-- System Health Display -->
        <div
          class="round-esi-summary"
          style="background:${systemHealth.color}15; border: 3px solid ${systemHealth.color}; padding:24px;"
        >
          <div style="margin-bottom: 16px;">
            <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">Ecosystem Status</div>
            <div style="font-size: 64px; font-weight: 800; color: ${systemHealth.color};">
              ${systemHealth.status === 'green' ? '🟢' : systemHealth.status === 'yellow' ? '🟡' : '🔴'}
            </div>
            <div style="font-size: 32px; font-weight: 700; color: ${systemHealth.color}; margin-top: 8px;">
              ${systemHealth.label}
            </div>
          </div>

          <!-- Yes/No breakdown -->
          <div style="display: flex; justify-content: center; gap: 48px; margin-top: 16px; padding: 16px; background: #f9fafb; border-radius: 8px;">
            <div style="text-align: center;">
              <div style="font-size: 32px;">✅</div>
              <div style="font-size: 28px; font-weight: 700; color: #22c55e;">${systemHealth.counts.green}</div>
              <div style="font-size: 13px; color: #6b7280; font-weight: 600;">YES</div>
              <div style="font-size: 11px; color: #9ca3af;">Unconditional</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 32px;">❌</div>
              <div style="font-size: 28px; font-weight: 700; color: #ef4444;">${systemHealth.counts.red}</div>
              <div style="font-size: 13px; color: #6b7280; font-weight: 600;">NO</div>
              <div style="font-size: 11px; color: #9ca3af;">With Conditions</div>
            </div>
          </div>

        </div>

        <!-- Summary Analysis Section -->
        ${renderSummarySection(selectedDecisions, systemHealth, round)}

        <div style="text-align:center; margin-top: 20px;">
          <button class="btn btn-success" data-action="next-round">
            ${round >= MAX_ROUNDS ? "🏆 See Final Results" : "➡️ Next Event"}
          </button>
        </div>
      </div>
    `;
  }

  // Header - shows ecosystem status based on last round's color calculation
  const statusEmoji = lastSystemHealth
    ? (lastSystemHealth.status === 'green' ? '🟢' : lastSystemHealth.status === 'yellow' ? '🟡' : '🔴')
    : '⚪';

  const header = `
    <div class="header">
      <div class="header-inner">
        <div>
          <h1 class="header-title">🏗️ Construction Ecosystem</h1>
          <p class="header-round">Round ${round}/${MAX_ROUNDS} — ${currentEvent?.title || ""}</p>
        </div>
        <div class="header-metrics">
          <div style="text-align:center; background:${headerStatus.color}20; padding:8px 16px; border-radius:8px;">
            <div class="header-esi-label" style="font-size:11px; color:#6b7280;">Ecosystem Status</div>
            <div
              class="header-esi-value"
              style="color:${headerStatus.color}; font-size:20px; display:flex; align-items:center; justify-content:center; gap:6px;"
            >
              <span>${statusEmoji}</span>
              <span>${headerStatus.label}</span>
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
  const currentDeckId = getCurrentDeckId();
  const currentDeck = getCurrentDeck();

  // Build deck selector options
  const deckOptions = Object.entries(AVAILABLE_DECKS).map(([id, deck]) => {
    const isSelected = id === currentDeckId;
    return `
      <button
        class="deck-option ${isSelected ? 'deck-option-selected' : ''}"
        data-action="select-deck"
        data-deck-id="${id}"
        style="
          padding: 6px 14px;
          border: 1px solid ${isSelected ? '#3b82f6' : 'rgba(255,255,255,0.3)'};
          border-radius: 6px;
          background: ${isSelected ? 'rgba(59, 130, 246, 0.2)' : 'transparent'};
          cursor: pointer;
          text-align: center;
        "
      >
        <div style="font-weight: 600; font-size: 13px; color: ${isSelected ? '#60a5fa' : 'rgba(255,255,255,0.8)'};">
          ${isSelected ? '✓ ' : ''}${deck.name}
        </div>
      </button>
    `;
  }).join('');

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

        <!-- Deck Selector -->
        <div style="margin-bottom: 24px; display: flex; align-items: center; justify-content: center; gap: 10px;">
          <span style="font-size: 13px; color: rgba(255,255,255,0.6);">🃏 Deck:</span>
          ${deckOptions}
        </div>

        <h2 style="font-size:24px; margin-bottom:20px;">👥 The Actors</h2>
        <div class="role-cards-grid" style="margin-bottom: 30px;">
          ${ROLE_CARDS.map(role => renderRoleCardClickable(role)).join("")}
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
export function renderCollapsedScreen(history, _ecosystemHealth) {
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
export function renderVictoryScreen(history, _ecosystemHealth) {
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
