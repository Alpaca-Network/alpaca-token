// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {ERC20BurnableUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {NoncesUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/NoncesUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/// @custom:security-contact vaughn@alpacanetwork.ai
/// @custom:security-contact aladeen@alpacanetwork.ai
contract Alpaca is 
    Initializable, 
    ERC20Upgradeable, 
    ERC20BurnableUpgradeable,     
    AccessControlUpgradeable, 
    UUPSUpgradeable 
{
    // Define roles for granular access control
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant TAX_ADMIN_ROLE = keccak256("TAX_ADMIN_ROLE");

    address public treasury;
    bool public taxEnabled;

    uint256 public constant MAX_FEE = 2000;

    uint256 public buyFee;
    uint256 public sellFee;

    mapping(address => bool) public dexes;

    /// @custom:oz-upgrades-unsafe-allow constructor
    // Constructor disables initializers to ensure proper upgradeable deployment
    constructor() {
        _disableInitializers();
    }

    /***********************************************/
	/********************* EVENT *******************/
	/***********************************************/

    event FeeCharged(
        address indexed from,
        address indexed to,
        uint256 amount
    );

    event DexAdded(address indexed pair, bool value);

    event TreasuryWalletUpdated(
        address indexed newWallet,
        address indexed oldWallet
    );

    event TaxEnabled(
        bool enabled
    );

    event UpdatedTradeFee(
        uint256 buyFee,
        uint256 sellFee
    );

    /**
     * @notice Initialize the Alpaca token contract
     * @param defaultAdmin Address to be granted the DEFAULT_ADMIN_ROLE
     * @param upgrader Address to be granted the UPGRADER_ROLE
     */
    function initialize(address defaultAdmin, address taxAdmin, address upgrader)
        initializer public
    {
        // Initialize inherited modules
        __ERC20_init("Alpaca", "PACA");
        __ERC20Burnable_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();

        // Set up roles for access control
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(TAX_ADMIN_ROLE, taxAdmin);
        _grantRole(UPGRADER_ROLE, upgrader);

        // Initialize state variables
        taxEnabled = true;

        // set treasury wallet
        treasury = defaultAdmin;

        // Mint initial supply of 1 billion PACA tokens to the deployer
        _mint(msg.sender, 1_200_000_000 * 10 ** decimals());
    }


    /*****************************************************************/
	/******************  EXTERNAL FUNCTIONS  *************************/
	/*****************************************************************/
   
    // only use to disable tax if absolutely necessary (emergency use only)
    function updateTaxEnabled(bool enabled) external onlyRole(TAX_ADMIN_ROLE) {
        taxEnabled = enabled;
        emit TaxEnabled(taxEnabled);
    }

    function updateFees(
        uint256 _buyFee,
        uint256 _sellFee
    ) external onlyRole(TAX_ADMIN_ROLE) {
        buyFee = _buyFee;
        sellFee = _sellFee;
        
        require(_buyFee <= MAX_FEE, "Buy fees must be <= 20%.");
        require(_sellFee <= MAX_FEE, "Sell fees must be <= 20%.");

        emit UpdatedTradeFee(buyFee, sellFee);
    }

    function updateTreasuryWallet(address newTreasury) external onlyRole(TAX_ADMIN_ROLE) {
        require(newTreasury != address(0), "Invalid wallet addresss");
        address oldTreasury = treasury;
        treasury = newTreasury;
        emit TreasuryWalletUpdated(newTreasury, oldTreasury);
    }

    function addDex(address pair, bool value) 
        public 
        onlyRole(TAX_ADMIN_ROLE)
    {
        require(
            pair != address(0x0),
            "The pair cannot be zero address"
        );

        dexes[pair] = value;
        emit DexAdded(pair, value);

    }


    /**
     * @notice Authorizes upgrades to the contract
     * @dev Restricted to accounts with the UPGRADER_ROLE
     * @param newImplementation Address of the new implementation contract
     */
    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(UPGRADER_ROLE)
        override
    {}

    // Overrides required by Solidity for multiple inheritance
    /**
     * @notice Updates state during token transfers
     * @param from Sender address
     * @param to Recipient address
     * @param amount Transfer amount
     */

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20Upgradeable){
        
        uint256 fees = 0;
        // tax logic for LP transfers.
        // only take fees on buys/sells, do not take on wallet transfers
        if (taxEnabled && amount > 0) {
            if(dexes[from]) {
                if(buyFee > 0) {
                    fees = (amount * buyFee) / 10000;
                }
            } else if(dexes[to]) {
                if(sellFee > 0) {
                    fees = (amount * sellFee) / 10000;
                }
            }
        }

        if(fees > 0) {
            super._update(from, treasury, fees);
            amount -= fees;
            emit FeeCharged(from, treasury, fees);
        }
        super._update(from, to, amount);
    }

}
