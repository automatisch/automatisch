import SlackClient from '../index';

export default class FindMessages {
  client: SlackClient;

  constructor(client: SlackClient) {
    this.client = client;
  }

  async run(
    query: string,
    sortBy: string,
    sortDirection: string,
    count = 1,
  ) {
    const headers = {
      Authorization: `Bearer ${this.client.connection.formattedData.accessToken}`,
    };

    const params = {
      query,
      sort: sortBy,
      sort_dir: sortDirection,
      count,
    };

    const response = await this.client.httpClient.get(
      '/search.messages',
      { headers, params }
    );

    const data = response.data;
    const messages = data.messages.matches;
    const message = messages?.[0];

    if (!data.ok) {
      if (data.error === 'missing_scope') {
        throw new Error(
          `Error occured while finding messages; ${data.error}: ${data.needed}`
        )
      }

      throw new Error(
        `Error occured while finding messages; ${data.error}`
      );
    }

    return message;
  }
}
