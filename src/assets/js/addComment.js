/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");

// fake Number
const increaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

// fake comment
const addComment = comment => {
  const li = document.createElement("li");
  li.className = "video__comment-item";
  const span = document.createElement("span");
  span.innerHTML = comment;
  const button = document.createElement("button");
  button.className = "video__comment-delete";
  const deleteIcon = document.createElement("i");
  deleteIcon.className = `material-icons`;
  deleteIcon.innerHTML = "close";
  button.appendChild(deleteIcon);
  li.appendChild(span);
  li.appendChild(button);
  commentList.prepend(li);
};

const sendComment = async comment => {
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: "POST",
    data: {
      comment
    }
  });
  if (response.status === 200) {
    addComment(comment);
    increaseNumber();
  }
};

const handleSubmit = event => {
  // Submit 시 새로고침 되지 않도록 막음
  event.preventDefault();
  const commentInput = addCommentForm.querySelector("input");
  const newComment = commentInput.value;
  sendComment(newComment);
  commentInput.value = "";
};

function init() {
  addCommentForm.addEventListener("submit", handleSubmit);
  // alert("find addCommentForm");
}

if (addCommentForm) {
  init();
}
