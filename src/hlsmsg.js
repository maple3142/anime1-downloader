import swal from 'sweetalert2'

const msg = `由於這種影片是線上串流格式的影片，無法透過瀏覽器直接下載<br>但你可以複製下方的網址並使用 ffmpeg 或 vlc 來下載或是 google m3u8 的下載方法`
const url=`https://chrome.google.com/webstore/detail/native-hls-playback/emnphkkblegpebimobpbekeedfgemhof`
const nativehlsplayback = `只是需要播放的話可以安裝<a href="${url}">此插件</a>來播放`
export default m3u8 => {
	swal({
		title: '不支援下載',
		html: `<p>${msg}</p><p>${nativehlsplayback}</p><a href="${m3u8}">${m3u8}</a>`
	})
}
