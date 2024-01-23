# facilita-node-api-react
Teste para a Facilita Juridico


Sistema:

Ubuntu 20.04
node: 18.0.0
docker-compose: 1.29.2

Instruções:

git clone https://github.com/rogerbage/facilita-node-api-react.git

cd facilita-node-api-react

Iniciar Banco de dados:

cd facilitaDB

sudo docker-composer up --build

Iniciar API:

cd facilitaApi
yarn install
yarn seed:postgres


Iniciar APP

cd facilitaApp
yarn install
yarn start