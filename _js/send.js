// "Send this recipe" without a server: shows links that open Gmail, Outlook,
// Yahoo or the visitor's own mail app with the address, subject, recipe text
// and a link already filled in.
function sendRecipe(form) {
	var to = form.send_to.value.replace(/\s/g, "");
	var subject = form.subject ? form.subject.value : document.title;
	var end = form.closest("td[background]") || form;

	// Copy everything above the send box into an offscreen div so innerText keeps the line breaks.
	var range = document.createRange();
	range.setStartBefore(document.body.firstChild);
	range.setEndBefore(end);
	var holder = document.createElement("div");
	holder.style.position = "absolute";
	holder.style.left = "-9999px";
	holder.style.width = "500px";
	holder.appendChild(range.cloneContents());
	var items = holder.querySelectorAll("li");
	for (var i = 0; i < items.length; i++) {
		var li = items[i], list = li.parentNode;
		var mark = "- ";
		if (list.nodeName == "OL") mark = (Array.prototype.indexOf.call(list.querySelectorAll(":scope > li"), li) + 1) + ". ";
		li.insertBefore(document.createTextNode(mark), li.firstChild);
	}
	document.body.appendChild(holder);
	var text = holder.innerText.replace(/\n{3,}/g, "\n\n").trim();
	document.body.removeChild(holder);

	var link = location.href.split("#")[0];
	var body = text + "\n\n" + link;
	if (body.length > 6000) body = link; // very long links get cut off by some mail apps

	var e = encodeURIComponent;
	var choices = [
		["Gmail", "https://mail.google.com/mail/?view=cm&fs=1&to=" + e(to) + "&su=" + e(subject) + "&body=" + e(body)],
		["Outlook", "https://outlook.live.com/mail/0/deeplink/compose?to=" + e(to) + "&subject=" + e(subject) + "&body=" + e(body)],
		["Yahoo", "https://compose.mail.yahoo.com/?to=" + e(to) + "&subject=" + e(subject) + "&body=" + e(body)],
		["my mail app", "mailto:" + e(to) + "?subject=" + e(subject) + "&body=" + e(body)]
	];

	var box = form.querySelector(".send-choices");
	if (!box) {
		box = document.createElement("div");
		box.className = "send-choices";
		box.style.fontFamily = "verdana, sans-serif";
		box.style.fontSize = "small";
		box.style.marginTop = "6px";
		form.appendChild(box);
	}
	box.innerHTML = "Open in: ";
	for (var j = 0; j < choices.length; j++) {
		var a = document.createElement("a");
		a.textContent = choices[j][0];
		a.href = choices[j][1];
		if (j < 3) a.target = "_blank";
		if (j) box.appendChild(document.createTextNode(" | "));
		box.appendChild(a);
	}
	return false;
}
