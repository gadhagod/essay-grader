const commentInpGroup = document.querySelector("#comment-inp-group");
const addCommentBtn = document.querySelector("#add-comment-btn");
const submitCommentBtn = document.querySelector("#submit-comment-btn");
const editCommentBtn = document.querySelector("#edit-comment-btn");
const deleteCommentBtn = document.querySelector("#delete-comment-btn")
const commentInp = document.querySelector("#comment-inp");
const essayId = window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1);

let admin = (new URLSearchParams(window.location.search)).get("admin");

if (admin) {
    let getComment = () => commentInp.value;

    addCommentBtn.addEventListener("click", () => {
        hideElem(addCommentBtn);
        showElem(commentInpGroup);
        showElem(submitCommentBtn);
        hideElem(editCommentBtn);
        commentInp.removeAttribute("disabled");
        if (getComment()) {
            showElem(deleteCommentBtn);
        } else {
            hideElem(deleteCommentBtn);
        }
    });
    
    if (getComment()) {
        hideElem(addCommentBtn);
        showElem(commentInpGroup);
        showElem(editCommentBtn);
        hideElem(submitCommentBtn);
        showElem(deleteCommentBtn);
    } else {
        hideElem(deleteCommentBtn);
    }
    
    submitCommentBtn.addEventListener("click", () => {
        fetch("/api/comment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                _id: essayId,
                comment: getComment()
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

    deleteCommentBtn.addEventListener("click", () => {
        fetch("/api/comment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                _id: essayId,
                comment: ""
            })
        }).then(() => {
            location.reload();
        }).catch((err) => {
            console.log(err);
            alert("An error occurred");
        });
    });
} else if (commentInp.value) {
    hideElem(document.querySelector("#comment-buttons"));
    hideElem(addCommentBtn);
    showElem(commentInpGroup);
}