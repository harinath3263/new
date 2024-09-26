// app.js
document.addEventListener('DOMContentLoaded', function() {
    const transactionForm = document.getElementById('transactionForm');
    const transactionTable = document.getElementById('transactionTable').querySelector('tbody');
    const balanceDisplay = document.getElementById('balance');
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    function updateLocalStorage() {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    function calculateBalance() {
        const balance = transactions.reduce((acc, transaction) => {
            return transaction.type === 'income' ? acc + transaction.amount : acc - transaction.amount;
        }, 0);
        balanceDisplay.textContent = `$${balance.toFixed(2)}`;
    }

    function addTransactionToDOM(transaction) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.description}</td>
            <td>${transaction.amount.toFixed(2)}</td>
            <td>${transaction.type}</td>
            <td><button onclick="deleteTransaction(${transaction.id})">Delete</button></td>
        `;
        transactionTable.appendChild(row);
    }

    function deleteTransaction(id) {
        transactions = transactions.filter(transaction => transaction.id !== id);
        updateLocalStorage();
        loadTransactions();
    }

    function loadTransactions() {
        transactionTable.innerHTML = '';
        transactions.forEach(addTransactionToDOM);
        calculateBalance();
    }

    transactionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const description = document.getElementById('description').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const type = document.getElementById('type').value;

        const transaction = { id: Date.now(), description, amount, type };
        transactions.push(transaction);
        addTransactionToDOM(transaction);
        calculateBalance();
        updateLocalStorage();

        transactionForm.reset();
    });

    window.deleteTransaction = deleteTransaction; 

    loadTransactions();

    document.getElementById('exportCSV').addEventListener('click', function() {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Description,Amount,Type\n" + transactions.map(t => `${t.description},${t.amount},${t.type}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "transactions.csv");
        link.click();
    });
});
