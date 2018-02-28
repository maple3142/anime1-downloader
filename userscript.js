// ==UserScript==
// @name        Anime1.me 下載器
// @namespace   https://blog.maple3142.net/
// @description 下載Anime1.me網站上的動漫
// @version     0.5
// @author      maple3142
// @match       https://anime1.me/*
// @match       https://p.anime1.me/pic.php*
// @match       https://p.anime1.me/ts.php*
// @match       https://p.anime1.me/mp4.php*
// @match       https://torrent.anime1.me/*.html
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @noframes
// @grant       none
// ==/UserScript==

(function ($) {
'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;

function download(url, filename) {
	//觸發下載
	var a = document.createElement('a');
	a.href = url;
	if (filename) a.download = filename;
	document.body.appendChild(a);
	a.click();
	return a;
}
function parseQuery(str) {
	return Object.assign.apply(Object, str.replace('?', '').split('&').map(function (part) {
		return part.split('=');
	}).map(function (ar) {
		var _ref;

		return _ref = {}, _ref[ar[0]] = ar[1], _ref;
	}));
}

function pic () {
	//如果是普通下載頁面
	//取得資料
	var video = jwplayer().getPlaylist()[0]; //目前使用jwplayer
	if (!video) return;
	var sources = video.sources;
	var title = video.title;
	var videomap = Object.assign.apply(Object, sources.map(function (src) {
		var _ref;

		return _ref = {}, _ref[src.label] = src.file, _ref;
	})); //Object.assign({'HD': 'hd video url'},{'SD': 'sd video url'},something...)

	//詢問要下載的畫質
	var askmsg = '\u8F38\u5165\u8981\u4E0B\u8F09\u7684\u756B\u8CEA\u540D\u7A31:(' + sources.map(function (src) {
		return src.label;
	}).join(',') + ')';
	var type = prompt(askmsg);
	//如果畫質存在
	if (type in videomap) {
		download(videomap[type], title + '.mp4');
	}
}

var query = parseQuery(location.search);
function ts () {
	//不支援下載
	var m3u8 = 'https://video.anime1.top/' + query.vid + '/list.m3u8';
	var msg = '\u62B1\u6B49!\u7531\u65BC\u9019\u7A2E\u5F71\u7247\u662F\u7531\u591A\u500B\u5F71\u7247\u6240\u7D44\u6210\u7684\uFF0C\u76EE\u524D\u9084\u7121\u6CD5\u76F4\u63A5\u4E0B\u8F09\n\u4E0D\u904E\u53EF\u4EE5\u8907\u88FD\u4E0B\u65B9\u7684\u7DB2\u5740\u7136\u5F8C\u4F7F\u7528vlc\u4E4B\u985E\u652F\u63F4\u7DB2\u8DEF\u4E32\u6D41\u7684\u64AD\u653E\u5668\u4F86\u4F7F\u7528';
	prompt(msg, m3u8);
}

var query$1 = parseQuery(location.search);
function mp4 () {
	//特殊，因為需要Referer header才能得到影片檔
	if (!confirm('這類需要特殊下載方法，要保持此頁面開啟直到下載完成\n是否繼續?')) return;
	//初始化下載器元素
	$(document.body).append('<div id="pbox" style="position: absolute;top: 0px;left: 0px;width: 500px;height: 500px;background-color: white;"></div>');
	//渲染函數
	function update(loaded, total) {
		var percent = parseInt(loaded / total * 100);
		$('#pbox').empty().append($('<div>').append($('<progress>').attr('max', total).attr('value', loaded)).append(percent + '%')).append($('<div>').text(loaded / 1024 / 1024 + ' MB/' + total / 1024 / 1024 + ' MB'));
		document.title = percent + '%';
	}
	//利用ajax去抓取並轉換成blob網址然後觸發下載
	var xhr = new XMLHttpRequest();
	xhr.responseType = 'blob';
	var lastupd = Date.now();
	xhr.onprogress = function (e) {
		if (!e.lengthComputable) return;
		if (Date.now() - lastupd > 3000) {
			update(e.loaded, e.total);
			lastupd = Date.now();
		}
	};
	xhr.onload = function (e) {
		var fileurl = URL.createObjectURL(xhr.response);
		var a = download(fileurl, query$1.vid + '.mp4');
		$('#pbox').empty().append($(a).text('點擊此連結以儲存檔案'));
		document.title = '下載完成!';
	};
	var url = $('video').attr('src');
	xhr.open('GET', url);
	xhr.send();
}

function torrent () {
	var _continue = prompt('以下是影片的磁力連結，若想在瀏覽器中撥放請按確定，按下取消會停止播放影片', torrentId);
	if (!_continue) {
		client.destroy();
		document.documentElement.innerHTML = '';
	}
}

function other () {
	//其他頁面
	if ($('.acpwd-pass').length) {
		//如果需要密碼就自動登入
		$('.acpwd-pass').get(0).value = 'anime1.me'; //目前的密碼(2017-12-03T14:15:37.823Z)
		$('.acpwd-submit').get(0).click();
		return;
	}
	//找到每個影片
	var $articles = $('article');

	var _loop = function _loop() {
		if (_isArray) {
			if (_i >= _iterator.length) return 'break';
			_ref = _iterator[_i++];
		} else {
			_i = _iterator.next();
			if (_i.done) return 'break';
			_ref = _i.value;
		}

		var art = _ref;

		var $title = $(art).find('.entry-title');
		var url = $(art).find('iframe').attr('src');
		if (!url) return 'continue'; //如果沒有影片
		$title.append($('<button>').addClass('search-submit').text('下載').click(function (e) {
			return window.open(url, '_blank');
		}));
	};

	_loop2: for (var _iterator = $articles, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
		var _ref;

		var _ret = _loop();

		switch (_ret) {
			case 'break':
				break _loop2;

			case 'continue':
				continue;}
	}
}

var loc = location;
if (loc.hostname === 'p.anime1.me' && loc.pathname === '/pic.php') pic();else if (loc.hostname === 'p.anime1.me' && loc.pathname === '/ts.php') ts();else if (loc.hostname === 'p.anime1.me' && loc.pathname === '/mp4.php') mp4();else if (loc.hostname === 'torrent.anime1.me') torrent();else other();

}($));
