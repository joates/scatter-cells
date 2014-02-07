var webgl = require('./webgl')
  , cells = 128

webgl.init(cells, function(err, data) { 
  if (err) console.error(err)
  console.log('ready', data)
})
