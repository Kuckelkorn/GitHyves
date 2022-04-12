const graphqlAuth = graphql.defaults({
    headers: { authorization: 'token ' + process.env.GITHUB_TOKEN },
  })

  graphqlAuth(`{{
    viewer {
      login(login: "joeribouwman25")
      repositories(first: 10) {
        totalCount
        nodes {
          name
          url
          description
        }
      }
    }
  }}`)