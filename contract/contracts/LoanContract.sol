// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract LoanContract is ReentrancyGuard {
    struct Loan {
        address lender;
        address borrower;
        uint256 amount;
        uint256 interest;
        bool isRepaid;
        bool isRequested;
    }

    Loan[] public loans;

    event LoanOffered(uint256 loanId, address indexed lender, uint256 amount, uint256 interest);
    event LoanRequested(uint256 loanId, address indexed borrower);
    event LoanRepaid(uint256 loanId, address indexed borrower);

    function offerLoan(uint256 interest) external payable {
        require(msg.value > 0, "Must send ETH");

        loans.push(Loan({
            lender: msg.sender,
            borrower: address(0),
            amount: msg.value,
            interest: interest,
            isRepaid: false,
            isRequested: false
        }));

        emit LoanOffered(loans.length - 1, msg.sender, msg.value, interest);
    }

    function requestLoan(uint256 loanId) external nonReentrant {
        Loan storage loan = loans[loanId];
        require(!loan.isRequested, "Already requested");
        require(loan.lender != msg.sender, "Can't borrow your own loan");

        loan.borrower = msg.sender;
        loan.isRequested = true;

        payable(msg.sender).transfer(loan.amount);

        emit LoanRequested(loanId, msg.sender);
    }

    function repayLoan(uint256 loanId) external payable nonReentrant {
        Loan storage loan = loans[loanId];
        require(loan.isRequested, "Loan not requested");
        require(!loan.isRepaid, "Already repaid");
        require(msg.sender == loan.borrower, "Only borrower can repay");
        require(msg.value == loan.amount + loan.interest, "Incorrect repayment");

        loan.isRepaid = true;
        payable(loan.lender).transfer(msg.value);

        emit LoanRepaid(loanId, msg.sender);
    }

    function getLoanCount() external view returns (uint256) {
        return loans.length;
    }

    function getLoan(uint256 loanId) external view returns (Loan memory) {
        return loans[loanId];
    }
}
