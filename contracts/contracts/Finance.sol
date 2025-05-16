// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title FinanceDashboard
 * @dev Smart contract for managing personal finance data including transactions, budgets, and savings goals
 */
contract FinanceDashboard {
    address public owner;
    
    // User financial data
    struct FinancialData {
        uint256 monthlyIncome;
        uint256 monthlyExpenses;
        uint256 savingsRate;
        uint256 totalBalance;
    }
    
    // Transaction structure
    struct Transaction {
        string description;
        string category;
        uint256 date;
        int256 amount;
        bool isIncome;
    }
    
    // Budget category structure
    struct Budget {
        string name;
        uint256 spent;
        uint256 budget;
    }
    
    // Savings goal structure
    struct SavingsGoal {
        string name;
        uint256 current;
        uint256 target;
    }
    
    // Mappings to store user data
    mapping(address => FinancialData) public financialData;
    mapping(address => Transaction[]) public transactions;
    mapping(address => Budget[]) public budgets;
    mapping(address => SavingsGoal[]) public savingsGoals;
    
    // Events
    event FinancialDataUpdated(address indexed user, uint256 monthlyIncome, uint256 monthlyExpenses, uint256 savingsRate, uint256 totalBalance);
    event TransactionAdded(address indexed user, string description, string category, uint256 date, int256 amount, bool isIncome);
    event BudgetAdded(address indexed user, string name, uint256 spent, uint256 budget);
    event BudgetUpdated(address indexed user, uint256 index, uint256 spent, uint256 budget);
    event SavingsGoalAdded(address indexed user, string name, uint256 current, uint256 target);
    event SavingsGoalUpdated(address indexed user, uint256 index, uint256 current, uint256 target);
    
    // Constructor
    constructor() {
        owner = msg.sender;
    }
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyDataOwner(address user) {
        require(msg.sender == user, "Only the data owner can call this function");
        _;
    }
    
    /**
     * @dev Update financial overview data
     * @param _monthlyIncome Monthly income amount
     * @param _monthlyExpenses Monthly expenses amount
     */
    function updateFinancialData(uint256 _monthlyIncome, uint256 _monthlyExpenses) external {
        require(_monthlyIncome >= _monthlyExpenses, "Income must be greater than or equal to expenses");
        
        uint256 _savingsRate = 0;
        if (_monthlyIncome > 0) {
            _savingsRate = ((_monthlyIncome - _monthlyExpenses) * 100) / _monthlyIncome;
        }
        
        uint256 _totalBalance = _monthlyIncome - _monthlyExpenses;
        
        financialData[msg.sender] = FinancialData({
            monthlyIncome: _monthlyIncome,
            monthlyExpenses: _monthlyExpenses,
            savingsRate: _savingsRate,
            totalBalance: _totalBalance
        });
        
        emit FinancialDataUpdated(msg.sender, _monthlyIncome, _monthlyExpenses, _savingsRate, _totalBalance);
    }
    
    /**
     * @dev Add a new transaction
     * @param _description Description of the transaction
     * @param _category Category of the transaction
     * @param _date Date of the transaction (Unix timestamp)
     * @param _amount Amount of the transaction (positive for income, negative for expense)
     */
    function addTransaction(string memory _description, string memory _category, uint256 _date, int256 _amount) external {
        bool _isIncome = _amount > 0;
        
        Transaction memory newTransaction = Transaction({
            description: _description,
            category: _category,
            date: _date,
            amount: _amount,
            isIncome: _isIncome
        });
        
        transactions[msg.sender].push(newTransaction);
        
        // Update monthly expenses or income based on transaction
        FinancialData storage data = financialData[msg.sender];
        if (_isIncome) {
            data.monthlyIncome += uint256(_amount);
        } else {
            data.monthlyExpenses += uint256(-_amount);
        }
        
        // Recalculate savings rate and total balance
        if (data.monthlyIncome > 0) {
            data.savingsRate = ((data.monthlyIncome - data.monthlyExpenses) * 100) / data.monthlyIncome;
        }
        data.totalBalance = data.monthlyIncome - data.monthlyExpenses;
        
        emit TransactionAdded(msg.sender, _description, _category, _date, _amount, _isIncome);
        emit FinancialDataUpdated(msg.sender, data.monthlyIncome, data.monthlyExpenses, data.savingsRate, data.totalBalance);
    }
    
    /**
     * @dev Get all transactions for a user
     * @return All transactions for the caller
     */
    function getTransactions() external view returns (Transaction[] memory) {
        return transactions[msg.sender];
    }
    
    /**
     * @dev Add a new budget category
     * @param _name Budget category name
     * @param _spent Current spent amount
     * @param _budget Total budget amount
     */
    function addBudget(string memory _name, uint256 _spent, uint256 _budget) external {
        require(_spent <= _budget, "Spent amount cannot exceed budget");
        
        Budget memory newBudget = Budget({
            name: _name,
            spent: _spent,
            budget: _budget
        });
        
        budgets[msg.sender].push(newBudget);
        
        emit BudgetAdded(msg.sender, _name, _spent, _budget);
    }
    
    /**
     * @dev Update an existing budget
     * @param _index Index of the budget to update
     * @param _spent Updated spent amount
     * @param _budget Updated budget amount
     */
    function updateBudget(uint256 _index, uint256 _spent, uint256 _budget) external {
        require(_index < budgets[msg.sender].length, "Budget index out of bounds");
        require(_spent <= _budget, "Spent amount cannot exceed budget");
        
        Budget storage budget = budgets[msg.sender][_index];
        budget.spent = _spent;
        budget.budget = _budget;
        
        emit BudgetUpdated(msg.sender, _index, _spent, _budget);
    }
    
    /**
     * @dev Get all budgets for a user
     * @return All budgets for the caller
     */
    function getBudgets() external view returns (Budget[] memory) {
        return budgets[msg.sender];
    }
    
    /**
     * @dev Add a new savings goal
     * @param _name Goal name
     * @param _current Current savings amount
     * @param _target Target savings amount
     */
    function addSavingsGoal(string memory _name, uint256 _current, uint256 _target) external {
        require(_current <= _target, "Current savings cannot exceed target");
        
        SavingsGoal memory newGoal = SavingsGoal({
            name: _name,
            current: _current,
            target: _target
        });
        
        savingsGoals[msg.sender].push(newGoal);
        
        emit SavingsGoalAdded(msg.sender, _name, _current, _target);
    }
    
    /**
     * @dev Update an existing savings goal
     * @param _index Index of the savings goal to update
     * @param _current Updated current savings amount
     * @param _target Updated target savings amount
     */
    function updateSavingsGoal(uint256 _index, uint256 _current, uint256 _target) external {
        require(_index < savingsGoals[msg.sender].length, "Savings goal index out of bounds");
        require(_current <= _target, "Current savings cannot exceed target");
        
        SavingsGoal storage goal = savingsGoals[msg.sender][_index];
        goal.current = _current;
        goal.target = _target;
        
        emit SavingsGoalUpdated(msg.sender, _index, _current, _target);
    }
    
    /**
     * @dev Get all savings goals for a user
     * @return All savings goals for the caller
     */
    function getSavingsGoals() external view returns (SavingsGoal[] memory) {
        return savingsGoals[msg.sender];
    }
    
    /**
     * @dev Get financial overview data
     * @return Financial data for the caller
     */
    function getFinancialData() external view returns (FinancialData memory) {
        return financialData[msg.sender];
    }
}