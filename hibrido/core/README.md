# CORE

## Instalando dependências
<hr>
Para executar o core é necessário o uso dos seguintes softwares:

- [Mongodb](https://www.mongodb.com/download-center/community)
- [NodeJS v11.3.0](https://nodejs.org/en/)
- [npm](https://github.com/npm) ou [yarn](https://github.com/yarnpkg/yarn)

A instalação da versão correta do Nodejs pode ser fácilmente feita através do [nvm](https://github.com/creationix/nvm), esse método também instala uma versão do npm.

Após a instalação do npm/yarn é necessário executar o seguinte comando:

```
npm install
```

ou

```
yarn install
```

<p>Isso irá realizar o download das dependencias na pasta node_modules.</p>
<b>OBS: os comandos devem ser executados na mesma pasta que contém o arquivo package.json</b>

## Como usar
<hr>

Crie uma pasta para o desenvolvimento dos serviços e um arquivo para ser o ponto de execução do app.
para cada serviço desejado crie uma pasta com um arquivo register.js na raiz.

Ex:

<pre>
- core/
- services/ <-- serviços serão criados aqui (uma subpasta deve ser feita p/ cada um)
-- meu-service01/
--- register.js
-- meu-service02/
---register.js
- index.js <-- Ponto de execução
</pre>

O arquivo index.js (ponto de execução) deve carregar a interface de core e apontar os caminhos

```javascript
const run = require('./core');
run({
  mongo_url: 'mongodb://MONGO_IP_ADDR:27017/DB_NAME', // Url para conexeão com o banco de dados
  services_dir: './services'), // Path da pasta com fontes dos services
});
```

Para cadastrar um serviço deve-se utilizar a interface global gerada pelo core:

```javascript
// services/meu-service01/register.js
const meu_service = register('meu-service01', function*() {
  // ...
});
```

O primeiro parâmetro deve ser o nome do service, o segundo uma [função geradora](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/function*) que cadastra e define dependências de componentes do serviço.

Os possíveis cadastros de componentes são:

- <a href="#global-register-model"> register.model</a>
- <a href="#global-register-route"> register.route</a>
- <a href="#global-register-middleware"> register.middleware</a>

E declaração de dependências:

- <a href='#global-register-depends-on-model'>register.depends_on_model</a>
- <a href='#global-register-depends-on-middleware'>register.depends_on_middleware</a>

Ex:

```javascript
const meu_service = register('meu-service01', function*() {
  const meuModel = yield register.model('meuModel', schema_obj);
  yield register.route('get', '/my/route/path', function(req, res) {
    // ...
  });
  const meuMiddleware = yield register.middleware('meuMiddleware', function(req,res,next) {
    // ...
  });
  const models = yield register.depends_on_model('ModelA', 'ModelB');
  const middlewares = yield register.depends_on_middleware(
    'umMiddleware',
    'outroMiddleware'
  );
  console.log(Object.keys(models)); // [ 'ModelA', 'ModelB' ]
  console.log(Object.keys(middlewares)); // [ 'umMiddleware', 'outroMiddleware' ]
});
```

O objeto retornado por register possui uma interface de hooks para modificar a criação de um model:

```javascript
const meu_service = register('meu-service01', function*() {
  // ...
});

meu_service.pre_create_model_hook('ModelA', (schema, statics) => {
  schema.loaned = {
    type: Boolean,
    default: false,
  };
});

```


## Referência da API
<hr>
<h3 id='global-register'>global.register(service_name, gen)</h3>

- service_name &lt;string&gt; - Nome do serviço
- gen &lt;Function&gt; - Uma [função geradora](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/function*)

Retorna: &lt;Object&gt; com as propriedades:

- pre_create_model_hook(name, hook)
  - name &lt;string&gt; - Nome usado no cadastro do model
  - hook &lt;Function(schema, static)&gt; - Recebe os objetos usados no cadastro do model antes de sua criação


<hr>
<h3 id='global-register-model'>global.register.model(name, schema, statics)</h3>

Registra o model no app e vincula ao contexto do serviço.

- name &lt;string&gt; - Valor usado para referenciar o model em dependencias
- schema  &lt;Object&gt; - Objeto usado na criação do [Schema pelo mongoose](https://mongoosejs.com/docs/api.html#schema_Schema)
- statics  &lt;Object&gt; - Objeto com funções statics para o [Schema do mongoose](https://mongoosejs.com/docs/api.html#schema_Schema-static)

Retorna &lt;[Model](https://mongoosejs.com/docs/api.html#Model)&gt;

<hr>
<h3 id='global-register-route'>global.register.route(method, path, [...middlewares], handler)</h3>

Cadastra uma rota no [express](https://expressjs.com/)

- method &lt;string&gt; - [Método HTTP](https://expressjs.com/en/4x/api.html#routing-methods)
- path &lt;string&gt; - [Path](https://expressjs.com/en/4x/api.html#path-examples) de execução da rota
- [...middlewares] &lt;Function[]&gt; - Middlewares executados durante a request
- handler - Atende a request recebida

<hr>
<h3 id='global-register-middleware'>global.register.middleware(name, fn)</h3>

Registra o middleware no app e vincula ao contexto do serviço.

- name  &lt;string&gt; - Nome do middleware
- fn  &lt;Function&gt; - [Middlewares](https://expressjs.com/en/guide/writing-middleware.html) usados pelo express.

Retorna: o parâmetro fn vinculado ao contexto do serviço.

<hr>
<h3 id='global-register-depends-on-model'>global.register.depends_on_model(...name)</h3>

Adiciona os models ao contexto do serviço

- names &lt;string&gt; - name usado para cadastro do model

Retorna: Objeto com chaves para cada model de acordo com o name cadastrado

<hr>
<h3 id='global-register-depends-on-middleware'>global.register.depends_on_middleware(...name)</h3>

- names &lt;string&gt; - name usado para cadastro do middleware

Retorna: Objeto com chaves para cada middleware de acordo com o name cadastrado
