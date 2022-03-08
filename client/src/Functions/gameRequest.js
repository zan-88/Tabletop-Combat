import axios from "axios";

export async function getTokens(code, setTemp) {
  try {
    const response = await axios.get(
      "http://192.168.0.161:5000/api/tokens",
      code
    );
    setTemp(response.data);
    console.log("TOKEN GOT" + response.data[0]);
    return response.data;
  } catch (err) {
    console.log("ERROR");
    console.log(err.response);
  }
}

export async function setToken(token) {
  await axios
    .post("http://192.168.0.161:5000/api/tokens", token)
    .catch(function (error) {
      if (error.response) {
        console.log(error.response);
      }
    });
}

export async function deleteAllTokens() {
  await axios
    .delete("http://192.168.0.161:5000/api/tokens")
    .catch(function (error) {
      if (error.response) {
        console.log(error.response);
      }
    });
}

export async function updateToken(token) {
  await axios
    .put(`http://192.168.0.161:5000/api/tokens/${token.key}`, token)
    .catch(function (error) {
      if (error.response) {
        console.log(error.response);
      }
    });
}

export async function deleteToken(key) {
  await axios
    .delete(`http://192.168.0.161:5000/api/tokens/${key}`)
    .catch(function (error) {
      if (error.response) {
        console.log(error.response);
      }
    });
}

export async function getMap(code, setParty, setIsLoaded) {
  try {
    console.log("getting map");
    const response = await axios.get(`http://192.168.0.161:5000/api/map`, code);
    console.log("got map");
    setParty(response.data[0]);
    setIsLoaded(true);
    console.log("map: " + response.data[0].mapUrl);
    return response.data[0];
  } catch (error) {
    console.log("ERROR");
    console.log(error);
  }
}

export async function setMap(map) {
  await axios
    .post("http://192.168.0.161:5000/api/map", map)
    .catch(function (error) {
      if (error.response) {
        console.log(error.response);
      }
    });
}
