State.init({});

const Box = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  box-sizing: border-box;
  text-align: center;
  margin-left: 1rem;
`;

const PostBox = styled.div`
  width: 100%;
  border: 1px solid gray;
  margin-bottom: 1rem;
  padding: 2rem 5px;
`;

const ImgPlaceholder = styled.div`
  width: 80px;
  height: 80px;
`;

const PostContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 1rem;
`;

const PostDate = styled.p`
  align-self: flex-end;
`;

const PostDescription = styled.h3`
  align-self: flex-start;
`;
const PostContent = styled.p`
  align-self: flex-start;
`;

const SelectedProfileBox = styled.div`
  flex-direction: left;
  align-items: center;
  margin-right: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid gray;
`;

const SubHeading = styled.h2`
  margin-top: 20px;
  text-align: center;
  font-size: 18px;
`;

function renderPosts() {
  return (
    <>
      <SelectedProfileBox>
        <SubHeading>{props.selectedProfile.profile.name} Posts</SubHeading>
      </SelectedProfileBox>
      <Box>
        {!props.posts || props.posts.length === 0 ? (
          <div>No posts so far.</div>
        ) : (
          props.posts.map((post) => {
            const metadata = post?.metadata;
            const createdAt = new Date(post?.createdAt);

            return (
              <PostBox class="p-3">
                {metadata?.media?.length > 0 &&
                  [metadata.media[0]].map((media) => {
                    const mimeType = media?.original?.mimeType;

                    let url = media?.original?.url;
                    if (url.startsWith("ipfs://")) {
                      url = url.replace("ipfs://", "https://ipfs.io/ipfs/");
                    }

                    return mimeType === "video/mp4" ? (
                      <iframe
                        src={media?.original?.url}
                        width="100%"
                        height="100%"
                      />
                    ) : mimeType?.startsWith("image") ? (
                      <img src={url} width={80} />
                    ) : null;
                  })}

                <PostContentWrapper>
                  <PostDate>{createdAt.toDateString()}</PostDate>

                  <PostDescription>{metadata?.description}</PostDescription>

                  <PostContent>{metadata?.content}</PostContent>
                </PostContentWrapper>
              </PostBox>
            );
          })
        )}
      </Box>
    </>
  );
}

console.log("LensProfilePostsView, props: ", props, " state: ", state);

return <div>{renderPosts()}</div>;
