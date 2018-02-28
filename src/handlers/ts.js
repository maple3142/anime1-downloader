import { parseQuery } from '../utils'
const query = parseQuery(location.search)
export default function() {
	//不支援下載
	const m3u8 = `https://video.anime1.top/${query.vid}/list.m3u8`
	const msg = `抱歉!由於這種影片是由多個影片所組成的，目前還無法直接下載\n不過可以複製下方的網址然後使用vlc之類支援網路串流的播放器來使用`
	prompt(msg, m3u8)
}
