// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v3-core/contracts/libraries/LowGasSafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";



/**
 * @title Paca is AlpacaNetwork's native ERC20 token.
 */


contract PacaToken is Ownable, SafeERC20 {

    // using SafeERC20 for IERC20;

    address public treasury;
    bool public taxEnabled = false;

    uint256 public maxFee = 5000; // 50%


    // store addresses that a automatic market maker pairs

    mapping(address => bool) public automatedMarketMakerPairs;

	/***********************************************/
	/****************** CONSTRUCTOR ****************/
	/***********************************************/

  	constructor(
		uint8 _decimals
	) ERC20("Alpaca Network", "Paca", _decimals) {
		_mint(msg.sender, 800000000 * 10 ** _decimals);
        
    }

    receive() external payable {}

    /***********************************************/
	/********************* EVENT *******************/
	/***********************************************/

    event SetAutomatedMarketMakerPair(address indexed pair, bool indexed value);

    event TreasuryWalletUpdated(
        address indexed newWallet,
        address indexed oldWallet
    );

    event SwapAndLiquify(
        uint256 tokensSwapped,
        uint256 ethReceived,
        uint256 tokensIntoLiquidity
    );
    /***********************************************/
	/****************** MODIFIERS ******************/
	/***********************************************/

    modifier onlyStakingContract() {
        require(msg.sender == mozStaking, "Invalid caller");
        _;
    }

	/*****************************************************************/
	/******************  EXTERNAL FUNCTIONS  *************************/
	/*****************************************************************/
   
    // only use to disable tax if absolutely necessary (emergency use only)
    function updateTaxEnabled(bool enabled) external onlyOwner {
        taxEnabled = enabled;
    }

    function updateFees(
        uint256 _fee
    ) external onlyOwner {
        tradeFee = _fee;
        require(tradeFee <= maxFee, "Buy fees must be <= 5%.");
    }

    function updateTreasuryWallet(address newTreasury) external onlyOwner {
        treasury = newTreasury;
        emit TreasuryWalletUpdated(newTreasury, treasury);
    }

    function setAutomatedMarketMakerPair(address pair, bool value) 
        public 
        onlyOwner
    {
        require(
            pair != address(0x0),
            "The pair cannot be zero address"
        );

        automatedMarketMakerPairs[pair] = value;
        emit SetAutomatedMarketMakerPair(pair, value);

    }

    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal override {

        uint256 fees = 0;
        // only take fees on buys/sells, do not take on wallet transfers
        if (taxEnabled && amount > 0) {
            if(automatedMarketMakerPairs[to] || automatedMarketMakerPairs[from]) {
                if(tradeFee > 0) {
                    fees = (amount * tradeFee) / 10000;
                }
            }
        }

        if(fees > 0) {
            super._transfer(from, treasury, fees);
            amount -= fees;
        }
        super._transfer(from, to, amount);
    }

    function withdrawStuckToken(address _token, address _to) external onlyOwner {
        require(_to != address(0), "Zero address");
        uint256 _contractWETHBalance = IERC20(_token).balanceOf(address(this));
        IERC20(_token).transfer(_to, _contractWETHBalance);
    }

    function withdrawStuckEth(address toAddr) external onlyOwner {
        (bool success, ) = toAddr.call{
            value: address(this).balance
        } ("");
        require(success);
    }

}
