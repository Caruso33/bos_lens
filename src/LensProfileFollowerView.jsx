State.init({})

const Box = styled.div`
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  text-align: center;
  margin: 1rem;
`

const ProfileBox = styled.div`
  width: 10rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ImgPlaceholder = styled.div`
  width: 80px;
  height: 80px;
`

function renderFollowers() {
  return !props.followers ? (
    <div>Followers are missing!</div>
  ) : (
    <Box>
      {props.followers.map((follower) => {
        const profile = follower?.wallet?.defaultProfile

        return (
          <ProfileBox class="p-3">
            {profile?.picture?.original?.url ? (
              <img src={profile.picture.original.url} width={80} />
            ) : (
              <ImgPlaceholder />
            )}
            <h1>{profile?.name}</h1>
            <p>@{profile?.handle}</p>
          </ProfileBox>
        )
      })}
    </Box>
  )
}

console.log("LensProfileFollowerView, props: ", props, " state: ", state)

return <div>{renderFollowers()}</div>
