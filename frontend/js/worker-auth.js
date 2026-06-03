const API_URL = "https://onestop-7lsu.onrender.com";

const workerLoginTab = document.getElementById("workerLoginTab");

const workerRegisterTab = document.getElementById("workerRegisterTab");

const workerLoginForm = document.getElementById("workerLoginForm");

const workerRegisterForm = document.getElementById("workerRegisterForm");

// TOGGLE

workerLoginTab.addEventListener("click", () => {

    workerLoginForm.style.display = "block";

    workerRegisterForm.style.display = "none";

    workerLoginTab.classList.add("active-auth");

    workerRegisterTab.classList.remove("active-auth");

});

workerRegisterTab.addEventListener("click", () => {

    workerLoginForm.style.display = "none";

    workerRegisterForm.style.display = "block";

    workerRegisterTab.classList.add("active-auth");

    workerLoginTab.classList.remove("active-auth");

});

// LOGIN

workerLoginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("workerLoginEmail").value;

    const password = document.getElementById("workerLoginPassword").value;

    try {

        const response = await fetch(`${API_URL}/api/workers/login`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                email,
                password

            })

        });

        const data = await response.json();

        alert(data.message);

        if (response.ok) {

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "loggedInWorker",
                JSON.stringify(data.worker)
            );

            window.location.href = "pages/worker-dashboard.html";

        }
    } catch (error) {

        console.log(error);

    }

});

// REGISTER

workerRegisterForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const workerData = {

        name: document.getElementById("workerName").value,

        email: document.getElementById("workerEmail").value,

        phone: document.getElementById("workerPhone").value,

        password: document.getElementById("workerPassword").value,

        category: document.getElementById("workerCategory").value,

        experience: document.getElementById("workerExperience").value,

        address: document.getElementById("workerAddress").value

    };

    try {

        const response = await fetch(`${API_URL}/api/workers/register`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(workerData)

        });

        const data = await response.json();

        alert(data.message);

        workerLoginTab.click();

    } catch (error) {

        console.log(error);

    }

});