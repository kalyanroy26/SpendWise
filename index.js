var form = document.getElementById("transaction-data");
var formDataObj;
var data;
var type;
var category;
var balance = 0;
var transaction_list = document.getElementById("transaction_list");

form.addEventListener('submit', saveForm);

// Attach event listeners to dropdown menus to get selected values
dropDownValue("type-dropdown", "option", "type-btn", "type");
dropDownValue("category-dropdown", "options", "category-btn", "category");

function dropDownValue(id, option, btn, type) {
    var dropDown_menu = document.getElementById(id);
    var options = dropDown_menu.getElementsByClassName(option);

    for (let i = 0; i < options.length; i++) {
        options[i].addEventListener('click', function () {
            var selectedValue = this.textContent;
            
            document.querySelector(`.${btn} span[name=${type}]`).textContent = selectedValue;


            if (type === "type") {
                window[type] = selectedValue;
                if (selectedValue === "Income") {
                    document.getElementById("category").classList.add("hide");
                }
                else if (selectedValue === "Investment") {
                    document.getElementById("category").classList.add("hide");
                }
                else {
                    document.getElementById("category").classList.remove("hide");
                }
            } else if (type === "category") {
                category = selectedValue;

            }
        })
    }
}


async function saveForm(event) {
    event.preventDefault();
    const myFormData = new FormData(event.target);

    formDataObj = Object.fromEntries(myFormData.entries());
    formDataObj.type = type;
    formDataObj.category = category;
    console.log(formDataObj);

    event.target.reset();
    document.querySelector(".type-btn span[name='type']").innerText = 'Select';
    document.querySelector(".category-btn span[name='category']").innerText = 'Select';
    data = formDataObj;
    addTransaction(data);
    dashboard(data);
    saveTransaction();
    donutGraph(
        Number(localStorage.getItem("income") || 0),
        Number(localStorage.getItem("expense") || 0),
        Number(localStorage.getItem("investment") || 0)
    );
}

function dashboard(data) {
    var type = data.type;
    var amount = Number(data.amount);

    var storedIncome = Number(localStorage.getItem("income") || 0);
    var storedExpense = Number(localStorage.getItem("expense") || 0);
    var storedInvestment = Number(localStorage.getItem("investment") || 0);

    if (type === "Income") {
        storedIncome += amount;
    }
    else if (type === "Expense") {
        storedExpense += amount;
    }
    else if (type === "Investment") {
        storedInvestment += amount;
    }

    balance = storedIncome - storedExpense - storedInvestment;

    document.querySelector(".current-balance").textContent = "₹ " + balance;
    document.querySelector(".total-income").textContent = "₹ " + storedIncome;
    document.querySelector(".total-expense").textContent = "₹ " + storedExpense;
    document.querySelector(".total-investments").textContent = "₹ " + storedInvestment;


    localStorage.setItem("balance", balance);
    localStorage.setItem("income", storedIncome);
    localStorage.setItem("expense", storedExpense);
    localStorage.setItem("investment", storedInvestment);

}


function addTransaction(data) {
        var name = data.name;
        var amount = data.amount;
        var type = data.type;
        var category = data.category;
        var date = data.date;
    
        var li = document.createElement("li"); //li element
        var typeIcon = document.createElement("img"); // icon 
        typeIcon.setAttribute("height", "50");
    
        var description = document.createElement("div")
        description.classList.add("transaction-description", "box"); //description
        var tName = document.createElement("div")
        tName.classList.add("transaction-name"); // name of transaction
        tName.innerHTML = name;
        var tCategory = document.createElement("div")
        tCategory.classList.add("transaction-category"); // category 
        if (type === "Income" || type === "Investment") {
            tCategory.classList.add("type");
            tCategory.innerHTML = type;
            if (type === "Income") {
                typeIcon.setAttribute("src", "./images/" + type + ".gif");
                li.classList.add("transaction-item", "income");
                tCategory.setAttribute("data-type", type);
            }
            else {
                typeIcon.setAttribute("src", "./images/" + type + ".png");
                li.classList.add("transaction-item", "investment");
                tCategory.setAttribute("data-type", type);
    
            }
        }
        else if (type === "Expense") {
            tCategory.classList.add("category");
            tCategory.innerHTML = category;
            tCategory.setAttribute("data-type", type);
    
            if (category === "Utilities" || category === "Other") {
                typeIcon.setAttribute("src", "./images/" + category + ".png");
            }
            else {
                typeIcon.setAttribute("src", "./images/" + category + ".gif");
            }
            li.classList.add("transaction-item", "expense");
    
        }
    
        var tAmountDateWrapper = document.createElement("div"); // Create wrapper for amount and date
        tAmountDateWrapper.classList.add("amount-date-wrapper");
    
        var tAmount = document.createElement("div")
        tAmount.classList.add("transaction-amount");
        tAmount.innerHTML = "₹ " + amount;
    
        var tDate = document.createElement("div")
        tDate.classList.add("current-transaction-date", "box");
        tDate.innerHTML = date;
    
        var deleteIcon = document.createElement("img")
        deleteIcon.setAttribute("src", "./images/bin.png");
        deleteIcon.setAttribute("height", "30");
        deleteIcon.classList.add("delete-icon");
    
        transaction_list.appendChild(li);
        li.appendChild(typeIcon);
        li.appendChild(description);
        description.appendChild(tName);
        description.appendChild(tCategory);
        li.appendChild(tAmountDateWrapper); // Append the wrapper
        tAmountDateWrapper.appendChild(tAmount); // Append amount inside the wrapper
        tAmountDateWrapper.appendChild(tDate); // Append date inside the wrapper
        li.appendChild(deleteIcon);
        
        saveTransaction();
        sortTransactions();
    
}

document.addEventListener("DOMContentLoaded", function () {
    showTransaction();
    showDashboard();
});

function saveTransaction() {
    localStorage.setItem("transaction", transaction_list.innerHTML);
    console.log("data is stored");
}

function showTransaction() {
    var transaction_list = document.getElementById("transaction_list");
    if (transaction_list) {
        transaction_list.innerHTML = localStorage.getItem("transaction") || "";
    } else {
        console.error("Transaction list element not found.");
    }
}

function showDashboard() {
    var balanceElement = document.querySelector(".current-balance");
    var incomeElement = document.querySelector(".total-income");
    var expenseElement = document.querySelector(".total-expense");
    var investmentElement = document.querySelector(".total-investments");

    var storedBalance = localStorage.getItem("balance") || 0;
    var storedIncome = localStorage.getItem("income") || 0;
    var storedExpense = localStorage.getItem("expense") || 0;
    var storedInvestment = localStorage.getItem("investment") || 0;

    balanceElement.textContent = "₹ " + storedBalance;
    incomeElement.textContent = "₹ " + storedIncome;
    expenseElement.textContent = "₹ " + storedExpense;
    investmentElement.textContent = "₹ " + storedInvestment;

    donutGraph(storedIncome, storedExpense, storedInvestment);
}


transaction_list.addEventListener('click', function (event) {
    if (event.target.tagName === 'IMG' &&  event.target.classList.contains("delete-icon")) {
        console.log(event.target.tagName)
        removeTransaction(event);
    }
})

function removeTransaction(event) {
    var clickedElement = event.target;
    var removedAmount = Number(clickedElement.closest('li').querySelector('.transaction-amount').textContent.replace("₹ ", ""));
    var removedType = clickedElement.closest('li').querySelector(".transaction-category").getAttribute("data-type");

    console.log("Removed Type:", removedType); // Check the type of the removed transaction
    console.log("removing amount:", removedAmount);

    var storedIncome = Number(localStorage.getItem("income") || 0);
    var storedExpense = Number(localStorage.getItem("expense") || 0);
    var storedInvestment = Number(localStorage.getItem("investment") || 0);

    if (removedType === 'Income') {
        storedIncome -= removedAmount;
    } else if (removedType === "Expense") {
        storedExpense -= removedAmount;
    } else if (removedType === "Investment") {
        storedInvestment -= removedAmount;
    }

    var balance = storedIncome - storedExpense - storedInvestment;
    console.log("Updated Balance:", balance); // Check the updated balance value

    donutGraph(storedIncome, storedExpense, storedInvestment);


    document.querySelector(".current-balance").textContent = "₹ " + balance;
    document.querySelector(".total-income").textContent = "₹ " + storedIncome;
    document.querySelector(".total-expense").textContent = "₹ " + storedExpense;
    document.querySelector(".total-investments").textContent = "₹ " + storedInvestment;

    // Update localStorage with new values
    localStorage.setItem("income", storedIncome);
    localStorage.setItem("expense", storedExpense);
    localStorage.setItem("investment", storedInvestment);
    localStorage.setItem("balance", balance);

    clickedElement.closest('li').remove();

    saveTransaction();


}

var filterBtn = document.getElementById("filter-btn");
var toggleSpans = document.querySelectorAll(".toggle");

toggleSpans.forEach(function (span) {
    span.addEventListener("click", function () {
        var width = span.offsetWidth + 3;
        var position = span.offsetLeft - 2;
        filterBtn.style.width = width + "px";
        filterBtn.style.left = position + "px";
        toggleSpans.forEach(function (innerSpan) {
            innerSpan.classList.remove("active");
        });
        span.classList.add("active");
    });
});


const allBtn = document.getElementById('all-btn');
const incomeBtn = document.getElementById('income-btn');
const expenseBtn = document.getElementById('expense-btn');
const investmentBtn = document.getElementById('investment-btn');

const transactionList = document.getElementById('transaction_list');

allBtn.addEventListener('click', () => filterTransactions('all'));
incomeBtn.addEventListener('click', () => filterTransactions('income'));
expenseBtn.addEventListener('click', () => filterTransactions('expense'));
investmentBtn.addEventListener('click', () => filterTransactions('investment'));


function filterTransactions(type) {
    const transactions = document.querySelectorAll('.transaction-item');

    const transactionsArray = Array.from(transactions);

    // Display transactions based on type
    transactionsArray.forEach(transaction => {
        const transactionType = transaction.classList.contains(type);

        if (type === 'all') {
            transaction.style.display = 'flex';
            sortTransactions();

        } else if (!transactionType) {
            transaction.style.display = 'none';
            sortTransactions();

        } else {
            transaction.style.display = 'flex';
            sortTransactions();

        }
    });
}

function sortTransactions() {
    // Get all transaction items
    const transactions = Array.from(document.querySelectorAll('.transaction-item'));

    // Map transaction elements to their corresponding dates
    const transactionMap = transactions.reduce((map, transaction) => {
        const dateElement = transaction.querySelector('.current-transaction-date');
        if (dateElement) {
            const date = new Date(dateElement.textContent);
            map.set(date, transaction);
        }
        return map;
    }, new Map());

    const sortedDates = Array.from(transactionMap.keys()).sort((a, b) => b - a);
    transactions.forEach(transaction => transaction.remove());

    // Append transaction items in the sorted order
    sortedDates.forEach(date => {
        const transaction = transactionMap.get(date);
        if (transaction) {
            document.querySelector('.transaction_list').appendChild(transaction);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    showTransaction();
    sortTransactions();

    const allSpan = document.getElementById('all-btn');
    allSpan.classList.add('default-active');
    allSpan.click();
});


function donutGraph(income, expense, investment) {
    const myChartCanvas = document.getElementById("myChart");
    const ctx = myChartCanvas.getContext('2d');

    // Destroy existing chart if it exists
    if (myChartCanvas.chart) {
        myChartCanvas.chart.destroy();
    }

    const chartData = {
        labels: ["Income", "Expense", "Investment"],
        datasets: [{
            data: [income, expense, investment],
            backgroundColor: [
                '#1fab89',
                '#ff2e63',
                '#40a2e3'
            ],
            hoverOffset: 4,
        }]
    };

    // Create new chart instance
    const myChart = new Chart(ctx, {
        type: 'doughnut',
        data: chartData,
        options: {
            borderWidth: 10,
            borderRadius: 2,
            hoverBorderWidth: 0,
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    borderColor: 'rgba(0,0,0,0.5)',
                    boxWidth: 15,
                    boxHeight:15,
                    boxPadding: 10,
                    bodyFont: { 
                        family:"Outfit",
                        size: 14,
                        weight: 'bold'
                    },
                    padding: 8,
                },
            },
            
        }
    });

    myChartCanvas.chart = myChart;
}









// localStorage.clear();
