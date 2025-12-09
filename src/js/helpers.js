// Helper/utility functions

export function getSeverityColor(severity) {
  switch (severity) {
    case 'critical': return '#dc3545';
    case 'high': return '#fd7e14';
    case 'medium': return '#ffc107';
    case 'low': return '#28a745';
    default: return '#6c757d';
  }
}

export function getDecisionTypeColor(type) {
  switch (type) {
    case 'cooperative': return '#28a745';
    case 'cautious': return '#ffc107';
    case 'investment': return '#17a2b8';
    case 'blocking': return '#dc3545';
    default: return '#6c757d';
  }
}

export function getDecisionTypeLabel(type) {
  switch (type) {
    case 'cooperative': return '✓ Cooperative';
    case 'cautious': return '⚡ Cautious';
    case 'investment': return '📈 Investment';
    case 'blocking': return '✗ Blocking';
    default: return type;
  }
}

export function calcESI(actors) {
  const weights = { SME: 0.2, LARGE: 0.25, EDUCATOR: 0.2, INTERMEDIARY: 0.2, UWV: 0.15 };
  return Object.keys(actors).reduce((sum, key) => sum + (actors[key].health / 100) * (weights[key] || 0.2), 0);
}

export function getESIStatus(esi) {
  if (esi >= 0.7) return { label: 'Healthy', color: '#28a745' };
  if (esi >= 0.4) return { label: 'Stressed', color: '#ffc107' };
  return { label: 'Critical', color: '#dc3545' };
}

export function clampHealth(val) {
  return Math.max(0, Math.min(100, val));
}

export function formatNumber(num) {
  return num.toLocaleString();
}

export function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Calculate system health based on decision card colors
// Returns: { status: 'green'|'yellow'|'red', counts: {green, yellow, red}, label, color }
export function calculateSystemHealth(selectedDecisions) {
  const counts = { green: 0, yellow: 0, red: 0 };

  // Count each color type from selected decisions
  Object.values(selectedDecisions).forEach(decision => {
    if (decision && decision.type) {
      const type = decision.type.toLowerCase();
      if (counts[type] !== undefined) {
        counts[type]++;
      }
    }
  });

  const total = counts.green + counts.yellow + counts.red;

  // Determine system status based on color distribution
  // Priority: Red cards have high negative impact
  // - 2+ red cards → System is RED (critical)
  // - Majority green (more green than yellow+red) → System is GREEN
  // - Otherwise → System is YELLOW
  let status, label, color;

  if (counts.red >= 2) {
    status = 'red';
    label = 'Collapsed';
    color = '#dc3545';
  } else if (counts.green > counts.yellow + counts.red) {
    status = 'green';
    label = 'Sustainable';
    color = '#28a745';
  } else if (counts.green >= counts.yellow && counts.red <= 1) {
    status = 'yellow';
    label = 'Fragile';
    color = '#ffc107';
  } else {
    status = 'yellow';
    label = 'Fragile';
    color = '#ffc107';
  }

  return { status, counts, label, color, total };
}
