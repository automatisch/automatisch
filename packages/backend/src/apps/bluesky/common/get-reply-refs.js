const parseUri = (uri) => {
  const parts = uri.split('/');

  return {
    repo: parts[4],
    collection: 'app.bsky.feed.post',
    rkey: parts[6],
  };
};

const getReplyRefs = async ($, parentUri) => {
  const uriParts = parseUri(parentUri);

  try {
    const { data: parent } = await $.http.get('/com.atproto.repo.getRecord', {
      params: uriParts,
    });

    const parentReply = parent.value?.reply;
    let root;

    if (parentReply) {
      const rootUri = parentReply.root.uri;
      const [rootRepo, rootCollection, rootRkey] = rootUri
        .split('/')
        .slice(2, 5);

      const params = {
        repo: rootRepo,
        collection: rootCollection,
        rkey: rootRkey,
      };

      const rootResp = await $.http.get('/com.atproto.repo.getRecord', {
        params,
      });

      root = rootResp.data;
    } else {
      root = parent;
    }

    return {
      root: {
        uri: root.uri,
        cid: root.cid,
      },
      parent: {
        uri: parent.uri,
        cid: parent.cid,
      },
    };
  } catch (error) {
    throw new Error('Error while fetching records');
  }
};

export default getReplyRefs;
