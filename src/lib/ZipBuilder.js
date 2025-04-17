import JSZip from "jszip";
import { saveAs } from "file-saver";
import { generateContractCode } from "./ContractBuilder";

export async function downloadContractZip() {
  const zip = new JSZip();

  // Create Solidity file
  const contractCode = generateContractCode();
  zip.file("MyToken.sol", contractCode);

  // Optional: Add readme
  const readme = `
Thank you for using Divi Labs Contract Creator!

This ZIP contains your Solidity token contract using pragma ^0.8.29.
You can deploy it manually using Remix or Hardhat.
`;
  zip.file("README.txt", readme.trim());

  // Create ZIP and trigger download
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "DiviToken.zip");
}
