import { download, parseQuery } from '../utils'
const query = parseQuery(location.search)
export default function() {
	//特殊，因為需要Referer header才能得到影片檔
	if (!confirm('這類需要特殊下載方法，要保持此頁面開啟直到下載完成\n是否繼續?')) return
	//初始化下載器元素
	$(document.body).append(
		`<div id="pbox" style="position: absolute;top: 0px;left: 0px;width: 500px;height: 500px;background-color: white;"></div>`
	)
	//渲染函數
	function update(loaded, total) {
		const percent = parseInt(loaded / total * 100)
		$('#pbox')
			.empty()
			.append(
				$('<div>')
					.append(
						$('<progress>')
							.attr('max', total)
							.attr('value', loaded)
					)
					.append(`${percent}%`)
			)
			.append($('<div>').text(`${loaded / 1024 / 1024} MB/${total / 1024 / 1024} MB`))
		document.title = `${percent}%`
	}
	//利用ajax去抓取並轉換成blob網址然後觸發下載
	const xhr = new XMLHttpRequest()
	xhr.responseType = 'blob'
	let lastupd = Date.now()
	xhr.onprogress = e => {
		if (!e.lengthComputable) return
		if (Date.now() - lastupd > 3000) {
			update(e.loaded, e.total)
			lastupd = Date.now()
		}
	}
	xhr.onload = e => {
		const fileurl = URL.createObjectURL(xhr.response)
		const a = download(fileurl, `${query.vid}.mp4`)
		$('#pbox')
			.empty()
			.append($(a).text('點擊此連結以儲存檔案'))
		document.title = '下載完成!'
	}
	const url = $('video').attr('src')
	xhr.open('GET', url)
	xhr.send()
}
