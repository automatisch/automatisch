type JSONValue = string | number | boolean | JSONObject | JSONArray;

interface JSONObject {
  [x: string]: JSONValue;
}

type JSONArray = Array<JSONValue>;

export default JSONObject;
