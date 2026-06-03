const API_URL = "http://localhost:5000";

const workersContainer = document.getElementById("workersContainer");

const params = new URLSearchParams(window.location.search);

const selectedCategory = params.get("category");

const selectedService = params.get("service");

// FETCH WORKERS

async function fetchWorkers() {

    try {

        const response = await fetch(

            `${API_URL}/api/workers/approved?category=${selectedCategory}`

        );

        const workers = await response.json();

        displayWorkers(workers);

    } catch (error) {

        console.log("Error fetching workers:", error);

    }

}

// DISPLAY WORKERS

function displayWorkers(workers) {

    workersContainer.innerHTML = "";

    if (workers.length === 0) {

        workersContainer.innerHTML = `

            <h3 class="text-center">

                No workers available

            </h3>

        `;

        return;

    }

    workers.forEach(worker => {

        workersContainer.innerHTML += `

        <div class="worker-list-item">

            <div class="worker-left">

                <h3>${worker.name}</h3>

                <p>

                    ${worker.category} • ${worker.experience}

                </p>

            </div>

            <div class="worker-center">

                <span class="worker-rating">

                    <i class="fa-solid fa-star"></i>

                    ${worker.rating}

                </span>

                <span class="worker-price">

                    ₹${worker.price}

                </span>

            </div>

            <div class="worker-right">

                <span class="worker-status ${worker.availability.toLowerCase().replace(" ", "-")}">

                    ${worker.availability}

                </span>

                <a href="booking.html?worker=${worker.id}&service=${selectedService}"

                    class="btn worker-btn">

                    Select

                </a>

            </div>

        </div>

        `;

    });

}

// START

fetchWorkers();