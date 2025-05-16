export const contractAddress = "0x9Ef2024F110CB3a8dB5d5E9496A9061684D8969A";
export const contractABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "spent",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "budget",
          "type": "uint256"
        }
      ],
      "name": "BudgetAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "spent",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "budget",
          "type": "uint256"
        }
      ],
      "name": "BudgetUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "monthlyIncome",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "monthlyExpenses",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "savingsRate",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "totalBalance",
          "type": "uint256"
        }
      ],
      "name": "FinancialDataUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "current",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "target",
          "type": "uint256"
        }
      ],
      "name": "SavingsGoalAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "current",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "target",
          "type": "uint256"
        }
      ],
      "name": "SavingsGoalUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "category",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "date",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "int256",
          "name": "amount",
          "type": "int256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isIncome",
          "type": "bool"
        }
      ],
      "name": "TransactionAdded",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_spent",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_budget",
          "type": "uint256"
        }
      ],
      "name": "addBudget",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_current",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_target",
          "type": "uint256"
        }
      ],
      "name": "addSavingsGoal",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_description",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_category",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_date",
          "type": "uint256"
        },
        {
          "internalType": "int256",
          "name": "_amount",
          "type": "int256"
        }
      ],
      "name": "addTransaction",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "budgets",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "spent",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "budget",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "financialData",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "monthlyIncome",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "monthlyExpenses",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "savingsRate",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalBalance",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getBudgets",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "spent",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "budget",
              "type": "uint256"
            }
          ],
          "internalType": "struct FinanceDashboard.Budget[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getFinancialData",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "monthlyIncome",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "monthlyExpenses",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "savingsRate",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "totalBalance",
              "type": "uint256"
            }
          ],
          "internalType": "struct FinanceDashboard.FinancialData",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getSavingsGoals",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "current",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "target",
              "type": "uint256"
            }
          ],
          "internalType": "struct FinanceDashboard.SavingsGoal[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTransactions",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "category",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "date",
              "type": "uint256"
            },
            {
              "internalType": "int256",
              "name": "amount",
              "type": "int256"
            },
            {
              "internalType": "bool",
              "name": "isIncome",
              "type": "bool"
            }
          ],
          "internalType": "struct FinanceDashboard.Transaction[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "savingsGoals",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "current",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "target",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "transactions",
      "outputs": [
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "category",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "date",
          "type": "uint256"
        },
        {
          "internalType": "int256",
          "name": "amount",
          "type": "int256"
        },
        {
          "internalType": "bool",
          "name": "isIncome",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_index",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_spent",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_budget",
          "type": "uint256"
        }
      ],
      "name": "updateBudget",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_monthlyIncome",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_monthlyExpenses",
          "type": "uint256"
        }
      ],
      "name": "updateFinancialData",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_index",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_current",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_target",
          "type": "uint256"
        }
      ],
      "name": "updateSavingsGoal",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];