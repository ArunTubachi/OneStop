const API_URL = "http://localhost:5000";

const adminData = JSON.parse(
    localStorage.getItem("loggedInUser")
);

if (!adminData || adminData.role !== "admin") {

    window.location.replace(
        "login.html"
    );

}

const pendingWorkersContainer =
    document.getElementById(
        "pendingWorkersContainer"
    );

const totalWorkers =
    document.getElementById(
        "totalWorkers"
    );

const pendingWorkers =
    document.getElementById(
        "pendingWorkers"
    );

const bookingsTableBody =
    document.getElementById(
        "bookingsTableBody"
    );

const adminLogoutBtn =
    document.getElementById(
        "adminLogoutBtn"
    );

// ==========================
// FETCH PENDING WORKERS
// ==========================

async function fetchPendingWorkers() {

    try {

        const response = await fetch(

            `${API_URL}/api/admin/pending-workers`

        );

        const workers =
            await response.json();

        displayPendingWorkers(workers);

        pendingWorkers.innerText =
            workers.length;

    } catch (error) {

        console.log(error);

    }

}

// ==========================
// DISPLAY PENDING WORKERS
// ==========================

function displayPendingWorkers(workers) {

    pendingWorkersContainer.innerHTML = "";

    if (workers.length === 0) {

        pendingWorkersContainer.innerHTML = `

            <div class="dashboard-card">

                <h4>
                    No pending worker requests
                </h4>

            </div>

        `;

        return;

    }

    totalWorkers.innerText =
        workers.length;

    workers.forEach(worker => {

        pendingWorkersContainer.innerHTML += `

        <div class="pending-worker-card">

            <h4>
                ${worker.name}
            </h4>

            <p>
                <strong>Email:</strong>
                ${worker.email}
            </p>

            <p>
                <strong>Phone:</strong>
                ${worker.phone}
            </p>

            <p>
                <strong>Category:</strong>
                ${worker.category}
            </p>

            <p>
                <strong>Experience:</strong>
                ${worker.experience}
            </p>

            <p>
                <strong>Address:</strong>
                ${worker.address}
            </p>

            <div class="pending-worker-actions">

                <button
                    class="btn btn-success"
                    onclick="approveWorker(${worker.id})">

                    Approve

                </button>

                <button
                    class="btn btn-danger"
                    onclick="rejectWorker(${worker.id})">

                    Reject

                </button>

            </div>

        </div>

        `;

    });

}

// ==========================
// APPROVE WORKER
// ==========================

async function approveWorker(id) {

    try {

        await fetch(

            `${API_URL}/api/admin/approve-worker/${id}`,

            {
                method: "PUT"
            }

        );

        fetchPendingWorkers();

    } catch (error) {

        console.log(error);

    }

}

// ==========================
// REJECT WORKER
// ==========================

async function rejectWorker(id) {

    try {

        await fetch(

            `${API_URL}/api/admin/reject-worker/${id}`,

            {
                method: "PUT"
            }

        );

        fetchPendingWorkers();

    } catch (error) {

        console.log(error);

    }

}

// ==========================
// DUMMY BOOKINGS TABLE
// ==========================

function loadDummyBookings() {

    const dummyBookings = [

        {
            id: 101,
            user: 5,
            worker: 2,
            service: 3,
            date: "2026-06-03",
            status: "Pending"
        },

        {
            id: 102,
            user: 8,
            worker: 4,
            service: 1,
            date: "2026-06-03",
            status: "Completed"
        },

        {
            id: 103,
            user: 3,
            worker: 7,
            service: 5,
            date: "2026-06-02",
            status: "Accepted"
        }

    ];

    dummyBookings.forEach(booking => {

        bookingsTableBody.innerHTML += `

            <tr>

                <td>${booking.id}</td>

                <td>${booking.user}</td>

                <td>${booking.worker}</td>

                <td>${booking.service}</td>

                <td>${booking.date}</td>

                <td>${booking.status}</td>

            </tr>

        `;

    });

}

// ==========================
// LOGOUT
// ==========================

adminLogoutBtn.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "loggedInUser"
        );

        window.location.replace(
            "login.html"
        );

    }
);

// ==========================
// START
// ==========================

fetchPendingWorkers();

loadDummyBookings();