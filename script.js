let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let chart = null;

// Jalankan setelah HTML siap
document.addEventListener("DOMContentLoaded", () => {
    updateUI();
});

// 🔄 Update UI
function updateUI() {
    const list = document.getElementById("list");
    const balanceEl = document.getElementById("balance");

    let balance = 0;
    let categories = { Food: 0, Transport: 0, Fun: 0 };

    list.innerHTML = "";

    transactions.forEach((t, index) => {
        balance += Number(t.amount);
        categories[t.category] += Number(t.amount);

        const div = document.createElement("div");
        div.classList.add("transaction");

        div.innerHTML = `
            <div>
                <b>${t.name}</b><br>
                $${t.amount} (${t.category})
            </div>
            <button class="delete" onclick="deleteTx(${index})">X</button>
        `;

        list.appendChild(div);
    });

    balanceEl.innerText = "$" + balance.toFixed(2);

    localStorage.setItem("transactions", JSON.stringify(transactions));

    updateChart(categories);
}

// ➕ Tambah data
function addTransaction() {
    const name = document.getElementById("name").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const category = document.getElementById("category").value;

    if (!name || isNaN(amount)) {
        alert("Isi data dengan benar!");
        return;
    }

    transactions.push({ name, amount, category });
    updateUI();

    document.getElementById("name").value = "";
    document.getElementById("amount").value = "";
}

// ❌ Hapus
function deleteTx(i) {
    transactions.splice(i, 1);
    updateUI();
}

// 📊 Chart FIXED
function updateChart(data) {
    const canvas = document.getElementById("chart");

    if (!canvas) return; // safety

    const ctx = canvas.getContext("2d");

    const values = Object.values(data);

    // kalau semua 0, biar chart tetap muncul
    if (values.every(v => v === 0)) {
        values[0] = 1;
    }

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: Object.keys(data),
            datasets: [{
                data: values,
                backgroundColor: ["#2ecc71", "#3498db", "#e67e22"],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom"
                }
            },
            animation: {
                animateScale: true
            }
        }
    });
}