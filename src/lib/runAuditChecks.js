// src/lib/runAuditChecks.js

export function runAuditChecks(code) {
    const results = [];
  
    const checks = [
      { label: "Mint Function", regex: /function\s+mint|_mint\(/i, severity: "❌" },
      { label: "Renounce Ownership", regex: /renounceOwnership|transferOwnership/i, severity: "⚠️" },
      { label: "Blacklist Functionality", regex: /blacklist|addToBlacklist|removeFromBlacklist/i, severity: "❌" },
      { label: "External Calls", regex: /call\(/i, severity: "⚠️" },
      { label: "Uncapped Tax or Fee", regex: /taxFee|setFee|_tax|_fee|setTaxes/i, severity: "⚠️" },
      { label: "Suspicious Transfer Logic", regex: /if\s*\(.*transfer.*\)/i, severity: "⚠️" },
      { label: "Hidden Owner Variable", regex: /address\s+private\s+owner|address\s+internal\s+owner/i, severity: "❌" },
    ];
  
    for (const check of checks) {
      const matched = check.regex.test(code);
      results.push({
        label: check.label,
        status: matched ? check.severity : "✅",
      });
    }
  
    return results;
  }
  