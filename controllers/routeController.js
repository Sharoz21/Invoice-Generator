exports.getFormPage = (req, res, next) => {
	res.status(200).render("home");
};

exports.getDownloadPage = (req, res, next) => {
	res.status(200).render("download", {
		path: req.params.id,
	});
};
