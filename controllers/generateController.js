const generateInvoice = require("../utils/generateInvoice");
const formatItems = require("../utils/formatItems");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

exports.generateInvoice = (req, res) => {
	const names = JSON.parse(req.body.names);
	const quantites = JSON.parse(req.body.quantites);
	const rates = JSON.parse(req.body.rates);

	let items = [];
	let subTotal = 0;

	for (let i = 0; i < names.length; i++) {
		subTotal += quantites[i] * rates[i];
		items.push(formatItems(names[i], quantites[i], rates[i]));
	}

	delete req.body.names;
	delete req.body.quantites;
	delete req.body.rates;

	req.body.subTotal = subTotal;

	generateInvoice(items, req.body, (downloadPath) => {
		fs.unlink(`./public/temp/${req.body.img}`, () => {
			res.status(200).json({
				status: "Invoice generated.",
				downloadPath,
			});
		});
	});
};

exports.uploadImage = upload.single("logo");

exports.compressImage = async (req, res, next) => {
	req.body.uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

	if (req.file) {
		req.body.img = req.file.originalname
			.split(".")[0]
			.concat(req.body.uniqueSuffix, ".png");

		await sharp(req.file.buffer)
			.flatten({ background: { r: 255, g: 255, b: 255, alpha: 0 } })
			.resize(300)
			.toFile(`./public/temp/${req.body.img}`, (err) => {
				if (err) console.log(err);
				next();
			});
	} else {
		next();
	}
};
