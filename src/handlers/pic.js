import { download } from '../utils'
export default function() {
	//如果是普通下載頁面
	//取得資料
	const video = jwplayer().getPlaylist()[0] //目前使用jwplayer
	if (!video) return
	const sources = video.sources
	const title = video.title
	//Object.assign({'HD': 'hd video url'},{'SD': 'sd video url'},something...)
	const videomap = Object.assign(...sources.map(src => ({ [src.label]: src.file })))

	//詢問要下載的畫質
	const askmsg = `輸入要下載的畫質名稱:(${sources.map(src => src.label).join(',')})`
	const type = prompt(askmsg)
	//如果畫質存在
	if (type in videomap) {
		if (GM_info.downloadMode === 'browser' && GM_download) {
			GM_download({
				url: videomap[type],
				name: `${title}.mp4`,
				onerror: () => download(videomap[type], `${title}.mp4`),
				saveAs: true
			})
		} else download(videomap[type], `${title}.mp4`)
	}
}
