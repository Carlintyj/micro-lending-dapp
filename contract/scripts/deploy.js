const { ethers } = require("hardhat");

async function main() {
  console.log("[1/5] Starting deployment process...");

  const duration = 604800; // 1 week in seconds
  const ticketPrice = ethers.parseEther("0.01");
  const maxTicketsPerUser = 10;

  console.log("[2/5] Getting contract factory...");
  const Lottery = await ethers.getContractFactory("Lottery");
  console.log("Contract factory obtained");

  console.log("[3/5] Deploying contract with parameters:", {
    duration,
    ticketPrice: ethers.formatEther(ticketPrice) + " ETH",
    maxTicketsPerUser,
  });

  // Deploy with explicit gas parameters
  const lottery = await Lottery.deploy(
    duration,
    ticketPrice,
    maxTicketsPerUser,
    {
      gasPrice: ethers.parseUnits("1", "gwei"),
      gasLimit: 1000000,
    }
  );

  console.log("Deployment transaction sent, waiting for confirmation...");
  const deploymentReceipt = await lottery.deploymentTransaction().wait();

  console.log("[5/5] Deployment complete!");
  console.log("Contract deployed to:", await lottery.getAddress());
  console.log("Deployer address:", deploymentReceipt.from);
  console.log("Block number:", deploymentReceipt.blockNumber);
  console.log("Transaction hash:", deploymentReceipt.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
