State.init({})

const Box = styled.div`
  position: relative;
  max-width: 400px;
  box-sizing: border-box;
  background-color: #181818;
  overflow: hidden;
  border-radius: 15px;
  margin: 0 auto;
  color: #fff;
  text-align: center;
`

function renderProfile() {
  return !props.profile ? (
    <div>Please provide a handle or lens id</div>
  ) : (
    <>
      <h1>{props.profile.name}</h1>
      <p>@{props.profile.handle}</p>
      <p>{props.profile.bio}</p>
      {/* <Box>
        {getConnectionOverlay()}
        <BoxCover style={coverStyles}>
          <BoxProfilePicture>
            <ProfilePicture style={profilePicStyles} />
          </BoxProfilePicture>
        </BoxCover>
        <BoxContent>
          <h1>{state.profile.name}</h1>
          <p>@{state.profile.handle}</p>
          <p>{state.profile.bio}</p>
          <br />
          <BoxStats>
            <h4>
              Followers
              <br />
              {state.profile.stats.totalFollowers}
            </h4>
            <h4>
              Comments
              <br />
              {state.profile.stats.totalComments}
            </h4>
            <h4>
              Posts
              <br />
              {state.profile.stats.totalPosts}
            </h4>
          </BoxStats>
          {!!state.account &&
          !!state.profile &&
          state.account.toLowerCase() != state.profile.ownedBy.toLowerCase()
            ? getFollowButton()
            : ""}
        </BoxContent>
      </Box> */}
    </>
  )
}

console.log("props", props)
console.log("state", state)

return <div>{renderProfile()}</div>
