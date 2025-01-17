const setParams = async (client, params) => {
  for (const { parameter, value } of params) {
    if (parameter) {
      const bindings = {
        parameter,
        value,
      };

      await client.raw('SET :parameter: = :value:', bindings);
    }
  }
};

export default setParams;
