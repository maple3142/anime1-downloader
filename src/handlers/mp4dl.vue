<template>
	<div id="outer">
		<div id="inner">
			<div>
				<progress :max="total" :value="loaded"></progress>{{percent}}%
			</div>
			<div>
				{{loadedMB}} MB/{{totalMB}} MB
			</div>
			<div v-if="fileurl">
				<a :href="fileurl" :download="vid+'.mp4'">點此下載</a>
			</div>
		</div>
	</div>
</template>
<script>
import { xhrDownload, download } from '../utils'

export default {
	props: {
		url: {
			type: String,
			required: true
		},
		vid: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			loaded: 0,
			total: 0,
			fileurl: null
		}
	},
	computed: {
		loadedMB() {
			return (this.loaded / 1024 / 1024).toFixed(2)
		},
		totalMB() {
			return (this.total / 1024 / 1024).toFixed(2)
		},
		percent() {
			return (this.loaded / this.total * 100).toFixed(2)
		}
	},
	created() {
		xhrDownload({
			url: this.url,
			progcb: e => {
				this.loaded = e.loaded
				this.total = e.total
			},
			loadcb: r => {
				this.fileurl = URL.createObjectURL(r)
				download(this.fileurl, this.vid + '.mp4')
				document.title = '下載完成!'
				this.loaded = this.total
			}
		})
	}
}
</script>
<style scoped>
#outer {
	width: 100%;
	height: 100vh;
	text-align: center;
}
#inner {
	position: relative;
	top: 50%;
	transform: translateY(-50%);
}
</style>
