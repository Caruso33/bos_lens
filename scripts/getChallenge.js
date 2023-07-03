// msg = "\nunknown wants you to sign in with your Ethereum account:\n0x4bFC74983D6338D3395A00118546614bB78472c2\n\nSign in with ethereum to lens\n\nURI: unknown\nVersion: 1\nChain ID: 80001\nNonce: 8828f247ef22804b\nIssued At: 2023-07-02T19:11:02.338Z\n "

const request = require("./api")

const GET_CHALLENGE_QUERY = `
query Challenge($address: EthereumAddress!) {
    challenge(request: {address: $address}) {
        text
    }
}
`

async function getChallenge(ethereumAddress) {
  const result = await request(GET_CHALLENGE_QUERY, {
    address: ethereumAddress,
  })

  if (result.status !== 200) {
    console.error(`Error: ${result.status}, ${result.body}`)
  }
  const challenge = result.body?.data?.challenge?.text

  return {
    challenge,
  }
}

module.exports = getChallenge
