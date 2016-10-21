# map-cluster
This project provides a simple RPC API for instanciating game servers for [Rabbits3D](https://github.com/Gzopel/rabbits3d-client/).

To get it running with docker just:
```
npm i
npm run docker
npm run seed
npm start
```
The app should start on maps.rabbits:8000 if it doesn't you may have to add localhost to your /etc/resolv.conf .
