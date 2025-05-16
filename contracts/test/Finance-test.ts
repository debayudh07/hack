import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("FinanceDashboard", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFinanceDashboardFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const FinanceDashboard = await hre.ethers.getContractFactory("FinanceDashboard");
    const financeDashboard = await FinanceDashboard.deploy();

    return { financeDashboard, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { financeDashboard, owner } = await loadFixture(deployFinanceDashboardFixture);

      expect(await financeDashboard.owner()).to.equal(owner.address);
    });
  });

  describe("Financial Data", function () {
    it("Should update financial data correctly", async function () {
      const { financeDashboard, owner } = await loadFixture(deployFinanceDashboardFixture);
      
      // Initial data should be empty/default
      const initialData = await financeDashboard.getFinancialData();
      expect(initialData.monthlyIncome).to.equal(0);
      expect(initialData.monthlyExpenses).to.equal(0);
      
      // Update financial data
      const monthlyIncome = 5000;
      const monthlyExpenses = 3000;
      const expectedSavingsRate = 40; // (5000-3000)/5000 * 100 = 40
      const expectedTotalBalance = 2000;
      
      await expect(financeDashboard.updateFinancialData(monthlyIncome, monthlyExpenses))
        .to.emit(financeDashboard, "FinancialDataUpdated")
        .withArgs(owner.address, monthlyIncome, monthlyExpenses, expectedSavingsRate, expectedTotalBalance);
      
      // Check the updated data
      const updatedData = await financeDashboard.getFinancialData();
      expect(updatedData.monthlyIncome).to.equal(monthlyIncome);
      expect(updatedData.monthlyExpenses).to.equal(monthlyExpenses);
      expect(updatedData.savingsRate).to.equal(expectedSavingsRate);
      expect(updatedData.totalBalance).to.equal(expectedTotalBalance);
    });

    it("Should revert if expenses exceed income", async function () {
      const { financeDashboard } = await loadFixture(deployFinanceDashboardFixture);
      
      // Attempt to update with expenses greater than income
      const monthlyIncome = 3000;
      const monthlyExpenses = 5000;
      
      await expect(financeDashboard.updateFinancialData(monthlyIncome, monthlyExpenses))
        .to.be.revertedWith("Income must be greater than or equal to expenses");
    });
  });

  describe("Transactions", function () {
    it("Should add a transaction and update financial data correctly", async function () {
      const { financeDashboard, owner } = await loadFixture(deployFinanceDashboardFixture);
      
      // Add an income transaction
      const description = "Salary";
      const category = "Income";
      const date = await time.latest();
      const amount = 5000; // Positive for income
      
      await expect(financeDashboard.addTransaction(description, category, date, amount))
        .to.emit(financeDashboard, "TransactionAdded")
        .withArgs(owner.address, description, category, date, amount, true);
      
      // Check that transaction was added
      const transactions = await financeDashboard.getTransactions();
      expect(transactions.length).to.equal(1);
      expect(transactions[0].description).to.equal(description);
      expect(transactions[0].category).to.equal(category);
      expect(transactions[0].date).to.equal(date);
      expect(transactions[0].amount).to.equal(amount);
      expect(transactions[0].isIncome).to.equal(true);
      
      // Check that financial data was updated
      const financialData = await financeDashboard.getFinancialData();
      expect(financialData.monthlyIncome).to.equal(amount);
      expect(financialData.monthlyExpenses).to.equal(0);
      expect(financialData.savingsRate).to.equal(100); // Since no expenses yet
      
      // Add an expense transaction
      const expDescription = "Rent";
      const expCategory = "Housing";
      const expDate = date + 1;
      const expAmount = -2000; // Negative for expense
      
      await expect(financeDashboard.addTransaction(expDescription, expCategory, expDate, expAmount))
        .to.emit(financeDashboard, "TransactionAdded")
        .withArgs(owner.address, expDescription, expCategory, expDate, expAmount, false);
      
      // Check updated financial data after expense
      const updatedData = await financeDashboard.getFinancialData();
      expect(updatedData.monthlyIncome).to.equal(amount);
      expect(updatedData.monthlyExpenses).to.equal(2000);
      expect(updatedData.savingsRate).to.equal(60); // (5000-2000)/5000 * 100 = 60
      expect(updatedData.totalBalance).to.equal(3000);
    });
  });

  describe("Budgets", function () {
    it("Should add a budget correctly", async function () {
      const { financeDashboard, owner } = await loadFixture(deployFinanceDashboardFixture);
      
      const name = "Groceries";
      const spent = 300;
      const budget = 500;
      
      await expect(financeDashboard.addBudget(name, spent, budget))
        .to.emit(financeDashboard, "BudgetAdded")
        .withArgs(owner.address, name, spent, budget);
      
      const budgets = await financeDashboard.getBudgets();
      expect(budgets.length).to.equal(1);
      expect(budgets[0].name).to.equal(name);
      expect(budgets[0].spent).to.equal(spent);
      expect(budgets[0].budget).to.equal(budget);
    });

    it("Should update a budget correctly", async function () {
      const { financeDashboard, owner } = await loadFixture(deployFinanceDashboardFixture);
      
      // First add a budget
      await financeDashboard.addBudget("Groceries", 300, 500);
      
      // Now update it
      const index = 0;
      const newSpent = 400;
      const newBudget = 600;
      
      await expect(financeDashboard.updateBudget(index, newSpent, newBudget))
        .to.emit(financeDashboard, "BudgetUpdated")
        .withArgs(owner.address, index, newSpent, newBudget);
      
      const budgets = await financeDashboard.getBudgets();
      expect(budgets[0].spent).to.equal(newSpent);
      expect(budgets[0].budget).to.equal(newBudget);
    });

    it("Should revert if spent exceeds budget", async function () {
      const { financeDashboard } = await loadFixture(deployFinanceDashboardFixture);
      
      await expect(financeDashboard.addBudget("Groceries", 600, 500))
        .to.be.revertedWith("Spent amount cannot exceed budget");
    });

    it("Should revert if updating non-existent budget", async function () {
      const { financeDashboard } = await loadFixture(deployFinanceDashboardFixture);
      
      await expect(financeDashboard.updateBudget(0, 300, 500))
        .to.be.revertedWith("Budget index out of bounds");
    });
  });

  describe("Savings Goals", function () {
    it("Should add a savings goal correctly", async function () {
      const { financeDashboard, owner } = await loadFixture(deployFinanceDashboardFixture);
      
      const name = "Vacation";
      const current = 1000;
      const target = 5000;
      
      await expect(financeDashboard.addSavingsGoal(name, current, target))
        .to.emit(financeDashboard, "SavingsGoalAdded")
        .withArgs(owner.address, name, current, target);
      
      const goals = await financeDashboard.getSavingsGoals();
      expect(goals.length).to.equal(1);
      expect(goals[0].name).to.equal(name);
      expect(goals[0].current).to.equal(current);
      expect(goals[0].target).to.equal(target);
    });

    it("Should update a savings goal correctly", async function () {
      const { financeDashboard, owner } = await loadFixture(deployFinanceDashboardFixture);
      
      // First add a savings goal
      await financeDashboard.addSavingsGoal("Vacation", 1000, 5000);
      
      // Now update it
      const index = 0;
      const newCurrent = 2000;
      const newTarget = 6000;
      
      await expect(financeDashboard.updateSavingsGoal(index, newCurrent, newTarget))
        .to.emit(financeDashboard, "SavingsGoalUpdated")
        .withArgs(owner.address, index, newCurrent, newTarget);
      
      const goals = await financeDashboard.getSavingsGoals();
      expect(goals[0].current).to.equal(newCurrent);
      expect(goals[0].target).to.equal(newTarget);
    });

    it("Should revert if current exceeds target", async function () {
      const { financeDashboard } = await loadFixture(deployFinanceDashboardFixture);
      
      await expect(financeDashboard.addSavingsGoal("Vacation", 6000, 5000))
        .to.be.revertedWith("Current savings cannot exceed target");
    });

    it("Should revert if updating non-existent savings goal", async function () {
      const { financeDashboard } = await loadFixture(deployFinanceDashboardFixture);
      
      await expect(financeDashboard.updateSavingsGoal(0, 2000, 5000))
        .to.be.revertedWith("Savings goal index out of bounds");
    });
  });

  describe("Access Control", function () {
    it("Should allow only the data owner to access their data", async function () {
      const { financeDashboard, owner, otherAccount } = await loadFixture(deployFinanceDashboardFixture);
      
      // Owner adds some data
      await financeDashboard.updateFinancialData(5000, 3000);
      await financeDashboard.addTransaction("Salary", "Income", await time.latest(), 5000);
      await financeDashboard.addBudget("Groceries", 300, 500);
      await financeDashboard.addSavingsGoal("Vacation", 1000, 5000);
      
      // Other account adds their own data
      const otherAccountFinance = financeDashboard.connect(otherAccount) as typeof financeDashboard;
      await otherAccountFinance.updateFinancialData(4000, 2000);
      // Verify that each account sees their own data
      const ownerData = await financeDashboard.getFinancialData();
      const otherData = await otherAccountFinance.getFinancialData();
      
      
      expect(ownerData.monthlyIncome).to.equal(10000); // 5000 from updateFinancialData + 5000 from addTransaction
      expect(otherData.monthlyIncome).to.equal(4000);
      // Verify that transactions are specific to each account
      const ownerTx = await financeDashboard.getTransactions();
      const otherTx = await otherAccountFinance.getTransactions();
     
      
      expect(ownerTx.length).to.equal(1);
      expect(otherTx.length).to.equal(0);
    });
  });

  describe("Data Retrieval", function () {
    it("Should fetch all transactions, budgets, and savings goals correctly", async function () {
      const { financeDashboard, owner } = await loadFixture(deployFinanceDashboardFixture);
      
      // Add multiple transactions
      const date = await time.latest();
      await financeDashboard.addTransaction("Salary", "Income", date, 5000);
      await financeDashboard.addTransaction("Rent", "Housing", date + 86400, -1500); // One day later
      await financeDashboard.addTransaction("Groceries", "Food", date + 172800, -300); // Two days later
      
      // Add multiple budgets
      await financeDashboard.addBudget("Housing", 1500, 2000);
      await financeDashboard.addBudget("Food", 300, 800);
      await financeDashboard.addBudget("Entertainment", 200, 500);
      
      // Add multiple savings goals
      await financeDashboard.addSavingsGoal("Vacation", 1000, 5000);
      await financeDashboard.addSavingsGoal("New Car", 2500, 15000);
      await financeDashboard.addSavingsGoal("Emergency Fund", 3000, 10000);
      
      // Fetch all data
      const transactions = await financeDashboard.getTransactions();
      const budgets = await financeDashboard.getBudgets();
      const savingsGoals = await financeDashboard.getSavingsGoals();
      
      // Verify transactions
      expect(transactions.length).to.equal(3);
      expect(transactions[0].description).to.equal("Salary");
      expect(transactions[0].amount).to.equal(5000);
      expect(transactions[1].description).to.equal("Rent");
      expect(transactions[1].amount).to.equal(-1500);
      expect(transactions[2].description).to.equal("Groceries");
      expect(transactions[2].amount).to.equal(-300);
      
      // Verify budgets
      expect(budgets.length).to.equal(3);
      expect(budgets[0].name).to.equal("Housing");
      expect(budgets[0].spent).to.equal(1500);
      expect(budgets[0].budget).to.equal(2000);
      expect(budgets[1].name).to.equal("Food");
      expect(budgets[1].spent).to.equal(300);
      expect(budgets[2].name).to.equal("Entertainment");
      expect(budgets[2].budget).to.equal(500);
      
      // Verify savings goals
      expect(savingsGoals.length).to.equal(3);
      expect(savingsGoals[0].name).to.equal("Vacation");
      expect(savingsGoals[0].current).to.equal(1000);
      expect(savingsGoals[1].name).to.equal("New Car");
      expect(savingsGoals[1].target).to.equal(15000);
      expect(savingsGoals[2].name).to.equal("Emergency Fund");
      expect(savingsGoals[2].current).to.equal(3000);
      expect(savingsGoals[2].target).to.equal(10000);
    });
    
    it("Should handle empty data retrieval correctly", async function () {
      const { financeDashboard } = await loadFixture(deployFinanceDashboardFixture);
      
      // Fetch data from a fresh contract deployment
      const transactions = await financeDashboard.getTransactions();
      const budgets = await financeDashboard.getBudgets();
      const savingsGoals = await financeDashboard.getSavingsGoals();
      
      // Verify all data arrays are empty
      expect(transactions.length).to.equal(0);
      expect(budgets.length).to.equal(0);
      expect(savingsGoals.length).to.equal(0);
    });
  });
});
