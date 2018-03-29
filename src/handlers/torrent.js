import swal from 'sweetalert2'

export default function() {
	swal({
		title: '不支援下載',
		html: `<p>以下是影片的磁力連結，若想在瀏覽器中播放請按確定，按下取消會停止播放影片</p><a href="${torrentId}">${torrentId}</a>`
	})
	if (!_continue) {
		client.destroy()
		document.documentElement.innerHTML = ''
	}
}
