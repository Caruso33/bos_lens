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
  margin-right: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid gray;
  background: linear-gradient(
    to bottom,
    rgb(139, 92, 246) 25%,
    transparent 25%
  );
  border-radius: 20px;
`;

const ImgPlaceholder = styled.div`
  width: 80px;
  height: 80px;
  background-image: url("https://cdn.stamp.fyi/avatar/eth:6d21d1544a4c303a3a407b9756071386955b76a3b091fded5731ca049604994a?s=80");
`;

const ProfileHandle = styled.p`
  word-break: break-all;
`;

const SubHeading = styled.h2`
  text-align: left;
  font-size: 18px;
`;

const SelectedProfileBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  border-bottom: 1px solid gray;
`;

function renderFollowers() {
  return (
    <>
      <SelectedProfileBox>
        <SubHeading>
          @{props.selectedProfile.profile.handle} followers:
        </SubHeading>
      </SelectedProfileBox>
      <br />
      <Box>
        {!props.followers || props.followers.length === 0 ? (
          <div>No Followers so far.</div>
        ) : (
          props.followers.map((follower) => {
            const profile = follower?.wallet?.defaultProfile;

            console.log("props: ", props);

            return (
              <ProfileBox class="p-3">
                {profile?.picture?.original?.url ? (
                  <img
                    src={
                      !!profile.picture
                        ? profile.picture.original.url.replace(
                            "ipfs://",
                            "https://ipfs.io/ipfs/"
                          )
                        : ""
                    }
                    width={80}
                  />
                ) : (
                  <ImgPlaceholder />
                )}
                <ProfileHandle>@{profile?.handle}</ProfileHandle>

                <div>
                  <div>
                    Followers
                    {profile.stats.totalFollowers}
                  </div>
                  <div>
                    Comments
                    {profile.stats.totalComments}
                  </div>
                  <div>
                    Posts
                    {profile.stats.totalPosts}
                  </div>
                </div>
              </ProfileBox>
            );
          })
        )}
      </Box>
    </>
  );
}

console.log("LensProfileFollowerView, props: ", props, " state: ", state);

return <div>{renderFollowers()}</div>;
