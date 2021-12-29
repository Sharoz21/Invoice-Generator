module.exports = (name, quantity, rate) => {
	const style = ["mainTable"];

	return [
		{ text: name, style },
		{ text: quantity, style },
		{ text: rate, style },
		{ text: `$ ${quantity * rate}`, style },
	];
};
