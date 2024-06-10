$(function () {
  $.ajax({
    contentType: "application/json",
    dataType: "json",
    type: "GET",
    url: "https://tsm.swabhavtechlabs.com/api/v1/tsam/tenant/7ca2664b-f379-43db-bdf9-7fdd40707219/enquiry-type",
  })
    .done(function (response) {
      console.log(response);
      const checkboxContainer = document.getElementById("enquiry-type");
      response.forEach(item => {
        localStorage.setItem('enquiry-type', JSON.stringify(response))
        const container = document.createElement("div");
        container.classList.add("input-wrap")

        const label = document.createElement("label");
        label.htmlFor = item.id;
        label.classList.add("cursor-pointer")

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = item.id;
        checkbox.classList.add("cursor-pointer")
        if (container && label && checkboxContainer) {
          container.appendChild(label);
          label.appendChild(checkbox);
          label.appendChild(document.createTextNode(" " + item.name));
          checkboxContainer.appendChild(container);
        }
        // checkboxContainer.appendChild(document.createElement("br")); // Add line break for spacing
      });
    })
    .fail(function (err) {
      console.error(err);
    })
})