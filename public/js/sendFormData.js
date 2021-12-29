const invoiceForm = document.querySelector("form");

invoiceForm.addEventListener("submit", async (e) => {
	e.preventDefault();
	const inputs = document.querySelectorAll(".input");

	const itemName = document.querySelectorAll(".item-name");
	const itemQuantity = document.querySelectorAll(".item-quantity");
	const itemRate = document.querySelectorAll(".item-rate");

	const form = new FormData(invoiceForm);

	inputs.forEach((input) => {
		form.append(input.id, input.value.replace(/\s{2,}/g, " "));
	});

	const names = [];
	itemName.forEach((name) => names.push(name.value));
	form.append("names", JSON.stringify(names));

	const quantities = [];
	itemQuantity.forEach((quantity) => quantities.push(quantity.value));
	form.append("quantites", JSON.stringify(quantities));

	const rates = [];
	itemRate.forEach((rate) => rates.push(rate.value));
	form.append("rates", JSON.stringify(rates));

	sendRequest(form);
});

const sendRequest = async (formData) => {
	const response = await fetch("http://localhost:8080/generateInvoice", {
		body: formData,
		method: "POST",
	});

	const data = await response.json();

	window.location.assign(`http://localhost:8080/${data.downloadPath}`);
};
