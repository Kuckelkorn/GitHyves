require('dotenv').config()
const { graphql } = require('@octokit/graphql')
const graphqlAuth = graphql.defaults({
  headers: { authorization: 'token ' + process.env.GITHUB_TOKEN },
})

const getApiData = async (user) => {
  const data = await graphqlAuth(`{
    user(login: "${user}") {
      repositories(first: 10) {
        totalCount
        nodes {
          name
          url
          description
        }
      }
    }}`)
  return await data
}

module.exports = getApiData

