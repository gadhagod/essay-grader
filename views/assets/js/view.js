const commentInpGroup = document.querySelector("#comment-inp-group");
const addCommentBtn = document.querySelector("#add-comment-btn");
const submitCommentBtn = document.querySelector("#submit-comment-btn");
const editCommentBtn = document.querySelector("#edit-comment-btn");
const commentInp = document.querySelector("#comment-inp");

let admin = (new URLSearchParams(window.location.search)).get("admin");

if (admin) {
    addCommentBtn.addEventListener("click", () => {
        addCommentBtn.style.display = "none";
        commentInpGroup.style.display = "";
        submitCommentBtn.style.display = "";
        editCommentBtn.style.display = "none";
        commentInp.removeAttribute("disabled");
    });
    
    if (commentInp.value) {
        addCommentBtn.style.display = "none";
        commentInpGroup.style.display = "";
        editCommentBtn.style.display = "";   
        submitCommentBtn.style.display = "none";
    }
    
    submitCommentBtn.addEventListener("click", () => {
        fetch("/api/comment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                _id: window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1 ),
                comment: commentInp.value
            })
        }).then(() => {
            location.reload();
        }).catch((err) => {
            console.log(err);
            alert("An error occurred");
        });
    });
    
    editCommentBtn.addEventListener("click", () => {
        addCommentBtn.click();
        commentInp.focus();
        commentInp.select();
    });
} else if (commentInp.value) {
    document.querySelector("#comment-buttons").style.display = "none";
    addCommentBtn.style.display = "none";
    commentInpGroup.style.display = "";
}