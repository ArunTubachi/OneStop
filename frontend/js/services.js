
const servicesContainer = document.getElementById("servicesContainer");

// FETCH SERVICES FROM BACKEND

async function fetchServices() {

    try {

        const response = await fetch("http://localhost:5000/api/services");

        const services = await response.json();

        allServices = services;

        displayServices(services);

    } catch (error) {

        console.log("Error fetching services:", error);

    }

}

// DISPLAY SERVICES

function displayServices(services) {

    servicesContainer.innerHTML = "";

    services.forEach(service => {

        servicesContainer.innerHTML += `

        <div class="col-lg-4 col-md-6">

            <div class="service-card reveal">

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

                        <a href="service-details.html?id=${service.id}" class="btn service-btn">

                            View Details

                        </a>

                    </div>

                </div>

            </div>

        </div>

        `;

    });

}

// START

fetchServices();

console.log("Dynamic services loaded");

const filterButtons = document.querySelectorAll(".category-btn");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        const category = button.dataset.category;

        // ACTIVE BUTTON UI

        filterButtons.forEach(btn => {
            btn.classList.remove("active-filter");
        });

        button.classList.add("active-filter");

        // FILTER LOGIC

        if (category === "All") {

            displayServices(allServices);

        } else {

            const filteredServices = allServices.filter(service =>
                service.category === category
            );

            displayServices(filteredServices);

        }

    });

});