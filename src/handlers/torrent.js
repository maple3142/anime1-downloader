export default function() {
	const _continue = prompt('以下是影片的磁力連結，若想在瀏覽器中撥放請按確定，按下取消會停止播放影片', torrentId)
	if (!_continue) {
		client.destroy()
		document.documentElement.innerHTML = ''
	}
}
