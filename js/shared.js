function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}

function setCookie(name, value, days) {
    var d = new Date;
    d.setTime(d.getTime() + 24*60*60*1000*days);
    document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}

function deleteCookie(name) { setCookie(name, '', -1); }

function loadScript(url, callback)
{
	// Only if not already loaded
	var list = document.getElementsByTagName('script');
	var i = list.length, flag = false;
	while (i--) {
		if (list[i].src === window.location.protocol + '//' + window.location.hostname + url) {
			flag = true;
			break;
		}
	}
	if(!flag) {
	    // Adding the script tag to the head
	    var head = document.head;
	    var script = document.createElement('script');
	    script.type = 'text/javascript';
	    script.src = url;

	    // Then bind the event to the callback function.
	    // There are several events for cross browser compatibility.
	    script.onreadystatechange = callback;
	    script.onload = callback;

	    // Fire the loading
	    head.appendChild(script);
	} else {
		callback();
	}
}

function randomIntFromInterval(min,max) // min and max included
{
    return Math.floor(Math.random()*(max-min+1)+min);
}