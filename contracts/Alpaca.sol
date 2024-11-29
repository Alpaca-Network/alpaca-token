// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

// Importing OpenZeppelin libraries for upgradeable and extended ERC20 functionality
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {ERC20BurnableUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import {ERC20PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PausableUpgradeable.sol";
import {ERC20PermitUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import {ERC20VotesUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {NoncesUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/NoncesUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/// @custom:security-contact vaughn@alpacanetwork.ai
/// @custom:security-contact aladeen@alpacanetwork.ai
contract Alpaca is 
    Initializable, 
    ERC20Upgradeable, 
    ERC20BurnableUpgradeable, 
    ERC20PausableUpgradeable, 
    AccessControlUpgradeable, 
    ERC20PermitUpgradeable, 
    ERC20VotesUpgradeable, 
    UUPSUpgradeable 
{
    // Define roles for granular access control
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    /// @custom:oz-upgrades-unsafe-allow constructor
    // Constructor disables initializers to ensure proper upgradeable deployment
    constructor() {
        _disableInitializers();
    }

    /**
     * @notice Initialize the Alpaca token contract
     * @param defaultAdmin Address to be granted the DEFAULT_ADMIN_ROLE
     * @param pauser Address to be granted the PAUSER_ROLE
     * @param upgrader Address to be granted the UPGRADER_ROLE
     */
    function initialize(address defaultAdmin, address pauser, address upgrader)
        initializer public
    {
        // Initialize inherited modules
        __ERC20_init("Alpaca", "PACA");
        __ERC20Burnable_init();
        __ERC20Pausable_init();
        __AccessControl_init();
        __ERC20Permit_init("Alpaca");
        __ERC20Votes_init();
        __UUPSUpgradeable_init();

        // Set up roles for access control
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(PAUSER_ROLE, pauser);
        _grantRole(UPGRADER_ROLE, upgrader);

        // Mint initial supply of 1.2 billion PACA tokens to the deployer
        _mint(msg.sender, 1200000000 * 10 ** decimals());
    }

    /**
     * @notice Pause all token transfers
     * @dev Restricted to accounts with the PAUSER_ROLE
     */
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @notice Unpause all token transfers
     * @dev Restricted to accounts with the PAUSER_ROLE
     */
    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /**
     * @notice Returns the current timestamp as the "clock" value
     * @dev Used for compatibility with certain standards or protocols
     * @return Current block timestamp
     */
    function clock() public view override returns (uint48) {
        return uint48(block.timestamp);
    }

    /**
     * @notice Defines the clock mode as "timestamp"
     * @return A string representing the clock mode
     */
    function CLOCK_MODE() public pure override returns (string memory) {
        return "mode=timestamp";
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
     * @param value Transfer amount
     */
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20Upgradeable, ERC20PausableUpgradeable, ERC20VotesUpgradeable)
    {
        super._update(from, to, value);
    }

    /**
     * @notice Returns the nonce for a given address (used for permit functionality)
     * @param owner Address for which the nonce is queried
     * @return Current nonce of the owner
     */
    function nonces(address owner)
        public
        view
        override(ERC20PermitUpgradeable, NoncesUpgradeable)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}
