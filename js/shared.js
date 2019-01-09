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

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function swap(obj){
	var ret = {};
	for(var key in obj){
		ret[obj[key]] = key;
	}
	return ret;
}

function loadScripts(urls, callback) {

	var load_id = Math.floor(new Date().getTime()) + '_' + Math.floor(Math.random()*(99999-11112)+11111);

	window['script_load_'+load_id] = {
		'self' : this,
		'loaded' : 0,
		'total' : urls.length,
		'callback' : callback,
		'counter' : function() {

			var load_data = window['script_load_'+load_id];
			load_data.loaded++;
			if(load_data.loaded >= load_data.total) {
				load_data.callback();
			}
		}.bind(load_id)
	};

	for(var i = 0; i < urls.length; i++) {

		loadScript(urls[i], window['script_load_'+load_id]['counter']);
	}
}

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