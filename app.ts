import { addAliases } from 'module-alias';
addAliases({
  '@root': __dirname,
  '@interfaces': `${__dirname}/interface`,
  '@config': `${__dirname}/config`,
  '@middlewares': `${__dirname}/middlewares`,
});
import Koa from 'koa';
import config from '@config/index';
import render from 'koa-swig';
import { createContainer, Lifetime } from 'awilix';
import { loadControllers, scopePerRequest } from 'awilix-koa';
const app = new Koa();

const { port, viewDir, memoryFlag, staticDir } = config;

const container = createContainer();
container.loadModules([`${__dirname}/services/*.ts`], {
  formatName: 'camelCase',
  resolverOptions: {
    lifetime: Lifetime.SCOPED,
  },
});
app.use(scopePerRequest(container));

// container.get("apiService").getInfo();
// AST 结构    constructor({ apiService }) {}
// apiService container.get("apiService")
app.use(loadControllers(`${__dirname}/routers/*.ts`));

app.listen(port, () => {
  console.log('京程一灯Server BFF启动成功');
});
