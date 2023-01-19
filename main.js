let leftCurrency = "RUB";
let rightCurrency = "RUB";
let leftRate = 1;
let rightRate = 1;

const leftUl = document.querySelector(".leftUl");
const rightUl = document.querySelector(".rightUl");

const leftInput = document.querySelector(".leftInput");
const rightInput = document.querySelector(".rightInput");

function exchange(from, to) {
  if (from === to) {
    return Promise.resolve("1");
  }
  return fetch(
    `https://api.exchangerate.host/latest?base=${from}&symbols=${to}`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data.rates[to];
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

function leftUlClick(event) {
  leftCurrency = event.target.textContent;
  for (let elem of event.currentTarget.children) elem.style.color = "black";
  event.target.style.color = "red";
  exchange(leftCurrency, rightCurrency)
    .then((result) => {
      leftRate = result;
      rightRate = 1 / leftRate;
      let spanText = document.querySelector(".leftSpan");
      spanText.textContent = `1 ${event.target.textContent} = ${leftRate} ${rightCurrency}`;
      spanText = document.querySelector(".rightSpan");
      spanText.textContent = `1 ${rightCurrency} = ${(1 / leftRate).toFixed(
        4
      )} ${leftCurrency}`;
      rightInput.value = (leftInput.value * leftRate).toFixed(2);
    })
    .catch((error) => {
      alert(`Что-то пошло не так.  Error: ${error}`);
    });
}
function rightUlClick(event) {
  rightCurrency = event.target.textContent;
  for (let elem of event.currentTarget.children) elem.style.color = "black";
  event.target.style.color = "red";
  exchange(rightCurrency, leftCurrency).then((result) => {
    rightRate = result;
    leftRate = 1 / rightRate;
    let spanText = document.querySelector(".rightSpan");
    spanText.textContent = `1 ${event.target.textContent} = ${rightRate} ${leftCurrency}`;
    spanText = document.querySelector(".leftSpan");
    spanText.textContent = `1 ${leftCurrency} = ${(1 / rightRate).toFixed(
      4
    )} ${rightCurrency}`;
    rightInput.value = (leftInput.value * leftRate).toFixed(2);
//    leftInput.value = (rightInput.value * rightRate).toFixed(2);
  });
}

leftUl.addEventListener("click", leftUlClick);
rightUl.addEventListener("click", rightUlClick);

leftInput.addEventListener("input", () => {
  if (leftInput.value.indexOf(",") >= 0)
    leftInput.value = leftInput.value.replace(",", ".");
  rightInput.value = (leftInput.value * leftRate).toFixed(2);
});
rightInput.addEventListener("input", () => {
  if (rightInput.value.indexOf(",") >= 0)
    rightInput.value = rightInput.value.replace(",", ".");
  leftInput.value = (rightInput.value * rightRate).toFixed(2);
});
