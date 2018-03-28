<template>
	<div id="pbox">
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
				download(this.fileurl, query$1.vid + '.mp4')
				document.title = '下載完成!'
			}
		})
	}
}
</script>
<style scoped>
#pbox {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	margin: auto;
	width: 500px;
	height: 100px;
}
</style>
