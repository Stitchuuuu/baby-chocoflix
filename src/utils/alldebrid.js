import { getConfig } from './config'

async function getHeaders() {
	const config = await getConfig()
	return {
		authorization: 'Bearer ' + config.alldebridKey
	}
}

export async function debridLink(link) {
	const headers = await getHeaders()
	const res = await fetch('https://api.alldebrid.com/v4/link/unlock', {
		method: 'POST',
		headers,
		body: new URLSearchParams({
			link,
		}),
	}).then(res => res.json())
	return res.data.link
}
export async function fetchAlldebrid(magnetIds, { debrid } = {}) {
	const headers = await getHeaders()
	return fetch('https://api.alldebrid.com/v4/magnet/files', {
		headers,
		method: 'POST',
		body: new URLSearchParams(magnetIds.reduce((map, v, idx) => {
			map[`id[${idx}]`] = v
			return map
		}, {}))
	})
		.then(res => res.json())
		.then(async res => {
			const magnets = res.data.magnets
			const files = []
			const links = []
			for (const m of magnets) {
				files.push(...m.files.map(f => ({
					private: f.l,
					name: f.n,
				})))
			}
			if (debrid) {
				for (const f of files) {
					f.public = await debridLink(f.private)
					f.vlcIOS = `vlc-x-callback://x-callback-url/stream?` + new URLSearchParams({
						url: f.public
					})
				}
				links.push(...files)
			}
			return links
		})
		.catch(err => console.error(err))
}