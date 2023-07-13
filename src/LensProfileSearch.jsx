// Globals
const ENV = props.testnet ? "testnet" : "near";
const DEV_USER = props.origin ? `${props.origin}.${ENV}` : `gr8h.${ENV}`;

const initState = {
  term: props.terms ?? "",
  profiles: props.profile ?? [],
  sdk: null,
  selectedProfile: { profile: null, selection: "" },
  followers: props.followers ?? [],
  posts: props.posts ?? [],
  comments: props.comments ?? [],
  isConnected: false,
  profile: null,
};

State.init(initState);

const ALLOWED_NETWORKS = {
  testnet: {
    id: 80001,
    hex: "0x13881",
  },
  mainnet: {
    id: 137,
    hex: "0x89",
  },
};

// Styles
const ContentWrapper = styled.div`
  display: flex;
`;
const LeftPanelWrapper = styled.div`
  max-width: 25vw;
  min-width: 20rem;
`;
const RightPanelWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  text-align: center;
  margin: 1rem;
`;

const NoContentWrapper = styled.div`
  margin: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: right;
  align-items: right;
  text-align: right;
  text-align: right;
  display: flex;
  justify-content: flex-end;
  border: apx solid #e3e6ec;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #1c1f2a;
`;

const Heading = styled.h3`
  color: #8f73ff;
`;

// Init & Login
if (state.account === undefined) {
  const accounts = Ethers.send("eth_requestAccounts", []);
  if (accounts.length) {
    State.update({ account: accounts[0] });
    console.log("account", state.account);
    let provider = Ethers.provider();
    if (!!provider) {
      provider.getNetwork().then((network) => {
        if (network.chainId != getAllowedNetwork().id) {
          State.update({ isConnected: false });
          switchNetwork();
        } else {
          State.update({ isConnected: true });
        }
      });
    }
  }
}

if (state.isConnected && !state.sdk.authenticated && props.requireLogin) {
  state.sdk.authenticateLens(
    state.account,
    () => Ethers.provider().getSigner(),
    () => {
      console.log("authenticated");
    }
  );
}

if (!!state.sdk && !state.profile && state.account) {
  state.sdk.getProfileByEthereumAddress(state.account).then((payload) => {
    let items = payload.body.data.profiles.items;
    State.update({ profile: items[0] });
  });
}

function signInWithLens() {
  state.sdk.authenticateLens(
    state.account,
    () => Ethers.provider().getSigner(),
    () => {
      console.log("authenticated");
    }
  );
}

function switchNetwork() {
  try {
    Ethers.send("wallet_switchEthereumChain", [
      { chainId: getAllowedNetwork().hex },
    ]).then((data) => {
      State.update({ isConnected: true });
    });
  } catch (err) {}
}

function getAllowedNetwork() {
  return props.testnet ? ALLOWED_NETWORKS.testnet : ALLOWED_NETWORKS.mainnet;
}

// Logic
const computeResults = (term) => {
  State.update({ term });
  state.sdk.searchProfiles(term).then((payload) => {
    State.update({ profiles: payload.body.data.search.items, term });
  });
};

const getFollowers = (profileId) => {
  state.sdk.getFollowers(profileId).then((payload) => {
    State.update({ followers: payload.body.data.followers.items });
  });
};

const getPosts = (profileId) => {
  state.sdk.getPosts(profileId).then((payload) => {
    State.update({ posts: payload.body.data.publications.items });
  });
};

const getComments = (profileId) => {
  state.sdk.getComments(profileId).then((payload) => {
    State.update({ comments: payload.body.data.publications.items });
  });
};

function followProfile(profileId) {
  state.sdk.followProfile(profileId).then((payload) => {
    if (payload.body.errors.length) {
      payload.body.errors.forEach((error) => {
        console.log("followProfile.error: ", error.message);
      });
    }
    computeResults(state.term);
  });
}

function unfollowProfile(profileId) {
  state.sdk.unfollowProfile(profileId).then((payload) => {
    if (payload.body.errors.length) {
      payload.body.errors.forEach((error) => {
        console.log("unfollowProfile.error: ", error.message);
      });
    }
    computeResults(state.term);
  });
}

const handleFollow = (profileId, isFollowedByMe) => {
  if (isFollowedByMe) {
    unfollowProfile(profileId);
  } else {
    followProfile(profileId);
  }
};

return (
  <>
    <Container>
      <Heading>
        {state.sdk.authenticated
          ? `Welcome @${state.profile?.handle}`
          : "Please Sign-in"}
      </Heading>

      {!state.sdk.authenticated && state.isConnected && !props.requireLogin ? (
        <button
          class="btn swap-button-enabled swap-button-text p-2 btn-outline-primary"
          onClick={signInWithLens}
        >
          Sign-in with Lens
        </button>
      ) : (
        ""
      )}
      <ButtonContainer>
        <Web3Connect
          className="swap-button-enabled swap-button-text p-2"
          connectLabel="Connect with wallet"
        />
      </ButtonContainer>
    </Container>
    <Widget
      src={`${DEV_USER}/widget/LensSDK`}
      props={{
        onLoad: (sdk) => State.update({ sdk: sdk }),
        onRefresh: (sdk) => State.update({ sdk: sdk }),
        loaded: !!state.sdk,
        testnet: props.testnet ?? false,
      }}
    />
    <div class="container border p-3">
      <input
        type="text"
        onChange={(e) => computeResults(e.target.value)}
        placeholder="Search"
      />
    </div>

    <ContentWrapper>
      <LeftPanelWrapper>
        {state.profiles.map((result) => {
          return (
            <Widget
              src={`${DEV_USER}/widget/LensProfileSearchView`}
              props={{
                profile: result,
                selectedProfile: state.selectedProfile,
                isAuthenticated: state.sdk.authenticated,
                onSelection: (selection) => {
                  State.update({
                    selectedProfile: {
                      profile: result,
                      selection,
                      followers: [],
                      posts: [],
                      comments: [],
                    },
                  });

                  if (selection === "followers") getFollowers(result.profileId);
                  if (selection === "posts") getPosts(result.profileId);
                  if (selection === "comments") getComments(result.profileId);
                  if (selection === "follow")
                    handleFollow(result.profileId, result.isFollowedByMe);
                },
              }}
            />
          );
        })}
      </LeftPanelWrapper>

      <RightPanelWrapper>
        {state.selectedProfile?.selection === "followers" ? (
          <Widget
            src={`${DEV_USER}/widget/LensProfileFollowersView`}
            props={{
              followers: state.followers,
              selectedProfile: state.selectedProfile,
            }}
          />
        ) : state.selectedProfile?.selection === "posts" ? (
          <Widget
            src={`${DEV_USER}/widget/LensProfilePostsView`}
            props={{
              posts: state.posts,
              selectedProfile: state.selectedProfile,
            }}
          />
        ) : state.selectedProfile?.selection === "comments" ? (
          <Widget
            src={`${DEV_USER}/widget/LensProfileCommentsView`}
            props={{
              comments: state.comments,
              DEV_USER: DEV_USER,
              selectedProfile: state.selectedProfile,
            }}
          />
        ) : (
          <NoContentWrapper>
            {!state.term ? "Get started by searching" : "Nothing Selected"}
          </NoContentWrapper>
        )}
      </RightPanelWrapper>
    </ContentWrapper>
  </>
);
