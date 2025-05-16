import { ethers } from "hardhat";

async function main() {
  console.log("Estimating gas costs for FinanceDashboard contract on Base Sepolia...\n");

  // Get the average gas price from the network
  const feeData = await ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice || ethers.parseUnits("5", "gwei"); // Fallback value if gasPrice is null
  console.log(`Current gas price: ${ethers.formatUnits(gasPrice, "gwei")} gwei\n`);
  
  // ETH price in USD (this is an example value, you might want to fetch this from an API)
  const ethPriceUSD = 3500; // Example ETH price in USD
  const baseSEPTokenPriceUSD = 0.01; // This is a testnet token, so price is just for estimation purposes
  
  // Deploy the contract
  const FinanceDashboard = await ethers.getContractFactory("FinanceDashboard");
  const deployTx = await FinanceDashboard.getDeployTransaction();
  const estimatedGas = await ethers.provider.estimateGas(deployTx);
  
  console.log("=== Deployment Costs ===");
  console.log(`Estimated gas for deployment: ${estimatedGas.toString()}`);
  
  const deploymentCostETH = Number(estimatedGas) * Number(ethers.formatUnits(gasPrice, "ether"));
  const deploymentCostUSD = deploymentCostETH * ethPriceUSD;
  
  console.log(`Deployment cost: ${deploymentCostETH.toFixed(6)} ETH (~ $${deploymentCostUSD.toFixed(2)})`);
  console.log(`Deployment cost in BASE SEPOLIA: ${(deploymentCostETH / baseSEPTokenPriceUSD).toFixed(6)} BASE SEP tokens\n`);
  
  // Deploy the contract for function estimation
  const financeDashboard = await FinanceDashboard.deploy();
  await financeDashboard.waitForDeployment();
  
  console.log("=== Function Call Costs ===");
  
  // Estimate updateFinancialData cost
  const updateFinancialDataGas = await financeDashboard.updateFinancialData.estimateGas(5000, 3000);
  const updateFinancialDataCostETH = Number(updateFinancialDataGas) * Number(ethers.formatUnits(gasPrice, "ether"));
  const updateFinancialDataCostUSD = updateFinancialDataCostETH * ethPriceUSD;
  
  console.log(`1. updateFinancialData:`);
  console.log(`   - Gas: ${updateFinancialDataGas}`);
  console.log(`   - Cost: ${updateFinancialDataCostETH.toFixed(6)} ETH (~ $${updateFinancialDataCostUSD.toFixed(2)})`);
  console.log(`   - Cost in BASE SEPOLIA: ${(updateFinancialDataCostETH / baseSEPTokenPriceUSD).toFixed(6)} BASE SEP tokens`);
  
  // Estimate addTransaction cost
  const addTransactionGas = await financeDashboard.addTransaction.estimateGas("Salary", "Income", Math.floor(Date.now() / 1000), 5000);
  const addTransactionCostETH = Number(addTransactionGas) * Number(ethers.formatUnits(gasPrice, "ether"));
  const addTransactionCostUSD = addTransactionCostETH * ethPriceUSD;
  
  console.log(`2. addTransaction:`);
  console.log(`   - Gas: ${addTransactionGas}`);
  console.log(`   - Cost: ${addTransactionCostETH.toFixed(6)} ETH (~ $${addTransactionCostUSD.toFixed(2)})`);
  console.log(`   - Cost in BASE SEPOLIA: ${(addTransactionCostETH / baseSEPTokenPriceUSD).toFixed(6)} BASE SEP tokens`);
  
  // Estimate addBudget cost
  const addBudgetGas = await financeDashboard.addBudget.estimateGas("Groceries", 300, 500);
  const addBudgetCostETH = Number(addBudgetGas) * Number(ethers.formatUnits(gasPrice, "ether"));
  const addBudgetCostUSD = addBudgetCostETH * ethPriceUSD;
  
  console.log(`3. addBudget:`);
  console.log(`   - Gas: ${addBudgetGas}`);
  console.log(`   - Cost: ${addBudgetCostETH.toFixed(6)} ETH (~ $${addBudgetCostUSD.toFixed(2)})`);
  console.log(`   - Cost in BASE SEPOLIA: ${(addBudgetCostETH / baseSEPTokenPriceUSD).toFixed(6)} BASE SEP tokens`);
  
  // Estimate updateBudget cost (first we need to add a budget)
  await financeDashboard.addBudget("Test budget", 100, 200);
  const updateBudgetGas = await financeDashboard.updateBudget.estimateGas(0, 150, 250);
  const updateBudgetCostETH = Number(updateBudgetGas) * Number(ethers.formatUnits(gasPrice, "ether"));
  const updateBudgetCostUSD = updateBudgetCostETH * ethPriceUSD;
  
  console.log(`4. updateBudget:`);
  console.log(`   - Gas: ${updateBudgetGas}`);
  console.log(`   - Cost: ${updateBudgetCostETH.toFixed(6)} ETH (~ $${updateBudgetCostUSD.toFixed(2)})`);
  console.log(`   - Cost in BASE SEPOLIA: ${(updateBudgetCostETH / baseSEPTokenPriceUSD).toFixed(6)} BASE SEP tokens`);
  
  // Estimate addSavingsGoal cost
  const addSavingsGoalGas = await financeDashboard.addSavingsGoal.estimateGas("Vacation", 1000, 5000);
  const addSavingsGoalCostETH = Number(addSavingsGoalGas) * Number(ethers.formatUnits(gasPrice, "ether"));
  const addSavingsGoalCostUSD = addSavingsGoalCostETH * ethPriceUSD;
  
  console.log(`5. addSavingsGoal:`);
  console.log(`   - Gas: ${addSavingsGoalGas}`);
  console.log(`   - Cost: ${addSavingsGoalCostETH.toFixed(6)} ETH (~ $${addSavingsGoalCostUSD.toFixed(2)})`);
  console.log(`   - Cost in BASE SEPOLIA: ${(addSavingsGoalCostETH / baseSEPTokenPriceUSD).toFixed(6)} BASE SEP tokens`);
  
  // Estimate updateSavingsGoal cost (first we need to add a savings goal)
  await financeDashboard.addSavingsGoal("Test goal", 500, 1000);
  const updateSavingsGoalGas = await financeDashboard.updateSavingsGoal.estimateGas(0, 600, 1200);
  const updateSavingsGoalCostETH = Number(updateSavingsGoalGas) * Number(ethers.formatUnits(gasPrice, "ether"));
  const updateSavingsGoalCostUSD = updateSavingsGoalCostETH * ethPriceUSD;
  
  console.log(`6. updateSavingsGoal:`);
  console.log(`   - Gas: ${updateSavingsGoalGas}`);
  console.log(`   - Cost: ${updateSavingsGoalCostETH.toFixed(6)} ETH (~ $${updateSavingsGoalCostUSD.toFixed(2)})`);
  console.log(`   - Cost in BASE SEPOLIA: ${(updateSavingsGoalCostETH / baseSEPTokenPriceUSD).toFixed(6)} BASE SEP tokens`);
  
  // Estimate read function costs (these are typically free as they don't modify state)
  console.log(`\n=== Read Functions (Free, no gas cost) ===`);
  console.log(`- getFinancialData`);
  console.log(`- getTransactions`);
  console.log(`- getBudgets`);
  console.log(`- getSavingsGoals`);
  
  console.log(`\n=== Total Estimated Cost for Initial Setup ===`);
  const totalSetupGas = Number(updateFinancialDataGas) + Number(addTransactionGas) + 
                        Number(addBudgetGas) + Number(addSavingsGoalGas);
  const totalSetupCostETH = updateFinancialDataCostETH + addTransactionCostETH + 
                           addBudgetCostETH + addSavingsGoalCostETH;
  const totalSetupCostUSD = totalSetupCostETH * ethPriceUSD;
  
  console.log(`Gas: ${totalSetupGas}`);
  console.log(`Cost: ${totalSetupCostETH.toFixed(6)} ETH (~ $${totalSetupCostUSD.toFixed(2)})`);
  console.log(`Cost in BASE SEPOLIA: ${(totalSetupCostETH / baseSEPTokenPriceUSD).toFixed(6)} BASE SEP tokens`);
  
  console.log(`\nNote: These estimates assume a gas price of ${ethers.formatUnits(gasPrice, "gwei")} gwei and ETH price of $${ethPriceUSD}.`);
  console.log(`Actual costs may vary based on network conditions and ETH price at the time of execution.`);
  console.log(`Base Sepolia is a testnet, so these costs are just for estimation purposes.`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
