const DEV_USER = props.testnet ? "caruso33.testnet" : "gr8h.near"
// https://near.org/{DEV_USER}/widget/LensProfileSearch

State.init({
  term: props.terms ?? "melike.test",
  profiles: props.profile ?? [],
  sdk: null,
  selectedProfile: { profile: null, selection: "" },
  followers: props.followers ?? [],
  posts: props.posts ?? [],
  comments: props.comments ?? [],
})

const computeResults = (term) => {
  state.sdk.searchProfiles(term).then((payload) => {
    State.update({ profiles: payload.body.data.search.items, term })
  })
}

const getFollowers = (profileId) => {
  state.sdk.getFollowers(profileId).then((payload) => {
    State.update({ followers: payload.body.data.followers.items })
  })
}

const getPosts = (profileId) => {
  state.sdk.getPosts(profileId).then((payload) => {
    State.update({ posts: payload.body.data.publications.items })
  })
}

const getComments = (profileId) => {
  state.sdk.getComments(profileId).then((payload) => {
    State.update({ comments: payload.body.data.publications.items })
  })
}

const ContentWrapper = styled.div`
  display: flex;
`
const LeftPanelWrapper = styled.div`
  max-width: 20vw;
  min-width: 20rem;
`
const RightPanelWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  text-align: center;
  margin: 1rem;
`

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
          return (
            <Widget
              src={`${DEV_USER}/widget/LensProfileSearchView`}
              props={{
                profile: result,
                onSelection: (selection) => {
                  State.update({
                    selectedProfile: { profile: result, selection },
                  })
                  if (selection === "followers") getFollowers(result.profileId)
                  if (selection === "posts") getPosts(result.profileId)
                  if (selection === "comments") getPosts(result.profileId)
                },
              }}
            />
          )
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
            props={{ posts: state.posts }}
          />
        ) : (
          <div>
            {state.term && state.profiles?.length === 0
              ? "Get started by searching"
              : "Nothing Selected"}
          </div>
        )}
      </RightPanelWrapper>
    </ContentWrapper>
  </>
)
