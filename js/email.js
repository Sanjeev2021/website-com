function sendEmail(dateTime, email, caseStudy) {
  // Create a new XMLHttpRequest object.
  var xhr = new XMLHttpRequest();

  // Set the request method to POST.
  xhr.open(
    "POST",
    // "http://127.0.0.1:8080/api/v1/tsam/tenant/7ca2664b-f379-43db-bdf9-7fdd40707219/resource-download/send-mail"
    "https://tsm.swabhavtechlabs.com/api/v1/tsam/tenant/7ca2664b-f379-43db-bdf9-7fdd40707219/resource-download/send-mail"
  );

  // Set the request headers.
  xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

  var data = JSON.stringify({
    dateTime: dateTime,
    email: email,
    resource: caseStudy,
  });

  // Send the request.
  xhr.send(data);

  // Check the response status code.
  if (xhr.status === 201 || xhr.status === 202) {
    console.log("email sent successfully");
    // The email was sent successfully.
    return true;
  }
  // The email was not sent successfully.
  console.log("error occured in sending mail");
  return false;
}

// Add event listener to the document body for click events
// document.body.addEventListener('click', (event) => {
//   // Check if the clicked element is not within the popup message
//   if (!popupMessage.contains(event.target) && isEmailClicked) {
//     // Close the popup message
//     const popupMessage = document.getElementById('popupMessage');
//     popupMessage.style.display = 'none';
//     return
//   }
// });

$(document).ready(function () {
  // Handle input focusout (when the input field loses focus)
  document.getElementById('emailInput')?.addEventListener('focusin', function () {
    let emailErrorElement = document.querySelector('#email-error');
    document.getElementById("emailInput").classList.remove('invalid-input')

    console.log(emailErrorElement);
    if (emailErrorElement) {
      emailErrorElement.remove();
    }
  })

  document.getElementById('emailInput')?.addEventListener('blur', function () {
    const email = document.getElementById('emailInput').value
    const emailInput = document.getElementById("emailInput")

    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

    if (!emailReg.test(email)) {
      emailInput.classList.add('invalid-input')
      $("#emailInput").after('<span id="email-error" class="error">Enter a valid email address.</span>')
    }

    var emailDomain = email?.split("@")?.[1]?.split(".")?.[0]?.toLowerCase();
    if (!emailDomain) {
      return
    }
    let isValidEmail = isValidOrganizationEmail(emailDomain)
    console.log("Is valid email: ", isValidEmail)
    if (!isValidEmail) {
      const popupMessage = document.getElementById('popupMessage');
      popupMessage.style.display = 'block';

      // Reset input field after displaying popup
      // this.value = '';

      // Hide popup message after 3 seconds (3000 milliseconds)
      // setTimeout(() => {
      //   popupMessage.style.display = 'none';
      // }, 10000);
      return
    }
  });

  document.getElementById("close-popup")?.addEventListener("click", () => {
    const popupMessage = document.getElementById('popupMessage');
    document.getElementById('emailInput').value = ""
    popupMessage.style.display = 'none';
  })

  // Open the modal programmatically
  $("#subscribeLink").click(() => {
    $("#subscribeModal").modal("show");
  });

  $("#subscribeHere").click(() => {
    $("#subscribeModal").modal("show");
  });

  // Handle form submission
  $("#subscribeForm").submit(function (event) {
    event.preventDefault(); // Prevent form from submitting

    // Get the email value
    var email = $("#emailInput").val();

    // Validate email address
    if (!validateEmail(email)) {
      displayErrorMessage("Please enter a valid email address.");
      return;
    }
    var emailDomain = email.split("@")[1].split(".")[0].toLowerCase();
    console.log(emailDomain);
    if (!isValidOrganizationEmail(emailDomain)) {
      displayErrorMessage("Please enter a valid organization email.");
      return;
    }
    // Get the current page URL
    var pageUrl = window.location.href;

    // Extract the last part of the URL and remove the ".html" extension
    var pageName = pageUrl.split("/").pop().replace(".html", "");

    var currentDate = new Date();

    // Extract the different components of the date and time
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1; // Months are zero-based, so we add 1
    var day = currentDate.getDate();
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();
    var seconds = currentDate.getSeconds();

    // Format the components as desired
    var formattedDateTime =
      year +
      "-" +
      month +
      "-" +
      day +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;

    // Output the formatted date and time
    console.log("Current Date and Time: " + formattedDateTime);

    sendEmail(formattedDateTime, email, pageName);

    // Define the PDF URLs based on the page name
    var pdfUrl = "";

    switch (pageName) {
      case "nexsales-casestudy":
        pdfUrl = "Upload/Casestudies/Swabhav-Nexsales.pdf";
        break;
      case "aurionpro-casestudy":
        pdfUrl = "Upload/Casestudies/Swabhav-Aurionpro.pdf";
        break;
      case "monocept-casestudy":
        pdfUrl = "Upload/Casestudies/Swabhav-Monocept.pdf";
        break;
      case "assesshub-casestudy":
        pdfUrl = "Upload/Casestudies/Swabhav-Assesshub.pdf";
        break;
      case "hiwi-casestudy":
        pdfUrl = "Upload/Casestudies/Swabhav-Hiwi.pdf";
        break;
      case "livlong-casestudy":
        pdfUrl = "Upload/Casestudies/Swabhav-Livlong.pdf";
        break;
      case "forcepoint-casestudy":
        pdfUrl = "Upload/Casestudies/Swabhav-Forcepoint.pdf";
        break;
      default:
        pdfUrl = "";
        break;
    }

    // Open the PDF file in a new tab/window
    // window.open(pdfUrl, "_blank");
    // Close the modal
    // $("#subscribeModal").modal("hide");
    // resetModal();
    $("#subscribeModal .modal-body").html(`
        <strong>
          <p>Thank you for submitting your email. Click <a href="${pdfUrl}" target="_blank" style="text-decoration: underline; font-style: italic;">here</a> if you don't see the case study in your mailbox.</p>
        </strong>
      `);
  });

  // Display the error message
  function displayErrorMessage(message) {
    $("#emailInput").addClass("is-invalid");
    $("#errorContainer").text(message);
    $("#errorContainer").show();
  }
  // Email validation function
  function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Check if the email domain is valid
  function isValidOrganizationEmail(domain) {
    return !genericEmails.includes(domain);
  }

  // Reset input field and hide error message
  function resetModal() {
    $("#emailInput").val("");
    $("#emailInput").removeClass("is-invalid");
    $("#errorContainer").text(""); // Clear the error message text
    $("#errorContainer").hide();
  }

  // Event listener for input change
  $("#emailInput").on("input", function () {
    $("#emailInput").removeClass("is-invalid");
    $("#errorContainer").text(""); // Clear the error message text
    $("#errorContainer").hide();
  });

  // Event listener for modal close
  $("#subscribeModal").on("hidden.bs.modal", function () {
    resetModal();
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
