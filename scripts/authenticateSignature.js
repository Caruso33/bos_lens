const signMsg = require("./signMessage")

const AUTHENTICATE_MUTATION = `
mutation Authenticate($address: EthereumAddress!, $signature: Signature!) {
    authenticate(request: {address: $address, signature: $signature}) {
        accessToken
        refreshToken
    }
}
`

async function authenticateSignature(ethereumAddress, challenge, signature) {
  if (!signature) {
    signature = signMsg(ethereumAddress, challenge)
  }

  const result = await request(AUTHENTICATE_MUTATION, {
    address: ethereumAddress,
    signature,
  })
  if (result.status !== 200) {
    console.error(`Error: ${result.status}, ${result.body}`)
  }

  const accessToken = payload.body.data.authenticate.accessToken
  const refreshToken = payload.body.data.authenticate.refreshToken

  return {
    accessToken,
    refreshToken,
  }
}

module.exports = authenticateSignature
