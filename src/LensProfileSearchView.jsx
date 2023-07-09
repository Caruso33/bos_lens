State.init({});

const SelectionButton = styled.button`
  border-radius: 15px;
  background: white;
  padding: 5px;
`;

function renderProfile() {
  console.log("onSelection", props.onSelection);

  return !props.profile ? (
    <div>Profile is missing!</div>
  ) : (
    <>
      <div class="container border p-3 m-3">
        <img src={props.profile.picture.original.url} width={100} />
        <h1>{props.profile.name}</h1>
        <p>@{props.profile.handle}</p>
        <p>{props.profile.bio}</p>
        <div>
          <SelectionButton onClick={() => props.onSelection("follow")}>
            {props.profile.isFollowedByMe ? "Unfollow" : "Follow"}
          </SelectionButton>
          <br />
          <SelectionButton onClick={() => props.onSelection("followers")}>
            Followers
            {props.profile.stats.totalFollowers}
          </SelectionButton>

          <SelectionButton onClick={() => props.onSelection("comments")}>
            Comments
            {props.profile.stats.totalComments}
          </SelectionButton>

          <SelectionButton onClick={() => props.onSelection("posts")}>
            Posts
            {props.profile.stats.totalPosts}
          </SelectionButton>
        </div>
      </div>
    </>
  );
}

console.log("LensProfileSearchView, props: ", props, " state: ", state);

return <div>{renderProfile()}</div>;
