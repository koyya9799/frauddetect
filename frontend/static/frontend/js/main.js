console.log("✅ JS loaded successfully");


// =====================
// 📊 Chart.js Setup
// =====================

let fraudCount = 0;
let legitCount = 0;
let predictionHistory = []; // {time: '15:00', prediction: 'Fraud'}

const pieCtx = document.getElementById('pieChart').getContext('2d');
const lineCtx = document.getElementById('lineChart').getContext('2d');

const pieChart = new Chart(pieCtx, {
  type: 'pie',
  data: {
    labels: ['Legit ✅', 'Fraud 🚨'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#4CAF50', '#E53935'],
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' }
    }
  }
});

const lineChart = new Chart(lineCtx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Fraud (1) vs Legit (0)',
      data: [],
      borderColor: '#2196F3',
      tension: 0.3
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: { beginAtZero: true, suggestedMax: 1 }
    }
  }
});

// =====================
// 🧠 Helper to Update Charts
// =====================
function updateCharts(prediction) {
  if (prediction === 1) fraudCount++;
  else legitCount++;

  // Update pie chart
  pieChart.data.datasets[0].data = [legitCount, fraudCount];
  pieChart.update();

  // Update line chart
  const now = new Date();
  const time = now.toLocaleTimeString();
  predictionHistory.push({ time, prediction });
  lineChart.data.labels.push(time);
  lineChart.data.datasets[0].data.push(prediction);
  lineChart.update();
}


// --- helpers ---
function getCookie(name) {
  // Read cookies for CSRF
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
  return null;
}

function setLoading(isLoading) {
  const btn = document.getElementById('predictBtn');
  btn.disabled = isLoading;
  btn.textContent = isLoading ? 'Predicting…' : 'Predict';
}

// --- UI elements ---
const featuresEl = document.getElementById('features');
const resultBox = document.getElementById('result');
const resultText = document.getElementById('resultText');
const errorBox = document.getElementById('error');
const loadSampleBtn = document.getElementById('loadSampleBtn');
const predictBtn = document.getElementById('predictBtn');

// Sample of 30 numbers (you can replace with any valid sample)
const SAMPLE = [
  0.12, -1.03, 0.55, -0.21, 0.78, -0.44, 0.19, 1.02, -0.87, 0.34,
  0.49, -0.63, 0.91, 0.08, -1.11, 0.72, 0.41, -0.35, 0.66, -0.52,
  0.70, -0.92, 0.32, 1.20, -0.68, 0.10, 0.51, -0.80, 0.88, -0.15
];

loadSampleBtn?.addEventListener('click', () => {
  featuresEl.value = SAMPLE.join(', ');
});

// Main click handler
predictBtn?.addEventListener('click', async () => {
  errorBox.style.display = 'none';
  resultBox.style.display = 'none';

  // Parse textarea -> numbers
  const raw = featuresEl.value.trim();
  const numbers = raw.split(/[\s,]+/).map(v => Number(v)).filter(v => !Number.isNaN(v));

  if (numbers.length !== 30) {
    errorBox.textContent = `Please enter exactly 30 numeric values (you provided ${numbers.length}).`;
    errorBox.style.display = 'block';
    return;
  }

  try {
    setLoading(true);

    const res = await fetch('/api/predict/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({ features: numbers })
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Server error (${res.status}): ${txt}`);
    }

    const data = await res.json();
    const label = Number(data.prediction) === 1 ? 'Fraud' : 'Legit';

    // Style result box
    resultBox.style.background = (label === 'Fraud') ? '#ffe6e6' : '#e9f7ef';
    resultBox.style.border = (label === 'Fraud') ? '1px solid #ff4d4d' : '1px solid #2ecc71';
    resultText.textContent = label;
    resultText.style.color = (label === 'Fraud') ? '#c40000' : '#1e7e34';
    resultBox.style.display = 'block';
  } catch (err) {
    errorBox.textContent = err.message;
    errorBox.style.display = 'block';
  } finally {
    setLoading(false);
  }
});


// Helper to get Django CSRF token from cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

document.getElementById("predictBtn").addEventListener("click", async () => {
  const raw = document.getElementById("features").value.trim();
  const numbers = raw.split(/[\s,]+/).map(Number).filter(v => !Number.isNaN(v));

  if (numbers.length !== 30) {
    alert(`❌ Please enter exactly 30 numbers. You entered ${numbers.length}.`);
    return;
  }

  try {
    const response = await fetch('/api/predict/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({ features: numbers })
    });

    if (!response.ok) throw new Error(`Server error: ${response.status}`);

    const data = await response.json();
    const resultBox = document.getElementById("result");
    const resultText = document.getElementById("resultText");

    if (Number(data.prediction) === 1) {
      // Fraud 🚨
      resultBox.style.background = "#ffe6e6";
      resultBox.style.border = "1px solid #ff4d4d";
      resultText.textContent = "🚨 Fraud Detected";
      resultText.style.color = "#c40000";
    } else {
      // Legit ✅
      resultBox.style.background = "#e9f7ef";
      resultBox.style.border = "1px solid #2ecc71";
      resultText.textContent = "✅ Legit Transaction";
      resultText.style.color = "#1e7e34";
    }

    resultBox.style.display = "block";
    console.log("Prediction:", data.prediction);
    addToHistory(numbers.length, data.prediction); // 👈 for Step 4
    updateCharts(data.prediction);


  } catch (err) {
    console.error("Prediction error:", err);
    alert("❌ Prediction failed: " + err.message);
  }

  function addToHistory(featureCount, prediction) {
  const tableBody = document.querySelector("#historyTable tbody");
  const row = document.createElement("tr");

  const timeCell = document.createElement("td");
  const featureCell = document.createElement("td");
  const resultCell = document.createElement("td");

  const now = new Date().toLocaleTimeString();

  timeCell.textContent = now;
  featureCell.textContent = featureCount;
  resultCell.textContent = prediction === 1 ? "🚨 Fraud" : "✅ Legit";

  row.appendChild(timeCell);
  row.appendChild(featureCell);
  row.appendChild(resultCell);

  // Add new row to top of table
  tableBody.insertBefore(row, tableBody.firstChild);

  // Keep only last 5 entries
    while (tableBody.rows.length > 5) {
    tableBody.deleteRow(5);
  }
}

async function loadHistory() {
  try {
    const res = await fetch('/api/transactions/');
    const data = await res.json();

    const tableBody = document.querySelector("#historyTable tbody");
    tableBody.innerHTML = '';

    data.slice(0, 5).forEach(txn => {
      const row = document.createElement("tr");
      const time = new Date(txn.created_at).toLocaleTimeString();

      row.innerHTML = `
        <td>${time}</td>
        <td>${txn.feature_count}</td>
        <td>${txn.prediction === 1 ? '🚨 Fraud' : '✅ Legit'}</td>
      `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error('Failed to load history:', err);
  }
}

// ✅ Call it on page load
window.addEventListener('DOMContentLoaded', loadHistory);



});
