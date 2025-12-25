import fs from 'fs/promises'
import crypto from 'crypto'
import readline from 'readline/promises'

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

const alldebridKey = await rl.question('API Key AllDebrid : ')
const tmdbKey = await rl.question('API Key TMDB : ')
const count = Number(await rl.question('Nombre de clés à générer: '))

const outputPath = import.meta.dirname + '/public/config.json'

const keys = []
for (let i = 0; i < count; i++) {
	keys.push(crypto.randomBytes(32).toString('hex'))
}

console.log('\n=== CLÉS GÉNÉRÉES ===\n')
keys.forEach((k, i) => console.log(`Clé ${i + 1}: ${k}`))

await rl.question('\nCopie-les maintenant puis appuie sur Entrée pour les effacer')

console.clear()

rl.close()

const data = JSON.stringify({
	alldebridKey,
	tmdbKey,
})

const variants = {}

for (let i = 0; i < keys.length; i++) {
	const salt = crypto.randomBytes(16)
	const iv = crypto.randomBytes(12)

	const baseKey = Buffer.from(keys[i], 'hex')
	const aesKey = crypto.hkdfSync('sha256', baseKey, salt, Buffer.from('json-encryption'), 32)

	const cipher = crypto.createCipheriv('aes-256-gcm', aesKey, iv)
	const ciphertext = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()])
	const tag = cipher.getAuthTag()

	const payload = Buffer.concat([ciphertext, tag])

	variants['v' + (i + 1)] = {
		salt: salt.toString('hex'),
		iv: iv.toString('hex'),
		payload: payload.toString('hex')
	}
}

await fs.writeFile(outputPath, JSON.stringify({ version: 1, files: variants }, null, '\t'))
console.log('Généré !')
