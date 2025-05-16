import { ethers } from "hardhat";

async function main() {
  console.log("Deploying FinanceDashboard contract...");

  const FinanceDashboard = await ethers.getContractFactory("FinanceDashboard");
  const financeDashboard = await FinanceDashboard.deploy();

  await financeDashboard.waitForDeployment();

  console.log(`FinanceDashboard deployed to: ${await financeDashboard.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
