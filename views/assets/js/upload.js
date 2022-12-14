let errorIndicator = new ErrorIndicator();
let essayBodyFile = document.querySelector("#essay-body-file");

essayBodyFile.addEventListener("change", () => { 
    var fr = new FileReader();
    fr.onload = () => {
        document.querySelector("#essay-body-input").value = fr.result
    }
    fr.readAsText(essayBodyFile.files[0]);
});

document.querySelector("#submit-btn").addEventListener("click", () => {
    localStorage.setItem("studentName", document.querySelector("#name-input").value);
    if (!document.querySelector("input").value.trim()) {
        errorIndicator.setText("Please enter your name");
        return errorIndicator.show();
    }
    if (!document.querySelector("textarea").value.trim()) {
        errorIndicator.setText("Please enter your essay");
        return errorIndicator.show();
    }
    document.querySelector("form").submit();
});

document.querySelector("#name-input").value = localStorage.getItem("studentName") ?? "";