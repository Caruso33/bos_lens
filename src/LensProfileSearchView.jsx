State.init({});

// const SelectionButton = styled.button`
//   border-radius: 15px;
//   background: white;
//   padding: 5px;
// `;

const ProfileName = styled.h1`
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
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
`;

function renderProfile() {
  return !props.profile ? (
    <div>Profile is missing!</div>
  ) : (
    <>
      <ContainerDiv>
        <ImageContainer>
          <img src={props.profile.picture.original.url} width={100} />
        </ImageContainer>
        <ProfileName>{props.profile.name}</ProfileName>
        <p>@{props.profile.handle}</p>
        <p>{props.profile.bio}</p>
        <div>
          <SelectionButton onClick={() => props.onSelection("follow")}>
            {props.profile.isFollowedByMe ? "Unfollow" : "Follow"}
          </SelectionButton>
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
