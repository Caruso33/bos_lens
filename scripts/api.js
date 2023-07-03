const axios = require("axios")

function request(query, variables, headers, method) {
  return axios.request(process.env.API_URL, {
    method: method ?? "POST",
    headers: headers ?? {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: query,
      variables: variables ?? {},
    }),
  })
}

module.exports = request
