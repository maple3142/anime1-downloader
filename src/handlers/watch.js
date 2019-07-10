import hlsmsg from '../hlsmsg'

export default () => setTimeout(() => (location.href = jwplayer('player').getPlaylistItem().file), 500)
