const API_URL = "https://onestop-7lsu.onrender.com";

const worker = JSON.parse(
    localStorage.getItem("loggedInWorker")
);

const workerBookingsContainer =
    document.getElementById(
        "workerBookingsContainer"
    );

const workerWelcome =
    document.getElementById(
        "workerWelcome"
    );

const workerName =
    document.getElementById(
        "workerName"
    );

const workerEmail =
    document.getElementById(
        "workerEmail"
    );

const workerCategory =
    document.getElementById(
        "workerCategory"
    );

const workerAvailability =
    document.getElementById(
        "workerAvailability"
    );

const totalJobs =
    document.getElementById(
        "totalJobs"
    );

const acceptedJobs =
    document.getElementById(
        "acceptedJobs"
    );

const completedJobs =
    document.getElementById(
        "completedJobs"
    );

const logoutBtn =
    document.getElementById(
        "workerLogoutBtn"
    );

// ==========================
// CHECK LOGIN
// ==========================

if (!worker) {

    window.location.replace(
        "worker-login.html"
    );

}

// ==========================
// LOAD WORKER INFO
// ==========================

workerWelcome.innerText =
    `Welcome Back, ${worker.name}`;

workerName.innerText =
    worker.name;

workerEmail.innerText =
    worker.email;

workerCategory.innerText =
    worker.category;

workerAvailability.innerText =
    worker.availability;

// ==========================
// FETCH BOOKINGS
// ==========================

async function fetchWorkerBookings() {

    try {

        const response = await fetch(

            `${API_URL}/api/workers/bookings/${worker.id}`

        );

        const bookings =
            await response.json();

        displayBookings(bookings);

        updateStats(bookings);

    } catch (error) {

        console.log(error);

    }

}

// ==========================
// UPDATE STATS
// ==========================

function updateStats(bookings) {

    totalJobs.innerText =
        bookings.length;

    acceptedJobs.innerText =
        bookings.filter(
            booking =>
                booking.status === "Accepted"
        ).length;

    completedJobs.innerText =
        bookings.filter(
            booking =>
                booking.status === "Completed"
        ).length;

}

// ==========================
// DISPLAY BOOKINGS
// ==========================

function displayBookings(bookings) {

    workerBookingsContainer.innerHTML = "";

    if (bookings.length === 0) {

        workerBookingsContainer.innerHTML = `

            <div class="dashboard-card">

                <h4>
                    No bookings available
                </h4>

            </div>

        `;

        return;

    }

    bookings.forEach(booking => {

        workerBookingsContainer.innerHTML += `

        <div class="dashboard-card booking-card">

            <h4>
                Booking #${booking.id}
            </h4>

            <p>
                <strong>Service ID:</strong>
                ${booking.service_id}
            </p>

            <p>
                <strong>Date:</strong>
                ${booking.booking_date}
            </p>

            <p>
                <strong>Address:</strong>
                ${booking.address}
            </p>

            <p>
                <strong>Status:</strong>
                ${booking.status}
            </p>

            <div class="booking-actions">

                ${generateButtons(booking)}

            </div>

        </div>

        `;

    });

}

// ==========================
// GENERATE BUTTONS
// ==========================

function generateButtons(booking) {

    if (booking.status === "Pending") {

        return `

            <button
                class="btn btn-success"
                onclick="acceptBooking(${booking.id})">

                Accept

            </button>

            <button
                class="btn btn-danger"
                onclick="rejectBooking(${booking.id})">

                Reject

            </button>

        `;

    }

    if (booking.status === "Accepted") {

        return `

            <button
                class="btn btn-primary"
                onclick="completeBooking(${booking.id})">

                Complete

            </button>

        `;

    }

    return "";

}

// ==========================
// ACCEPT BOOKING
// ==========================

async function acceptBooking(id) {

    await fetch(

        `${API_URL}/api/workers/accept-booking/${id}`,

        {
            method: "PUT"
        }

    );

    fetchWorkerBookings();

}

// ==========================
// REJECT BOOKING
// ==========================

async function rejectBooking(id) {

    await fetch(

        `${API_URL}/api/workers/reject-booking/${id}`,

        {
            method: "PUT"
        }

    );

    fetchWorkerBookings();

}

// ==========================
// COMPLETE BOOKING
// ==========================

async function completeBooking(id) {

    await fetch(

        `${API_URL}/api/workers/complete-booking/${id}`,

        {
            method: "PUT"
        }

    );

    fetchWorkerBookings();

}

// ==========================
// LOGOUT
// ==========================

logoutBtn.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "loggedInWorker"
        );

        window.location.replace(
            "choose-role.html"
        );

    }
);

// ==========================
// START
// ==========================

fetchWorkerBookings();