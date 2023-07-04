State.init({
  handle: "",
})

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
`

console.log("props", props)
console.log("state", state)

return (
  <div>
    Your handle:
    <input
      type="text"
      value={state.handle}
      onChange={(e) =>
        State.update({
          handle: e.target.value,
        })
      }
    />
    <button>Create Profile</button>
  </div>
)
