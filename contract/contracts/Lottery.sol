// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Lottery is ReentrancyGuard {
    using Address for address payable;
    
    address public admin;
    uint public lotteryDuration;
    uint public lotteryEndTime;
    uint public ticketPrice;
    uint public maxTicketsPerUser;
    
    uint public currentLotteryId;
    mapping(uint => mapping(address => uint)) public ticketsBought;
    mapping(uint => address[]) public participants;
    mapping(uint => uint) public prizePool;
    mapping(uint => address) public lotteryWinners;
    
    event LotteryStarted(uint indexed lotteryId, uint endTime);
    event TicketsPurchased(uint indexed lotteryId, address buyer, uint amount);
    event LotteryEnded(uint indexed lotteryId, address winner, uint prize);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }
    
    modifier lotteryActive() {
        require(block.timestamp < lotteryEndTime, "Lottery not active");
        _;
    }
    
    constructor(uint _duration, uint _ticketPrice, uint _maxTickets) {
        admin = msg.sender;
        lotteryDuration = _duration;
        ticketPrice = _ticketPrice;
        maxTicketsPerUser = _maxTickets;
        startNewLottery();
    }
    
    function startNewLottery() public onlyAdmin {
        currentLotteryId++;
        lotteryEndTime = block.timestamp + lotteryDuration;
        emit LotteryStarted(currentLotteryId, lotteryEndTime);
    }
    
    function buyTickets(uint numberOfTickets) public payable lotteryActive nonReentrant {
        require(numberOfTickets > 0, "Must buy at least 1 ticket");
        require(ticketsBought[currentLotteryId][msg.sender] + numberOfTickets <= maxTicketsPerUser, "Exceeds max tickets");
        require(msg.value == ticketPrice * numberOfTickets, "Incorrect ETH sent");
        
        ticketsBought[currentLotteryId][msg.sender] += numberOfTickets;
        for (uint i = 0; i < numberOfTickets; i++) {
            participants[currentLotteryId].push(msg.sender);
        }
        prizePool[currentLotteryId] += msg.value;
        
        emit TicketsPurchased(currentLotteryId, msg.sender, numberOfTickets);
    }
    
    function endLottery() public onlyAdmin {
        require(block.timestamp >= lotteryEndTime, "Lottery not ended");
        require(participants[currentLotteryId].length > 0, "No participants");
        
        uint randomIndex = uint(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, participants[currentLotteryId].length))) % participants[currentLotteryId].length;
        address winner = participants[currentLotteryId][randomIndex];
        lotteryWinners[currentLotteryId] = winner;
        
        uint prize = prizePool[currentLotteryId];
        payable(winner).sendValue(prize);
        
        emit LotteryEnded(currentLotteryId, winner, prize);
        
        startNewLottery();
    }
    
    function getParticipantsCount(uint lotteryId) public view returns (uint) {
        return participants[lotteryId].length;
    }
    
    function getCurrentPrizePool() public view returns (uint) {
        return prizePool[currentLotteryId];
    }
    
    function setTicketPrice(uint newPrice) public onlyAdmin {
        ticketPrice = newPrice;
    }
    
    function setMaxTicketsPerUser(uint newMax) public onlyAdmin {
        maxTicketsPerUser = newMax;
    }
    
    function setLotteryDuration(uint newDuration) public onlyAdmin {
        lotteryDuration = newDuration;
    }
}