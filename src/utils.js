export function download(url, filename) {
	//觸發下載
	const a = document.createElement('a')
	a.href = url
	if (filename) a.download = filename
	document.body.appendChild(a)
	a.click()
	return a
}
export function parseQuery(str) {
	return Object.assign(
		...str
			.replace('?', '')
			.split('&')
			.map(part => part.split('='))
			.map(ar => ({ [ar[0]]: ar[1] }))
	)
}
export function xhrDownload({ url, progcb, loadcb, proginterval = 3000 }) {
	const xhr = new XMLHttpRequest()
	xhr.responseType = 'blob'
	let lastupd = Date.now()
	xhr.onprogress = e => {
		if (!e.lengthComputable) return
		if (Date.now() - lastupd > proginterval) {
			progcb(e)
			lastupd = Date.now()
		}
	}
	xhr.onload = e => loadcb(xhr.response)
	xhr.open('GET', url)
	xhr.send()
	return xhr
}
