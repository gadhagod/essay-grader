const xhr = new XMLHttpRequest();
let beforeLogin = document.querySelector("#before-login");
let afterLogin = document.querySelector("#after-login");
let essayTable = document.querySelector("table");
let nameInput = document.querySelector("#name-input");
let enterBtn = document.querySelector("#name-submit");
let logoutBtn = document.querySelector("#logout-btn");
let uploadBtn = document.querySelector("#upload-btn")

function resetTable() {
    document.querySelectorAll("tr:not(:first-child)").forEach(elem => elem.remove());
}

function createTextTd(text) {
    let td = document.createElement("td");
    td.setAttribute("class", "text-center")
    let p = document.createElement("p");
    p.innerHTML = text;
    td.appendChild(p);
    return td;
}

let errorIndicator = new ErrorIndicator();

uploadBtn.onclick = () => { window.location.href = "/upload" };

enterBtn.onclick = (storedStudentName, ignoreNoName) => {
    errorIndicator.hide();
    let studentName = nameInput.value.trim() || storedStudentName;
    if (!studentName) {
        errorIndicator.setText("Please enter your name");
        errorIndicator.show();
        return;
    }
    fetch(`/api/essays?${new URLSearchParams({ studentName: studentName })}`, { method: "GET" }).then(async res => {
        let data = await res.json();
        hideElem(essayTable);
        resetTable();
        let essays = data.essays;
        if (!essays.length) {
            if (!ignoreNoName) {
                errorIndicator.setText(data.possibility ? `Did you mean "${data.possibility}"?` : "Student not found");
                errorIndicator.show();
            }
            localStorage.removeItem("studentName");
            showElem(beforeLogin);
            hideElem(afterLogin);
            return;
        };
        showElem(afterLogin);
        hideElem(beforeLogin)
        localStorage.setItem("studentName", studentName);
        document.getElementById("student-name-display").innerText = studentName;
        essays.forEach(essay => {
            essay.creationTime = new Date(essay.creationTime);
            let row = document.createElement("tr");
            row.appendChild(createTextTd(`${essay.creationTime.getMonth()}/${essay.creationTime.getDate()}/${essay.creationTime.getYear().toString().slice(-2)}`));
            row.appendChild(createTextTd(essay.creationTime.toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true })));
            row.appendChild(createTextTd(essay.grade.letterGrade));
            row.appendChild(createTextTd(
                (() => {
                    let a = document.createElement("a");
                    a.setAttribute("href", `/view/${essay._id}`)
                    let btn = document.createElement("button");
                    btn.classList.add("btn", "btn-primary", "text-center");
                    btn.innerText = "View"
                    a.appendChild(btn);
                    return a.outerHTML;
                })()
            ));
            essayTable.appendChild(row);
        });
        showElem(essayTable);
    }).catch((err) => {
        console.log(err);
        hideElem(essayTable);
        errorIndicator.setText("An error occurred");
        errorIndicator.show();
    });
};

logoutBtn.onclick = () => {
    localStorage.removeItem("studentName");
    hideElem(afterLogin);
    showElem(beforeLogin);
};

let studentName = localStorage.getItem("studentName");
if (studentName) {
    enterBtn.onclick(studentName, true);
} else {
    hideElem(afterLogin);
    showElem(beforeLogin);
}