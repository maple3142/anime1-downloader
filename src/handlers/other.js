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
		const url = $(art)
			.find('iframe')
			.attr('src')
		if (!url) continue //如果沒有影片
		$title.append(
			$('<button>')
				.addClass('search-submit')
				.text('下載')
				.click(e => window.open(url, '_blank'))
		)
	}
}
