const config_path = () => {
  let path = './config'
  if (process.env.NODE_ENV === 'development') path += '/development'
  else if (process.env.NODE_ENV === 'production') path += '/production'
  else path += '/test'
  path += '.env'
  console.log(path)
  return path
}

module.exports = config_path
