const writeFile = async (obj, path) => {
    let data = await readFile(path)
    const existingProfile = await data.find(i => i.username === obj.username)
  
    for (let i = 0; i < data.length; i++){
      
      if (data[i] === existingProfile) {
        data.splice(i, 1)
      }
    }
    
    data.push(obj)
    const newData = JSON.stringify(data)
    fs.writeFileSync(path, newData)
  }

  module.exports= {
    writeFile
  }