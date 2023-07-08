State.init({})

const Box = styled.div`
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  text-align: center;
  margin: 1rem;
`

const ProfileBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ImgPlaceholder = styled.div`
  width: 80px;
  height: 80px;
`

function renderPosts() {
  return !props.posts ? (
    <div>Posts are missing!</div>
  ) : (
    <Box>
      {props.posts.map((post) => {
        const metadata = post?.metadata
        const createdAt = new Date(post?.createdAt)

        return (
          <ProfileBox class="p-3">
            {metadata?.media?.map((media) => {
              const mimeType = media?.original?.mimeType

              const url = media?.original?.url

              return mimeType === "video/mp4" ? (
                <iframe src={media?.original?.url} width="100%" height="100%" />
              ) : mimeType?.startsWith("image") ? (
                <img
                  src={
                    url.startsWith("ipfs://")
                      ? url.replace("ipfs://", "https://ipfs.io/ipfs/")
                      : url
                  }
                  width={80}
                />
              ) : null
            })}
            <p>{createdAt.toDateString()}</p>

            <h1>{metadata?.name}</h1>
            <p>{metadata?.description}</p>

            <p>{metadata?.content}</p>
          </ProfileBox>
        )
      })}
    </Box>
  )
}

console.log("LensProfilePostsView, props: ", props, " state: ", state)

return <div>{renderPosts()}</div>
