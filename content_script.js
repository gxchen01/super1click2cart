

logd("in impl.js now...");

var g_cnt = 0;

var g_size_idx = 0;
var g_size_nums = 0;

var g_color_idx = 0;
var g_color_nums = 0;

var enable_logd = 1;
function logd (log_str) {
	if (enable_logd) {
		console.log("[DBG] " + log_str);
	}
}

function sleep (sleepTime) {
	for(var start = Date.now(); Date.now() - start <= sleepTime; ) { }
}

/*
 * min <= amount <= max &&
 * amount % 10 == 0
 *
 */
function randomAmount (min, max) {
	var amount = 0;

	amount = Math.random() * (max - min);

	amount = Math.round(amount / 10);
	amount *= 10;

	return (amount + min);
}

/*
 * mainly decide how many size-numbers and color-numbers
 *
 */
function tbInitialize (argument) {
	logd("tbInitialize(), E.");

	var item_options = document.getElementById('J_isku').getElementsByTagName('ul');
	logd(item_options);

	for (var idx = 0; idx < item_options.length; idx++) {
		logd("option " + idx + " : " + item_options[idx]);
		var option = item_options[idx];
		console.log(option);

		if (option.getAttributeNode('data-property').nodeValue == '尺码' ||
			option.getAttributeNode('data-property').nodeValue == '鞋码') {
			g_size_nums = option.getElementsByTagName('a').length;
			logd("option for size, size numbers: " + g_size_nums);
		} else if (option.getAttributeNode('data-property').nodeValue == '颜色分类') {
			g_color_nums = option.getElementsByTagName('a').length;
			logd("option for color, color numbers: " + g_color_nums);
		} else {
			logd("unkonw option type: " + option.getAttributeNode('data-property').nodeValue);
		}
	};

	logd("sending message to extension..");
	chrome.extension.sendRequest({color_nums: g_color_nums, size_nums: g_size_nums}, function (response) {
		console.log(response.ret_code);
	});

	logd("tbInitialize(), X.");
}

// in some item pages, there is a "huopin" button,
// we need to be aware of these pages and click the "huopin" button additionally.
function aliIsLimitedPurchase () {
	if (document.getElementsByClassName('do-limited').length > 0) {
		if (document.getElementsByClassName('do-limited')[0].innerHTML == "入伙拼单") {
			logd("item in huopin status!!");
			return true;
		}
	}

	return false;
}

function aliInitialize (argument) {
	logd("aliInitialize(), E.");

	var color_options = document.getElementsByClassName('mod-detail-purchasing-multiple')[0].getElementsByClassName('unit-detail-spec-operator');
	g_color_nums = color_options.length;
	logd("color option nums: " + color_options.length);

	// g_size_nums is not used in alibaba
	g_size_nums = 1;

	if (aliIsLimitedPurchase()) {
		logd("item in huopin status, click the 'huopin' button to popup the purchasing form");
		document.getElementsByClassName('do-limited')[0].click();
	}

	logd("sending message to extension..");
	chrome.extension.sendRequest({color_nums: g_color_nums, size_nums: g_size_nums}, function (response) {
		console.log(response.ret_code);
	});

	logd("aliInitialize(), X.");
}

function initialize (argument) {
	logd("initialize() E.");

	aliInitialize(null);

	logd("initialize() X.");
}


/*
 * I know it's a ugly way to use different functions
 * for taobao/alibaba/tmall.
 *
 * We should find a better way later
 *
 */

// functions for taobao
function tbSelSize (argument) {
	if (g_color_idx == 0) {
		document.getElementById('J_isku').getElementsByTagName('ul')[0].getElementsByTagName('a')[g_size_idx].click();
	}
}

function tbSelColor (argument) {
	if (g_color_nums == 0) {
		// no color options availabe, we needn't choose any color.
		return;
	}
	document.getElementById('J_isku').getElementsByTagName('ul')[1].getElementsByTagName('a')[g_color_idx].click()
}

function tbSelAmount (argument) {
	// body...
}

function tbAdd2Cart (argument) {
	document.getElementById('J_juValid').getElementsByTagName("a")[1].click();
}

function tbPrepareNextRun (argument) {
	g_cnt += 1;
	g_color_idx += 1;
	if (g_color_idx >= g_color_nums) {
		g_size_idx  += 1;
		g_color_idx  = 0;

		if (g_size_idx >= g_size_nums) {
			g_size_idx = 0;
		};
	};

	logd("next run (size, color) = (" + g_size_idx + ", " + g_color_idx + ")");
}


// functions for alibaba
function aliSelColor (argument) {
	document.getElementsByClassName('mod-detail-purchasing-multiple')[0].getElementsByClassName('unit-detail-spec-operator')[g_color_idx].getElementsByTagName('a')[0].click();
}

function aliSelAmountForAllSizes (argument) {
	var size_tbl = document.getElementsByClassName('mod-detail-purchasing-multiple')[0].getElementsByTagName('tbody')[0];
	var size_tbl_len = size_tbl.getElementsByTagName('tr').length;
	// size_tbl_len = 1;

	for (var idx = 0; idx < size_tbl_len; idx++) {
		// seems we have to click "-/+" button for amount value to taking effect,
		// so first set the value to `dest_amount -1`, then click the "+" button...
		size_tbl.getElementsByClassName('amount-input')[idx].value = randomAmount(20, 100) - 1;
		size_tbl.getElementsByClassName('amount-up')[idx].click();
	}

}

function aliPrepareNextRun (argument) {
	g_color_idx += 1;
	if (g_color_idx >= g_color_nums) {
		g_color_idx = 0;
	}

	logd("next run, color idx: " + g_color_idx);
}

function aliAdd2Cart (argument) {
	document.getElementsByClassName('unit-detail-order-action')[0].getElementsByClassName('do-cart')[0].click();
}

function aliCloseCartInfoDiag (argument) {
	logd("closing cart info page")
	document.getElementsByClassName('unit-detail-cart-view')[0].getElementsByClassName('close-btn')[0].click();

	logd("finally finished for this page!!!");
}


function add_item_2_cart (argument) {
	logd("in add_item_2_cart()...");

	// to-fix: seems not work if there is only one color or size options..

	// select one size
	if (g_color_idx == 0) {
		document.getElementById('J_isku').getElementsByTagName('ul')[0].getElementsByTagName('a')[g_size_idx].click();
	}

	// select one color
	document.getElementById('J_isku').getElementsByTagName('ul')[1].getElementsByTagName('a')[g_color_idx].click()

	// select buying amount here

	//add item to cart
	document.getElementById('J_juValid').getElementsByTagName("a")[1].click()

	// prepare for next item
	g_cnt += 1;
	g_color_idx += 1;
	if (g_color_idx >= g_color_nums) {
		g_size_idx  += 1;
		g_color_idx  = 0;

		if (g_size_idx >= g_size_nums) {
			g_size_idx = 0;
		};
	};

	logd("out add_item_2_cart(), g_cnt = " + g_cnt);
	logd("next (size, color) = (" + g_size_idx + ", " + g_color_idx + ")");
}

initialize(null);

logd("out impl.js now...");

