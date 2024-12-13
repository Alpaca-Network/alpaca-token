# Solidity API

## PacaAI

### UPGRADER_ROLE

```solidity
bytes32 UPGRADER_ROLE
```

### TAX_ADMIN_ROLE

```solidity
bytes32 TAX_ADMIN_ROLE
```

### treasury

```solidity
address treasury
```

### taxEnabled

```solidity
bool taxEnabled
```

### MAX_FEE

```solidity
uint256 MAX_FEE
```

### buyFee

```solidity
uint256 buyFee
```

### sellFee

```solidity
uint256 sellFee
```

### dexes

```solidity
mapping(address => bool) dexes
```

### constructor

```solidity
constructor() public
```

### FeeCharged

```solidity
event FeeCharged(address treasury, uint256 amount)
```

### DexAdded

```solidity
event DexAdded(address pair, bool value)
```

### TreasuryWalletUpdated

```solidity
event TreasuryWalletUpdated(address newWallet, address oldWallet)
```

### TaxEnabled

```solidity
event TaxEnabled(bool enabled)
```

### UpdatedTradeFee

```solidity
event UpdatedTradeFee(uint256 buyFee, uint256 sellFee)
```

### initialize

```solidity
function initialize(address defaultAdmin, address taxAdmin, address upgrader, address treasuryWallet) public
```

Initialize the Alpaca token contract

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| defaultAdmin | address | Address to be granted the DEFAULT_ADMIN_ROLE |
| taxAdmin | address |  |
| upgrader | address | Address to be granted the UPGRADER_ROLE |
| treasuryWallet | address |  |

### updateTaxEnabled

```solidity
function updateTaxEnabled(bool enabled) external
```

### updateFees

```solidity
function updateFees(uint256 newBuyFee, uint256 newSellFee) external
```

### updateTreasuryWallet

```solidity
function updateTreasuryWallet(address newTreasury) external
```

### addDex

```solidity
function addDex(address pair, bool value) public
```

### _authorizeUpgrade

```solidity
function _authorizeUpgrade(address newImplementation) internal
```

Authorizes upgrades to the contract

_Restricted to accounts with the UPGRADER_ROLE_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newImplementation | address | Address of the new implementation contract |

### _update

```solidity
function _update(address from, address to, uint256 amount) internal
```

Updates state during token transfers

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | Sender address |
| to | address | Recipient address |
| amount | uint256 | Transfer amount |

### _calculateFees

```solidity
function _calculateFees(address from, address to, uint256 amount) internal view returns (uint256)
```

Calculate fees based on the transaction type (buy/sell).

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | Sender address |
| to | address | Recipient address |
| amount | uint256 | Transfer amount |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | fees Amount of fees to deduct |

