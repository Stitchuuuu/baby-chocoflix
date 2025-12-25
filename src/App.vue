<template>
	<section
		class="hero"
		:style="{
			backgroundImage: 'url(' + bg + ')',
		}"
	>
		<h1>{{ title }}</h1>
		<div class="meta">{{ year }}</div>
		<!--div class="buttons">
			<button class="btn play">▶ Lecture</button>
			<button class="btn info">ℹ Infos</button>
		</div-->
	</section>

	<section class="content">
		<div class="tabs">
			<div class="tab active">Épisodes</div>
		</div>
		<div v-if="loading">Chargement...</div>
		<template v-else>
			<a
				v-for="ep of fullEpisodes"
				:href="ep.links.public || '#'"
				class="episode"
				@click="openChoiceInMobile($event, ep)"
			>
				<div
					class="episode__thumb"
					:style="{
						backgroundImage: `url(${ep.image})`
					}"
				>

				</div>
				<div class="episode__desc">
					<div>{{ ep.number }}. {{ ep.name }}</div>
					<div class="duration">{{ ep.runtime }} min</div>
					<div class="ep-desc">{{ ep.overview }}</div>
				</div>
			</a>
		</template>
		<mobile-selector
			v-model="isOpen"
			:options="openOptions"
			@select="selectCurrentEpisodeAction"
		/>
	</section>	
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { fetchAlldebrid } from './utils/alldebrid'
import { fetchTV, fetchEpisodes } from './utils/tmdb'
import { loadConfig } from './utils/config'

import MobileSelector from './components/MobileSelector.vue'

const isOpen = ref(false)
let currentEpisode = reactive({})
const title = ref('')
const year = ref('')
const bg = ref('')

function getMobileOperatingSystem() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera

    if (/android/i.test(userAgent)) {
      return { android: true }
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return { iOS: true }
    }
		return {}
}

function openChoiceInMobile(event, ep) {
	const os = getMobileOperatingSystem()
	if (!os.android && !os.iOS) return
	event.preventDefault()
	Object.assign(currentEpisode, ep)
	isOpen.value = true
}

function selectCurrentEpisodeAction(opt) {
	console.log(opt)
}

const openOptions = computed(() => {
	if (!currentEpisode.name) return []
	return [
		{ label: 'Ouvrir avec VLC', value: currentEpisode.links.vlc, action: 'url' },
		{ label: 'Copier', value: currentEpisode.links.public, action: 'copy' },
		// { label: 'Copier lien VLC', value: currentEpisode.links.vlc, action: 'copy' },
		{ label: 'Ouvrir', value: currentEpisode.links.public, action: 'url' }
	]
})

const fullEpisodes = computed(() => {
	return episodes.map(ep => {
		const link = links.find(v => {
			const reg = new RegExp('S[0-9]{1,2}E0?' + ep.number + '[^0-9]', 'i' )
			return v.name.match(reg)
		}) || {}
		return {
			...ep,
			links: {
				vlc: link.vlcIOS,
				public: link.public,
			}
		}
	})
})

const episodes = reactive([])
const links = reactive([])

const loading = computed(() => episodes.length === 0 || links.length === 0)

const params = new URLSearchParams(location.search)
if (params.get('pw')) {
	loadConfig(params.get('pw')).then(() => {
		if (!params.get('config')) return
		fetch('configs/' + params.get('config') + '.json')
			.then(res => res.json())
			.then(config => {
				fetchTV({
					query: config.tmdbQuery
				}).then(tvInfo => {
					title.value = tvInfo.title
					year.value = tvInfo.year
					bg.value = tvInfo.background
					return fetchEpisodes(tvInfo.id, 1)
				}).then(_episodes => {
					episodes.push(..._episodes)
				})
				fetchAlldebrid(config.magnets, { debrid: true }).then(urls => {
					links.push(...urls)
				})
			})
			.catch(console.error)
	})
}

</script>