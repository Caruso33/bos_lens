const ethers = require("ethers")

const signer = new ethers.Wallet(process.env.PRIV_KEY)

async function signMessage(msg) {
  const signature = await signer.signMessage(msg)

  console.log("Signer: \t", signer.address)
  console.log("Message: \t", msg)
  console.log("Signature: \t", signature)

  return {
    signer,
    message,
    signature,
  }
}

module.exports = signMessage
