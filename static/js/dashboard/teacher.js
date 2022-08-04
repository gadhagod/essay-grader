const xhr = new XMLHttpRequest();

function deleteEssay(essayId) {
    fetch(`/delete/${essayId}`, {
        method: "DELETE",
    }).then((res) => {
        document.querySelector(`#essay-row-${essayId}`).remove();
        if (document.querySelectorAll("tr").length === 1) {
            document.querySelector("table").remove();
            document.querySelector("#no-essays-submitted").style.display = "";
        }
    }).catch((err) => {
        console.log(err)
        alert("An error occurred")
    });
}