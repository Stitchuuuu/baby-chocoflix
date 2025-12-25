let loaded = false
let loading = null
let config = {}

async function decryptFile(data, hexKey) {
	const keyBytes = Uint8Array.from(hexKey.match(/.{1,2}/g).map(b => parseInt(b,16)))

	for (const v of Object.values(data.files)) {
		try {
			const salt = Uint8Array.from(v.salt.match(/.{1,2}/g).map(b => parseInt(b,16)))
			const iv = Uint8Array.from(v.iv.match(/.{1,2}/g).map(b => parseInt(b,16)))
			const payload = Uint8Array.from(v.payload.match(/.{1,2}/g).map(b => parseInt(b,16)))

			const baseKey = await crypto.subtle.importKey('raw', keyBytes, 'HKDF', false, ['deriveKey'])

			const aesKey = await crypto.subtle.deriveKey(
				{ name: 'HKDF', hash: 'SHA-256', salt, info: new TextEncoder().encode('json-encryption') },
				baseKey,
				{ name: 'AES-GCM', length: 256 },
				false,
				['decrypt']
			)

			const decrypted = await crypto.subtle.decrypt(
				{ name: 'AES-GCM', iv, tagLength: 128 },
				aesKey,
				payload
			)

			return JSON.parse(new TextDecoder().decode(decrypted))
		} catch {}
	}
	throw new Error('Invalid key')
}


export async function loadConfig(hexKey) {
	return loading = fetch('config.json?t=' + Date.now())
		.then(r => r.json())
		.then(data => {
			return decryptFile(data, hexKey)
		}).then(decryptedData => {
			config = decryptedData
			return config
		}).catch(err => {
			console.error('Could not load config', err)
		}).finally(() => {
			loaded = true
		})
	return decryptFile(data, hexKey)
}

/**
 * @returns {Promise<{ alldebridKey: string, tmdbKey: string }>}
 */
export function getConfig() {
	return loading
}