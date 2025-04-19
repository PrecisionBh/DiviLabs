// src/lib/auditScorer.js

export default function runAuditScorer(code = "") {
    let score = 100;
    const report = {};
  
    const hasMint = /function\s+mint/i.test(code);
    const hasBlacklist = /blacklist/i.test(code);
    const hasOwnerOnly = /onlyOwner/i.test(code);
    const isRenounced = /owner\s*=\s*address\(0\)/i.test(code);
    const hasMaxTx = /maxTxAmount|maxTransactionAmount/i.test(code);
    const hasFeeLogic = /_taxFee|_liquidityFee|takeFee/i.test(code);
    const usesSafeMath = /SafeMath/i.test(code);
    const proxyPattern = /delegatecall|upgradeTo/i.test(code);
    const hasReflection = /distribute|reflection/i.test(code);
  
    // Apply scoring deductions
    if (hasMint) {
      score -= 20;
      report["Mint Function Detected"] = "-20 points";
    }
  
    if (hasBlacklist) {
      score -= 15;
      report["Blacklist Logic Detected"] = "-15 points";
    }
  
    if (proxyPattern) {
      score -= 15;
      report["Proxy Pattern Found"] = "-15 points";
    }
  
    if (hasOwnerOnly) {
      score -= 10;
      report["Owner-Only Functions Present"] = "-10 points";
    }
  
    if (!isRenounced) {
      score -= 10;
      report["Ownership Not Renounced"] = "-10 points";
    }
  
    if (hasMaxTx) {
      report["Max Tx Logic"] = "+5 points (common for anti-whale)";
    }
  
    if (hasFeeLogic) {
      report["Fee Logic Found"] = "+5 points (standard for taxes)";
    }
  
    if (usesSafeMath) {
      report["SafeMath Usage"] = "+5 points";
    }
  
    if (hasReflection) {
      report["Reflection System"] = "+5 points";
    }
  
    return { score: Math.max(0, score), report };
  }
  