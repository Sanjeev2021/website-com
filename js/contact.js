/*-------------------------
        Ajax Contact Form 
    ---------------------------*/
$(function () {
  console.log("contact.js");
  // <div class="success-message w-form-done success">
  // <div>Thank you! Your submission has been received!</div>
  // </div>
  // <div class="w-form-fail error">
  // <div>Oops! Something went wrong while submitting the form.</div>
  // </div>

  console.log("intialize listener");
  // Get the form.
  var form = $("#contact-form");

  // Get the messages div.
  var formMessages = $(".form-messege");

  // Set up an event listener for the contact form.
  $(form).submit(function (e) {
    // Stop the browser from submitting the form.
    e.preventDefault();

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

    let emailDomain = emailaddressVal.split("@")[1].split(".")[0].toLowerCase();

    if (genericEmails.includes(emailDomain)) {
      $("#email").after(
        '<span class="error">Please enter a valid business email.</span>'
      );
      hasError = true;
    }

    if (hasError == true) {
      return false;
    }

    function convertFormToJSON(form) {
      const array = $(form).serializeArray(); // Encodes the set of form elements as an array of names and values.
      const json = {};
      $.each(array, function () {
        json[this.name] = this.value || "";
      });
      return json;
    }

    function getEnquiryType(json) {
      json.companyEnquiryEnquiryTypes = []
      const checkboxContainer = document.getElementById("enquiry-type");
      const checkboxes = checkboxContainer.querySelectorAll('input[type="checkbox"]:checked');

      // Extract the values of selected checkboxes
      const selectedValues = Array.from(checkboxes).map(checkbox => checkbox.id);

      if (selectedValues.length <= 0) {
        $("#enquiry-type").after(
          '<p class="error">Please select atleast one service.</p>'
        );
        return
      }

      const enquiryTypes = JSON.parse(localStorage.getItem("enquiry-type"))
      enquiryTypes.forEach((enquiryType) => {
        if (selectedValues.includes(enquiryType.id)) {
          json.companyEnquiryEnquiryTypes.push(enquiryType)
        }
      });
    }

    function formatDateToYYYYMMDD(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    const form = $(e.target);
    const json = convertFormToJSON(form);
    json.enquiryDate = formatDateToYYYYMMDD(new Date())
    getEnquiryType(json)

    if (json.companyEnquiryEnquiryTypes?.length <= 0) {
      return
    }

    console.log(json);
    var json1 = JSON.stringify(json);

    // Submit the form using AJAX.
    console.log(json1);


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
        $("#contact-form input,#contact-form textarea").val("");

        // uncheck checkboxes
        const checkboxContainer = document.getElementById("enquiry-type");
        const checkboxes = checkboxContainer.querySelectorAll('input[type="checkbox"]:checked');
        console.log(checkboxes);

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
  });
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