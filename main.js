let table_data = returnObjectFromLocalMemory("workersTableData") || {
  workerList: [
    {
      firstName: "John",
      lastName: "Smith",
      department: "IT",
      salary: { amount: 3000, currency: "USD" },
    },
    {
      firstName: "Jane",
      lastName: "Doe",
      department: "IT",
      salary: { amount: 3000, currency: "USD" },
    },
    {
      firstName: "Bob",
      lastName: "Colman",
      department: "Sales",
      salary: { amount: 9000, currency: "USD" },
    },
    {
      firstName: "Barbara",
      lastName: "O'Connor",
      department: "Sales",
      salary: { amount: 4000, currency: "USD" },
    },
    {
      firstName: "Adam",
      lastName: "Murphy",
      department: "Administration",
      salary: { amount: 2000, currency: "USD" },
    },
  ],
  taskList: [
    {
      title: "Add form to add new worker",
      completed: true,
      subtaskList: [
        { title: "firstName", completed: true },
        { title: "lastName", completed: true },
        { title: "department", completed: true },
        { title: "salary amount and currency", completed: true },
      ],
    },
    {
      title: "Add search form",
      completed: true,
      subtaskList: [
        { title: "person (text)", completed: true },
        { title: "department (multiple choice)", completed: true },
        { title: "salary (range)", completed: true },
      ],
    },
    {
      title: "Add summary of salary per department",
      completed: true,
    },
    {
      title: "Other improvements:",
      completed: true,
      subtaskList: [
        { title: "Added auto conventer for currency", completed: true },
        { title: "Table's data is saved in local memory", completed: true },
        { title: "Table can be downloaded as CSV", completed: true },
        { title: "Table can be downloaded as PDF", completed: true },
      ],
    },
    {
      title: "Please send us this file with your solutions",
      completed: true,
    },
  ],
};

const TaskItem = Vue.component("task-item", {
  props: {
    task: Object,
  },
  template:
    '<li>{{task.title}} {{ task.completed ? "✅" : "❌"}}<slot name="default"></slot></li>',
});

new Vue({
  el: "#app",
  components: {
    TaskItem,
  },
  data: table_data,
  computed: {
    salarySum() {
      return this.workerList.reduce((acc, i) => acc + i.salary.amount, 0);
    },
  },
});

// Initialize local memory usage
window.localStorage.setItem("workersTableData", JSON.stringify(table_data));

// the API that I have connected to before was having some useabillity issues and it
// didn't work everytime, so I made some basic function that will convert most popular
// currencies and convert them as of 9.02.2023 [dd.mm format]

// arrays for currencies names and their exchange rate for USD
const CURRENCIES = [
  "AED",
  "AUD",
  "BRL",
  "CAD",
  "CHF",
  "CLP",
  "CNY",
  "COP",
  "CZK",
  "DKK",
  "EUR",
  "GBP",
  "HKD",
  "HUF",
  "IDR",
  "ILS",
  "INR",
  "JPY",
  "KRW",
  "MXN",
  "MYR",
  "NOK",
  "NZD",
  "PHP",
  "PLN",
  "RON",
  "RUB",
  "SAR",
  "SEK",
  "SGD",
  "THB",
  "TRY",
  "TWD",
  "USD",
];

const EXCHANGE_RATE = [
  0.27229408, 0.6932938, 0.18954594, 0.74291879, 1.083699, 0.0012486089,
  0.1475119, 0.00021112689, 0.045292178, 0.14421215, 1.0733852, 1.2117149,
  0.12739159, 0.0027730738, 0.000066038911, 0.28577525, 0.012111429,
  0.0075971862, 0.00079067249, 0.053221747, 0.23176406, 0.098226395, 0.6323206,
  0.018337423, 0.22563395, 0.21946986, 0.013708322, 0.26666667, 0.096511786,
  0.75434537, 0.029756449, 0.053103241, 0.033197642, 1,
];

function convertCurrency(currency, value) {
  for (let i = 0; i < CURRENCIES.length; i++) {
    if (currency === CURRENCIES[i]) {
      return Number(Number(value * EXCHANGE_RATE[i]).toFixed(0));
    }
  }
}

// function that will fill currency datalist input options
function fillCurrencyDatalist() {
  const datalist = document.querySelector("#currency-type-input");

  CURRENCIES.forEach((currency) => {
    let option = document.createElement("option");
    option.innerText = currency;
    datalist.appendChild(option);
  });
}

fillCurrencyDatalist();

function addObjectToLocalMemory(object_name, object_reference) {
  window.localStorage.setItem(object_name, JSON.stringify(object_reference));
}

function returnObjectFromLocalMemory(object_name) {
  return JSON.parse(window.localStorage.getItem(object_name));
}

function addWorker() {
  table_data.workerList.push({
    firstName: document.querySelector("#fname").value,
    lastName: document.querySelector("#lname").value,
    department: document.querySelector("#input-departments-form").value,
    salary: {
      amount: convertCurrency(
        document.querySelector("#currency-type-input-form").value,
        document.querySelector("#salary").value
      ),
      currency: "USD",
    },
  });

  function resetInputsValues() {
    document.querySelector("#fname").value = "";
    document.querySelector("#lname").value = "";
    document.querySelector("#salary").value = "";
  }

  resetInputsValues();

  // update local memory content
  addObjectToLocalMemory("workersTableData", table_data);

  function updateSallarySum() {
    let sum = 0;
    document
      .querySelector("tbody")
      .querySelectorAll("tr:not(.hide)")
      .forEach((tr) => {
        sum += Number(tr.cells[4].textContent.replace(/\D/g, ""));
      });
    document.querySelector("#summary-cell").innerText = sum + " USD";
  }

  setTimeout(updateSallarySum, 1);
}

// function that will validate inputs for creating new worker
function validateWorkerInputs() {
  const fnameInput = document.querySelector("#fname");
  const lnameInput = document.querySelector("#lname");
  const departmentInput = document.querySelector("#input-departments-form");
  const salaryInput = document.querySelector("#salary");
  const currencyInput = document.querySelector("#currency-type-input-form");

  // function that resets form inputs styles
  function resetStyles() {
    fnameInput.classList.remove("invalid-input");
    lnameInput.classList.remove("invalid-input");
    departmentInput.classList.remove("invalid-input");
    salaryInput.classList.remove("invalid-input");
    currencyInput.classList.remove("invalid-input");
  }

  resetStyles();

  let currencyValidity = true;
  let departmentValidity = true;
  let emptinessValidity = true;
  let wordsValidity = true;
  let numbersValidity = true;

  // checks if selected currency is available
  function checkCurrencyAvailability() {
    for (let i = 0; i < CURRENCIES.length; i++) {
      if (CURRENCIES[i] !== currencyInput.value) {
        currencyValidity = false;
        currencyInput.classList.add("invalid-input");
      } else {
        currencyValidity = true;
        currencyInput.classList.remove("invalid-input");
        return;
      }
    }
  }

  checkCurrencyAvailability();

  // checks if selected department is avaible
  const DEPARTMENTS = ["IT", "Sales", "Administration"];

  function checkDepartmentAvailability() {
    for (let i = 0; i < DEPARTMENTS.length; i++) {
      if (DEPARTMENTS[i] !== departmentInput.value) {
        departmentValidity = false;
        departmentInput.classList.add("invalid-input");
      } else {
        departmentValidity = true;
        departmentInput.classList.remove("invalid-input");
        return;
      }
    }
  }

  checkDepartmentAvailability();

  // checks if the inputs are not empty
  function checkIfEmpty() {
    if (fnameInput.value === "") {
      emptinessValidity = false;
      fnameInput.classList.add("invalid-input");
    }
    if (lnameInput.value === "") {
      emptinessValidity = false;
      lnameInput.classList.add("invalid-input");
    }
    if (departmentInput.value === "") {
      emptinessValidity = false;
      departmentInput.classList.add("invalid-input");
    }
    if (salaryInput.value === "") {
      emptinessValidity = false;
      salaryInput.classList.add("invalid-input");
    }
    if (currencyInput.value === "") {
      emptinessValidity = false;
      currencyInput.classList.add("invalid-input");
    }
  }

  checkIfEmpty();

  // checks if fname, lname are only letters, no spaces
  function checkWords() {
    if (fnameInput.value !== "") {
      if (!/^[A-Za-z]+$/.test(fnameInput.value)) {
        fnameInput.classList.add("invalid-input");
        wordsValidity = false;
      }
    }
    if (lnameInput.value !== "") {
      if (!/^[A-Za-z]+$/.test(lnameInput.value)) {
        lnameInput.classList.add("invalid-input");
        wordsValidity = false;
      }
    }
  }

  checkWords();

  // checks if salary contains only numbers and no spaces
  function checkNumbers() {
    if (salaryInput.value !== "") {
      if (!/^[0-9]+$/.test(salaryInput.value)) {
        salaryInput.classList.add("invalid-input");
        numbersValidity = false;
      }
    }
  }

  checkNumbers();

  return (
    currencyValidity &&
    departmentValidity &&
    emptinessValidity &&
    wordsValidity &&
    numbersValidity
  );
}

// adds events to form submit button, which checks form validity
const submitButton = document.querySelector("#submit-form");

submitButton.addEventListener("click", function () {
  if (validateWorkerInputs()) {
    addWorker();
  }
});

window.onload = function () {
  slideOne();
  slideTwo();
};

let sliderOne = document.getElementById("slider-1");
let sliderTwo = document.getElementById("slider-2");
let displayValOne = document.getElementById("range1");
let displayValTwo = document.getElementById("range2");
let minGap = 0;
let sliderTrack = document.querySelector(".slider-track");
let sliderMaxValue = document.getElementById("slider-1").max;

function slideOne() {
  if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
    sliderOne.value = parseInt(sliderTwo.value) - minGap;
  }
  displayValOne.textContent = sliderOne.value + "$";
  fillColor();
}

function slideTwo() {
  if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
    sliderTwo.value = parseInt(sliderOne.value) + minGap;
  }
  displayValTwo.textContent = sliderTwo.value + "$";
  fillColor();
}

function fillColor() {
  percent1 = (sliderOne.value / sliderMaxValue) * 100;
  percent2 = (sliderTwo.value / sliderMaxValue) * 100;
  sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #000000cc ${percent1}% , #000000cc ${percent2}%, #dadae5 ${percent2}%)`;
}

// function that will filter table based on user's input
function filterTable() {
  let name = document.querySelector("#search-filter").value;
  let department = document.querySelector("#input-departments").value;
  let minSalary = document.querySelector("#slider-1").value;
  let maxSalary = document.querySelector("#slider-2").value;

  const TABLE_BODY = document.querySelector("tbody");

  let sum = 0;

  resetFiltering();

  TABLE_BODY.querySelectorAll("tr").forEach((tr) => {
    filterByName(tr, name);
    filterByRange(tr, minSalary, maxSalary);
    filterByDepartment(tr, department);
  });

  changeSum();

  function filterByRange(tr, minSalary, maxSalary) {
    if (
      !(
        Number(tr.cells[4].textContent.replace(/\D/g, "")) >= minSalary &&
        Number(tr.cells[4].textContent.replace(/\D/g, "")) <= maxSalary
      )
    ) {
      tr.classList.add("hide");
    }
  }

  function filterByName(tr, name) {
    if (name !== "") {
      if (
        !(
          name.toLowerCase() == tr.cells[1].textContent.toLowerCase() ||
          name.toLowerCase() == tr.cells[2].textContent.toLowerCase()
        )
      ) {
        tr.classList.add("hide");
      }
    }
  }

  function filterByDepartment(tr, department) {
    if (department != "" && department != "View all") {
      if (!(tr.cells[3].textContent == department)) {
        tr.classList.add("hide");
      }
    }
  }

  function resetFiltering() {
    TABLE_BODY.querySelectorAll("tr").forEach((tr) => {
      tr.classList.remove("hide");
    });
  }
  function changeSum() {
    TABLE_BODY.querySelectorAll("tr:not(.hide)").forEach((tr) => {
      sum += Number(tr.cells[4].textContent.replace(/\D/g, ""));
    });
    document.querySelector("#summary-cell").innerText = sum + " USD";
  }
}

// add filtering events to inputs
document
  .querySelector("#search-filter")
  .addEventListener("change", function () {
    filterTable();
  });
document
  .querySelector("#input-departments")
  .addEventListener("change", function () {
    filterTable();
  });
document.querySelector("#slider-1").addEventListener("change", function () {
  filterTable();
});
document.querySelector("#slider-2").addEventListener("change", function () {
  filterTable();
});

function updateSallarySum() {
  let sum = 0;
  document
    .querySelector("tbody")
    .querySelectorAll("tr:not(.hide)")
    .forEach((tr) => {
      sum += Number(tr.cells[4].textContent.replace(/\D/g, ""));
    });
  document.querySelector("#summary-cell").innerText = sum + " USD";
}

updateSallarySum();

// code for paralax card
Vue.config.devtools = true;

Vue.component("card", {
  template: `
        <div class="card-wrap"
          @mousemove="handleMouseMove"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
          ref="card">
          <div class="card"
            :style="cardStyle">
            <div class="card-bg" :style="[cardBgTransform, cardBgImage]"></div>
            <div class="card-info">
              <slot name="header"></slot>
              <slot name="content"></slot>
            </div>
          </div>
        </div>`,
  mounted() {
    this.width = this.$refs.card.offsetWidth;
    this.height = this.$refs.card.offsetHeight;
  },
  props: ["dataImage"],
  data: () => ({
    width: 0,
    height: 0,
    mouseX: 0,
    mouseY: 0,
    mouseLeaveDelay: null,
  }),
  computed: {
    mousePX() {
      return this.mouseX / this.width;
    },
    mousePY() {
      return this.mouseY / this.height;
    },
    cardStyle() {
      const rX = this.mousePX * 30;
      const rY = this.mousePY * -30;
      return {
        transform: `rotateY(${rX}deg) rotateX(${rY}deg)`,
      };
    },
    cardBgTransform() {
      const tX = this.mousePX * -40;
      const tY = this.mousePY * -40;
      return {
        transform: `translateX(${tX}px) translateY(${tY}px)`,
      };
    },
    cardBgImage() {
      return {
        backgroundImage: `url(${this.dataImage})`,
      };
    },
  },
  methods: {
    handleMouseMove(e) {
      this.mouseX = e.pageX - this.$refs.card.offsetLeft - this.width / 2;
      this.mouseY = e.pageY - this.$refs.card.offsetTop - this.height / 2;
    },
    handleMouseEnter() {
      clearTimeout(this.mouseLeaveDelay);
    },
    handleMouseLeave() {
      this.mouseLeaveDelay = setTimeout(() => {
        this.mouseX = 0;
        this.mouseY = 0;
      }, 1000);
    },
  },
});

const app = new Vue({
  el: "#card-app",
});

const PDF_DOWNLOAD_BTN = document.querySelector("#btn-pdf");
const CSV_DOWNLOAD_BTN = document.querySelector("#btn-csv");

let workersTable = JSON.parse(
  window.localStorage.getItem("workersTableData")
).workerList;

let objectsContainer = [];

PDF_DOWNLOAD_BTN.addEventListener("click", function () {
  convertTable();

  var doc = new jsPDF();
  doc.setFont("roboto", "bold");
  doc.setFontSize(13);
  objectsContainer.forEach(function (worker, i) {
    doc.text(
      10,
      20 + i * 10,
      "ID: " +
        Number(i + 1) +
        " First Name: " +
        worker.firstName +
        " Last Name: " +
        worker.lastName +
        " Department: " +
        worker.department +
        " Salary: " +
        worker.salary
    );
  });
  doc.save("Workers.pdf");

  objectsContainer.length = 0;
});

CSV_DOWNLOAD_BTN.addEventListener("click", function () {
  convertTable();
  console.log(objectsContainer);
  const csv = jsonToCsv(objectsContainer);

  tableToCSV();
  downloadCSVFile(csv);
  objectsContainer.length = 0;
});

// convert table rows to an object
function convertTable() {
  for (let i = 0; i < workersTable.length; i++) {
    objectsContainer.push({
      ID: i + 1,
      firstName: workersTable[i].firstName,
      lastName: workersTable[i].lastName,
      department: workersTable[i].department,
      salary: workersTable[i].salary.amount + " USD",
    });
  }
}

// forked from https://codingbeautydev.com/blog/javascript-convert-json-to-csv/
function jsonToCsv(items) {
  const header = Object.keys(items[0]);

  const headerString = header.join(",");

  // handle null or undefined values here
  const replacer = (key, value) => value ?? "";

  const rowItems = items.map((row) =>
    header
      .map((fieldName) => JSON.stringify(row[fieldName], replacer))
      .join(",")
  );

  // join header and body, and break into separate lines
  const csv = [headerString, ...rowItems].join("\r\n");

  return csv;
}

function tableToCSV() {
  // Variable to store the final csv data
  var csv_data = [];

  // Get each row data
  var rows = document.getElementsByTagName("tr");
  for (var i = 0; i < rows.length; i++) {
    // Get each column data
    var cols = rows[i].querySelectorAll("td,th");

    // Stores each csv row data
    var csvrow = [];
    for (var j = 0; j < cols.length; j++) {
      // Get the text data of each cell of
      // a row and push it to csvrow
      csvrow.push(cols[j].innerHTML);
    }

    // Combine each column value with comma
    csv_data.push(csvrow.join(","));
  }
  // combine each row data with new line character
  csv_data = csv_data.join("\n");

  /* We will use this function later to download
    the data in a csv file downloadCSVFile(csv_data);
    */
}

// forked from https://www.geeksforgeeks.org/how-to-export-html-table-to-csv-using-javascript/
function downloadCSVFile(csv_data) {
  // Create CSV file object and feed
  // our csv_data into it
  CSVFile = new Blob([csv_data], {
    type: "text/csv",
  });

  // Create to temporary link to initiate
  // download process
  var temp_link = document.createElement("a");

  // Download csv file
  temp_link.download = "Workers.csv";
  var url = window.URL.createObjectURL(CSVFile);
  temp_link.href = url;

  // This link should not be displayed
  temp_link.style.display = "none";
  document.body.appendChild(temp_link);

  // Automatically click the link to
  // trigger download
  temp_link.click();
  document.body.removeChild(temp_link);
}
