echo 'Install Script for Raspberry Pi'

echo 'Update and Upgrade'

sudo apt update -y
sudo apt upgrade -y

echo '\n get the latest version of mongodb'

wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo '\n'
echo 'Add the source location for the MongoDB packages'
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list

echo 'Install MongoDB \n'
sudo apt-get install -y mongodb-org

echo 'Start MongoDB \n'
sudo systemctl start mongod

echo '\n Install nodejs 21 \n'
curl -sL https://deb.nodesource.com/setup_21.x | sudo bash -
sudo apt install nodejs -y

echo '\n Node Version:'
node --version