import $ from 'jquery'
export default function() {
	//其他頁面
	if ($('.acpwd-pass').length) {
		//如果需要密碼就自動登入
		$('.acpwd-pass').get(0).value = 'anime1.me' //目前的密碼(2017-12-03T14:15:37.823Z)
		$('.acpwd-submit')
			.get(0)
			.click()
		return
	}
	//找到每個影片
	const $articles = $('article')
	for (let art of $articles) {
		const $title = $(art).find('.entry-title')
		const iframes = $(art).find('iframe')
		for (let i = 0; i < iframes.length; i++) {
			const ifr = iframes[i]
			const url = $(ifr).attr('src')
			if (!url) continue //如果沒有影片
			let btnText = '下載'
			if (iframes.length > 1) {
				// add number after the text if there are more than 1 video in the article
				btnText += ` #${i + 1}`
			}
			$title.append(
				$('<button>')
					.addClass('search-submit')
					.text(btnText)
					.click(e => window.open(url, '_blank'))
			)
		}
	}
}
