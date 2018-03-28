import $ from 'jquery'
import Vue from 'vue'
import { download, parseQuery } from '../utils'
import Mp4dl from './mp4dl.vue'

const query = parseQuery(location.search)
export default function() {
	//特殊，因為需要Referer header才能得到影片檔
	if (!confirm('這類需要特殊下載方法，要保持此頁面開啟直到下載完成\n是否繼續?')) return
	const url = $('video>source').attr('src')
	$('body *').remove()
	const div = document.createElement('div')
	$(document.body).append(div)
	new Vue({
		render: h => <Mp4dl url={url}/>
	}).$mount(div)
}
