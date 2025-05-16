import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

async function main(): Promise<void> {
  try {
    // Get the contract factory for NFTSTORE
    const FinanceDashboard: ContractFactory = await ethers.getContractFactory("FinanceDashboard");

    console.log("Deploying FinanceDashboard...");
    // Deploy the contract
    const financeDashboard = await FinanceDashboard.deploy();

    // Get the deployment transaction
    const deploymentTx = financeDashboard.deploymentTransaction();
    if (!deploymentTx) {
      throw new Error("Deployment transaction is null");
    }

    // Wait for the transaction to be mined
    console.log("Waiting for deployment transaction to be mined...");
    const receipt = await deploymentTx.wait();

    if (receipt && receipt.contractAddress) {
      console.log("FinanceDashboard deployed to:", receipt.contractAddress);
      console.log("Transaction hash:", deploymentTx.hash);
    } else {
      throw new Error("Deploy failed - no contract address");
    }
  } catch (error) {
    console.error("Deployment failed:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });