# PACA Token Smart Contract

## Key Information

### Contract Ownership

Ownership of the contract has been renounced, and it is no longer upgradeable. Verification links:

#### Upgradability Renouncement

- Upgrader role renounced: [Transaction](https://basescan.org/tx/0xd824f19fbd2cc061c5458203c16abd74d18f33d65f96abc9d6208738fa68c879)
- Upgrader role assigned to the dead wallet: [Transaction](https://basescan.org/tx/0x726391230f03f2fc5ac02b1cc2cf485804b564b3e8ef544efe7f568b2c1a3872)

#### Ownership Renouncement

- Default admin role assigned to the dead wallet: [Transaction](https://basescan.org/tx/0x3db84cfacfceb3809f2449708f251c7b6e8b74dc10158fe824d7913ab969d649)

### Upgradeability

The contract was initially structured as upgradeable (proxy) to accommodate custom tax logic used during launch to mitigate sniping. This custom tax logic was deactivated shortly after launch, and all tax rates are now set to **0%**. Verification links:

- [Transaction](https://basescan.org/tx/0x5ac2dd8305305cc357461fa23d7dbc9fc83d4887c4a55df0332166ffb60bfde0)
- [Buy Fee](https://basescan.org/token/0x3639e6f4c224ebd1bf6373c3d97917d33e0492bb#readProxyContract#buyFee)
- [Sell Fee](https://basescan.org/token/0x3639e6f4c224ebd1bf6373c3d97917d33e0492bb#readProxyContract#sellFee)

The upgrader role serves as a safeguard for emergencies. This role has been assigned to the dead wallet, effectively disabling future upgrades.

### Role-Based Management

The contract implements role-based access control, ensuring that no single address holds full control over the contract. Different functionalities are managed by separate roles distributed across multiple addresses.

## Contract Address

- [0x3639e6f4c224ebd1bf6373c3d97917d33e0492bb](https://basescan.org/token/0x3639e6f4c224ebd1bf6373c3d97917d33e0492bb)

## Additional Resources

### Documentation

- [Alpaca.sol Documentation](./docs/Alpaca.md)

### Source Code

- [Alpaca.sol](./contracts/Alpaca.sol)

### Tests

- [Alpaca.test.js](./test/Alpaca.test.js)
