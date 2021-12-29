const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const pug = require("pug");
const fs = require("fs");
const { promisify } = require("util");
const generateRouter = require("./routes/generateRouter");
const viewRouter = require("./routes/viewRouter");

app = express();
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());

app.use(
	cors({
		origin: "*",
	})
);

app.get("/download/:id", (req, res) => {
	res.status(200).download(`./public/temp/${req.params.id}`, () => {
		fs.unlink(`./public/temp/${req.params.id}`, () => {
			//TODO ERROR HANDLING
		});
	});
});
app.use("/", viewRouter);
app.use("/generateInvoice", generateRouter);

module.exports = app;
