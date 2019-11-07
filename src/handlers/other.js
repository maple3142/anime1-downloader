import $ from 'jquery'
export default function() {
	// other pages
	if ($('.acpwd-pass').length) {
		// automatically enter password if needed
		$('.acpwd-pass').get(0).value = 'anime1.me' // current password (2017-12-03T14:15:37.823Z)
		$('.acpwd-submit')
			.get(0)
			.click()
		return
	}
	// find each videos in articles
	const $articles = $('article')
	for (const art of $articles) {
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
	// handle load vid btns
	const loadvidBtns = $('.loadvideo')
	for (const btn of loadvidBtns) {
		const url = $(btn)
			.data('src')
			.replace('?autoplay=1', '')
		$(btn).after(
			$('<button>')
				.addClass('search-submit')
				.css('margin-left', '1em')
				.text('下載')
				.click(e => window.open(url, '_blank'))
		)
	}
}
