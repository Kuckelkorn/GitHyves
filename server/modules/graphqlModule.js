require('dotenv').config()
const { graphql } = require('@octokit/graphql')
const graphqlAuth = graphql.defaults({
  headers: { authorization: 'token ' + process.env.GITHUB_TOKEN },
})

const getApiProfileData = async (user) => {
  const data = await graphqlAuth(`{
    user(login: "${user}") {
<<<<<<< HEAD
      login
      avatarUrl
=======
>>>>>>> Jody
      status {
        message
        emojiHTML
      }
      following(first: 10) {
        nodes {
          avatarUrl
          login
          following {
            totalCount
          }
        }
        totalCount
      }
      repositories(first: 10, orderBy: {field: CREATED_AT, direction: DESC}) {
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



module.exports = getApiProfileData

