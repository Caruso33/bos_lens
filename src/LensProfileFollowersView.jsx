State.init({});

const Box = styled.div`
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  text-align: center;
  margin: 1rem;
`;

const ProfileBox = styled.div`
  width: 10rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border: 1px solid gray;
`;

const ImgPlaceholder = styled.div`
  width: 80px;
  height: 80px;
  background-image: url("https://cdn.stamp.fyi/avatar/eth:0x7bee83e0f1f0e99f11560170568258df61965304?s=80");
`;

const SelectionButton = styled.button`
  border-radius: 15px;
  background: white;
  padding: 5px;
`;

function renderFollowers() {
  return !props.followers ? (
    <div>Followers are missing!</div>
  ) : (
    <>
      <Box>
        {props.followers.map((follower) => {
          const profile = follower?.wallet?.defaultProfile;

          return (
            <ProfileBox class="p-4">
              {profile?.picture?.original?.url ? (
                <img src={profile.picture.original.url} width={80} />
              ) : (
                <ImgPlaceholder />
              )}
              <p>@{profile?.handle}</p>
            </ProfileBox>
          );
        })}
      </Box>
    </>
  );
}

console.log("LensProfileFollowerView, props: ", props, " state: ", state);

return <div>{renderFollowers()}</div>;
