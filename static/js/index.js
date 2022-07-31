  class Themes {
    #lightTheme;
    #toggleButton;

    constructor(startWithLightTheme) {
        this.#toggleButton = document.querySelector(".bi");
        this.#lightTheme = startWithLightTheme ?? !startWithLightTheme;
        if (this.#lightTheme) {
            this.#setToLight();
        } else {
            this.#setToDark();
        }
    }

    toggle() {
        if (this.#lightTheme) {
            this.#setToDark();
        } else {
            this.#setToLight();
        }
    }

    #setToLight() {
        this.#lightTheme = true;
        document.querySelector("#dark-light-link").href = "/static/css/light.css";
        document.body.removeAttribute("class");
        document.querySelector(".navbar").classList.add("bg-light");
        if (document.querySelector(".table-head")) {
            document.querySelector(".table-head").classList.remove("bg-secondary");
        }
        document.querySelectorAll(".form-control").forEach((elem) => {
            elem.classList.remove("bg-dark");
        });
        this.#toggleButton.classList.remove("bi-sun");
        this.#toggleButton.classList.add("bi-moon");
        localStorage.setItem("lightTheme", 1);
    }

    #setToDark() {
        this.#lightTheme = false;
        document.querySelector("#dark-light-link").href = "/static/css/dark.css";
        document.body.setAttribute("class", "bg-dark");
        document.querySelector(".navbar").classList.remove("bg-light");
        if (document.querySelector(".table-head")) {
            document.querySelector(".table-head").classList.add("bg-secondary");
        }
        document.querySelectorAll(".form-control").forEach((elem) => {
            elem.classList.add("bg-dark");
        });
        this.#toggleButton.classList.remove("bi-moon");
        this.#toggleButton.classList.add("bi-sun");
        localStorage.setItem("lightTheme", 0);
    }
}

var theme = new Themes(parseInt(localStorage.getItem("lightTheme")));

document.querySelector(".navbar-brand").addEventListener("click", () => {
    window.location.href= "/";
});

document.querySelector("#dark-mode-btn").addEventListener("click", () => {
    theme.toggle();
})