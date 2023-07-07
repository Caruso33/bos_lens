const DEV_USER = props.testnet ? "gr8h.testnet" : "gr8h.near";
// https://near.org/{DEV_USER}/widget/LensProfileSearch

State.init({
  profiles: [],
  sdk: null,
});

const computeResults = (term) => {
  state.sdk.searchProfiles(term).then((payload) => {
    State.update({ profiles: payload.body.data.search.items });
  });
};

return (
  <>
    <Widget
      src={`${DEV_USER}/widget/LensSDK`}
      props={{
        onLoad: (sdk) => State.update({ sdk: sdk }),
        onRefresh: (sdk) => State.update({ sdk: sdk }),
        loaded: !!state.sdk,
        testnet: props.testnet ?? false,
      }}
    />

    <div class="container border border-info p-3">
      <input
        type="text"
        onChange={(e) => computeResults(e.target.value)}
        placeholder="Search"
      />
    </div>

    {state.profiles.map((result) => {
      return (
        <Widget
          src={`${DEV_USER}/widget/LensProfileSearchView`}
          props={{
            profile: result,
          }}
        />
      );
    })}
  </>
);
