import { parseQuery } from '../utils'
import swal from 'sweetalert2'

const query = parseQuery(location.search)
export default function() {
	//不支援下載
	const m3u8 = `https://video.anime1.top/${query.vid}/list.m3u8`
	const msg = `由於這種影片是由多個影片所組成的，目前還無法直接下載<br>不過可以複製下方的網址並使用 ffmpeg 或 vlc 來下載`
	swal({
		title: '不支援下載',
		html: `<p>${msg}</p><a href="${m3u8}">${m3u8}</a>`
	})
}
