const contactForm = () => {
  // Get the form.
  var contactForm2 = $("#contact-form");

  // Set up an event listener for the contact form.
  $(contactForm2).submit(function (e) {
    processContact(e)
  });
}

const processContact = (e, formMessages) => {
  // Stop the browser from submitting the form.
  e.preventDefault();
  var formMessages = $(".form-messege");

  $(".error").hide();
  var hasError = false;
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

  var emailaddressVal = $("#email").val();
  if (emailaddressVal == "") {
    $("#email").after(
      '<span class="error">Please enter your email address.</span>'
    );
    hasError = true;
  } else if (!emailReg.test(emailaddressVal)) {
    $("#email").after(
      '<span class="error">Enter a valid email address.</span>'
    );
    hasError = true;
  }

  if (hasError == true) {
    return false;
  }

  onContactFormSubmit(e, formMessages, "contact-form", "enquiry-type")
}

const onContactFormSubmit = (e, formMessages, formId, enquiryTypeId) => {
  const form = $(e.target);
  const json = convertFormToJSON(form);
  json.enquiryDate = formatDateToYYYYMMDD(new Date())
  var json1 = JSON.stringify(json);

  // Submit the form using AJAX.
  $.ajax({
    contentType: "application/json",
    dataType: "json",
    // headers: {"Accepts": "text/plain; charset=utf-8"},
    type: "POST",
    url: $(form).attr("action"),
    data: json1,
  })
    .done(function (response) {
      // Make sure that the formMessages div has the 'success' class.
      $(formMessages).removeClass("error");
      $(formMessages).addClass("success");
      alert("Enquiry successfully added");
      // Set the message text.
      $(formMessages).text("Enquiry successfully added");

      // Clear the form.
      document.getElementById(formId).reset();
      // $("#contact-form input,#contact-form textarea").val("");

      // uncheck checkboxes
      const checkboxContainer = document.getElementById(enquiryTypeId);
      const checkboxes = checkboxContainer.querySelectorAll('input[type="checkbox"]:checked');

      Array.from(checkboxes).forEach((checkbox) => {
        document.getElementById(checkbox.id).checked = false;
      });
    })
    .fail(function (data) {
      // Make sure that the formMessages div has the 'error' class.
      $(formMessages).removeClass("success");
      $(formMessages).addClass("error");

      // Set the message text.
      if (data.responseText !== "") {
        $(formMessages).text(data.responseText);
      } else {
        $(formMessages).text(
          "Oops! An error occured and your message could not be sent."
        );
      }
    });
}

const convertFormToJSON = (form) => {
  const array = $(form).serializeArray(); // Encodes the set of form elements as an array of names and values.
  const json = {};
  $.each(array, function () {
    json[this.name] = this.value || "";
  });
  return json;
}

const formatDateToYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const getEnquiryType = (json, enquiryTypeId) => {
  json.companyEnquiryEnquiryTypes = []
  const checkboxContainer = document.getElementById(enquiryTypeId);
  const checkboxes = checkboxContainer.querySelectorAll('input[type="checkbox"]:checked');

  // Extract the values of selected checkboxes
  const selectedValues = Array.from(checkboxes).map(checkbox => {
    return checkbox.id.split(enquiryTypeId)[1]
  });

  if (selectedValues.length <= 0) {
    return
  }

  const enquiryTypes = JSON.parse(localStorage.getItem('enquiry-type'))
  enquiryTypes.forEach((enquiryType) => {
    if (selectedValues.includes(enquiryType.id)) {
      json.companyEnquiryEnquiryTypes.push(enquiryType)
    }
  });
}

// Email validation function
const validateEmail = (email) => {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Display the error message
const displayErrorMessage = (message) => {
  $("#courseCatalogue-email").addClass("is-invalid");
  $("#errorContainer").text(message);
  $("#errorContainer").show();
}

const catologForm = () => {
  var catologForm = $("#catalog-form");

  $(catologForm).submit(function (e) {
    // Stop the browser from submitting the form.
    e.preventDefault();
    $("#errorContainer").text("");
    $("#errorContainer").show();

    let email = document.getElementById("courseCatalogue-email").value
    if (!validateEmail(email)) {
      displayErrorMessage("Please enter a valid email address.")
      return
    }

    let emailDomain = email.split("@")[1].split(".")[0].toLowerCase();
    if (genericEmails.includes(emailDomain)) {
      displayErrorMessage("Please enter a valid organization email.")
      return
    }

    downloadCourseCatalogue(e)
  })
}

const requestQuotationForm = () => {
  // Get the form.
  var requestQuotationForm = document.getElementById("request-quotation");

  // Set up an event listener for the contact form.
  $(requestQuotationForm).submit(function (e) {
    processQuotationForm(e)
  });
}

const processQuotationForm = (e, formMessage) => {
  // Stop the browser from submitting the form.
  e.preventDefault();
  var formMessage = $(".rq-form-message");

  $(".rq-error").hide();
  var hasError = false;
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

  var emailaddressVal = $("#rq-email").val();
  if (emailaddressVal == "") {
    $("#rq-email").after(
      '<span class="rq-error error">Please enter your email address.</span>'
    );
    hasError = true;
  } else if (!emailReg.test(emailaddressVal)) {
    $("#rq-email").after(
      '<span class="rq-error error">Enter a valid email address.</span>'
    );
    hasError = true;
  }

  if (hasError == true) {
    return false;
  }

  onRequestQuotationFormSubmit(e, formMessage, "request-quotation")
}

const onRequestQuotationFormSubmit = (e, formMessage, formId) => {
  const form = document.getElementById(formId);

  const json = {
    technologies: [...new Set(getCheckboxValues("technologies"))],
    talentType: getCheckboxValues("talentType"),
    noOfTalents: form.elements["noOfTalents"].value,
    email: form.elements["email"].value,
  };

  // if (json.technologies.length <= 0) {
  //   $(formMessage).removeClass("success");
  //   $(formMessage).addClass("error");
  //   $(formMessage).text("At least one technology must be specified");
  //   return
  // }

  // if (json.talentType.length <= 0) {
  //   $(formMessage).removeClass("success");
  //   $(formMessage).addClass("error");
  //   $(formMessage).text("At least one talent type must be specified");
  //   return
  // }

  // if (json.noOfTalents.length <= 0) {
  //   $(formMessage).removeClass("success");
  //   $(formMessage).addClass("error");
  //   $(formMessage).text("Number of talents must be specified");
  //   return
  // }

  var json1 = JSON.stringify(json);

  $.ajax({
    contentType: "application/json",
    dataType: "json",
    // headers: {"Accepts": "text/plain; charset=utf-8"},
    type: "POST",
    url: $(form).attr("action"),
    data: json1,
  })
    .done(function (response) {
      // Make sure that the formMessages div has the 'success' class.
      $(formMessage).removeClass("error");
      $(formMessage).addClass("success");
      alert("Request for quotation successfully raised");
      // Set the message text.
      $(formMessage).text("Request for quotation successfully raised");

      // Clear the form.
      document.getElementById(formId).reset();
      // $("#contact-form input,#contact-form textarea").val("");

      resetCheckbox("technologies")
      resetCheckbox("talentType")

    })
    .fail(function (data) {
      // Make sure that the formMessages div has the 'error' class.
      $(formMessage).removeClass("success");
      $(formMessage).addClass("error");

      // Set the message text.
      if (data.responseText !== "") {
        $(formMessage).text(data.responseText);
      } else {
        $(formMessage).text(
          "Oops! An error occured and your message could not be sent."
        );
      }
    });
}

const resetCheckbox = (checkboxId) => {
  // uncheck checkboxes
  const checkboxContainer = document.getElementsByName(checkboxId);
  const checkboxes = checkboxContainer.querySelectorAll('input[type="checkbox"]:checked');

  Array.from(checkboxes).forEach((checkbox) => {
    document.getElementById(checkbox.id).checked = false;
  });
}

const getCheckboxValues = (checkboxName) => {
  var checkboxes = document.getElementsByName(checkboxName);
  var values = [];

  checkboxes.forEach(function (checkbox) {
    if (checkbox.checked) {
      values.push(checkbox.value);
    }
  });

  return values;
}

const downloadCourseCatalogue = (e) => {

  // var xhr = new XMLHttpRequest();
  // // Set the request method to POST.
  // xhr.open(
  //   "POST",
  //   "https://tsm.swabhavtechlabs.com/api/v1/tsam/tenant/7ca2664b-f379-43db-bdf9-7fdd40707219/resource-download/send-mail"
  // );

  // // Set the request headers.
  // xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

  var data = JSON.stringify({
    dateTime: formatDateToYYYYMMDD(new Date()),
    email: document.getElementById("courseCatalogue-email").value,
    resource: "course-catalogue",
  });

  // console.log(data);

  // // Send the request.
  // xhr.send(data);
  const url = "https://tsm.swabhavtechlabs.com/api/v1/tsam/tenant/7ca2664b-f379-43db-bdf9-7fdd40707219/resource-download/send-mail"
  // const url = "http://localhost:8080/api/v1/tsam/tenant/7ca2664b-f379-43db-bdf9-7fdd40707219/resource-download/send-mail"

  fetch(url, {
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: data,
    method: "POST"
  })
    .then((response) => response.json()).
    then((response) => {
      console.info("email sent successfully");
      // The email was sent successfully.
      var modal = document.getElementById("courseCatalogModal");
      modal.style.display = "none";
      // Set the form message
      const formMessage = $(".form-message");
      $(formMessage).removeClass("error");
      $(formMessage).addClass("success");
      alert("The catalog is sent to the given email.")

      // Clear the form.
      document.getElementById("catalog-form").reset();

      return true;
    }).catch((err) => {
      console.error(err);
    })

  // Check the response status code.
  // if (xhr.status >= 200 && xhr.status < 300) {
  //   console.log("email sent successfully");
  //   // The email was sent successfully.
  //   var modal = document.getElementById("courseCatalogModal");
  //   modal.style.display = "none";
  //   return true;
  // }
  // // The email was not sent successfully.
  // console.log("error occured in sending mail");
  // return false;
}

const openCourseCatalogueModal = () => {
  var modal = document.getElementById("courseCatalogModal");
  var btn = document.getElementById("courseCatalogBtn");
  var closeSpan = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal 
  btn.onclick = function () {
    var inputBox = document.getElementById('courseCatalogue-email');
    inputBox.value = '';
    modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  closeSpan.onclick = function () {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

const techInit = () => {
  const items = document.querySelectorAll(".tech-label");
  items.forEach(item => {
    const input = item.getElementsByTagName("input");
    if (input?.length > 0) {
      // adding event listener to 0 index as label has only one input field
      input[0].addEventListener("click", (e) => {
        const msTech = document.getElementById("ms-" + e.target.id)
        if (msTech) {
          msTech.checked = e.target.checked
        }
      })
    }
  })
}

const multiselectTechInit = () => {
  const selectBtn = document.querySelector(".select-btn")
  const items = document.querySelectorAll(".ms-item");

  selectBtn.addEventListener("click", () => {
    selectBtn.classList.toggle("open");
  });

  items.forEach(item => {
    item.addEventListener("click", (e) => {
      const id = e.target.id.split("ms-")[1]
      if (id) {
        const checkedTech = document.getElementById(id)
        checkedTech.checked = e.target.checked
        const totalTech = new Set(getCheckboxValues("technologies")).size
        let btnText = document.querySelector(".btn-text");

        if (totalTech > 0) {
          btnText.innerText = `${totalTech} Selected`;
        } else {
          btnText.innerText = "Select Language";
        }
      }
    });
  })
}

const onTechSearch = () => {
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("ms-tech-search");
  filter = input.value.toUpperCase();
  ul = document.getElementById("ms-tech");
  li = ul.getElementsByTagName("li");
  for (i = 0; i < li.length; i++) {
    label = li[i].getElementsByTagName("label")[0];
    if (label) {
      txtValue = label.textContent || label.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }
}

const isDownloadCatalogue = () => {
  const queryParamsString = window.location.search
  var queryparams = new URLSearchParams(queryParamsString)

  // Convert the query parameters to an object
  var queryparamsObject = {};

  queryparams.forEach(function (value, key) {
    queryparamsObject[key] = value;
  });

  replaceUrlState(queryparams)

  if (queryparamsObject['downloadCatalogue'] == '1') {
    var modal = document.getElementById("courseCatalogModal");
    modal.style.display = "block";
  }
}

const replaceUrlState = (urlSearchParams) => {
  const currentUrl = window.location.href;
  urlSearchParams.delete('downloadCatalogue');

  // Create a new URL without the specified parameter
  var newUrl = currentUrl.split('?')[0] + urlSearchParams.toString();

  // Update the URL without reloading the page
  window.history.replaceState({}, document.title, newUrl);
}

$(document).ready(function () {
  // init()
  techInit()
  multiselectTechInit()
  contactForm()
  catologForm()
  requestQuotationForm()
  openCourseCatalogueModal()
  isDownloadCatalogue()
});


var genericEmails = [
  "gmail",
  "yahoo",
  "hotmail",
  "aol",
  "msn",
  "wanadoo",
  "orange",
  "comcast",
  "live",
  "rediffmail",
  "free",
  "gmx",
  "web",
  "yandex",
  "ymail",
  "libero",
  "outlook",
  "uol",
  "bol",
  "mail",
  "cox",
  "sbcglobal",
  "sfr",
  "verizon",
  "googlemail",
  "ig",
  "bigpond",
  "terra",
  "neuf",
  "alice",
  "rocketmail",
  "att",
  "laposte",
  "facebook",
  "bellsouth",
  "charter",
  "rambler",
  "tiscali",
  "shaw",
  "sky",
  "earthlink",
  "optonline",
  "freenet",
  "t-online",
  "aliceadsl",
  "virgilio",
  "home",
  "qq",
  "telenet",
  "me",
  "voila",
  "planet",
  "tin",
  "ntlworld",
  "arcor",
  "frontiernet",
  "hetnet",
  "zonnet",
  "club-internet",
  "juno",
  "optusnet",
  "blueyonder",
  "bluewin",
  "skynet",
  "sympatico",
  "windstream",
  "mac",
  "centurytel",
  "chello",
  "aim",
];
