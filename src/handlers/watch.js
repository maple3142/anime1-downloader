import hlsmsg from '../hlsmsg'

export default () =>
	setTimeout(() => {
		const url = jwplayer('player').getPlaylistItem().file
		if (url.endsWith('.m3u8')) {
			hlsmsg(url)
		} else {
			location.href = url
		}
	}, 500)
