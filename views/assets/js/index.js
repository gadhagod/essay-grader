class ErrorIndicator {
    errCard;
    constructor(indicatorCard) {
        this.errCard = indicatorCard || document.querySelector(".err-card");
    }
    setText(errorMsg) {
        this.errCard.querySelector("strong").innerText = errorMsg;
    }
    show() {
        this.errCard.style.display = "";
    }
    hide() {
        this.errCard.style.display = "none";
    }
}

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
        document.querySelector("#dark-light-link").href = "/assets/css/light.css";
        document.body.removeAttribute("class");
        document.querySelector(".navbar").classList.add("bg-light");
        if (document.querySelector(".table-head")) {
            document.querySelector(".table-head").classList.remove("bg-secondary");
        }
        document.querySelectorAll(".form-control").forEach((elem) => {
            if (elem.disabled) {
                elem.style.background = "";
            } else {
                elem.classList.remove("bg-dark");
            }
        });
        this.#toggleButton.classList.remove("bi-sun");
        this.#toggleButton.classList.add("bi-moon");
        if (document.querySelector("#name-input-card")) {
            document.querySelector("#name-input-card").classList.remove("bg-secondary");
        }
        if (document.querySelector(".err-card")) {
            document.querySelector(".err-card").classList.add("bg-light");
        }
        document.querySelector(".dropdown-menu").classList.remove("bg-secondary");
        localStorage.setItem("lightTheme", 1);
    }

    #setToDark() {
        this.#lightTheme = false;
        document.querySelector("#dark-light-link").href = "/assets/css/dark.css";
        document.body.setAttribute("class", "bg-dark");
        document.querySelector(".navbar").classList.remove("bg-light");
        if (document.querySelector(".table-head")) {
            document.querySelector(".table-head").classList.add("bg-secondary");
        }
        document.querySelectorAll(".form-control").forEach((elem) => {
            if (elem.disabled) {
                elem.style.background = "#3b3b3b";
            } else {
                elem.classList.add("bg-dark");
            }
        });
        this.#toggleButton.classList.remove("bi-moon");
        this.#toggleButton.classList.add("bi-sun");
        if (document.querySelector("#name-input-card")) {
            document.querySelector("#name-input-card").classList.add("bg-secondary");
        }
        if (document.querySelector(".err-card")) {
            document.querySelector(".err-card").classList.remove("bg-light");
        }
        document.querySelector(".dropdown-menu").classList.add("bg-secondary");
        localStorage.setItem("lightTheme", 0);
    }
}

var theme = new Themes(parseInt(localStorage.getItem("lightTheme") ?? 1));
document.querySelector("#dark-mode-btn").addEventListener("click", () => { theme.toggle() })

document.querySelector(".navbar-brand").addEventListener("click", () => { window.location.href = "/" });