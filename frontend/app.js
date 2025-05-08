document.addEventListener("DOMContentLoaded", async function () {
  const contractABI = [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "numberOfTickets",
          type: "uint256",
        },
      ],
      name: "buyTickets",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "endLottery",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_duration",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_ticketPrice",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_maxTickets",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "FailedCall",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "balance",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "needed",
          type: "uint256",
        },
      ],
      name: "InsufficientBalance",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "lotteryId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "winner",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "prize",
          type: "uint256",
        },
      ],
      name: "LotteryEnded",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "lotteryId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "endTime",
          type: "uint256",
        },
      ],
      name: "LotteryStarted",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "newDuration",
          type: "uint256",
        },
      ],
      name: "setLotteryDuration",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "newMax",
          type: "uint256",
        },
      ],
      name: "setMaxTicketsPerUser",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "newPrice",
          type: "uint256",
        },
      ],
      name: "setTicketPrice",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "startNewLottery",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "lotteryId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "buyer",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "TicketsPurchased",
      type: "event",
    },
    {
      inputs: [],
      name: "admin",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "currentLotteryId",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getCurrentPrizePool",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "lotteryId",
          type: "uint256",
        },
      ],
      name: "getParticipantsCount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "lotteryDuration",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "lotteryEndTime",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "lotteryWinners",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "maxTicketsPerUser",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "participants",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "prizePool",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "ticketPrice",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "ticketsBought",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];
  const contractAddress = "0x9a2a85c972370e5326e3c6b4848df10362f2263e";

  let web3;
  let lotteryContract;
  let accounts = [];
  let isAdmin = false;

  if (typeof window.ethereum === "undefined") {
    alert("Please install MetaMask to use this DApp!");
    return;
  }

  try {
    web3 = new Web3(window.ethereum);
    accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    lotteryContract = new web3.eth.Contract(contractABI, contractAddress);
    setupEventListeners();
    updateUI();
    setInterval(updateUI, 10000);
  } catch (error) {
    console.error("Failed to initialize DApp:", error);
    alert("Could not connect to MetaMask.");
  }

  function setupEventListeners() {
    const btnIds = [
      { id: "buyTicketsBtn", handler: buyTickets },
      { id: "endLotteryBtn", handler: endLottery },
      { id: "setTicketPriceBtn", handler: setTicketPrice },
      { id: "setMaxTicketsBtn", handler: setMaxTickets },
      { id: "setDurationBtn", handler: setDuration },
    ];

    btnIds.forEach(({ id, handler }) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("click", handler);
    });
  }

  async function updateUI() {
    if (!lotteryContract) return;
    try {
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

      isAdmin =
        accounts[0] && accounts[0].toLowerCase() === admin.toLowerCase();
      const adminPanel = document.getElementById("adminPanel");
      const notAdminMessage = document.getElementById("notAdminMessage");
      if (adminPanel && notAdminMessage) {
        adminPanel.style.display = isAdmin ? "block" : "none";
        notAdminMessage.style.display = isAdmin ? "none" : "block";
      }

      document.getElementById("currentLotteryId").textContent =
        currentLotteryId;
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

      const now = Math.floor(Date.now() / 1000);
      const timeRemaining = lotteryEndTime - now;
      const timeStr =
        timeRemaining > 0
          ? `${Math.floor(timeRemaining / 86400)}d ${Math.floor(
              (timeRemaining % 86400) / 3600
            )}h ${Math.floor((timeRemaining % 3600) / 60)}m ${
              timeRemaining % 60
            }s`
          : "Ended";
      document.getElementById("timeRemaining").textContent = timeStr;

      await loadWinners();
    } catch (error) {
      console.error("Error updating UI:", error);
    }
  }

  async function loadWinners() {
    try {
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
            const div = document.createElement("div");
            div.className = "mb-2";
            div.innerHTML = `<strong>Lottery #${i}:</strong> ${shortenAddress(
              winner
            )} won ${web3.utils.fromWei(prize, "ether")} ETH`;
            winnersList.appendChild(div);
          }
        } catch (e) {
          console.error(`Failed to fetch winner for lottery ${i}:`, e);
        }
      }
    } catch (e) {
      console.error("loadWinners failed:", e);
    }
  }

  function shortenAddress(address) {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
  }

  async function buyTickets() {
    const input = document.getElementById("ticketAmount");
    const amount = parseInt(input?.value || "0");
    if (!amount || amount <= 0) return alert("Invalid ticket amount");

    try {
      const ticketPrice = await lotteryContract.methods.ticketPrice().call();
      const cost = ticketPrice * amount;

      await lotteryContract.methods.buyTickets(amount).send({
        from: accounts[0],
        value: cost,
      });

      alert("Tickets purchased!");
      updateUI();
    } catch (e) {
      console.error("Buy failed:", e);
      alert("Error: " + e.message);
    }
  }

  async function endLottery() {
    if (!confirm("End the lottery?")) return;

    try {
      await lotteryContract.methods.endLottery().send({ from: accounts[0] });
      alert("Lottery ended");
      updateUI();
    } catch (e) {
      console.error("End failed:", e);
      alert("Error: " + e.message);
    }
  }

  async function setTicketPrice() {
    const val = document.getElementById("newTicketPrice")?.value;
    if (!val || isNaN(val)) return alert("Invalid ticket price");

    try {
      const wei = web3.utils.toWei(val, "ether");
      await lotteryContract.methods
        .setTicketPrice(wei)
        .send({ from: accounts[0] });
      alert("Ticket price updated");
      updateUI();
    } catch (e) {
      console.error("Set ticket price failed:", e);
      alert("Error: " + e.message);
    }
  }

  async function setMaxTickets() {
    const val = document.getElementById("newMaxTickets")?.value;
    if (!val || isNaN(val) || val <= 0) return alert("Invalid max tickets");

    try {
      await lotteryContract.methods
        .setMaxTicketsPerUser(val)
        .send({ from: accounts[0] });
      alert("Max tickets updated");
      updateUI();
    } catch (e) {
      console.error("Set max tickets failed:", e);
      alert("Error: " + e.message);
    }
  }

  async function setDuration() {
    const val = document.getElementById("newDuration")?.value;
    if (!val || isNaN(val) || val <= 0) return alert("Invalid duration");

    try {
      const seconds = val * 86400;
      await lotteryContract.methods
        .setLotteryDuration(seconds)
        .send({ from: accounts[0] });
      alert("Duration updated");
      updateUI();
    } catch (e) {
      console.error("Set duration failed:", e);
      alert("Error: " + e.message);
    }
  }
});
