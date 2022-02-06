type ConnectionData = {
  screenName: string;
}

type Connection = {
  id: string;
  key: string;
  data: ConnectionData;
  verified?: boolean;
  createdAt: string;
};

export type { Connection, ConnectionData };
