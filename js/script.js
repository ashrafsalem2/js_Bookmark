// url pattern
// const urlReg =
//   /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;

const urlReg =
  /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

// at least 3 char pattern
const nameReg = /^\w{3,}$/;

// elements
var siteName = document.getElementById("site_name");
var urlName = document.getElementById("site_url");
var subButton = document.querySelector(".btn_sub");
var errorMessage = document.querySelector("#error_message");
var nameError = document.getElementById("name_error");
var urlError = document.getElementById("url_error");
var closeBtn = document.querySelector(".fa-close");
var tbody = document.querySelector("#tbody");
var alertUrl = document.getElementById('alert_url');
var alertName = document.getElementById('alert_name');

// bookmark list
var bookmarks = [];

//  display all bookmarks if it avaliable
if (localStorage.getItem("bookmarks") != null) {
  displayBookMarks(JSON.parse(localStorage.getItem("bookmarks")));
  bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
}

// make enter act as adding new
document.addEventListener('keypress', function(e){
    if(e.key=== "Enter"){
        e.preventDefault();
        subButton.click();
    }
});
// adding submit action
subButton.addEventListener("click", function () {
  // if validation is pass
  if (validation(siteName, urlName)) {
    // add new book mark
    addBookmark();
    // display all bookmarks
    displayBookMarks(JSON.parse(localStorage.getItem("bookmarks")));
    //   clear fileds
    clearFileds(siteName, urlName);
    // remove valid from inputs
    siteName.classList.remove("is-valid");
    urlName.classList.remove("is-valid");
  }
});

/**
 * adding new bookmark
 */
function addBookmark() {
  var bookmark = {
    name: siteName.value,
    url: urlName.value,
  };

  // adding bookmark to bookmarklists
  bookmarks.push(bookmark);
  console.log(bookmarks);
  // adding bookmarks list to localStorage
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}
/**
 * clear fileds after adding
 */
function clearFileds(siteName, urlName) {
  siteName.value = "";
  urlName.value = "";
}
/**
 * display all bookmarks
 */
function displayBookMarks(markList) {
  console.log(markList);
  var cartona = "";
  for (var i = 0; i < markList.length; i++) {
    cartona += `
             <tr>
                <td>${i}</td>
                <td>${markList[i].name}</td>
                <td><button class="btn_edit px-3 py-2 border-0 rounded-1" onclick="goToSite('${markList[i].url}')">
                    <i class="fa-solid fa-eye pe-2"></i>
                    Visit
                </button></td>
                <td><button class="btn_delete px-3 py-2 border-0 rounded-1" onclick="deleteUrl(${bookmarks.indexOf( markList[i])})">
                    <i class="fa-solid fa-trash-can"></i>
                    Delete
                </button></td>
            </tr>
        `;
  }
  tbody.innerHTML = cartona;
}
/**
 * validate all inputs before adding
 * @param {site name} siteName
 * @param {url name} urlName
 * @returns
 */
function validation(siteName, urlName) {
  var valid = true;
  // check if all inputs are empty
  if (siteName.value === "" && urlName.value === "") {
    errorMessage.classList.replace("d-none", "d-fixed");
    nameError.classList.replace("d-none", "d-block");
    urlError.classList.replace("d-none", "d-block");
    valid = false;
  }

  // if name is not correct or empty, display name error message
  if (siteName.classList.contains("is-invalid") || siteName.value === "") {
    errorMessage.classList.replace("d-none", "d-fixed");
    nameError.classList.replace("d-none", "d-block");
    urlError.classList.replace("d-block", "d-none");
    valid = false;
  }

  // if url is not correct or empty, display url error message
  if (urlName.classList.contains("is-invalid") || urlName.value === "") {
    errorMessage.classList.replace("d-none", "d-fixed");
    urlError.classList.replace("d-none", "d-block");
    nameError.classList.replace("d-block", "d-none");
    valid = false;
  }

  //   if both invalid
  if (
    siteName.classList.contains("is-invalid") &&
    urlName.classList.contains("is-invalid")
  ) {
    errorMessage.classList.replace("d-none", "d-fixed");
    nameError.classList.replace("d-none", "d-block");
    urlError.classList.replace("d-none", "d-block");
    valid = false;
  }

  return valid;
}

/**
 * close the error message
 */
function closeErrorMessage() {
  errorMessage.classList.replace("d-fixed", "d-none");
}
/**
 * adding closeErrorMessage function to close button
 */
closeBtn.addEventListener("click", closeErrorMessage);

/**
 * closing error message if press outside error message div
 */
document.addEventListener("click", function (e) {
  if (e.target.id === "error_message") {
    closeErrorMessage();
  }
});

/**
 * validated name input
 */
siteName.addEventListener("input", function () {
  validateInput(siteName, nameReg, alertName);
});

/**
 * validate url input
 */
urlName.addEventListener("input", function () {
  validateInput(urlName, urlReg, alertUrl);
});

/**
 * vlaidate input
 */
function validateInput(input, reg, alert) {
  // if name is not correct, adding is-invalid class to input
  if (!reg.test(input.value)) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    // change background color
    input.classList.add("form_control_danger");
    input.classList.remove("form_control_success");
    // appear the alert dialog
    alert.classList.replace('d-none', 'd-block');
  } else {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    // change background color
    input.classList.replace("form_control_danger", "form_control_success");
     // appear the alert dialog
     alert.classList.replace( 'd-block', 'd-none');
  }
}

/**
 * delete url
 */
function deleteUrl(index) {
  // delete from bookmarks
  bookmarks.splice(index, 1);
  // set the edited list to localstorage
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  // display all bookmarks
  displayBookMarks(JSON.parse(localStorage.getItem("bookmarks")));
}
/**
 * visit url
 */
function goToSite(url) {
  console.log("https://" + url);
  // window.location.href = 'https://' +url;
  window.open("https://" + url);
}
