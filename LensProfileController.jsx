const LENS_API_URL = props.testnet
  ? "https://api-mumbai.lens.dev"
  : "https://api.lens.dev"

State.init({
  authenticated: null,
  account: null,
  isProfileCalled: false,
  profile: null,
  error: "",
})

function request(query, variables, headers, method) {
  return asyncFetch(LENS_API_URL, {
    method: method ?? "POST",
    headers: headers ?? { "Content-Type": "application/json" },
    body: JSON.stringify({ query: query, variables: variables ?? {} }),
  })
}

// Get profile information by Lens handle
function getProfileByHandle(handle) {
  request(
    `
      query Profile ($handle: Handle!) {
        profile(request: { handle: $handle }) {
          id
          name
          bio
          attributes {
            displayType
            traitType
            key
            value
          }
          followNftAddress
          metadata
          isDefault
          picture {
            ... on NftImage {
              contractAddress
              tokenId
              uri
              verified
            }
            ... on MediaSet {
              original {
                url
                mimeType
              }
            }
            __typename
          }
          handle
          coverPicture {
            ... on NftImage {
              contractAddress
              tokenId
              uri
              verified
            }
            ... on MediaSet {
              original {
                url
                mimeType
              }
            }
            __typename
          }
          ownedBy
          stats {
            totalFollowers
            totalFollowing
            totalPosts
            totalComments
            totalMirrors
            totalPublications
            totalCollects
          }
        }
      }
    `,
    { handle: handle }
  ).then((result) => {
    if (result.status !== 200) {
      State.update({
        error: `getProfileByHandle result error: ${result.status}`,
      })
      return
    }

    if (result.body.data.profile) {
      State.update({ profile: result.body.data.profile })
    } else {
      State.update({
        error: `getProfileByHandle No profile found.`,
      })
    }
  })
}

// Get profile information by Ethereum address
function getProfileByEthereumAddress(ethereumAddress) {
  request(
    `
      query Profiles ($address: [EthereumAddress!]) {
        profiles(request: { ownedBy: $address}) {
          items {
            handle
          }
        }
      }
      `,
    { address: [ethereumAddress] }
  ).then((result) => {
    if (result.status !== 200) {
      State.update({
        error: `getProfileByEthereumAddress result error: ${result.status}`,
      })
      return
    }

    const items = result.body?.data?.profiles?.items

    if (items.length > 0) {
      getProfileByHandle(items[0].handle)
    } else {
      State.update({ error: "getProfileByEthereumAddress No profile found." })
    }
  })
}

function getProfile() {
  if (isProfileCalled) return

  State.update({ isProfileCalled: true })
  return props.handle
    ? getProfileByHandle(props.handle)
    : getProfileByEthereumAddress(props.ethereumAddress)
}

function getEthereumAccount() {
  if (state.authenticated === null && !state.account) {
    const accounts = Ethers.send("eth_requestAccounts", [])
    if (accounts.length) {
      State.update({ authenticated: true, account: accounts[0] })
    } else {
      State.update({
        authenticated: false,
        error: "getEthereumAccount Not authenticated",
      })
    }
  }
}

getProfile()
getEthereumAccount()

console.log("props", props)
console.log("state", state)

return state.isProfileCalled && !state.profile ? (
  <Widget
    src={
      props.testnet
        ? "caruso33.testnet/widget/LensProfileCreate"
        : "leinss.near/widget/LensProfileCreate"
    }
    props={{
      ...state,
      lensUrl: LENS_API_URL,
    }}
  />
) : (
  <Widget
    src={
      props.testnet
        ? "caruso33.testnet/widget/LensProfileView"
        : "leinss.near/widget/LensProfileView"
    }
    props={{
      ...state,
      lensUrl: LENS_API_URL,
    }}
  />
)
