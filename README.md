# facilita-node-api-react
Teste para a Facilita Juridico


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