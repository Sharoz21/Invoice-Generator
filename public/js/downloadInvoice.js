const downloadBtn = document.getElementById("download-btn");

downloadBtn.addEventListener("click", async (e) => {
	e.preventDefault();
	window.open(
		`http://localhost:8080/download/${downloadBtn.getAttribute("data-id")}`
	);
	window.location.assign("/");
});
