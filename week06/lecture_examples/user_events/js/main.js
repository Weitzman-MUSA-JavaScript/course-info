const colorButton = document.querySelector('#color-button');

// Change the button color to a random color when clicked...
const changeButtonColor = (evt) => {
  colorButton.style.backgroundColor = `rgb(${Math.floor(Math.random() * 256)} ${Math.floor(Math.random() * 256)} ${Math.floor(Math.random() * 256)})`
}

colorButton.addEventListener('click', changeButtonColor);

// Change the button text to show how many times it has been clicked...
let timesClicked = 0;
function changeButtonText(evt) {
  timesClicked++;
  evt.target.innerHTML = `Clicked ${timesClicked} time(s)`;
}

colorButton.addEventListener('click', changeButtonText);