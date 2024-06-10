
// script.js
const dropdownBtn = document.querySelectorAll(".dropdown-btn");
const dropdown = document.querySelectorAll(".dropdown");
const hamburgerBtn = document.getElementById("hamburger");
const navMenu = document.querySelector(".menu");
const links = document.querySelectorAll(".dropdown a");

function setAriaExpandedFalse() {
	dropdownBtn.forEach((btn) => btn.setAttribute("aria-expanded", "false"));
}

function closeDropdownMenu() {
	dropdown.forEach((drop) => {
		drop.classList.remove("active");
		drop.addEventListener("click", (e) => e.stopPropagation());
	});
}

function toggleHamburger() {
	navMenu.classList.toggle("show");
}

dropdownBtn.forEach((btn) => {
	btn.addEventListener("click", function (e) {
		const dropdownIndex = e.currentTarget.dataset.dropdown;
		const dropdownElement = document.getElementById(dropdownIndex);

		dropdownElement.classList.toggle("active");
		dropdown.forEach((drop) => {
			if (drop.id !== btn.dataset["dropdown"]) {
				drop.classList.remove("active");
			}
		});
		e.stopPropagation();
		btn.setAttribute(
			"aria-expanded",
			btn.getAttribute("aria-expanded") === "false" ? "true" : "false"
		);
	});
});

// close dropdown menu when the dropdown links are clicked
links.forEach((link) =>
	link.addEventListener("click", () => {
		closeDropdownMenu();
		setAriaExpandedFalse();
		toggleHamburger();
	})
);

function validatePhone(event) {
	console.log("in validate phone")
	const phoneInput = event.target;
	const phoneNumber = phoneInput.value;

	// Check if the entered value contains only numeric characters
	if (!/^\d+$/.test(phoneNumber)) {
		// Display an error message or handle validation feedback
		phoneInput.setCustomValidity('Please enter a valid phone number (numeric characters only).');
	} else {
		// Clear any previous validation message
		phoneInput.setCustomValidity('');
	}
}

document.getElementById('contact-form').addEventListener('submit', async function (event) {
	event.preventDefault(); // Prevent default form submission

	const formData = new FormData(this);
	let obj = Object.fromEntries(formData)

	if (obj.staffContact.length !== 10) {
		const popupMessage = document.getElementById('popupMessage');
		popupMessage.style.display = 'block';
		popupMessage.innerHTML = `<p>Mobile number should consist of 10 digits</p>`

		setTimeout(() => {
			popupMessage.style.display = 'none';
		}, 3000);
		return;
	}

	let enquiryDate = formatDateToYYYYMMDD(new Date())
	obj.enquiryDate = enquiryDate

	// const url = 'http://localhost:8080/api/v1/tsam/tenant/7ca2664b-f379-43db-bdf9-7fdd40707219/form/company-enquiry';
	const url = 'https://tsm.swabhavtechlabs.com/api/v1/tsam/health'; // dummy
	// const url = 'https://tsm.swabhavtechlabs.com/api/v1/tsam/tenant/7ca2664b-f379-43db-bdf9-7fdd40707219/form/company-enquiry'; //actual 


	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(obj), // Convert FormData to JSON
		});

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		console.log("Success")
		// Display success message and hide form
		document.getElementById('contact-form-container').style.display = 'none';
		const messageElement = document.getElementById('form-message');
		messageElement.innerText = 'Thank you for sharing the details. Our team will get in touch with you to understand more about your requirements.';
		addStylesToMessage(messageElement)

	} catch (error) {
		console.error('Error submitting form:', error);
		alert('An error occurred while submitting the form. Please try again later.');
	}
});

function addStylesToMessage(msgElement, height) {
	msgElement.style.padding = '20px';
	msgElement.style.backgroundColor = 'white';
	msgElement.style.height = height ? height : '350px';
	msgElement.style.display = 'flex';
	msgElement.style.alignContent = 'center';
	msgElement.style.alignItems = 'center';
	msgElement.style.textAlign = 'center';
	msgElement.style.borderRadius = '10px';
}

const formatDateToYYYYMMDD = (date) => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

// close dropdown menu when you click on the document body
document.documentElement.addEventListener("click", () => {
	closeDropdownMenu();
	setAriaExpandedFalse();
});

// close dropdown when the escape key is pressed
document.addEventListener("keydown", (e) => {
	if (e.key === "Escape") {
		closeDropdownMenu();
		setAriaExpandedFalse();
	}
});

// hamburgerBtn?.addEventListener("click", toggleHamburger);

// $(document).ready(function () {

// 	AOS.init();
// 	var scrollSpy;
// 	var hash = window.location.hash;
// 	hash && $('#side-menu>li>a[href="' + hash + '"]').tab("show");

// 	$("#side-menu>li>a").click(function (e) {
// 		e.preventDefault();
// 		$(this).tab("show");
// 		window.location.hash = this.hash;

// 		if (this.hash == "#tab1") {
// 			if ($("#tab1-tab").hasClass("active")) {
// 				$("#tab1-programs").addClass("show");
// 				scrollSpy = new bootstrap.ScrollSpy(document.body, { target: "#tab1-programs" });
// 			}
// 		} else {
// 			$("#tab1-programs").removeClass("show");
// 			scrollSpy.dispose();
// 		}
// 	});
// 	if ($("#tab1-tab").hasClass("active")) {
// 		$("#tab1-programs").addClass("show");
// 		scrollSpy = new bootstrap.ScrollSpy(document.body, {
// 			target: '#tab1-programs'
// 		});
// 	}

// });

(function () {
	// Vertical Timeline - by CodyHouse.co
	function VerticalTimeline(element) {
		this.element = element;
		this.blocks = this.element.getElementsByClassName("cd-timeline__block");
		this.images = this.element.getElementsByClassName("cd-timeline__img");
		this.contents = this.element.getElementsByClassName("cd-timeline__content");
		this.offset = 0.8;
		this.hideBlocks();
	};

	VerticalTimeline.prototype.hideBlocks = function () {
		if (!"classList" in document.documentElement) {
			return; // no animation on older browsers
		}
		//hide timeline blocks which are outside the viewport
		var self = this;
		for (var i = 0; i < this.blocks.length; i++) {
			(function (i) {
				if (self.blocks[i].getBoundingClientRect().top > window.innerHeight * self.offset) {
					self.images[i].classList.add("cd-timeline__img--hidden");
					self.contents[i].classList.add("cd-timeline__content--hidden");
				}
			})(i);
		}
	};

	VerticalTimeline.prototype.showBlocks = function () {
		if (! "classList" in document.documentElement) {
			return;
		}
		var self = this;
		for (var i = 0; i < this.blocks.length; i++) {
			(function (i) {
				if (self.contents[i].classList.contains("cd-timeline__content--hidden") && self.blocks[i].getBoundingClientRect().top <= window.innerHeight * self.offset) {
					// add bounce-in animation
					self.images[i].classList.add("cd-timeline__img--bounce-in");
					self.contents[i].classList.add("cd-timeline__content--bounce-in");
					self.images[i].classList.remove("cd-timeline__img--hidden");
					self.contents[i].classList.remove("cd-timeline__content--hidden");
				}
			})(i);
		}
	};

	var verticalTimelines = document.getElementsByClassName("js-cd-timeline"),
		verticalTimelinesArray = [],
		scrolling = false;
	if (verticalTimelines.length > 0) {
		for (var i = 0; i < verticalTimelines.length; i++) {
			(function (i) {
				verticalTimelinesArray.push(new VerticalTimeline(verticalTimelines[i]));
			})(i);
		}

		//show timeline blocks on scrolling
		window.addEventListener("scroll", function (event) {
			if (!scrolling) {
				scrolling = true;
				(!window.requestAnimationFrame) ? setTimeout(checkTimelineScroll, 250) : window.requestAnimationFrame(checkTimelineScroll);
			}
		});
	}

	function checkTimelineScroll() {
		verticalTimelinesArray.forEach(function (timeline) {
			timeline.showBlocks();
		});
		scrolling = false;
	};
})();

(function () {
	const talentEnquiryRedirect = document.getElementById("talent-enquiry-redirect")
	talentEnquiryRedirect.addEventListener("click", () => {

		const enquiryForm = convertFormToJSON(document.getElementById("contact-form"))

		if (enquiryForm["staffName"].includes(" ")) {
			enquiryForm["firstName"] = enquiryForm["staffName"].split(" ")[0]
			enquiryForm["lastName"] = enquiryForm["staffName"].split(" ")[1]
			enquiryForm["email"] = enquiryForm["email"]
			enquiryForm["contact"] = enquiryForm["staffContact"]
		} else {
			enquiryForm["firstName"] = enquiryForm["staffName"]
		}

		let queryparams = ""

		for (let key in enquiryForm) {
			if (enquiryForm.hasOwnProperty(key)) {
				if (!enquiryForm[key]) {
					continue
				}

				queryparams += "&" + key + "=" + enquiryForm[key]
			}
		}

		console.log(queryparams);

		const popupMessage = document.getElementById('popupMessage');
		popupMessage.style.display = 'none';
		document.getElementById('emailInput').value = ""

		const link = "https://tsm.swabhavtechlabs.com/forms/talent-enquiry?" + queryparams
		location.href = link
	})
})()

function convertFormToJSON(form) {
	const array = $(form).serializeArray(); // Encodes the set of form elements as an array of names and values.
	const json = {};
	$.each(array, function () {
		json[this.name] = this.value || "";
	});

	return json;
}
