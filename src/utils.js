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
