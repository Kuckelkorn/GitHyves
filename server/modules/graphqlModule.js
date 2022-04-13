require('dotenv').config()
const { graphql } = require('@octokit/graphql')
const graphqlAuth = graphql.defaults({
  headers: { authorization: 'token ' + process.env.GITHUB_TOKEN },
})

const getApiData = async (user) => {
  const data = await graphqlAuth(`{
    user(login: "joeribouwman25") {
      status {
        emoji
        message
      }
      repositories(first: 10) {
        nodes {
          name
          url
          description
          languages(first: 3) {
            nodes {
              name
            }
          }
        }
      }
    }
  }`)
  return await data
}



module.exports = getApiData

