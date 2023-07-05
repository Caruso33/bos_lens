State.init({});

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
`;

function renderProfile() {
  return !props.profile ? (
    <div>Profile is missing!</div>
  ) : (
    <>
      <div class="container border border-info p-3">
        <img src={props.profile.picture.original.url} width={100} />
        <h1>{props.profile.name}</h1>
        <p>@{props.profile.handle}</p>
        <p>{props.profile.bio}</p>
        <div>
          <p>
            Followers
            {props.profile.stats.totalFollowers}
          </p>
          <p>
            Comments
            {props.profile.stats.totalComments}
          </p>
          <p>
            Posts
            {props.profile.stats.totalPosts}
          </p>
        </div>
      </div>
    </>
  );
}

console.log("props view", props);
console.log("state view", state);

return <div>{renderProfile()}</div>;
