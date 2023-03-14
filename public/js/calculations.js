const customSliders = document.querySelectorAll("custom-slider");
const monthlyRepay = document.querySelector("#monthly-repay");
const totalRepay = document.querySelector("#total-repay");
const monthlyFee = 10;
let loan = 2100;
let duration = 12;
let interest = 0.05;

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getRepayments(event) {
  const { value, type } = event ? event.detail : { value: 0, type: null };

  if (type === "currency") loan = value;
  if (type === "unit") duration = value;
  if (type === "percentage") interest = value * 0.05;

  const result = loan + interest * loan + monthlyFee * duration;

  totalRepay.innerText = result.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  monthlyRepay.innerText = (result / duration).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

customSliders.forEach((slider) =>
  slider.addEventListener("slider-changed", getRepayments)
);

getRepayments();
