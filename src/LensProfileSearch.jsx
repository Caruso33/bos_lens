const DEV_USER = props.testnet ? "caruso33.testnet" : "gr8h.testnet";
// https://near.org/{DEV_USER}/widget/LensProfileSearch

const initState = {
  term: props.terms ?? "",
  profiles: props.profile ?? [],
  sdk: null,
  selectedProfile: { profile: null, selection: "" },
  followers: props.followers ?? [],
  posts: props.posts ?? [],
  comments: props.comments ?? [],
};

State.init(initState);

// Init
if (state.account === undefined) {
  console.log("eth_requestAccounts");

  const accounts = Ethers.send("eth_requestAccounts", []);

  if (accounts.length) {
    State.update({ account: accounts[0] });

    state.sdk.authenticateLens(
      state.account,
      () => Ethers.provider().getSigner(),
      isFollowedByMe
    );
  }
}

const computeResults = (term) => {
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

const handleFollow = (profileId, isFollowedByMe) => {
  if (isFollowedByMe) {
    state.sdk.unfollowProfile(profileId).then((payload) => {
      console.log("isFollowedByMe", payload.body.errors);

      if (payload.body.errors.length) {
        payload.body.errors.forEach((error) => {
          console.log("isFollowedByMe: ", error.message);
        });
      } else {
        console.log("isFollowedByMe", payload);
      }
    });
  } else {
    state.sdk.followProfile(profileId).then((payload) => {
      console.log("isFollowedByMe", payload.body.errors);

      if (payload.body.errors.length) {
        payload.body.errors.forEach((error) => {
          console.log("isFollowedByMe: ", error.message);
        });
      } else {
        console.log("isFollowedByMe", payload);
      }
    });
  }
};

const ContentWrapper = styled.div`
  display: flex;
`;
const LeftPanelWrapper = styled.div`
  max-width: 20vw;
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

return (
  <>
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
          console.log("result", result.isFollowedByMe);
          return (
            <Widget
              src={`${DEV_USER}/widget/LensProfileSearchView`}
              props={{
                profile: result,
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
            props={{ followers: state.followers }}
          />
        ) : state.selectedProfile?.selection === "posts" ? (
          <Widget
            src={`${DEV_USER}/widget/LensProfilePostsView`}
            props={{ posts: state.posts }}
          />
        ) : state.selectedProfile?.selection === "comments" ? (
          <Widget
            src={`${DEV_USER}/widget/LensProfileCommentsView`}
            props={{ comments: state.comments, DEV_USER: DEV_USER }}
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
