const API_URL = "https://onestop-7lsu.onrender.com";

// ==========================
// LOGIN CHECK
// ==========================

function isLoggedIn() {

    return localStorage.getItem("token");

}
function isWorkerLoggedIn() {

    return localStorage.getItem(
        "loggedInWorker"
    );

}

// ==========================
// SMART NAVIGATION
// ==========================

document.addEventListener("DOMContentLoaded", () => {

    const loginBtn =
        document.getElementById("loginBtn");

    const dashboardBtn =
        document.getElementById("dashboardBtn");

    const navbarBookBtn =
        document.getElementById("navbarBookBtn");

    const heroBookBtn =
        document.getElementById("heroBookBtn");

    const bookNowBtn =
        document.getElementById("bookNowBtn");

    // ==========================
    // PATH DETECTION
    // ==========================

    const isInsidePages =
        window.location.pathname.includes("/pages/");

    const basePath = isInsidePages
        ? ""
        : "pages/";

    // ==========================
    // LOGIN BUTTON
    // ==========================

    if (loginBtn) {

        if (isLoggedIn()) {

            loginBtn.textContent = "Logout";

            loginBtn.addEventListener("click", () => {

                localStorage.removeItem("token");

                localStorage.removeItem("loggedInUser");

                window.location.replace(
                    `${basePath}choose-role.html`
                );

            });

        } else {

            loginBtn.addEventListener("click", () => {

                window.location.replace(
                    `${basePath}choose-role.html`
                );

            });

        }

    }

    // ==========================
    // DASHBOARD BUTTON
    // ==========================

    if (dashboardBtn) {

        dashboardBtn.addEventListener("click", () => {

            if (isLoggedIn()) {

                window.location.href =
                    `${basePath}user-dashboard.html`;

            } else {

                window.location.replace(
                    `${basePath}choose-role.html`
                );

            }

        });

    }

    // ==========================
    // BOOKING FLOW
    // ==========================

    function handleBookingFlow() {

        if (isWorkerLoggedIn()) {

            alert("Workers cannot access booking services");

            window.location.replace(
                `${basePath}worker-dashboard.html`
            );

        } else if (isLoggedIn()) {

            window.location.replace(
                `${basePath}services.html`
            );

        } else {

            window.location.replace(
                `${basePath}choose-role.html`
            );

        }

    }

    if (navbarBookBtn) {

        navbarBookBtn.addEventListener(
            "click",
            handleBookingFlow
        );

    }

    if (heroBookBtn) {

        heroBookBtn.addEventListener(
            "click",
            handleBookingFlow
        );

    }

    if (bookNowBtn) {

        bookNowBtn.addEventListener(
            "click",
            handleBookingFlow
        );

    }

});

const reveals = document.querySelectorAll(".reveal");

function revealElements() {

    reveals.forEach((element) => {

        const windowHeight = window.innerHeight;

        const revealTop = element.getBoundingClientRect().top;

        const revealPoint = 120;

        if (revealTop < windowHeight - revealPoint) {

            element.classList.add("active");

        } else {

            element.classList.remove("active");

        }

    });

}

// RUN ON PAGE LOAD
revealElements();

// RUN ON SCROLL
window.addEventListener("scroll", () => {

    revealElements();

    // HERO IMAGE SHRINK EFFECT

    const heroImage = document.querySelector(".hero-image-wrapper");

    if (heroImage) {

        const scrollY = window.scrollY;

        let scaleValue = 1 - scrollY * 0.0002;

        if (scaleValue < 0.88) {

            scaleValue = 0.88;

        }

        heroImage.style.transform = `scale(${scaleValue})`;

    }

});

// ==========================
// LOAD SERVICES
// ==========================

const servicesContainer = document.getElementById("servicesContainer");

if (servicesContainer) {

    let allServices = [];
    let currentCategory = "All";

    function displayServices(services) {

        servicesContainer.innerHTML = "";

        services.forEach((service) => {

            servicesContainer.innerHTML += `

                <div class="col-lg-4 col-md-6">

                    <div class="service-card">

                        <img src="${service.image}" alt="${service.service_name}">

                        <div class="service-content">

                            <div class="service-top">

                                <span>${service.category}</span>

                                <h6>

                                    <i class="fa-solid fa-star"></i>

                                    ${service.rating}

                                </h6>

                            </div>

                            <h3>${service.service_name}</h3>

                            <p>${service.description}</p>

                            <div class="service-bottom">

                                <h4>$${service.price}</h4>

                                <a href="service-details.html?id=${service.id}"
                                    class="btn service-btn">

                                    Book Now

                                </a>

                            </div>

                        </div>

                    </div>

                </div>

            `;

        });

    }

    fetch(`${API_URL}/api/services`)

        .then((response) => response.json())

        .then((services) => {

            allServices = services;

            displayServices(allServices);

        })

        .catch((error) => {

            console.log("Error loading services:", error);

        });

    // ==========================
    // CATEGORY FILTER
    // ==========================

    const categoryButtons = document.querySelectorAll(".category-btn");

    const searchInput = document.getElementById("searchInput");

    categoryButtons.forEach((button) => {

        button.addEventListener("click", () => {

            categoryButtons.forEach((btn) => {

                btn.classList.remove("active-category");

            });

            button.classList.add("active-category");

            const category = button.dataset.category;

            currentCategory = category;

            filterServices();

        });

    });

    // ==========================
    // FILTER SERVICES
    // ==========================

    function filterServices() {

        const searchText = searchInput.value.toLowerCase();

        let filteredServices = allServices.filter((service) => {

            const matchesCategory = currentCategory === "All" ||
                service.category === currentCategory;

            const matchesSearch = service.service_name.toLowerCase().includes(searchText) ||
                service.description.toLowerCase().includes(searchText);

            return matchesCategory && matchesSearch;

        });

        if (filteredServices.length === 0) {

            servicesContainer.innerHTML = `

            <div class="col-12">

                <div class="text-center py-5">

                    <h3>No services found</h3>

                    <p>Try another search or category.</p>

                </div>

            </div>

        `;

            return;

        }

        displayServices(filteredServices);

    }

    // ==========================
    // SEARCH INPUT
    // ==========================

    searchInput.addEventListener("input", () => {

        filterServices();

    });

}

// ==========================
// PROTECTED BOOKING FLOW
// ==========================

function handleProtectedBooking(category, serviceId) {

    if (!isLoggedIn()) {

        alert(
            "Please login first"
        );

        window.location.replace(
            "choose-role.html"
        );

        return;

    }

    if (isWorkerLoggedIn()) {

        alert(
            "Workers cannot book services"
        );

        window.location.replace(
            "pages/worker-dashboard.html"
        );

        return;

    }

    window.location.href =
        `workers.html?category=${category}&service=${serviceId}`;

}

// ==========================
// SERVICE DETAILS
// ==========================

const serviceDetails = document.getElementById("serviceDetails");

if (serviceDetails) {

    const params = new URLSearchParams(window.location.search);

    const serviceId = params.get("id");

    fetch(`${API_URL}/api/services`)

        .then((response) => response.json())

        .then((services) => {

            const service = services.find((item) => {

                return item.id == serviceId;

            });

            if (!service) {

                serviceDetails.innerHTML = `

                    <h2>Service not found</h2>

                `;

                return;

            }

            serviceDetails.innerHTML = `

                <div class="row align-items-center g-5">

                    <div class="col-lg-6">

                        <img src="${service.image}"
                            class="details-image">

                    </div>

                    <div class="col-lg-6">

                        <div class="details-content">

                            <span class="details-category">

                                ${service.category}

                            </span>

                            <h1 class="details-title">

                                ${service.service_name}

                            </h1>

                            <p class="details-description">

                                ${service.description}

                            </p>

                            <h2 class="details-price">

                                $${service.price}

                            </h2>

                            <div class="details-rating">

                                <i class="fa-solid fa-star"></i>

                                ${service.rating} Rating

                            </div>

                            <button
    class="btn book-btn book-service-btn"
    onclick="handleProtectedBooking('${service.category}', '${service.id}')">

    Book This Service

</button>

                        </div>

                    </div>

                </div>

            `;

        });

}

// ==========================
// BOOKING PAGE
// ==========================

const bookingServiceInfo = document.getElementById("bookingServiceInfo");

if (bookingServiceInfo) {

    const params = new URLSearchParams(window.location.search);

    const serviceId = params.get("service");

    fetch(`${API_URL}/api/services`)

        .then((response) => response.json())

        .then((services) => {

            const service = services.find((item) => {

                return item.id == serviceId;

            });

            if (!service) {

                bookingServiceInfo.innerHTML = `

                    <h2>Service not found</h2>

                `;

                return;

            }

            bookingServiceInfo.innerHTML = `

                <img src="${service.image}">

                <h2>${service.service_name}</h2>

                <p>${service.description}</p>

                <div class="booking-price">

                    $${service.price}

                </div>

            `;

        });

}

// ==========================
// SUBMIT BOOKING
// ==========================

const bookingForm = document.getElementById("bookingForm");

const phoneInput = document.getElementById("customerPhone");

if (phoneInput) {

    phoneInput.addEventListener("input", () => {

        phoneInput.value = phoneInput.value.replace(/\D/g, "");

    });

}

if (bookingForm) {

    bookingForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const params = new URLSearchParams(window.location.search);

        const serviceId = params.get("service");

        const loggedInUser = JSON.parse(
            localStorage.getItem("loggedInUser")
        );

        const bookingData = {

            user_id: loggedInUser.id,

            worker_id: params.get("worker"),

            service_id: serviceId,

            booking_date:
                document.getElementById("bookingDate").value,

            time_slot: "10:00 AM",


            address:
                document.getElementById("bookingNotes").value

        };

        const customerPhone =
            document.getElementById("customerPhone").value;

        if (customerPhone.length !== 10) {

            alert("Phone number must be 10 digits");

            return;

        }

        fetch(`${API_URL}/api/users/book-service`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(bookingData)

        })

            .then((response) => response.json())

            .then((data) => {

                alert(data.message);

                bookingForm.reset();

            })

            .catch((error) => {

                console.log("Booking Error:", error);

            });

    });

}

const bookingDate = document.getElementById("bookingDate");

if (bookingDate) {

    const today = new Date().toISOString().split("T")[0];

    bookingDate.min = today;

}

// ==========================
// USER DASHBOARD BOOKINGS
// ==========================

const userBookingsContainer =
    document.getElementById("userBookingsContainer");

if (userBookingsContainer) {

    const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser")
    );
    if (!loggedInUser) {

        window.location.replace(
            "login.html"
        );

    }

    fetch(`${API_URL}/api/bookings`)

        .then((response) => response.json())

        .then((bookings) => {

            const userBookings = bookings.filter((booking) => {

                return booking.user_id == loggedInUser.id;

            });

            if (userBookings.length === 0) {

                userBookingsContainer.innerHTML = `

                    <div class="booking-item">

                        <div>

                            <h3>

                                No bookings found

                            </h3>

                            <p>

                                Book your first service

                            </p>

                        </div>

                    </div>

                `;

                return;

            }

            userBookingsContainer.innerHTML = "";

            userBookings.forEach((booking) => {

                userBookingsContainer.innerHTML += `

                    <div class="booking-item">

                        <div>

                            <h3>

    Service:
    ${booking.service_name || `Service #${booking.service_id}`}

</h3>

<p>

    Worker:
    ${booking.worker_name || `Worker #${booking.worker_id}`}

</p>

                            <p>

                                Date:
                                ${new Date(booking.booking_date).toLocaleDateString()}

                            </p>

                        </div>

                        <div class="booking-status-section">

                            <span class="booking-status pending-status">

                                ${booking.status}

                            </span>

                        </div>

                    </div>

                `;

            });

        })

        .catch((error) => {

            console.log("Dashboard Error:", error);

        });

}

// ==========================
// SELECTED WORKER INFO
// ==========================

const selectedWorkerInfo = document.getElementById("selectedWorkerInfo");

if (selectedWorkerInfo) {

    const params = new URLSearchParams(window.location.search);

    const workerId = params.get("worker");

    fetch(`${API_URL}/api/workers/approved`)

        .then((response) => response.json())

        .then((workers) => {

            const worker = workers.find(
                w => w.id == workerId
            );
            if (worker) {

                selectedWorkerInfo.innerHTML = `

    <div class="selected-worker-box">

        <h4>

            Selected Professional

        </h4>

        <p>

            <strong>${worker.name}</strong>

        </p>

        <p>

            ${worker.category}

        </p>

        <p>

            ⭐ ${worker.rating}

        </p>

        <span class="worker-status ${worker.availability.toLowerCase().replace(" ", "-")}">

            ${worker.availability}

        </span>

    </div>

    `;

            }

        });

}