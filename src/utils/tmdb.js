import { getConfig } from './config'

const DEFAULT_TMDB_HEADERS = {
	accept: 'application/json',
}

async function getHeaders() {
	const config = await getConfig()
	return {
		...DEFAULT_TMDB_HEADERS,
		authorization: 'Bearer ' + config.tmdbKey
	}
}

export async function fetchEpisodes(id, season) {
	const options = {
		method: 'GET',
		headers: await getHeaders(),
	}
	const url = `https://api.themoviedb.org/3/tv/${id}/season/${season || 1}`
	return fetch(url + '?' + new URLSearchParams({
		query: 'pluribus',
		include_adult: 'false',
		language: 'fr-FR',
	}).toString(), options)
		.then(res => res.json())
		.then(res => {
			const episodes = []
			if (res && res.episodes) {
				episodes.push(...res.episodes.map(ep => ({
					name: ep.name,
					overview: ep.overview,
					runtime: ep.runtime,
					number: ep.episode_number,
					image: `https://image.tmdb.org/t/p/w780${ep.still_path}`,
				})))
			}
			return episodes
		})
		.catch(console.error)
}

export async function fetchTV({ query, year, id } = {}) {
	const options = {
		method: 'GET',
		headers: await getHeaders(),
	}

	const params = {
		include_adult: 'false',
		language: 'fr-FR',
	}
	if (query) params.query = query
	if (year) params.year = year
	const req = !id ? 
	fetch(
		'https://api.themoviedb.org/3/search/tv?' + new URLSearchParams(params), options
	).then(res => res.json()).then(res => res.results[0]) 
		: 
	fetch('https://api.themoviedb.org/3/tv/?' + new URLSearchParams({
		language: 'fr-FR',
	}), options).then(res => res.json())

	return req.then(result => {
		if (result && result.id) {
			return {
				id: result.id,
				title: result.name,
				year: new Date(result.first_air_date).getFullYear().toString(),
				background: 'https://image.tmdb.org/t/p/w780' + result.backdrop_path,
			}
		}
		return null
	}).catch(err => console.error(err))
}