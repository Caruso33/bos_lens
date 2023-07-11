const { onLoad, onRefresh, loaded, testnet } = props;

const LENS_API_URL = testnet
  ? "https://api-mumbai.lens.dev"
  : "https://api.lens.dev";

let LensSDK = {
  jwt: {
    accessToken: "",
    refreshToken: "",
  },
  authenticated: false,
  request: (query, variables, headers, method) => {
    return asyncFetch(LENS_API_URL, {
      method: method ?? "POST",
      headers: headers ?? {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query,
        variables: variables ?? {},
      }),
    });
  },
  getChallenge: (address) => {
    return LensSDK.request(
      `
        query Challenge ($address: EthereumAddress!) {
            challenge(request: { address: $address}) {
            text
            }
        }
       `,
      {
        address: address,
      }
    );
  },
  authenticateSignature: (address, signature) => {
    return LensSDK.request(
      `
        mutation Authenticate ($address: EthereumAddress!, $signature: Signature!) {
            authenticate(request: {
            address: $address,
            signature: $signature
            }) {
            accessToken
            refreshToken
            }
        }
      `,
      {
        address: address,
        signature: signature,
      }
    );
  },
  authenticateLens: (address, signer, onSuccess) => {
    LensSDK.getChallenge(address).then((payload) => {
      let challenge = payload.body.data.challenge.text;
      const response = signer().signMessage(challenge);

      response.then((signature) => {
        LensSDK.authenticateSignature(address, signature).then((payload) => {
          if (
            payload.status === 200 &&
            !!payload.body.data.authenticate.accessToken
          ) {
            LensSDK.jwt.accessToken =
              payload.body.data.authenticate.accessToken;
            LensSDK.jwt.refreshToken =
              payload.body.data.authenticate.refreshToken;
            LensSDK.authenticated = true;

            if (onSuccess) {
              onSuccess();
            }

            if (onRefresh) {
              onRefresh(LensSDK);
            }
          }
        });
      });
    });
  },
  getFollowers: (profileId) => {
    return LensSDK.request(
      `
      query Followers {
        followers(request: { 
                      profileId: "` +
        profileId +
        `",
                    limit: 20
                   }) {
             items {
            wallet {
              address
              defaultProfile {
                id
                name
                bio
                attributes {
                  displayType
                  traitType
                  key
                  value
                }
                followNftAddress
                  metadata
                isDefault
                handle
                picture {
                  ... on NftImage {
                    contractAddress
                    tokenId
                    uri
                    verified
                  }
                  ... on MediaSet {
                    original {
                      url
                      mimeType
                    }
                  }
                }
                coverPicture {
                  ... on NftImage {
                    contractAddress
                    tokenId
                    uri
                    verified
                  }
                  ... on MediaSet {
                    original {
                      url
                      mimeType
                    }
                  }
                }
                ownedBy
                dispatcher {
                  address
                  canUseRelay
                }
                stats {
                  totalFollowers
                  totalFollowing
                  totalPosts
                  totalComments
                  totalMirrors
                  totalPublications
                  totalCollects
                }
                followModule {
                  ... on FeeFollowModuleSettings {
                    type
                    contractAddress
                    amount {
                      asset {
                        name
                        symbol
                        decimals
                        address
                      }
                      value
                    }
                    recipient
                  }
                  ... on ProfileFollowModuleSettings {
                   type
                  }
                  ... on RevertFollowModuleSettings {
                   type
                  }
                }
              }
            }
            totalAmountOfTimesFollowed
          }
          pageInfo {
            prev
            next
            totalCount
          }
        }
      }
      
      `,
      {
        "Content-Type": "application/json",
        "x-access-token": LensSDK.jwt.accessToken,
      }
    );
  },
  isFollowedByMe: (profileId) => {
    return LensSDK.request(
      `
      query Profile {
        profile(request: { profileId: "` +
        profileId +
        `" }) {isFollowedByMe}}`,
      {},
      {
        "Content-Type": "application/json",
        "x-access-token": LensSDK.jwt.accessToken,
      }
    );
  },
  getProfileByHandle: (handle) => {
    return LensSDK.request(
      `
        query Profile ($handle: Handle!) {
          profile(request: { handle: $handle }) {
            id
            name
            bio
            attributes {
              displayType
              traitType
              key
              value
            }
            followNftAddress
            metadata
            isDefault
            picture {
              ... on NftImage {
                contractAddress
                tokenId
                uri
                verified
              }
              ... on MediaSet {
                original {
                  url
                  mimeType
                }
              }
              __typename
            }
            handle
            coverPicture {
              ... on NftImage {
                contractAddress
                tokenId
                uri
                verified
              }
              ... on MediaSet {
                original {
                  url
                  mimeType
                }
              }
              __typename
            }
            ownedBy
            stats {
              totalFollowers
              totalFollowing
              totalPosts
              totalComments
              totalMirrors
              totalPublications
              totalCollects
            }
          }
    }
  `,
      {
        handle: handle,
      }
    );
  },
  searchProfiles: (query) => {
    return LensSDK.request(
      `
      query Search {
        search(request: {
          query: "` +
        query +
        `",
          type: PROFILE,
          limit: 10
        }) {
          ... on ProfileSearchResult {
            __typename 
            items {
              ... on Profile {
                ...ProfileFields
              }
            }
            pageInfo {
              prev
              totalCount
              next
            }
          }
        }
      }
      
      fragment MediaFields on Media {
        url
        mimeType
      }
      
      fragment ProfileFields on Profile {
        profileId: id,
        name
        bio
        attributes {
          displayType
          traitType
          key
          value
        }
        isFollowedByMe
        isFollowing(who: null)
        followNftAddress
        metadata
        isDefault
        handle
        picture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              ...MediaFields
            }
          }
        }
        coverPicture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              ...MediaFields
            }
          }
        }
        ownedBy
        dispatcher {
          address
        }
        stats {
          totalFollowers
          totalFollowing
          totalPosts
          totalComments
          totalMirrors
          totalPublications
          totalCollects
        }
        followModule {
          ... on FeeFollowModuleSettings {
          type
          amount {
            asset {
              name
              symbol
              decimals
              address
            }
            value
          }
          recipient
          }
          ... on ProfileFollowModuleSettings {
            type
            contractAddress
          }
          ... on RevertFollowModuleSettings {
            type
            contractAddress
          }
          ... on UnknownFollowModuleSettings {
            type
            contractAddress
            followModuleReturnData
          }
        }
      }
  `,
      {},
      {
        "Content-Type": "application/json",
        "x-access-token": LensSDK.jwt.accessToken,
      }
    );
  },
  getProfileByEthereumAddress: (ethereumAddress) => {
    return LensSDK.request(
      `
        query Profiles ($address: [EthereumAddress!]) {
        profiles(request: { ownedBy: $address}) {
          items {
            handle
          }
        }
    }
    `,
      {
        address: [ethereumAddress],
      }
    );
  },
  followProfile: (profileId) => {
    return LensSDK.request(
      `
        mutation ProxyAction {
            proxyAction(request: {
                follow: {
                    freeFollow: {
                        profileId: "` +
        profileId +
        `"
                    }
                }
            })
        }`,
      {},
      {
        "Content-Type": "application/json",
        "x-access-token": LensSDK.jwt.accessToken,
      }
    );
  },
  unfollowProfile: (profileId) => {
    return LensSDK.request(
      `
        mutation Unfollow {
  createUnfollowTypedData(request: { profile: "` +
        profileId +
        `" }) {
    id
    expiresAt
    typedData {
      domain {
        name
        chainId
        version
        verifyingContract
        __typename
      }
      types {
        BurnWithSig {
          name
          type
          __typename
        }
        __typename
      }
      value {
        nonce
        deadline
        tokenId
        __typename
      }
      __typename
    }
    __typename
  }
}`,
      {},
      {
        "Content-Type": "application/json",
        "x-access-token": LensSDK.jwt.accessToken,
      }
    );
  },
  getPosts: (profileId) => {
    return LensSDK.request(
      `
      query Publications {
        publications(request: {
          profileId: "` +
        profileId +
        `",
          publicationTypes: [POST, MIRROR],
          limit: 10
        }) {
          items {
            __typename 
            ... on Post {
              ...PostFields
            }
            ... on Comment {
              ...CommentFields
            }
            ... on Mirror {
              ...MirrorFields
            }
          }
          pageInfo {
            prev
            next
            totalCount
          }
        }
      }
      
      fragment MediaFields on Media {
        url
        mimeType
      }
      
      fragment ProfileFields on Profile {
        id
        name
        bio
        attributes {
           displayType
           traitType
           key
           value
        }
        isFollowedByMe
        isFollowing(who: null)
        followNftAddress
        metadata
        isDefault
        handle
        picture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              ...MediaFields
            }
          }
        }
        coverPicture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              ...MediaFields
            }
          }
        }
        ownedBy
        dispatcher {
          address
        }
        stats {
          totalFollowers
          totalFollowing
          totalPosts
          totalComments
          totalMirrors
          totalPublications
          totalCollects
        }
        followModule {
          ...FollowModuleFields
        }
      }
      
      fragment PublicationStatsFields on PublicationStats { 
        totalAmountOfMirrors
        totalAmountOfCollects
        totalAmountOfComments
        totalUpvotes
        totalDownvotes
      }
      
      fragment MetadataOutputFields on MetadataOutput {
        name
        description
        content
        media {
          original {
            ...MediaFields
          }
        }
        attributes {
          displayType
          traitType
          value
        }
      }
      
      fragment Erc20Fields on Erc20 {
        name
        symbol
        decimals
        address
      }
      
      fragment PostFields on Post {
        id
        profile {
          ...ProfileFields
        }
        stats {
          ...PublicationStatsFields
        }
        metadata {
          ...MetadataOutputFields
        }
        createdAt
        collectModule {
          ...CollectModuleFields
        }
        referenceModule {
          ...ReferenceModuleFields
        }
        appId
        hidden
        reaction(request: null)
        mirrors(by: null)
        hasCollectedByMe
      }
      
      fragment MirrorBaseFields on Mirror {
        id
        profile {
          ...ProfileFields
        }
        stats {
          ...PublicationStatsFields
        }
        metadata {
          ...MetadataOutputFields
        }
        createdAt
        collectModule {
          ...CollectModuleFields
        }
        referenceModule {
          ...ReferenceModuleFields
        }
        appId
        hidden
        reaction(request: null)
        hasCollectedByMe
      }
      
      fragment MirrorFields on Mirror {
        ...MirrorBaseFields
        mirrorOf {
         ... on Post {
            ...PostFields          
         }
         ... on Comment {
            ...CommentFields          
         }
        }
      }
      
      fragment CommentBaseFields on Comment {
        id
        profile {
          ...ProfileFields
        }
        stats {
          ...PublicationStatsFields
        }
        metadata {
          ...MetadataOutputFields
        }
        createdAt
        collectModule {
          ...CollectModuleFields
        }
        referenceModule {
          ...ReferenceModuleFields
        }
        appId
        hidden
        reaction(request: null)
        mirrors(by: null)
        hasCollectedByMe
      }
      
      fragment CommentFields on Comment {
        ...CommentBaseFields
        mainPost {
          ... on Post {
            ...PostFields
          }
          ... on Mirror {
            ...MirrorBaseFields
            mirrorOf {
              ... on Post {
                 ...PostFields          
              }
              ... on Comment {
                 ...CommentMirrorOfFields        
              }
            }
          }
        }
      }
      
      fragment CommentMirrorOfFields on Comment {
        ...CommentBaseFields
        mainPost {
          ... on Post {
            ...PostFields
          }
          ... on Mirror {
             ...MirrorBaseFields
          }
        }
      }
      
      fragment FollowModuleFields on FollowModule {
        ... on FeeFollowModuleSettings {
          type
          amount {
            asset {
              name
              symbol
              decimals
              address
            }
            value
          }
          recipient
        }
        ... on ProfileFollowModuleSettings {
          type
          contractAddress
        }
        ... on RevertFollowModuleSettings {
          type
          contractAddress
        }
        ... on UnknownFollowModuleSettings {
          type
          contractAddress
          followModuleReturnData
        }
      }
      
      fragment CollectModuleFields on CollectModule {
        __typename
        ... on FreeCollectModuleSettings {
          type
          followerOnly
          contractAddress
        }
        ... on FeeCollectModuleSettings {
          type
          amount {
            asset {
              ...Erc20Fields
            }
            value
          }
          recipient
          referralFee
        }
        ... on LimitedFeeCollectModuleSettings {
          type
          collectLimit
          amount {
            asset {
              ...Erc20Fields
            }
            value
          }
          recipient
          referralFee
        }
        ... on LimitedTimedFeeCollectModuleSettings {
          type
          collectLimit
          amount {
            asset {
              ...Erc20Fields
            }
            value
          }
          recipient
          referralFee
          endTimestamp
        }
        ... on RevertCollectModuleSettings {
          type
        }
        ... on TimedFeeCollectModuleSettings {
          type
          amount {
            asset {
              ...Erc20Fields
            }
            value
          }
          recipient
          referralFee
          endTimestamp
        }
        ... on UnknownCollectModuleSettings {
          type
          contractAddress
          collectModuleReturnData
        }
      }
      
      fragment ReferenceModuleFields on ReferenceModule {
        ... on FollowOnlyReferenceModuleSettings {
          type
          contractAddress
        }
        ... on UnknownReferenceModuleSettings {
          type
          contractAddress
          referenceModuleReturnData
        }
        ... on DegreesOfSeparationReferenceModuleSettings {
          type
          contractAddress
          commentsRestricted
          mirrorsRestricted
          degreesOfSeparation
        }
      }
      `,
      {
        "Content-Type": "application/json",
        "x-access-token": LensSDK.jwt.accessToken,
      }
    );
  },
  getComments: (profileId) => {
    return LensSDK.request(
      `
      query Publications {
        publications(request: {
          profileId: "` +
        profileId +
        `",
          publicationTypes: [COMMENT],
          limit: 10
        }) {
          items {
            __typename 
            ... on Post {
              ...PostFields
            }
            ... on Comment {
              ...CommentFields
            }
            ... on Mirror {
              ...MirrorFields
            }
          }
          pageInfo {
            prev
            next
            totalCount
          }
        }
      }
      
      fragment MediaFields on Media {
        url
        mimeType
      }
      
      fragment ProfileFields on Profile {
        id
        name
        bio
        attributes {
           displayType
           traitType
           key
           value
        }
        isFollowedByMe
        isFollowing(who: null)
        followNftAddress
        metadata
        isDefault
        handle
        picture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              ...MediaFields
            }
          }
        }
        coverPicture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              ...MediaFields
            }
          }
        }
        ownedBy
        dispatcher {
          address
        }
        stats {
          totalFollowers
          totalFollowing
          totalPosts
          totalComments
          totalMirrors
          totalPublications
          totalCollects
        }
        followModule {
          ...FollowModuleFields
        }
      }
      
      fragment PublicationStatsFields on PublicationStats { 
        totalAmountOfMirrors
        totalAmountOfCollects
        totalAmountOfComments
        totalUpvotes
        totalDownvotes
      }
      
      fragment MetadataOutputFields on MetadataOutput {
        name
        description
        content
        media {
          original {
            ...MediaFields
          }
        }
        attributes {
          displayType
          traitType
          value
        }
      }
      
      fragment Erc20Fields on Erc20 {
        name
        symbol
        decimals
        address
      }
      
      fragment PostFields on Post {
        id
        profile {
          ...ProfileFields
        }
        stats {
          ...PublicationStatsFields
        }
        metadata {
          ...MetadataOutputFields
        }
        createdAt
        collectModule {
          ...CollectModuleFields
        }
        referenceModule {
          ...ReferenceModuleFields
        }
        appId
        hidden
        reaction(request: null)
        mirrors(by: null)
        hasCollectedByMe
      }
      
      fragment MirrorBaseFields on Mirror {
        id
        profile {
          ...ProfileFields
        }
        stats {
          ...PublicationStatsFields
        }
        metadata {
          ...MetadataOutputFields
        }
        createdAt
        collectModule {
          ...CollectModuleFields
        }
        referenceModule {
          ...ReferenceModuleFields
        }
        appId
        hidden
        reaction(request: null)
        hasCollectedByMe
      }
      
      fragment MirrorFields on Mirror {
        ...MirrorBaseFields
        mirrorOf {
         ... on Post {
            ...PostFields          
         }
         ... on Comment {
            ...CommentFields          
         }
        }
      }
      
      fragment CommentBaseFields on Comment {
        id
        profile {
          ...ProfileFields
        }
        stats {
          ...PublicationStatsFields
        }
        metadata {
          ...MetadataOutputFields
        }
        createdAt
        collectModule {
          ...CollectModuleFields
        }
        referenceModule {
          ...ReferenceModuleFields
        }
        appId
        hidden
        reaction(request: null)
        mirrors(by: null)
        hasCollectedByMe
      }
      
      fragment CommentFields on Comment {
        ...CommentBaseFields
        mainPost {
          ... on Post {
            ...PostFields
          }
          ... on Mirror {
            ...MirrorBaseFields
            mirrorOf {
              ... on Post {
                 ...PostFields          
              }
              ... on Comment {
                 ...CommentMirrorOfFields        
              }
            }
          }
        }
      }
      
      fragment CommentMirrorOfFields on Comment {
        ...CommentBaseFields
        mainPost {
          ... on Post {
            ...PostFields
          }
          ... on Mirror {
             ...MirrorBaseFields
          }
        }
      }
      
      fragment FollowModuleFields on FollowModule {
        ... on FeeFollowModuleSettings {
          type
          amount {
            asset {
              name
              symbol
              decimals
              address
            }
            value
          }
          recipient
        }
        ... on ProfileFollowModuleSettings {
          type
          contractAddress
        }
        ... on RevertFollowModuleSettings {
          type
          contractAddress
        }
        ... on UnknownFollowModuleSettings {
          type
          contractAddress
          followModuleReturnData
        }
      }
      
      fragment CollectModuleFields on CollectModule {
        __typename
        ... on FreeCollectModuleSettings {
          type
          followerOnly
          contractAddress
        }
        ... on FeeCollectModuleSettings {
          type
          amount {
            asset {
              ...Erc20Fields
            }
            value
          }
          recipient
          referralFee
        }
        ... on LimitedFeeCollectModuleSettings {
          type
          collectLimit
          amount {
            asset {
              ...Erc20Fields
            }
            value
          }
          recipient
          referralFee
        }
        ... on LimitedTimedFeeCollectModuleSettings {
          type
          collectLimit
          amount {
            asset {
              ...Erc20Fields
            }
            value
          }
          recipient
          referralFee
          endTimestamp
        }
        ... on RevertCollectModuleSettings {
          type
        }
        ... on TimedFeeCollectModuleSettings {
          type
          amount {
            asset {
              ...Erc20Fields
            }
            value
          }
          recipient
          referralFee
          endTimestamp
        }
        ... on UnknownCollectModuleSettings {
          type
          contractAddress
          collectModuleReturnData
        }
      }
      
      fragment ReferenceModuleFields on ReferenceModule {
        ... on FollowOnlyReferenceModuleSettings {
          type
          contractAddress
        }
        ... on UnknownReferenceModuleSettings {
          type
          contractAddress
          referenceModuleReturnData
        }
        ... on DegreesOfSeparationReferenceModuleSettings {
          type
          contractAddress
          commentsRestricted
          mirrorsRestricted
          degreesOfSeparation
        }
      }
      `,
      {
        "Content-Type": "application/json",
        "x-access-token": LensSDK.jwt.accessToken,
      }
    );
  },
};

if (!!onLoad && !loaded) {
  onLoad(LensSDK);
}
