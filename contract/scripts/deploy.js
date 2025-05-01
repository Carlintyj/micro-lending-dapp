async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  const LoanContract = await ethers.getContractFactory("LoanContract");
  const contract = await LoanContract.deploy();
  await contract.waitForDeployment();
  console.log(`Deployed to: ${contract.address}`);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
