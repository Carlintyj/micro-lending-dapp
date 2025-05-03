// Contract ABI and Address (will be updated after deployment)
const contractABI = []; // Paste your compiled contract ABI here
let contractAddress = ""; // Set your deployed contract address here

let web3;
let lotteryContract;
let accounts = [];
let isAdmin = false;

// Initialize application
window.addEventListener("load", async () => {
  // Check if Web3 is injected
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      // Request account access
      accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      // Initialize contract
      initializeContract();

      // Set up event listeners
      setupEventListeners();

      // Start UI updates
      updateUI();
      setInterval(updateUI, 10000); // Update every 10 seconds
    } catch (error) {
      console.error("User denied account access");
    }
  } else {
    alert("Please install MetaMask to use this DApp!");
  }
});

function initializeContract() {
  lotteryContract = new web3.eth.Contract(contractABI, contractAddress);
}

function setupEventListeners() {
  // Buy tickets button
  document
    .getElementById("buyTicketsBtn")
    .addEventListener("click", buyTickets);

  // Admin buttons
  document
    .getElementById("endLotteryBtn")
    .addEventListener("click", endLottery);
  document
    .getElementById("setTicketPriceBtn")
    .addEventListener("click", setTicketPrice);
  document
    .getElementById("setMaxTicketsBtn")
    .addEventListener("click", setMaxTickets);
  document
    .getElementById("setDurationBtn")
    .addEventListener("click", setDuration);
}

async function updateUI() {
  if (!lotteryContract) return;

  try {
    // Get current lottery info
    const currentLotteryId = await lotteryContract.methods
      .currentLotteryId()
      .call();
    const lotteryEndTime = await lotteryContract.methods
      .lotteryEndTime()
      .call();
    const ticketPrice = await lotteryContract.methods.ticketPrice().call();
    const prizePool = await lotteryContract.methods
      .getCurrentPrizePool()
      .call();
    const participantsCount = await lotteryContract.methods
      .getParticipantsCount(currentLotteryId)
      .call();
    const admin = await lotteryContract.methods.admin().call();

    // Check if current user is admin
    isAdmin = accounts[0] && accounts[0].toLowerCase() === admin.toLowerCase();
    document.getElementById("adminPanel").style.display = isAdmin
      ? "block"
      : "none";
    document.getElementById("notAdminMessage").style.display = isAdmin
      ? "none"
      : "block";

    // Update UI elements
    document.getElementById("currentLotteryId").textContent = currentLotteryId;
    document.getElementById("ticketPrice").textContent = web3.utils.fromWei(
      ticketPrice,
      "ether"
    );
    document.getElementById("prizePool").textContent = web3.utils.fromWei(
      prizePool,
      "ether"
    );
    document.getElementById("participantsCount").textContent =
      participantsCount;

    // Calculate time remaining
    const now = Math.floor(Date.now() / 1000);
    const timeRemaining = lotteryEndTime - now;
    if (timeRemaining > 0) {
      const days = Math.floor(timeRemaining / 86400);
      const hours = Math.floor((timeRemaining % 86400) / 3600);
      const minutes = Math.floor((timeRemaining % 3600) / 60);
      const seconds = timeRemaining % 60;
      document.getElementById(
        "timeRemaining"
      ).textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else {
      document.getElementById("timeRemaining").textContent = "Ended";
    }

    // Load winners
    await loadWinners();
  } catch (error) {
    console.error("Error updating UI:", error);
  }
}

async function loadWinners() {
  const currentLotteryId = await lotteryContract.methods
    .currentLotteryId()
    .call();
  const winnersList = document.getElementById("winnersList");
  winnersList.innerHTML = "";

  for (let i = 1; i < currentLotteryId; i++) {
    try {
      const winner = await lotteryContract.methods.lotteryWinners(i).call();
      const prize = await lotteryContract.methods.prizePool(i).call();

      if (winner !== "0x0000000000000000000000000000000000000000") {
        const winnerDiv = document.createElement("div");
        winnerDiv.className = "mb-2";
        winnerDiv.innerHTML = `
                    <strong>Lottery #${i}:</strong> ${shortenAddress(
          winner
        )} won ${web3.utils.fromWei(prize, "ether")} ETH
                `;
        winnersList.appendChild(winnerDiv);
      }
    } catch (error) {
      console.error(`Error loading winner for lottery ${i}:`, error);
    }
  }
}

function shortenAddress(address) {
  return address ? `${address.substring(0, 6)}...${address.substring(38)}` : "";
}

async function buyTickets() {
  const ticketAmount = parseInt(document.getElementById("ticketAmount").value);
  if (isNaN(ticketAmount) || ticketAmount <= 0) {
    alert("Please enter a valid number of tickets");
    return;
  }

  try {
    const ticketPrice = await lotteryContract.methods.ticketPrice().call();
    const totalCost = ticketAmount * ticketPrice;

    await lotteryContract.methods.buyTickets(ticketAmount).send({
      from: accounts[0],
      value: totalCost,
    });

    alert(`Successfully purchased ${ticketAmount} ticket(s)!`);
    updateUI();
  } catch (error) {
    console.error("Error buying tickets:", error);
    alert(`Error: ${error.message}`);
  }
}

async function endLottery() {
  if (
    !confirm(
      "Are you sure you want to end the current lottery and select a winner?"
    )
  ) {
    return;
  }

  try {
    await lotteryContract.methods.endLottery().send({ from: accounts[0] });
    alert("Lottery ended successfully! A new lottery has started.");
    updateUI();
  } catch (error) {
    console.error("Error ending lottery:", error);
    alert(`Error: ${error.message}`);
  }
}

async function setTicketPrice() {
  const newPrice = document.getElementById("newTicketPrice").value;
  if (!newPrice || isNaN(newPrice)) {
    alert("Please enter a valid ticket price");
    return;
  }

  try {
    const priceInWei = web3.utils.toWei(newPrice, "ether");
    await lotteryContract.methods
      .setTicketPrice(priceInWei)
      .send({ from: accounts[0] });
    alert("Ticket price updated successfully!");
    updateUI();
  } catch (error) {
    console.error("Error setting ticket price:", error);
    alert(`Error: ${error.message}`);
  }
}

async function setMaxTickets() {
  const newMax = document.getElementById("newMaxTickets").value;
  if (!newMax || isNaN(newMax) || newMax <= 0) {
    alert("Please enter a valid number");
    return;
  }

  try {
    await lotteryContract.methods
      .setMaxTicketsPerUser(newMax)
      .send({ from: accounts[0] });
    alert("Max tickets per user updated successfully!");
    updateUI();
  } catch (error) {
    console.error("Error setting max tickets:", error);
    alert(`Error: ${error.message}`);
  }
}

async function setDuration() {
  const newDurationDays = document.getElementById("newDuration").value;
  if (!newDurationDays || isNaN(newDurationDays) || newDurationDays <= 0) {
    alert("Please enter a valid number of days");
    return;
  }

  try {
    const newDurationSeconds = newDurationDays * 86400; // Convert days to seconds
    await lotteryContract.methods
      .setLotteryDuration(newDurationSeconds)
      .send({ from: accounts[0] });
    alert("Lottery duration updated successfully!");
    updateUI();
  } catch (error) {
    console.error("Error setting duration:", error);
    alert(`Error: ${error.message}`);
  }
}
