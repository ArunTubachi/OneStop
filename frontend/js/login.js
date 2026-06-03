const API_URL = "http://localhost:5000";

const loginTab = document.getElementById("loginTab");

const registerTab = document.getElementById("registerTab");

const loginForm = document.getElementById("loginForm");

const registerForm = document.getElementById("registerForm");

// TOGGLE FORMS

loginTab.addEventListener("click", () => {

    loginForm.style.display = "block";

    registerForm.style.display = "none";

    loginTab.classList.add("active-auth");

    registerTab.classList.remove("active-auth");

});

registerTab.addEventListener("click", () => {

    loginForm.style.display = "none";

    registerForm.style.display = "block";

    registerTab.classList.add("active-auth");

    loginTab.classList.remove("active-auth");

});

// USER LOGIN

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("loginEmail").value;

    const password = document.getElementById("loginPassword").value;

    try {

        // ==========================
        // TRY ADMIN LOGIN FIRST
        // ==========================

        let response = await fetch(

            `${API_URL}/api/admin/login`,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    email,
                    password

                })

            }

        );

        // ==========================
        // IF ADMIN LOGIN FAILS
        // TRY USER LOGIN
        // ==========================

        if (!response.ok) {

            response = await fetch(

                `${API_URL}/api/users/login`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({

                        email,
                        password

                    })

                }

            );

        }

        const data = await response.json();

        if (!response.ok) {

            return alert(data.message);

        }

        alert(data.message);

        // SAVE TOKEN
        localStorage.setItem("token", data.token);

        // SAVE USER
        localStorage.setItem(

            "loggedInUser",

            JSON.stringify(
                data.user || data.admin
            )

        );

        // ADMIN LOGIN DETECTION
        if (data.admin) {

            window.location.href = "admin-dashboard.html";

        } else {

            window.location.href = "../index.html";

        }

    } catch (error) {

        console.log(error);

    }

});

// USER REGISTER

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("registerName").value;

    const email = document.getElementById("registerEmail").value;

    const phone = document.getElementById("registerPhone").value;

    const password = document.getElementById("registerPassword").value;

    try {

        const response = await fetch(

            `${API_URL}/api/users/register`,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    name,
                    email,
                    phone,
                    password

                })

            }

        );

        const data = await response.json();

        alert(data.message);

        // AUTO LOGIN AFTER REGISTER

        localStorage.setItem(
            "token",
            data.token
        );

        localStorage.setItem(

            "loggedInUser",

            JSON.stringify(data.user)

        );

        // REDIRECT TO HOMEPAGE

        window.location.href = "../index.html";

    } catch (error) {

        console.log(error);

    }

});