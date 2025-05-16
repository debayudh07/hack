# Finance Dashboard Smart Contract

This project contains the FinanceDashboard smart contract, which allows users to track personal finances, budgets, and savings goals on the blockchain.

## Features

- Track monthly income and expenses
- Record transactions with categories
- Manage budget categories
- Set and track savings goals
- Data privacy (each user can only see their own data)

## Development

### Setup

1. Clone the repository
2. Install dependencies:
```shell
npm install
```
3. Copy `.env.example` to `.env` and add your values:
```shell
cp .env.example .env
```

### Testing

Run the test suite to verify contract functionality:

```shell
npx hardhat test
REPORT_GAS=true npx hardhat test
```

### Deployment

Deploy to a local node:

```shell
npx hardhat node
npx hardhat run scripts/deploy.ts --network localhost
```

Deploy to Base Sepolia testnet:

```shell
npx hardhat run scripts/deploy.ts --network base-sepolia
```

### Gas Cost Estimation

Estimate deployment and transaction costs on Base Sepolia:

```shell
npx hardhat run scripts/estimateCosts.ts --network base-sepolia
```

For detailed information about gas costs, see [Gas Cost Estimation Guide](./docs/GasCostEstimation.md).

## Usage

Check out the test files for examples of how to interact with the contract.
