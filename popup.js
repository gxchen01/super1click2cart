

/*
 * Javascript is a event based, single-thread simple language,
 * there is not any APIs like sleep().
 *
 * This is an awkward way to simulate *sleep()* feature,
 * just stupidly consuming CPU with empty `for` loop...
 *
 */
function sleep (sleepTime) {
	for (var start = Date.now(); Date.now() - start <= sleepTime;) {
		// do nothing...
	}
}

function sleepRandom (average, variance) {
	sleep(average + Math.random() * variance);
}

function addOneCombination2Cart (argument) {
	chrome.tabs.executeScript(null, {code: "add_item_2_cart(null);"});

	sleep(2000);

	chrome.tabs.executeScript(null, {
		code: "console.log('closing cart info page'); document.getElementById('J_CartInfo').getElementsByTagName('a')[0].click()"
	});

}

function tbAddOneCombination2Cart_New (argument) {
	chrome.tabs.executeScript(null, {code: "tbSelSize();"});
	sleepRandom(1000, 500);

	chrome.tabs.executeScript(null, {code: "tbSelColor();"});
	sleepRandom(1000, 500);

	chrome.tabs.executeScript(null, {code: "tbPrepareNextRun();"});
	sleepRandom(1000, 500);

	chrome.tabs.executeScript(null, {code: "tbAdd2Cart();"});
	sleepRandom(2000, 800);

	chrome.tabs.executeScript(null, {
		code: "console.log('closing cart info page'); document.getElementById('J_CartInfo').getElementsByTagName('a')[0].click()"
	});
}


/*
 * we first try to load URLs from localStorage, which is saved/updated in options page;
 * if that is not available, then try to import html text input
 *
 */
var urls_text = "";
var urls_array = new Array();
var cur_idx = 0;
//var default_url = "http://detail.1688.com/offer/38673134735.html";
var default_url = "http://gxchen.net";

/* test urls:
http://detail.1688.com/offer/38335009518.html
http://detail.1688.com/offer/38745908918.html
http://detail.1688.com/offer/38747780081.html
*/

function string2Array (str, delimiter) {
	console.log('before conv: ' + str);

	if (!str) {
		return null;
	}

	var _array = str.split(delimiter);
	console.log("after conv: " + _array);

	return _array;
}

var KEY_URLS_STRING = 'string-item-urls';
function loadURLsFromLocalStorage (argument) {
	var str_urls = localStorage[KEY_URLS_STRING];

	if (!str_urls) {
		console.log('no urls found. Pls add URLs in options page first');
		urls_array[0] = default_url;
	} else {
		console.log('loadURLsFromLocalStorage() -->  str urls from localStorage: ' + str_urls);
		urls_array = string2Array(str_urls, '\n');
	}

	return;
}

function importURLsFromTextInput (argument) {
	// load url from tag textarea
	urls_text = document.getElementById('item-urls').value;
	if (!urls_text) {
		urls_array[0] = default_url;
	} else {
		urls_array = urls_text.split('\n');
	}

	console.log("import all urls: " + urls_array);
	return;
}

function getNextURL () {

	// if (urls_text == "") {
	// 	importURLsFromTextInput();
	// }

	if (urls_array.length <= 0) {
		loadURLsFromLocalStorage();
	}

	if (cur_idx >= urls_array.length) {
		console.log("All urls are processed!!");
		alert("all urls are done!");
		return null;
	}

	var url = urls_array[cur_idx];
	console.log("idx: " + cur_idx + ", url: " + url);
	cur_idx++;

	return url;
}

function openUrlInCurrentTab (url) {
	//chrome.tabs.create({url: "http://www.taobao.com/"});
	chrome.tabs.update({url: url});

	// TO-DO: we should make sure page is fully loaded before any further process.
}

function onOpenUrlBtnClicked (argument) {
	var url = getNextURL();
	if (!url) {
		return;
	}

	openUrlInCurrentTab(url);
}

function injectJsFile(e) {

	console.log("in injectJsFile()");

	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		console.log(tabs[0]);
		document.getElementById('debug_window').innerHTML = "current url: " + tabs[0].url;
	});

	chrome.tabs.executeScript(null, {
		file: "content_script.js"
	});

	//window.close();
}

function tbOneClick2Cart (ele) {

	console.log("loop count: " + g_combination_nums)

	for (var cnt = 0; cnt < g_combination_nums; cnt++) {
		// addOneCombination2Cart(null);
		tbAddOneCombination2Cart_New(null);
		sleepRandom(3000, 1000);
	};

	window.close();
}

function aliAddOneColor2Cart (ele) {

	// 1. select one color
	console.log("call aliSelColor()");
	chrome.tabs.executeScript(null, {code: "aliSelColor();"});
	sleepRandom(3000, 500);

	// 2. sel amount for all sizes, for selected color
	console.log("call aliSelAmountForAllSizes()");
	chrome.tabs.executeScript(null, {code: "aliSelAmountForAllSizes();"});
	sleepRandom(1000, 500);

	// 3. prepare for next run
	console.log("call aliPrepareNextRun()");
	chrome.tabs.executeScript(null, {code: "aliPrepareNextRun();"});
	sleepRandom(1000, 500);

	// 4. add to cart
	//console.log("calling aliAdd2Cart()");
	//chrome.tabs.executeScript(null, {code: "aliAdd2Cart();"});
	//sleepRandom(2000, 800);

	// 5. close cart info page
	//console.log("calling aliCloseCartInfoDiag();");
	//chrome.tabs.executeScript(null, {code: "aliCloseCartInfoDiag();"});
}

function aliOneClick2Cart (ele) {
	console.log("aliOneClick2Cart(), loop count: " + g_combination_nums);
	// g_combination_nums = 2;
	for (var cnt = 0; cnt < g_combination_nums; cnt++) {
		console.log("loop: " + cnt);
		aliAddOneColor2Cart(null);
		sleepRandom(1000, 500);
	};

	// 4. add to cart
	console.log("calling aliAdd2Cart()");
	chrome.tabs.executeScript(null, {code: "aliAdd2Cart();"});
	sleepRandom(2000, 800);

	// 5. close cart info page
	console.log("calling aliCloseCartInfoDiag();");
	chrome.tabs.executeScript(null, {code: "aliCloseCartInfoDiag();"});
}

function load_item_page(url) {
	var xmlhttp = null;

	xmlhttp = new XMLHttpRequest();
	if (xmlhttp != null) {
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState==4) {// 4 = "loaded"
				if (xmlhttp.status==200) {// 200 = "OK"
					document.getElementById('debug_window').innerHTML = xmlhttp.responseText;
				} else {
					alert("Problem retrieving data:" + xmlhttp.status);
				}
			}
		};
		xmlhttp.open("GET", url, true);
		xmlhttp.send(null);
	};
}

document.addEventListener('DOMContentLoaded', function () {
	var btn_initialize = document.getElementById('btn_initialize');
	btn_initialize.addEventListener('click', injectJsFile);

	//var btn_tb2cart = document.getElementById('btn_tb2cart');
	//btn_tb2cart.addEventListener('click', tbOneClick2Cart);

	var btn_ali2cart = document.getElementById('btn_ali2cart');
	btn_ali2cart.addEventListener('click', aliOneClick2Cart);

	var btn_open_url = document.getElementById('btn_open_url');
	btn_open_url.addEventListener('click', onOpenUrlBtnClicked);
});

var g_combination_nums = 0;
chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
	console.log(sender.tab ?
			"from a content script:" + sender.tab.url :
			"from the extension");

	console.log("total_size_nums: " + request.size_nums + ", total_color_nums: " + request.color_nums);

	g_combination_nums = request.size_nums * request.color_nums;

	sendResponse({ret_code: "success"});
});
