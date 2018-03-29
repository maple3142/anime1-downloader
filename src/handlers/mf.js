import $ from 'jquery'
import { hook } from '../utils'
import swal from 'sweetalert2'

export default function() {
	const restore = hook(XMLHttpRequest.prototype, 'open', ([GET, url]) => {
		restore()
		fetch(url)
			.then(r => r.text())
			.then(ht => {
				const $$ = $(ht)
				let lnk = $$.find('.DownloadButtonAd-startDownload').attr('href')
				if (!lnk) lnk = url
				swal({
					title: '下載連結',
					html: `<a href="${lnk}">${lnk}</a>`
				})
				jwplayer('player').stop()
			})
	})
	load()
}
