rm -rf ~/deploiement-server-gpi
mkdir ~/deploiement-server-gpi
p=`pwd`
cd ~/deploiement-server-gpi/
heroku git:clone -a warm-chamber-13731
cd warm-chamber-13731
rm server.js
cp $p/server/build/server.js ~/deploiement-server-gpi/warm-chamber-13731/
git add .
git commit -m wip
git push heroku main

