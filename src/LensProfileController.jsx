const LENS_API_URL = props.testnet
  ? "https://api-mumbai.lens.dev"
  : "https://api.lens.dev";

const DEV_USER = props.testnet ? "gr8h.testnet" : "gr8h.testnet";

State.init({
  authenticated: null,
  account: null,
  isProfileCalled: false,
  profile: null,
  error: "",
  sdk: null,
});

// Get profile by handle
function getProfile() {
  if (isProfileCalled) return;

  State.update({ isProfileCalled: true });

  return props.handle
    ? state.sdk.getProfileByHandle(props.handle).then((result) => {
        if (result.status !== 200) {
          State.update({
            error: `getProfileByHandle result error: ${result.status}`,
          });
          return;
        }

        if (result.body.data.profile) {
          State.update({ profile: result.body.data.profile });
        } else {
          State.update({
            error: `getProfileByHandle No profile found.`,
          });
        }
      })
    : state.sdk
        .getProfileByEthereumAddress(props.ethereumAddress)
        .then((result) => {
          if (result.status !== 200) {
            State.update({
              error: `getProfileByEthereumAddress result error: ${result.status}`,
            });
            return;
          }

          const items = result.body?.data?.profiles?.items;

          if (items.length > 0) {
            getProfileByHandle(items[0].handle);
          } else {
            State.update({
              error: "getProfileByEthereumAddress No profile found.",
            });
          }
        });
}

// Get ethereum account
function getEthereumAccount() {
  if (state.authenticated === null && !state.account) {
    const accounts = Ethers.send("eth_requestAccounts", []);
    if (accounts.length) {
      State.update({ authenticated: true, account: accounts[0] });
    } else {
      State.update({
        authenticated: false,
        error: "getEthereumAccount Not authenticated",
      });
    }
  }
}

// Initialize Lens SDK
function init(sdk) {
  State.update({ sdk: sdk });
  if (state.sdk) {
    getProfile();
    getEthereumAccount();
  }
}

// console.log("props controller", props);
// console.log("state controller", state);

return (
  <>
    <Widget
      src={`${DEV_USER}/widget/LensSDK`}
      props={{
        onLoad: (sdk) => init(sdk),
        onRefresh: (sdk) => State.update({ sdk: sdk }),
        loaded: !!state.sdk,
        testnet: props.testnet ?? false,
      }}
    />

    {state.sdk ? (
      state.isProfileCalled && !state.profile ? (
        <Widget
          src={`${DEV_USER}/widget/LensProfileCreate`}
          props={{
            ...state,
            lensUrl: LENS_API_URL,
          }}
        />
      ) : (
        <Widget
          src={`${DEV_USER}/widget/LensProfileView`}
          props={{
            ...state,
            lensUrl: LENS_API_URL,
          }}
        />
      )
    ) : (
      <div>loading...</div>
    )}
  </>
);
