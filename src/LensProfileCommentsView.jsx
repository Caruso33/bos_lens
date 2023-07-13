State.init({});

const Box = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  box-sizing: border-box;
  text-align: center;
  margin-left: 1rem;
`;

const CommentBox = styled.div`
  width: 100%;
  border: 1px solid gray;
  margin-bottom: 1rem;
  padding: 2rem 5px;
`;

const ImgPlaceholder = styled.div`
  width: 80px;
  height: 80px;
`;

const CommentPostWrapper = styled.div``;

const CommentContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 1rem;
`;

const CommentDate = styled.p`
  align-self: flex-end;
`;

const CommentDescription = styled.h3`
  align-self: flex-start;
`;
const CommentContent = styled.p`
  align-self: flex-start;
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

function renderComments() {
  return (
    <>
      <SelectedProfileBox>
        <SubHeading>
          @{props.selectedProfile.profile.handle} comments:
        </SubHeading>
      </SelectedProfileBox>
      <br />
      <Box>
        {!props.comments || props.comments.length === 0 ? (
          <div>No Comments so far.</div>
        ) : (
          props.comments.map((comment) => {
            const metadata = comment?.metadata;
            const createdAt = new Date(comment?.createdAt);

            return (
              <CommentBox class="p-3">
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

                <CommentPostWrapper>
                  <Widget
                    src={`${props.DEV_USER}/widget/LensProfilePostsView`}
                    props={{ posts: [comment.mainPost] }}
                  />
                </CommentPostWrapper>

                <CommentContentWrapper>
                  <CommentDate>{createdAt.toDateString()}</CommentDate>

                  <CommentDescription>
                    <Markdown text={metadata?.description} />
                  </CommentDescription>

                  <CommentContent>
                    <Markdown text={metadata?.content} />
                  </CommentContent>
                </CommentContentWrapper>
              </CommentBox>
            );
          })
        )}
      </Box>
    </>
  );
}

console.log("LensProfileCommentsView, props: ", props, " state: ", state);

return <div>{renderComments()}</div>;
