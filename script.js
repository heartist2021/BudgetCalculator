var incomeLines = [];
var expensesLines = [];

function addIncome() {
    var incomeValue = parseFloat(document.getElementById("income").value) || 0;
    var incomeDescription = document.getElementById("incomeDescription").value;
    
    if (incomeValue > 0 && incomeDescription.trim() !== "") {
        incomeLines.push({ value: incomeValue, description: incomeDescription });
        updateHistory();
        clearInputFields();
    } else {
        alert("Please enter a valid income value and description.");
    }
}

function addExpenses() {
    var expensesValue = parseFloat(document.getElementById("expenses").value) || 0;
    var expensesDescription = document.getElementById("expensesDescription").value;
    
    if (expensesValue > 0 && expensesDescription.trim() !== "") {
        expensesLines.push({ value: expensesValue, description: expensesDescription });
        updateHistory();
        clearInputFields();
    } else {
        alert("Please enter a valid expenses value and description.");
    }
}

function calculateBudget() {
    // Calculate the budget
    var budget = incomeLines.reduce((sum, line) => sum + line.value, 0) -
                 expensesLines.reduce((sum, line) => sum + line.value, 0);

    // Display the result
    document.getElementById("result").innerText = budget.toFixed(2);
}

function updateHistory() {
    var historyList = document.getElementById("historyList");
    historyList.innerHTML = "";

    incomeLines.forEach(line => addLineToHistory(historyList, line, "green"));
    expensesLines.forEach(line => addLineToHistory(historyList, line, "red"));
}

function downloadExcel() {
  const data = incomeLines.concat(expensesLines);
  const wsData = [
      // Header row
      ["Description", "Value"],
      // Data rows
      ...data.map(line => [line.description, line.value.toFixed(2)]),
      // Total row
      ["Total Budget", calculateTotalBudget().toFixed(2)]
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
  XLSX.writeFile(wb, 'budget.xlsx');
}




function calculateTotalBudget() {
  const incomeTotal = incomeLines.reduce((sum, line) => sum + line.value, 0);
  const expensesTotal = expensesLines.reduce((sum, line) => sum + line.value, 0);
  return incomeTotal - expensesTotal;
}

function addLineToHistory(historyList, line, color) {
    var listItem = document.createElement("li");
    listItem.textContent = `${line.description}: $${line.value.toFixed(2)}`;
    listItem.style.color = color;
    historyList.appendChild(listItem);
}

function downloadPDF() {
  const pdfElement = document.getElementById("history");
  const totalBudget = document.getElementById("result").innerText;

  // Add the total budget to the PDF content
  const totalBudgetElement = document.createElement("p");
  totalBudgetElement.textContent = `Total Budget: $${totalBudget}`;
  pdfElement.appendChild(totalBudgetElement);

  html2pdf(pdfElement, {
      margin: 10,
      filename: 'budget.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  });

}
function clearInputFields() {
      document.getElementById("income").value = "";
      document.getElementById("expenses").value = "";
      document.getElementById("incomeDescription").value = "";
      document.getElementById("expensesDescription").value = "";
  }