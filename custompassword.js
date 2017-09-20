bp.hear('QUICKREPLY.B4', (event, next)=>{
    bp.hear('QUICKREPLY.B1', (event, next) => {
        if (bp.convo.find(event)) {
          return event.reply('#askStopConvo')
        }
})
})