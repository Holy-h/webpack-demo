import axios from "axios";

const deleteCommentBtn = document.getElementsByClassName("jsDeleteComment");
const commentNumber = document.getElementById("jsCommentNumber");

// fake Number
const decreaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
};

// fake comment
const deleteComment = e => {
  const deleteTarget = e.parentElement;
  deleteTarget.remove();
};

const myFunction = async function handleDelete() {
  const videoId = window.location.href.split("/videos/")[1];
  const commentId = this.getAttribute("value");
  const response = await axios({
    url: `/api/${videoId}/deletecomment`,
    method: "POST",
    data: {
      commentId
    }
  }).catch(error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    console.log(error.config);
  });
  if (response.status === 200) {
    deleteComment(this);
    decreaseNumber();
  }
};

// 안된다.
// const myFunction = () => {
//     const value = this.getAttribute("value");
//     console.log(value);
//   };

if (deleteCommentBtn) {
  for (let i = 0; i < deleteCommentBtn.length; i += 1) {
    deleteCommentBtn[i].addEventListener("click", myFunction, false);
  }
}

/*
// 두 번째 방법 이건 pug와 js가 한 파일에 같이 있어야 가능할 듯

function deleteComment(commentId) {
  const videoId = window.location.href.split("/videos/")[1];
  console.log(`commentId is ${commentId}`);
  console.log(`videoId is ${videoId}`);
  // const response = await axios({
  //   url: `/api/${videoId}/deletecomment`,
  //   method: "POST",
  //   data: {
  //     commentId
  //   }
}
*/
