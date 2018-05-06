import $ from 'jquery'
export default function() {
	const src = $('source').attr('src')
	location.href = src
}
