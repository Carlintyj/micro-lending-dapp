async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  const LoanContract = await ethers.getContractFactory("LoanContract");
  const contract = await LoanContract.deploy();
  const deployment = await contract.waitForDeployment(); // Wait for deployment to be confirmed
  console.log(`Deployed to: ${await deployment.getAddress()}`); // Get the address from the deployment object
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
