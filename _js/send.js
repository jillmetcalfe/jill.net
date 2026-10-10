// "Send this recipe" without a server: opens the visitor's own mail app
// with the address, subject, recipe text and a link already filled in.
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
	document.body.appendChild(holder);
	var text = holder.innerText.replace(/\n{3,}/g, "\n\n").trim();
	document.body.removeChild(holder);

	var link = location.href.split("#")[0];
	var body = text + "\n\n" + link;
	if (body.length > 6000) body = link; // very long mailto links get cut off by some mail apps

	location.href = "mailto:" + encodeURIComponent(to) +
		"?subject=" + encodeURIComponent(subject) +
		"&body=" + encodeURIComponent(body);
	return false;
}
