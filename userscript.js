// ==UserScript==
// @name        Anime1.me 下載器
// @namespace   https://blog.maple3142.net/
// @description 下載Anime1.me網站上的動漫
// @version     0.4
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

'use strict';

function download(url, filename) {
	//觸發下載
	const a = document.createElement('a');
	a.href = url;
	if (filename) a.download = filename;
	document.body.appendChild(a);
	a.click();
	return a;
}
function parseQuery(str) {
	return Object.assign(...str.replace('?', '').split('&').map(part => part.split('=')).map(ar => ({ [ar[0]]: ar[1] })));
}

function pic () {
	//如果是普通下載頁面
	//取得資料
	const video = jwplayer().getPlaylist()[0]; //目前使用jwplayer
	if (!video) return;
	const sources = video.sources;
	const title = video.title;
	const videomap = Object.assign(...sources.map(src => ({ [src.label]: src.file }))); //Object.assign({'HD': 'hd video url'},{'SD': 'sd video url'},something...)

	//詢問要下載的畫質
	const askmsg = `輸入要下載的畫質名稱:(${sources.map(src => src.label).join(',')})`;
	const type = prompt(askmsg);
	//如果畫質存在
	if (type in videomap) {
		download(videomap[type], `${title}.mp4`);
	}
}

const query = parseQuery(location.search);
function ts () {
	//不支援下載
	const m3u8 = `https://video.anime1.top/${query.vid}/list.m3u8`;
	const msg = `抱歉!由於這種影片是由多個影片所組成的，目前還無法直接下載\n不過可以複製下方的網址然後使用vlc之類支援網路串流的播放器來使用`;
	prompt(msg, m3u8);
}

const query$1 = parseQuery(location.search);
function mp4 () {
	//特殊，因為需要Referer header才能得到影片檔
	if (!confirm('這類需要特殊下載方法，要保持此頁面開啟直到下載完成\n是否繼續?')) return;
	//初始化下載器元素
	$(document.body).append(`<div id="pbox" style="position: absolute;top: 0px;left: 0px;width: 500px;height: 500px;background-color: white;"></div>`);
	//渲染函數
	function update(loaded, total) {
		const percent = parseInt(loaded / total * 100);
		$('#pbox').empty().append($('<div>').append($('<progress>').attr('max', total).attr('value', loaded)).append(`${percent}%`)).append($('<div>').text(`${loaded / 1024 / 1024} MB/${total / 1024 / 1024} MB`));
		document.title = `${percent}%`;
	}
	//利用ajax去抓取並轉換成blob網址然後觸發下載
	const xhr = new XMLHttpRequest();
	xhr.responseType = 'blob';
	let lastupd = Date.now();
	xhr.onprogress = e => {
		if (!e.lengthComputable) return;
		if (Date.now() - lastupd > 3000) {
			update(e.loaded, e.total);
			lastupd = Date.now();
		}
	};
	xhr.onload = e => {
		const fileurl = URL.createObjectURL(xhr.response);
		const a = download(fileurl, `${query$1.vid}.mp4`);
		$('#pbox').empty().append($(a).text('點擊此連結以儲存檔案'));
		document.title = '下載完成!';
	};
	const url = $('video').attr('src');
	xhr.open('GET', url);
	xhr.send();
}

function torrent () {
	const _continue = prompt('以下是影片的磁力連結，若想在瀏覽器中撥放請按確定，按下取消會停止播放影片', torrentId);
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
	const $articles = $('article');
	for (let art of $articles) {
		const $title = $(art).find('.entry-title');
		const url = $(art).find('iframe').attr('src');
		if (!url) continue; //如果沒有影片
		$title.append($('<button>').addClass('search-submit').text('下載').click(e => window.open(url, '_blank')));
	}
}

(function ($) {
	const loc = location;
	if (loc.hostname === 'p.anime1.me' && loc.pathname === '/pic.php') pic();else if (loc.hostname === 'p.anime1.me' && loc.pathname === '/ts.php') ts();else if (loc.hostname === 'p.anime1.me' && loc.pathname === '/mp4.php') mp4();else if (loc.hostname === 'torrent.anime1.me') torrent();else other();
})(jQuery);
