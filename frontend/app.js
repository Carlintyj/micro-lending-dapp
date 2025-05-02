let signer;
let contract;

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

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

  const response = await fetch("abi.json");
  const data = await response.json();
  contract = new ethers.Contract(CONTRACT_ADDRESS, data.abi, signer);
}

async function lend() {
  try {
    const amount = ethers.parseEther("0.01");
    const interest = ethers.parseEther("0.001");
    const tx = await contract.offerLoan(interest, { value: amount });

    await tx.wait();
    alert("Lending successful!");
  } catch (err) {
    console.error(err);
    alert("Lend failed.");
  }
}

async function repay() {
  try {
    const userAddress = await signer.getAddress();
    const loanCount = await contract.getLoanCount();
    let loanId = null;

    for (let i = 0; i < loanCount; i++) {
      const loan = await contract.getLoan(i);
      if (
        loan.borrower.toLowerCase() === userAddress.toLowerCase() &&
        !loan.isRepaid
      ) {
        loanId = i;
        break;
      }
    }

    if (loanId === null) {
      alert("No active loan found for this borrower.");
      return;
    }

    const loan = await contract.getLoan(loanId);
    const totalRepayment = loan.amount + loan.interest;

    const tx = await contract.repayLoan(loanId, { value: totalRepayment });
    await tx.wait();
    alert("Repayment successful!");
  } catch (err) {
    console.error(err);
    alert("Repayment failed.");
  }
}

document.getElementById("connectBtn").addEventListener("click", connectWallet);
