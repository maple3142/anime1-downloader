import $ from 'jquery'
import { hook } from '../utils'
import swal from 'sweetalert2'

export default function() {
	const restore = hook(XMLHttpRequest.prototype, 'open', ([GET, url]) => {
		restore()
		jwplayer('player').stop()
		fetch(url)
			.then(r => r.text())
			.then(ht => {
				const $$ = $(ht)
				const lnk = $$.find('.DownloadButtonAd-startDownload').attr('href')
				swal({
					title: '下載連結',
					html: `<a href="${lnk}">${lnk}</a>`
				})
			})
	})
	load()
}
