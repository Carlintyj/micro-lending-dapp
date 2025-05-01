let signer;
let contract;

const CONTRACT_ADDRESS = "0xE1846dD8aE1Fe167e576a50d43213C90BB3B2999"; // replace me

async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask not found!");
    return;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  document.getElementById("userAddress").innerText = await signer.getAddress();
  document.getElementById("app").style.display = "block";

  const abi = (await fetch("abi.json")).json();
  abi.then((data) => {
    contract = new ethers.Contract(CONTRACT_ADDRESS, data.abi, signer);
  });
}

async function lend() {
  try {
    const tx = await contract.offerLoan({ value: ethers.parseEther("0.01") });
    await tx.wait();
    alert("Lending successful!");
  } catch (err) {
    console.error(err);
    alert("Lend failed.");
  }
}

async function repay() {
  try {
    const tx = await contract.repayLoan();
    await tx.wait();
    alert("Repayment successful!");
  } catch (err) {
    console.error(err);
    alert("Repayment failed.");
  }
}

document.getElementById("connectBtn").addEventListener("click", connectWallet);
