type ConnectionData = {
  screenName: string;
}

type Connection = {
  id: string;
  key: string;
  data: ConnectionData;
  verified: boolean;
};

export type { Connection, ConnectionData };
