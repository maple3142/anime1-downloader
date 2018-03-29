// ==UserScript==
// @name        Anime1.me 下載器
// @namespace   https://blog.maple3142.net/
// @description 下載Anime1.me網站上的動漫
// @version     0.8.0
// @author      maple3142
// @match       https://anime1.me/*
// @match       https://p.anime1.me/pic.php*
// @match       https://p.anime1.me/ts.php*
// @match       https://p.anime1.me/mp4.php*
// @match       https://p.anime1.me/mf?id=*
// @match       https://torrent.anime1.me/*.html
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @require     https://unpkg.com/vue@2.5.16/dist/vue.runtime.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/7.18.0/sweetalert2.all.min.js
// @noframes
// @grant       none
// ==/UserScript==

(function (swal,$,Vue) {
'use strict';

swal = swal && swal.hasOwnProperty('default') ? swal['default'] : swal;
$ = $ && $.hasOwnProperty('default') ? $['default'] : $;
Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;

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
function xhrDownload({ url, progcb, loadcb, proginterval = 3000 }) {
	const xhr = new XMLHttpRequest();
	xhr.responseType = 'blob';
	let lastupd = Date.now();
	xhr.onprogress = e => {
		if (!e.lengthComputable) return;
		if (Date.now() - lastupd > proginterval) {
			progcb(e);
			lastupd = Date.now();
		}
	};
	xhr.onload = e => loadcb(xhr.response);
	xhr.open('GET', url);
	xhr.send();
	return xhr;
}
function hook(obj, name, cb) {
	const orig = obj[name];
	obj[name] = function (...args) {
		cb(args);
		orig.apply(this, args);
	};
	return () => obj[name] = orig;
}

function pic () {
	//如果是普通下載頁面
	//取得資料
	const video = jwplayer().getPlaylist()[0]; //目前使用jwplayer
	if (!video) return;
	const sources = video.sources;
	const title = video.title;
	//Object.assign({'HD': 'hd video url'},{'SD': 'sd video url'},something...)
	const videomap = Object.assign(...sources.map(src => ({ [src.label]: src.file })));

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
	const msg = `由於這種影片是由多個影片所組成的，目前還無法直接下載<br>不過可以複製下方的網址並使用 ffmpeg 或 vlc 來下載`;
	swal({
		title: '不支援下載',
		html: `<p>${msg}</p><a href="${m3u8}">${m3u8}</a>`
	});
}

(function () {
	if (typeof document !== 'undefined') {
		var head = document.head || document.getElementsByTagName('head')[0],
		    style = document.createElement('style'),
		    css = " #outer[data-v-e2bc17e8] { width: 100%; height: 100vh; text-align: center; } #inner[data-v-e2bc17e8] { position: relative; top: 50%; transform: translateY(-50%); } ";style.type = 'text/css';if (style.styleSheet) {
			style.styleSheet.cssText = css;
		} else {
			style.appendChild(document.createTextNode(css));
		}head.appendChild(style);
	}
})();

var Mp4dl = { render: function () {
		var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { attrs: { "id": "outer" } }, [_c('div', { attrs: { "id": "inner" } }, [_c('div', [_c('progress', { attrs: { "max": _vm.total }, domProps: { "value": _vm.loaded } }), _vm._v(_vm._s(_vm.percent) + "% ")]), _vm._v(" "), _c('div', [_vm._v(" " + _vm._s(_vm.loadedMB) + " MB/" + _vm._s(_vm.totalMB) + " MB ")]), _vm._v(" "), _vm.fileurl ? _c('div', [_c('a', { attrs: { "href": _vm.fileurl, "download": _vm.vid + '.mp4' } }, [_vm._v("點此下載")])]) : _vm._e()])]);
	}, staticRenderFns: [], _scopeId: 'data-v-e2bc17e8',
	props: {
		url: {
			type: String,
			required: true
		},
		vid: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			loaded: 0,
			total: 0,
			fileurl: null
		};
	},
	computed: {
		loadedMB() {
			return (this.loaded / 1024 / 1024).toFixed(2);
		},
		totalMB() {
			return (this.total / 1024 / 1024).toFixed(2);
		},
		percent() {
			return (this.loaded / this.total * 100).toFixed(2);
		}
	},
	created() {
		xhrDownload({
			url: this.url,
			progcb: e => {
				this.loaded = e.loaded;
				this.total = e.total;
			},
			loadcb: r => {
				this.fileurl = URL.createObjectURL(r);
				download(this.fileurl, this.vid + '.mp4');
				document.title = '下載完成!';
				this.loaded = this.total;
			}
		});
	}
};

const query$1 = parseQuery(location.search);
function mp4 () {
	//特殊，因為需要Referer header才能得到影片檔
	if (!confirm('這類需要特殊下載方法，要保持此頁面開啟直到下載完成\n是否繼續?')) return;
	const url = $('video>source').attr('src');
	$('body *').remove();
	const div = document.createElement('div');
	$(document.body).append(div);
	new Vue({
		render: h => h(Mp4dl, {
			attrs: { url: url }
		})
	}).$mount(div);
}

function mf () {
	const restore = hook(XMLHttpRequest.prototype, 'open', ([GET, url]) => {
		restore();
		jwplayer('player').stop();
		fetch(url).then(r => r.text()).then(ht => {
			const $$ = $(ht);
			const lnk = $$.find('.DownloadButtonAd-startDownload').attr('href');
			swal({
				title: '下載連結',
				html: `<a href="${lnk}">${lnk}</a>`
			});
		});
	});
	load();
}

function torrent () {
	swal({
		title: '不支援下載',
		html: `<p>以下是影片的磁力連結，若想在瀏覽器中播放請按確定，按下取消會停止播放影片</p><a href="${torrentId}">${torrentId}</a>`
	});
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

const loc = location;
if (loc.hostname === 'p.anime1.me' && loc.pathname === '/pic.php') pic();else if (loc.hostname === 'p.anime1.me' && loc.pathname === '/ts.php') ts();else if (loc.hostname === 'p.anime1.me' && loc.pathname === '/mp4.php') mp4();else if (loc.hostname === 'p.anime1.me' && loc.pathname === '/mf') mf();else if (loc.hostname === 'torrent.anime1.me') torrent();else other();

}(Sweetalert2,$,Vue));
