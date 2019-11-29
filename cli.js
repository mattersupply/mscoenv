#!/usr/bin/env node

const fs = require('fs')
const crypto = require('crypto')

const ALGORITHM = process.env.MSCOENV_ALGORITHM || 'aes-256-cbc'
const HASH = process.env.MSCOENV_HASH || 'sha256'
const SECRET_KEY = process.env.MSCOENV_SECRET_KEY
const ENV_PATH = '.env'

const DEFAULT_ENVIRONMENT = 'development'

const key = crypto
  .createHash(HASH)
  .update(String(SECRET_KEY))
  .digest('hex')
  .substr(0, 32)

const createEnvDir = () => {
  if (!fs.existsSync(ENV_PATH)) {
    fs.mkdirSync(ENV_PATH)
    console.info(`${ENV_PATH} folder created`)
  }

}
  
const encrypt = (environment = DEFAULT_ENVIRONMENT) => {
  createEnvDir()

  const input = fs.createReadStream(`.env.${environment}`)
  const output = fs.createWriteStream(`${ENV_PATH}/${environment}`)
  const iv = Buffer.from(key, 'hex')

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

  input.pipe(cipher).pipe(output)

  output.on('finish', function() {
    console.log('Encryption completed successfully!')
  })
}

const decrypt = (environment = DEFAULT_ENVIRONMENT) => {
  createEnvDir()

  const input = fs.createReadStream(`${ENV_PATH}/${environment}`)
  const output = fs.createWriteStream(`.env.${environment}`)

  const iv = Buffer.from(key, 'hex')
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)

  input.pipe(decipher).pipe(output)

  output.on('finish', function() {
    console.log('Decryption completed successfully!')
  })
}

const setup = (environment = DEFAULT_ENVIRONMENT) => {
  
  createEnvDir()
  const existsEncryptedEnv = fs.existsSync(`${ENV_PATH}/${environment}`)
  const existsDecryptedEnv = fs.existsSync(`${ENV_PATH}.${environment}`)

  if (existsEncryptedEnv && !existsDecryptedEnv) {
    decrypt(environment)
  } else if (!existsEncryptedEnv) {
    console.warn(`Environment ${environment} not found`)
  }
}

const main = command => {
  const help = `
Help:\n
- To process the images, type
  $ node env.js encrypt [environment]

- To get the current rules type
  $ node env.js decrypt [environment]
  `

  switch (command) {
    case 'encrypt': {
      encrypt(process.argv[3])
      break
    }
    case 'decrypt': {
      decrypt(process.argv[3])
      break
    }
    case 'setup': {
      setup(process.argv[3])
      break
    }
    case 'help': {
      console.info(help)
      break
    }
    default:
      console.error(`\nUnknown command: ${command}.\n\n`)
      console.info(help)
  }
}

const command = process.argv[2]

main(command)
