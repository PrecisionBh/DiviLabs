// src/lib/Deployer.js
import * as solc from "solc-js";
import { generateContractCode } from "./ContractBuilder";

export async function deployGeneratedContract(signer) {
  const sourceCode = generateContractCode();

  const input = {
    language: "Solidity",
    sources: {
      "MyToken.sol": {
        content: sourceCode,
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode.object"],
        },
      },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  if (output.errors) {
    const errors = output.errors.filter((e) => e.severity === "error");
    if (errors.length > 0) {
      throw new Error("Solidity compilation error: " + errors[0].formattedMessage);
    }
  }

  const contractFile = output.contracts["MyToken.sol"];
  const contractName = Object.keys(contractFile)[0];
  const contract = contractFile[contractName];
  const abi = contract.abi;
  const bytecode = "0x" + contract.evm.bytecode.object;

  const factory = new signer.ContractFactory(abi, bytecode, signer);
  const contractInstance = await factory.deploy();
  await contractInstance.waitForDeployment();

  return {
    contractAddress: contractInstance.target,
    abi,
  };
}