import hlsmsg from '../hlsmsg'

export default () => setTimeout(() => hlsmsg(jwplayer('player').getPlaylistItem().file), 500)
