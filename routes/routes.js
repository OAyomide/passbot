const path = require('path');
module.exports = (bp)=> {
  const router =  bp.getRouter('/botpress-web')
  router.get('/tipOne', (req, res)=>{
      res.sendFile(path.join(__dirname, './webview/views/one.html'));
  })
}