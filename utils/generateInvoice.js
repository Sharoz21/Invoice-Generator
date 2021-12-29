const PdfPrinter = require("pdfmake");
const fs = require("fs");

let fonts = {
	Roboto: {
		normal: "node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.ttf",
		bold: "node_modules/roboto-font/fonts/Roboto/roboto-bold-webfont.ttf",
		italics: "node_modules/roboto-font/fonts/Roboto/roboto-italic-webfont.ttf",
		bolditalics:
			"node_modules/roboto-font/fonts/Roboto/roboto-bolditalic-webfont.ttf",
	},
};

const preventSpam = (string, breakLength) => {
	const maxLength = breakLength ? breakLength : 10;

	let count = 0;

	for (let i = 0; i < string.length; i++) {
		count = string[i] == " " ? 0 : ++count;
		if (count == maxLength) {
			string = string.slice(0, i) + "-\n" + string.slice(i);
			count = 0;
		}
	}

	return string;
};

const generateBody = (items) => {
	const body = [
		[
			{ text: "Item", style: ["mainTable", "headerStyle"] },
			{ text: "Quantity", style: ["mainTable", "headerStyle"] },
			{ text: "Rate", style: ["mainTable", "headerStyle"] },
			{ text: "Amount", style: ["mainTable", "headerStyle"] },
		],
	];

	items.forEach((item) => body.push([...item]));

	return body;
};

const prepareDynamicData = (invoice) => {
	invoice.total = invoice.subTotal * 1 + invoice.tax * 1;
	invoice.balance = invoice.total * 1 - invoice.amountPaid * 1;
};

module.exports = (items, invoice, callback) => {
	const printer = new PdfPrinter(fonts);

	const body = generateBody(items);

	prepareDynamicData(invoice);

	const docDefinition = {
		watermark: {
			text: `${invoice.from}`,
			opacity: 0.1,
			bold: true,
			italics: false,
		},

		content: [
			{
				table: {
					widths: ["*", "*", "*", "*"],
					heights: [60, "*", "*", "*"],

					body: [
						[
							invoice.img
								? {
										image: `./public/temp/${invoice.img}`,
										width: 100,
								  }
								: "",
							"",

							{
								text: [
									preventSpam(`${invoice.heading}`).toUpperCase(),
									{ text: `\n# ${invoice.num}`, style: "muted", fontSize: 12 },
								],
								rowSpan: 2,
								colSpan: 2,
								style: "mainHeading",
							},
							"",
						],
						[{ text: preventSpam(invoice.from, 40), colSpan: 4 }, "", "", ""],

						[
							"",
							"",
							{ text: "Date:", style: ["leftTable", "muted"] },
							{ text: `${invoice.date}`, style: "leftTable" },
						],

						[
							{
								text: [
									{ text: "Bill to:", style: ["muted"] },
									{ text: `\n${preventSpam(invoice.bill)}` },
								],
								rowSpan: 4,
							},
							{
								text: [
									{ text: "Ship to:", style: ["muted"] },
									{ text: `\n${preventSpam(invoice.ship)}` },
								],
								rowSpan: 4,
							},
							{ text: "Payment Terms:", style: ["leftTable", "muted"] },
							{
								text: preventSpam(`${invoice.paymentTerms}`),
								style: "leftTable",
							},
						],

						[
							"",
							"",
							{ text: "Due Date:", style: ["leftTable", "muted"] },
							{
								text: `${invoice.dueDate}`,
								style: "leftTable",
							},
						],

						[
							"",
							"",
							{ text: "PO Number:", style: ["leftTable", "muted"] },
							{
								text: preventSpam(`${invoice.PONumber}`),
								style: "leftTable",
							},
						],

						[
							"",
							"",
							{
								text: "Balance Due:",
								alignment: "right",
								bold: true,
							},
							{
								text: `$ ${invoice.balance}`,
								alignment: "right",
								bold: true,
							},
						],
					],
				},
				layout: "noBorders",
			},

			{
				margin: [0, 40, 0, 0],
				table: {
					widths: [250, "*", "*", "*"],
					body,
				},
				layout: "noBorders",
			},
			{
				margin: [0, 60, 0, 0],
				table: {
					widths: ["*", "*", "*", "*"],
					body: [
						[
							"",
							"",
							{ text: "Subtotal:", style: ["leftTable", "muted"] },
							{ text: `$ ${invoice.subTotal}`, style: ["leftTable"] },
						],
						[
							"",
							"",
							{ text: "Tax:", style: ["leftTable", "muted"] },
							{ text: `$ ${invoice.tax}`, style: ["leftTable"] },
						],
						[
							"",
							"",
							{ text: "Total:", style: ["leftTable", "muted"] },
							{ text: `$ ${invoice.total}`, style: ["leftTable"] },
						],
						[
							"",
							"",
							{ text: "Amount Paid:", style: ["leftTable", "muted"] },
							{ text: `$ ${invoice.amountPaid}`, style: ["leftTable"] },
						],
						[{ text: "Notes:", style: ["muted"] }, "", "", ""],
						[
							{ text: `${preventSpam(invoice.notes, 65)}`, colSpan: 4 },
							"",
							"",
							"",
						],
						[{ text: "Terms:", style: ["muted"] }, "", "", ""],
						[
							{ text: `${preventSpam(invoice.terms, 65)}`, colSpan: 4 },
							"",
							"",
							"",
						],
					],
				},
				layout: "noBorders",
			},
		],

		styles: {
			mainHeading: {
				alignment: "right",
				fontSize: 26,
			},
			leftTable: {
				alignment: "right",
				fontSize: 10,
			},
			muted: {
				color: "#808080",
				fontSize: 10,
			},
			mainTable: {
				margin: [10, 0, 0, 0],
				color: "#353935",
				fontSize: 10,
			},
			headerStyle: {
				color: "#ffffff",
				fillColor: "#353935",
			},
		},
	};
	var pdfDoc = printer.createPdfKitDocument(docDefinition, {});

	pdfDoc.pipe(
		new fs.createWriteStream(
			`./public/temp/invoice-${invoice.uniqueSuffix}.pdf`
		)
	);
	pdfDoc.on("end", () => {
		callback(`invoice-${invoice.uniqueSuffix}.pdf`);
	});

	pdfDoc.end();
};
