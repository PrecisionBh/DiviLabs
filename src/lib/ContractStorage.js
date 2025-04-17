import JSZip from "jszip";

// ✅ Save a generated contract to localStorage
export function storeContractLocally(data) {
  const id = data?.id || Date.now().toString(); // Preserve ID if passed
  const wallet = data?.wallet || localStorage.getItem("connected_wallet") || "";

  const item = {
    id,
    name: data?.tokenInfo?.name || "Unnamed Token",
    symbol: data?.tokenInfo?.symbol || "",
    tokenInfo: data?.tokenInfo || {},
    package: data?.package || "basic",
    timestamp: Date.now(),
    wallet,
    code: data?.code || generateContractCodeIfMissing(data),
  };

  localStorage.setItem(`divi_contract_${id}`, JSON.stringify(item));
  localStorage.setItem("last_contract_id", id);
  return id;
}

// ✅ Load a single contract by ID
export function getStoredContract(id) {
  const raw = localStorage.getItem(`divi_contract_${id}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ✅ Get all saved contracts
export function getAllSavedContracts() {
  const keys = Object.keys(localStorage).filter((k) => k.startsWith("divi_contract_"));
  return keys.map((k) => {
    try {
      return JSON.parse(localStorage.getItem(k));
    } catch {
      return null;
    }
  }).filter(Boolean);
}

// ✅ Trigger a download of the ZIP file for a contract by ID
export function downloadZipById(id) {
  const data = getStoredContract(id);
  if (!data) return;

  const blob = new Blob([data.code], { type: "text/plain" });
  const zip = new JSZip();
  zip.file(`${data.name || "Token"}.sol`, blob);

  zip.generateAsync({ type: "blob" }).then((content) => {
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.name || "MyToken"}_Contract.zip`;
    a.click();
    URL.revokeObjectURL(url);
  });
}

// 🧠 Optional fallback if code is missing
function generateContractCodeIfMissing(data) {
  if (typeof window.generateContractCode === "function") {
    return window.generateContractCode();
  }
  return "// Contract code missing.";
}
