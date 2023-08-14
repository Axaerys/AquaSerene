document.addEventListener("DOMContentLoaded", function() {
  var scrollLinks = document.getElementsByClassName("tab-btn");

  function handleClick(event) {
    // Remove the active class from all buttons
    for (var i = 1; i < scrollLinks.length; i++) {
      scrollLinks[i].classList.remove("active");
    }

    // Add the active class to the clicked button
    this.classList.add("active");
  }

  // Add the click event listener to each button
  for (var i = 0; i < scrollLinks.length; i++) {
    scrollLinks[i].addEventListener("click", handleClick);
  }
});


var originalPlaceholder;

function clearPlaceholder(input) {
  originalPlaceholder = input.placeholder;
  input.placeholder = '';
}

function restorePlaceholder(input) {
  input.placeholder = originalPlaceholder;
}


function removeDiv(button) {
var div = button.parentNode;
var confirmation = confirm("Are you sure you want to remove this reservation?");
if (confirmation) {
  div.parentNode.removeChild(div);
} else {
  window.location.href = './myAccount';
}
}

function removeDiv(button) {
  var div = button.parentNode;
  var confirmation = confirm("Are you sure you want to edit this reservation?");
  if (confirmation) {
    window.location.href = './myAccount';
  } else {
    window.location.href = './myAccount';
  }
  }



function copyText(element) {
var text = element.textContent || element.innerText;
var tempInput = document.createElement("input");
tempInput.type = "text";
tempInput.value = text;
document.body.appendChild(tempInput);
tempInput.select();
document.execCommand("copy");
document.body.removeChild(tempInput);
alert("Text copied: " + text);
}

function validateNumberInput(event) {
var input = event.target.value;

// Remove any non-numeric characters from the input
var sanitizedInput = input.replace(/\D/g, '');

// Update the input value with the sanitized input
event.target.value = sanitizedInput;
}




