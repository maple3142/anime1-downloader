import pic from './handlers/pic'
import ts from './handlers/ts'
import mp4 from './handlers/mp4'
import mf from './handlers/mf'
import torrent from './handlers/torrent'
import video from './handlers/video'
import watch from './handlers/watch'
import watchhls from './handlers/watchhls'
import web1anime from './handlers/web1anime'
import other from './handlers/other'
const loc = location
if (loc.hostname === 'p.anime1.me' && loc.pathname === '/pic.php') pic()
else if (loc.hostname === 'p.anime1.me' && loc.pathname === '/ts.php') ts()
else if (loc.hostname === 'p.anime1.me' && loc.pathname === '/mp4.php') mp4()
else if (loc.hostname === 'p.anime1.me' && loc.pathname === '/mf') mf()
else if (loc.hostname === 'torrent.anime1.me') torrent()
else if (loc.hostname === 'video.anime1.me' && loc.pathname === '/video') video()
else if (loc.hostname === 'player.anime1.me' && loc.pathname === '/watch') watch()
else if (loc.hostname === 'player.anime1.me' && loc.pathname === '/watchhls') watchhls()
else if (loc.hostname === 'web.1ani.me') web1anime()
else other()
