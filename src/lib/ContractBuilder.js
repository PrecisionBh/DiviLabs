// src/lib/ContractBuilder.js

export function generateContractCode() {
    const tokenInfo = JSON.parse(localStorage.getItem("divi_token_info")) || {};
    const tokenomics = JSON.parse(localStorage.getItem("divi_tokenomics")) || {};
    const advancedOptions = JSON.parse(localStorage.getItem("divi_advanced_options")) || {};
  
    const name = tokenInfo.name || "MyToken";
    const symbol = tokenInfo.symbol || "MTK";
    const supply = tokenInfo.supply || "1000000";
    const decimals = "18";
  
    const buyTax = Math.min(Number(tokenomics.buyTax || 0), 10);
    const sellTax = Math.min(Number(tokenomics.sellTax || 0), 10);
    const marketingWallet = tokenomics.marketingWallet || "0x000000000000000000000000000000000000dEaD";
  
    const highSellTax = Math.min(Number(advancedOptions.highSellTax || 0), 20);
    const useHighSellTax = !!advancedOptions.highSellTax;
  
    const reflections = !!advancedOptions.reflections;
    const adjustableTaxes = !!advancedOptions.adjustableTaxes;
    const antiBot = !!advancedOptions.antiBot;
    const maxWallet = advancedOptions.maxWallet || "";
    const maxTx = advancedOptions.maxTx || "";
  
    const totalSupply = `${supply} * 10 ** uint256(${decimals})`;
  
    let contract = `
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.29;
  
  contract ${symbol} {
      string public name = "${name}";
      string public symbol = "${symbol}";
      uint8 public decimals = ${decimals};
      uint256 public totalSupply = ${totalSupply};
  
      mapping(address => uint256) public balanceOf;
      mapping(address => mapping(address => uint256)) public allowance;
  
      address public owner;
      address public marketingWallet = ${JSON.stringify(marketingWallet)};`;
  
    if (reflections) {
      contract += `
      uint256 public totalReflections;
      mapping(address => bool) public isExcludedFromReflections;`;
    }
  
    if (adjustableTaxes) {
      contract += `
      uint256 public buyTax = ${buyTax};
      uint256 public sellTax = ${sellTax};
  
      function setTaxes(uint256 newBuyTax, uint256 newSellTax) external onlyOwner returns (bool) {
          require(newBuyTax <= 10 && newSellTax <= 10, "Tax too high");
          buyTax = newBuyTax;
          sellTax = newSellTax;
          return true;
      }`;
    } else {
      contract += `
      uint256 public constant buyTax = ${buyTax};
      uint256 public constant sellTax = ${sellTax};`;
    }
  
    if (useHighSellTax) {
      contract += `
      uint256 public highSellTax = ${highSellTax};`;
    }
  
    if (maxWallet) {
      contract += `
      uint256 public maxWalletPercent = ${maxWallet};`;
    }
  
    if (maxTx) {
      contract += `
      uint256 public maxTxPercent = ${maxTx};`;
    }
  
    if (antiBot) {
      contract += `
      mapping(address => bool) public isBlacklisted;
      mapping(address => uint256) public lastTxBlock;
      uint256 public cooldownBlocks = 2;
  
      function blacklist(address user, bool value) external onlyOwner {
          isBlacklisted[user] = value;
      }`;
    }
  
    contract += `
      constructor() {
          owner = msg.sender;
          balanceOf[msg.sender] = totalSupply;
          emit Transfer(address(0), msg.sender, totalSupply);
      }
  
      modifier onlyOwner() {
          require(msg.sender == owner, "Not owner");
          _;
      }
  
      event Transfer(address indexed from, address indexed to, uint256 value);
      event Approval(address indexed owner, address indexed spender, uint256 value);
  
      function transfer(address to, uint256 value) external returns (bool) {
          require(balanceOf[msg.sender] >= value, "Insufficient balance");`;
  
    if (antiBot) {
      contract += `
          require(!isBlacklisted[msg.sender] && !isBlacklisted[to], "Blacklisted");
          require(block.number > lastTxBlock[msg.sender] + cooldownBlocks, "Cooldown");
          lastTxBlock[msg.sender] = block.number;`;
    }
  
    if (maxWallet) {
      contract += `
          if (to != owner) {
              require(balanceOf[to] + value <= totalSupply * maxWalletPercent / 100, "Over max wallet");
          }`;
    }
  
    if (maxTx) {
      contract += `
          require(value <= totalSupply * maxTxPercent / 100, "Over max tx");`;
    }
  
    contract += `
          balanceOf[msg.sender] -= value;
          balanceOf[to] += value;
          emit Transfer(msg.sender, to, value);
          return true;
      }
  
      function approve(address spender, uint256 value) external returns (bool) {
          allowance[msg.sender][spender] = value;
          emit Approval(msg.sender, spender, value);
          return true;
      }
  
      function transferFrom(address from, address to, uint256 value) external returns (bool) {
          require(balanceOf[from] >= value, "Insufficient balance");
          require(allowance[from][msg.sender] >= value, "Not approved");
  
          balanceOf[from] -= value;
          balanceOf[to] += value;
          allowance[from][msg.sender] -= value;
  
          emit Transfer(from, to, value);
          return true;
      }
  
      receive() external payable {}
      fallback() external payable {}
  }
  `;
  
    return contract.trim();
  }
  