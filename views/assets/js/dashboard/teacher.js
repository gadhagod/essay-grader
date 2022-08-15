let errorIndicator = new ErrorIndicator();

function deleteEssay(essayId) {
    fetch(`/delete/${essayId}`, {
        method: "DELETE",
    }).then(() => {
        document.querySelector(`#essay-row-${essayId}`).remove();
        if (document.querySelectorAll("tr").length === 1) {
            document.querySelector("table").remove();
            errorIndicator.show();
        }
    }).catch((err) => {
        console.log(err);
        alert("An error occurred");
    });
}