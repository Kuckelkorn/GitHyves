require('dotenv').config()
const { graphql } = require('@octokit/graphql')
const graphqlAuth = graphql.defaults({
  headers: { authorization: 'token ' + process.env.GITHUB_TOKEN },
})

const getApiData = async (user) => {
  const data = await graphqlAuth(`{
    user(login: "${user}") {
      status {
        emoji
        message
      }
      following(first: 10) {
        nodes {
          avatarUrl
          login
          following {
            totalCount
          }
        }
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

