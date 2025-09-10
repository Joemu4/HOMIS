let reservations = JSON.parse(localStorage.getItem("reservations")) || [];
let totalRooms = 50;

// LOGIN SYSTEM
function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if (user === "hoteladmin" && pass === "12345") {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("appScreen").style.display = "block";
    updateDashboard();
  } else {
    alert("❌ Invalid credentials (hint: hoteladmin / 12345)");
  }
}

function logout() {
  document.getElementById("loginScreen").style.display = "block";
  document.getElementById("appScreen").style.display = "none";
}

// ADD BOOKING
function addBooking() {
  const name = document.getElementById("guestName").value;
  const guests = document.getElementById("guests").value;
  const roomType = document.getElementById("roomType").value;
  const checkIn = document.getElementById("checkIn").value;
  const checkOut = document.getElementById("checkOut").value;

  if (!name || !guests || !checkIn || !checkOut) {
    alert("⚠️ Fill all fields");
    return;
  }

  const id = "B" + (reservations.length + 1);
  const booking = { id, name, guests, roomType, checkIn, checkOut };
  reservations.push(booking);
  localStorage.setItem("reservations", JSON.stringify(reservations));
  renderReservations();
  updateDashboard();
}

// RENDER RESERVATIONS
function renderReservations() {
  const tbody = document.querySelector("#reservationsTable tbody");
  tbody.innerHTML = "";
  reservations.forEach((r, i) => {
    const row = `<tr>
      <td>${r.id}</td>
      <td>${r.name}</td>
      <td>${r.roomType}</td>
      <td>${r.guests}</td>
      <td>${r.checkIn}</td>
      <td>${r.checkOut}</td>
      <td><button onclick="deleteBooking(${i})">Delete</button></td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

// DELETE BOOKING
function deleteBooking(index) {
  reservations.splice(index, 1);
  localStorage.setItem("reservations", JSON.stringify(reservations));
  renderReservations();
  updateDashboard();
}

// DASHBOARD STATS
function updateDashboard() {
  document.getElementById("totalBookings").innerText = reservations.length;
  const totalGuests = reservations.reduce((sum, r) => sum + parseInt(r.guests), 0);
  document.getElementById("totalGuests").innerText = totalGuests;
  document.getElementById("availableRooms").innerText = totalRooms - reservations.length;
}

// REPORTS
function generateReport() {
  const reportArea = document.getElementById("reportArea");
  let html = "<h3>📊 Reservations Report</h3><table><tr><th>ID</th><th>Guest</th><th>Room</th><th>Guests</th><th>Check-In</th><th>Check-Out</th></tr>";
  reservations.forEach(r => {
    html += `<tr><td>${r.id}</td><td>${r.name}</td><td>${r.roomType}</td><td>${r.guests}</td><td>${r.checkIn}</td><td>${r.checkOut}</td></tr>`;
  });
  html += "</table>";
  reportArea.innerHTML = html;
}

function downloadCSV() {
  let csv = "ID,Guest,Room,Guests,Check-In,Check-Out\n";
  reservations.forEach(r => {
    csv += `${r.id},${r.name},${r.roomType},${r.guests},${r.checkIn},${r.checkOut}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "reservations_report.csv";
  a.click();
}

function printReport() {
  const report = document.getElementById("reportArea").innerHTML;
  const win = window.open("", "", "width=800,height=600");
  win.document.write("<html><head><title>Print Report</title></head><body>");
  win.document.write(report);
  win.document.write("</body></html>");
  win.print();
  win.close();
}

// INITIAL RENDER
renderReservations();
updateDashboard();
