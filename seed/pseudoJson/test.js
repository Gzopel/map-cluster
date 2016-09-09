const helper = require('./helper');
/*
*        Region:
*    _________________
*   |        |        |
*   |  Map 4    Map 3 |
*   |___  ___|___  ___|
*   |        |        |
*   |  Map 2    Map 1 |
*   |________|________|
*/


module.exports = {
  Region:[
    {
      _id:helper.getId(),
      maps:[1,2,3,4]
    }
  ],
  Map:[
    {
      _id:helper.getId(),
      id:1,
      size:{
        x:800,
        y:800
      }
      exits:[{
        position:{x:800,y:400}
        destination:2
      },{
        position:{x:400,y:800}
        destination:3
      }]
    },{
      _id:helper.getId(),
      id:2,
      size:{
        x:800,
        y:800
      }
      exits:[{
        position:{x:400,y:800}
        destination:4
      },{
        position:{x:0,y:400}
        destination:1
      }]
    },{
      _id:helper.getId(),
      id:3,
      size:{
        x:800,
        y:800
      }
      exits:[{
        position:{x:400,y:0}
        destination:1
      },{
        position:{x:800,y:400}
        destination:4
      }]
    },{
      _id:helper.getId(),
      id:4,
      size:{
        x:800,
        y:800
      }
      exits:[{
        position:{x:400,y:0}
        destination:2
      },{
        position:{x:0,y:400}
        destination:3
      }]
    }
  ]
}
