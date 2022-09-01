import axios from "axios";

const getCountries = async () => {
  const resp = await axios.get("http://localhost:3000/countries");
  return resp.data;
};

export { getCountries };
