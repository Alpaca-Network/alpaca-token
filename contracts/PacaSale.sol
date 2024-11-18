// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract PacaSale is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    uint256 public  MAX_BUY_AMOUNT;
    address public PacaToken;

    // Price of the Paca
    uint256 public tokenPrice;

    mapping(address => uint256) public salesLockup;

    // Address of the treasury
    address public treasury;
    // Events to log changes in the contract state
    event SetTreasury(address _treasury);
    event SetMaxBuyAmount(uint256 _newMaxAmount);
    event PurchasePacaToken(uint256 amount);
    event SetTokenPrice(uint256 tokenPrice);
    event WidthrawFundsETH(uint256 _amount);
    event WidthrawFundsPaca(uint256 _amount);
    event WidthrawFundsAll();

    // Contract constructor
    constructor(address _paca, address _treasury) {
        require(_paca != address(0), "Invalid token address");
        require(_treasury != address(0), "Invalid address");

        PacaToken = _paca;
        treasury = _treasury;
    }

    // Function to set Max amount for Paca token purchase
    function setMaxBuyAmount(uint256 _newMaxAmount) external onlyOwner {
        // Ensure valid input Max amount
        require(_newMaxAmount  > 0 , "PacaSale: Invalid value");

        // Set Value
        MAX_BUY_AMOUNT = _newMaxAmount;
        // Emit an event indicating the MAX_BUY_AMOUNT has been updated
        emit SetMaxBuyAmount(_newMaxAmount);
    }

    function setTreasury(address _treasury) external onlyOwner {
        // Ensure valid input Max amount
        require(_treasury != address(0), "PacaSale: Invalid address");

        // Set Value
        treasury = _treasury;
        // Emit an event indicating the MAX_BUY_AMOUNT has been updated
        emit SetTreasury(_treasury);
    }

    // Function to set Paca token price
    function setTokenPrice(uint256 _newPrice) external onlyOwner {
        // Ensure valid input Price
        require(_newPrice  >= 0 , "PacaSale: Invalid value");

        // Set Paca token price
        tokenPrice = _newPrice;
        // Emit an event indicating the Paca price has been updated
        emit SetTokenPrice(tokenPrice);
    }

    // Function to purchase Paca
    function buyPaca(uint256 _amount) external payable {

        require(_amount < MAX_BUY_AMOUNT, "PacaSale: Invalid amount for purchase");
        require(_amount * tokenPrice <= msg.value, "PacaSale: Insufficient funds");
        salesLockup[msg.sender] += _amount;
        // Emit an event indicating Paca tokens have been purchased
        emit PurchasePacaToken(_amount);
    }

    function airdrop() external {
        _safeTransfer(PacaToken, msg.sender, salesLockup[msg.sender]);
    }
    
    function withdrawStuckToken(address _token, address _to) external onlyOwner {
        require(_to != address(0), "Zero address");
        uint256 _contractBalance = IERC20(_token).balanceOf(address(this));
        IERC20(_token).transfer(_to, _contractBalance);
    }

    function withdrawStuckEth(address toAddr) external onlyOwner {
        require(toAddr != address(0), "Zero address");

        (bool success, ) = toAddr.call{
            value: address(this).balance
        } ("");
        require(success);
    }

   // Internal function to safely transfer tokens, with optional skipping for certain tokens
    function _safeTransfer(address token, address to, uint256 value) internal {
        // Ensure the token address has associated code
        require(token.code.length != 0, "token address has no code");
        // If the transfer value is zero, skip the transfer
        if (value == 0) return;
        // Execute the token transfer
        (bool success, bytes memory data) = token.call(abi.encodeCall(IERC20.transfer, (to, value)));
        // Ensure the transfer was successful and returned true
        require(success, "transfer reverted");
        require(data.length == 0 || abi.decode(data, (bool)), "transfer returned false");
    }

}