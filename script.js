const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");

const buttons = document.querySelectorAll(".calculator button");

let expression = "";
let justCalculated = false;

/* =========================
   CALCULATOR
========================= */

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.textContent.trim();

        if (value === "C") {
            clearCalculator();
            return;
        }

        if (value === "⌫") {
            deleteLast();
            return;
        }

        if (value === "=") {
            calculate();
            return;
        }

        if (value === "%") {
            percentage();
            return;
        }

        addValue(value);
    });
});

function addValue(value) {
    if (justCalculated && !isOperator(value)) {
        expression = "";
        justCalculated = false;
    }

    if (value === ".") {
        const parts = expression.split(/[+\-×÷]/);
        const currentNumber = parts[parts.length - 1];

        if (currentNumber.includes(".")) {
            return;
        }
    }

    if (isOperator(value)) {
        if (expression === "") {
            return;
        }

        const lastCharacter = expression.slice(-1);

        if (isOperator(lastCharacter)) {
            expression = expression.slice(0, -1);
        }
    }

    expression += value;
    updateDisplay();
}

function isOperator(value) {
    return ["+", "−", "×", "÷"].includes(value);
}

function updateDisplay() {
    expressionDisplay.textContent = expression || "0";
}

function clearCalculator() {
    expression = "";
    expressionDisplay.textContent = "0";
    resultDisplay.textContent = "0";
    justCalculated = false;
}

function deleteLast() {
    expression = expression.slice(0, -1);
    updateDisplay();
}

function percentage() {
    const match = expression.match(/(\d+\.?\d*)$/);

    if (!match) {
        return;
    }

    const number = Number(match[0]);
    const percentageValue = number / 100;

    expression =
        expression.slice(0, -match[0].length) +
        percentageValue;

    updateDisplay();
}

function calculate() {
    if (!expression) {
        return;
    }

    try {
        let calculation = expression
            .replace(/×/g, "*")
            .replace(/÷/g, "/")
            .replace(/−/g, "-");

        if (!/^[0-9+\-*/().\s]+$/.test(calculation)) {
            throw new Error("Invalid calculation");
        }

        const answer = Function(
            `"use strict"; return (${calculation})`
        )();

        if (!Number.isFinite(answer)) {
            throw new Error("Invalid result");
        }

        const roundedAnswer =
            Math.round(answer * 100000000) / 100000000;

        resultDisplay.textContent = roundedAnswer;
        justCalculated = true;

    } catch (error) {
        resultDisplay.textContent = "Error";
    }
}


/* =========================
   MODE SWITCHING
========================= */

const modeButtons = document.querySelectorAll(".mode");

const calculatorMode =
    document.getElementById("calculatorMode");

const equationMode =
    document.getElementById("equationMode");

const salesMode =
    document.getElementById("salesMode");

modeButtons.forEach(button => {
    button.addEventListener("click", () => {

        modeButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const mode = button.dataset.mode;

        calculatorMode.classList.add("hidden");
        equationMode.classList.add("hidden");
        salesMode.classList.add("hidden");

        if (mode === "calculator") {
            calculatorMode.classList.remove("hidden");
        }

        if (mode === "equation") {
            equationMode.classList.remove("hidden");
        }

        if (mode === "sales") {
            salesMode.classList.remove("hidden");
        }
    });
});


/* =========================
   EQUATION SOLVER
========================= */

const solveButton =
    document.getElementById("solveButton");

const equationInput =
    document.getElementById("equationInput");

const equationAnswer =
    document.getElementById("equationAnswer");

solveButton.addEventListener("click", solveEquation);

function solveEquation() {

    const equation =
        equationInput.value
            .replace(/\s/g, "")
            .toLowerCase();

    const match =
        equation.match(/^(-?\d*\.?\d*)x([+-]\d+\.?\d*)?=(-?\d+\.?\d*)$/);

    if (!match) {
        equationAnswer.textContent = "Invalid equation";
        return;
    }

    let a = match[1];

    if (a === "" || a === "+") {
        a = 1;
    } else if (a === "-") {
        a = -1;
    } else {
        a = Number(a);
    }

    const b = match[2]
        ? Number(match[2])
        : 0;

    const c = Number(match[3]);

    if (a === 0) {
        equationAnswer.textContent = "Invalid equation";
        return;
    }

    const x = (c - b) / a;

    equationAnswer.textContent =
        `x = ${Math.round(x * 100000000) / 100000000}`;
}


/* =========================
   SALES MODE
========================= */

const productsContainer =
    document.getElementById("products");

const addProductButton =
    document.getElementById("addProduct");

addProductButton.addEventListener(
    "click",
    addProduct
);

function addProduct() {

    const product =
        document.createElement("div");

    product.className = "product";

    product.innerHTML = `
        <input
            type="text"
            placeholder="Product"
        >

        <input
            type="number"
            placeholder="Qty"
            min="1"
            value="1"
        >

        <input
            type="number"
            placeholder="Cost"
            min="0"
        >

        <input
            type="number"
            placeholder="Selling Price"
            min="0"
        >
    `;

    productsContainer.appendChild(product);

    updateSales();
}


productsContainer.addEventListener(
    "input",
    updateSales
);

function updateSales() {

    const products =
        document.querySelectorAll(".product");

    let totalItems = 0;
    let totalRevenue = 0;
    let totalProfit = 0;

    products.forEach(product => {

        const inputs =
            product.querySelectorAll("input");

        const quantity =
            Number(inputs[1].value) || 0;

        const cost =
            Number(inputs[2].value) || 0;

        const price =
            Number(inputs[3].value) || 0;

        const amount =
            quantity * price;

        const profit =
            quantity * (price - cost);

        totalItems += quantity;
        totalRevenue += amount;
        totalProfit += profit;


        let amountDisplay =
            product.querySelector(".product-amount");

        if (!amountDisplay) {

            amountDisplay =
                document.createElement("div");

            amountDisplay.className =
                "product-amount";

            product.appendChild(amountDisplay);
        }

        amountDisplay.textContent =
            `₦${amount.toLocaleString()}`;
    });


    document.getElementById("totalItems").textContent =
        totalItems;

    document.getElementById("revenue").textContent =
        `₦${totalRevenue.toLocaleString()}`;

    document.getElementById("profit").textContent =
        `₦${totalProfit.toLocaleString()}`;
}


/* =========================
   SAVE SALE
========================= */

const saveSaleButton =
    document.getElementById("saveSale");

saveSaleButton.addEventListener(
    "click",
    saveSale
);

function saveSale() {

    const products =
        document.querySelectorAll(".product");

    if (products.length === 0) {

        alert(
            "Add at least one product first."
        );

        return;
    }


    const sale = {

        date:
            new Date().toISOString(),

        items: [],

        totalItems: 0,

        revenue: 0,

        profit: 0
    };


    products.forEach(product => {

        const inputs =
            product.querySelectorAll("input");

        const name =
            inputs[0].value.trim();

        const quantity =
            Number(inputs[1].value) || 0;

        const cost =
            Number(inputs[2].value) || 0;

        const price =
            Number(inputs[3].value) || 0;


        if (
            !name ||
            quantity <= 0 ||
            cost < 0 ||
            price < 0
        ) {
            return;
        }


        const amount =
            quantity * price;

        const profit =
            quantity * (price - cost);


        sale.items.push({

            name: name,

            quantity: quantity,

            cost: cost,

            price: price,

            amount: amount,

            profit: profit
        });


        sale.totalItems +=
            quantity;

        sale.revenue +=
            amount;

        sale.profit +=
            profit;
    });


    if (sale.items.length === 0) {

        alert(
            "Please enter valid product details."
        );

        return;
    }


    const savedSales =
        JSON.parse(
            localStorage.getItem("sales")
        ) || [];


    savedSales.push(sale);


    localStorage.setItem(
        "sales",
        JSON.stringify(savedSales)
    );


    alert(
        "Sale saved successfully! "
    );
}


/* =========================
   SALES HISTORY
========================= */

const historyButton =
    document.getElementById("historyButton");

const salesHistory =
    document.getElementById("salesHistory");


historyButton.addEventListener(
    "click",
    () => {

        salesHistory.classList.toggle(
            "hidden"
        );

        loadSalesHistory();
    }
);


function loadSalesHistory() {

    const historyList =
        document.getElementById("historyList");

    const savedSales =
        JSON.parse(
            localStorage.getItem("sales")
        ) || [];

    historyList.innerHTML = "";

    if (savedSales.length === 0) {

        historyList.innerHTML = `
            <div class="empty-history">
                No sales recorded yet.
            </div>
        `;

        return;
    }

    savedSales.forEach(
        (sale, index) => {

            const saleBox =
                document.createElement("div");

            saleBox.className =
                "sale-record";

            saleBox.innerHTML = `

                <div class="sale-header">

                    <strong>
                        Sale ${index + 1}
                    </strong>

                    <span>
                        ${new Date(sale.date).toLocaleString()}
                    </span>

                </div>

                <div class="sale-items">

                    ${sale.items.map(item => `

                        <div class="sale-item">

                            <span>
                                ${item.name}
                                × ${item.quantity}
                            </span>

                            <strong>
                                ₦${item.amount.toLocaleString()}
                            </strong>

                        </div>

                    `).join("")}

                </div>

                <div class="sale-details">

                    <div>
                        <span>Revenue</span>
                        <strong>
                            ₦${sale.revenue.toLocaleString()}
                        </strong>
                    </div>

                    <div>
                        <span>Profit</span>
                        <strong>
                            ₦${(sale.profit || 0).toLocaleString()}
                        </strong>
                    </div>

                </div>

                <div class="sale-total">

                    <span>
                        Total Items
                    </span>

                    <strong>
                        ${sale.totalItems}
                    </strong>

                </div>

            `;

            historyList.appendChild(
                saleBox
            );
        }
    );
}
