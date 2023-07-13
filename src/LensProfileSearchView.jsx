State.init({});

const ProfileName = styled.h2`
  word-break: break-all;
`;

const SelectionButton = styled.button`
  margin-top: 1rem;
  border: 0;
  border-radius: 5px;
  padding: 0.3rem;
  width: 100%;
  max-width: 100px;
  font-size: 0.9rem;
  font-weight: bold;
  color: #fff;
  background-color: #7d3cdc;
`;

const ContainerDiv = styled.div`
  border: 1px solid;
  padding: 1rem;
  margin: 1rem;
  border-color: ${(props) => (props.selected ? "#7d3cdc" : "#e3e6ec")};
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  background: linear-gradient(
    to bottom,
    rgb(139, 92, 246) 50%,
    transparent 50%
  );
  border-radius: 20px;
`;

function renderProfile() {
  return !props.profile ? (
    <div>Profile is missing!</div>
  ) : (
    <>
      <ContainerDiv
        selected={
          props.profile.profileId === props.selectedProfile?.profile?.profileId
        }
      >
        <ImageContainer>
          <img
            src={
              !!props.profile.picture
                ? props.profile.picture.original.url.replace(
                    "ipfs://",
                    "https://ipfs.io/ipfs/"
                  )
                : "https://cdn.stamp.fyi/avatar/eth:6d21d1544a4c303a3a407b9756071386955b76a3b091fded5731ca049604994a?s=100"
            }
            width={100}
          />
        </ImageContainer>
        <ProfileName>{props.profile.name}</ProfileName>
        <p>@{props.profile.handle}</p>
        <p>{props.profile.bio}</p>
        <div>
          {props.isAuthenticated ? (
            <SelectionButton onClick={() => props.onSelection("follow")}>
              {props.profile.isFollowedByMe ? "Unfollow" : "Follow"}
            </SelectionButton>
          ) : (
            ""
          )}
        </div>
        <div>
          <SelectionButton onClick={() => props.onSelection("followers")}>
            Followers <br /> {props.profile.stats.totalFollowers}
          </SelectionButton>

          <SelectionButton onClick={() => props.onSelection("comments")}>
            Comments <br /> {props.profile.stats.totalComments}
          </SelectionButton>

          <SelectionButton onClick={() => props.onSelection("posts")}>
            Posts
            <br /> {props.profile.stats.totalPosts}
          </SelectionButton>
        </div>
      </ContainerDiv>
    </>
  );
}

// console.log("LensProfileSearchView, props: ", props, " state: ", state);

return <div>{renderProfile()}</div>;
