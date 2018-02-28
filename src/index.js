import pic from './handlers/pic'
import ts from './handlers/ts'
import mp4 from './handlers/mp4'
import torrent from './handlers/torrent'
import other from './handlers/other'
const loc = location
if (loc.hostname === 'p.anime1.me' && loc.pathname === '/pic.php') pic()
else if (loc.hostname === 'p.anime1.me' && loc.pathname === '/ts.php') ts()
else if (loc.hostname === 'p.anime1.me' && loc.pathname === '/mp4.php') mp4()
else if (loc.hostname === 'torrent.anime1.me') torrent()
else other()
