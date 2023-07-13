State.init({});

const Box = styled.div`
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  text-align: left;
  margin-left: 1rem;
`;

const PostBox = styled.div`
  width: 100%;
  border: 1px solid gray;
  margin-bottom: 1rem;
  padding: 2rem 5px;
`;

const ImageWrapper = styled.div`
  width: 50%;
  text-align: center;
  margin: 0 auto;
`;

const ImgPlaceholder = styled.div`
  width: 80px;
  height: 80px;
`;

const PostContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 1rem;
`;

const PostDate = styled.p`
  align-self: flex-end;
`;

const PostDescription = styled.h3``;
const PostContent = styled.p``;

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

function renderPosts() {
  return (
    <>
      <SelectedProfileBox>
        <SubHeading>@{props.selectedProfile.profile.handle} posts:</SubHeading>
      </SelectedProfileBox>
      <br />
      <Box>
        {!props.posts || props.posts.length === 0 ? (
          <div>No posts so far.</div>
        ) : (
          props.posts.map((post) => {
            const metadata = post?.metadata;
            const createdAt = new Date(post?.createdAt);

            return (
              <PostBox class="p-3">
                {metadata?.media?.length > 0 && (
                  <ImageWrapper>
                    {[metadata.media[0]].map((media) => {
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
                        <img src={url} width={"100%"} />
                      ) : null;
                    })}
                  </ImageWrapper>
                )}

                <PostContentWrapper>
                  <PostDate>{createdAt.toDateString()}</PostDate>

                  <PostDescription>
                    <Markdown text={metadata?.description} />
                  </PostDescription>

                  <PostContent>
                    <Markdown text={metadata?.content} />
                  </PostContent>
                </PostContentWrapper>
              </PostBox>
            );
          })
        )}
      </Box>
    </>
  );
}

// console.log("LensProfilePostsView, props: ", props, " state: ", state);

return <div>{renderPosts()}</div>;
