echo "make sure nodejs is installed to build vue app"

cd ./vuejs-frontend/vue/
npm i
npm run build

cd ../../

docker compose up