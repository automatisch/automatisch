import type { FieldPolicy, Reference } from '@apollo/client';

type KeyArgs = FieldPolicy<unknown>['keyArgs'];

export type TEdge<TNode> =
  | {
      node: TNode;
    }
  | Reference;

export type TPageInfo = {
  currentPage: number;
  totalPages: number;
};

export type TExisting<TNode> = Readonly<{
  edges: TEdge<TNode>[];
  pageInfo: TPageInfo;
}>;

export type TIncoming<TNode> = {
  edges: TEdge<TNode>[];
  pageInfo: TPageInfo;
};

export type CustomFieldPolicy<TNode> = FieldPolicy<
  TExisting<TNode> | null,
  TIncoming<TNode> | null,
  TIncoming<TNode> | null
>;

const makeEmptyData = <TNode>(): TExisting<TNode> => {
  return {
    edges: [],
    pageInfo: {
      currentPage: 1,
      totalPages: 1,
    },
  };
};

function offsetLimitPagination<TNode = Reference>(
  keyArgs: KeyArgs = false
): CustomFieldPolicy<TNode> {
  return {
    keyArgs,
    merge(existing, incoming, { args }) {
      if (!existing) {
        existing = makeEmptyData<TNode>();
      }

      if (!incoming || incoming === null) return existing;

      const existingEdges = existing?.edges || [];
      const incomingEdges = incoming.edges || [];

      if (args) {
        const newEdges = [...existingEdges, ...incomingEdges];
        return {
          pageInfo: incoming.pageInfo,
          edges: newEdges,
        };
      } else {
        return existing;
      }
    },
  };
}

export default offsetLimitPagination;
