const addBtn = document.getElementById("add-btn");
const removeBtn = document.getElementById("remove-btn");
const itemList = document.getElementById("item-list");

addBtn.addEventListener("click", (e) => {
	e.preventDefault();
	const div = document.createElement("div");
	div.classList.add("row");
	div.classList.add("list-item");
	div.classList.add("my-2");

	div.innerHTML = `<div class="col-5">
                            <input type="text" class="form-control item-name" />
                         </div>
                        <div class="col">
                            <input type="text" class="form-control item-quantity" />
                        </div>
                        <div class="col">
                            <input type="text" class="form-control item-rate" />
                    	</div>`;

	itemList.appendChild(div);
});

removeBtn.addEventListener("click", (e) => {
	e.preventDefault();
	itemList.removeChild(itemList.lastElementChild);
});
