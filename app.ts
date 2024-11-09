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
import serve from 'koa-static';
import co from 'co';
import { createContainer, Lifetime } from 'awilix';
import { loadControllers, scopePerRequest } from 'awilix-koa';
import ErrorHandler from '@middlewares/ErrorHandler';
import { configure, getLogger } from 'log4js';
//koa中没有实现的路由重定向到index.html
import { historyApiFallback } from 'koa2-connect-history-api-fallback';

configure({
  appenders: { cheese: { type: 'file', filename: `${__dirname}/logs/yd.log` } },
  categories: { default: { appenders: ['cheese'], level: 'error' } },
});

const app = new Koa();
const logger = getLogger('cheese');
const { port, viewDir, memoryFlag, staticDir } = config;
app.context.render = co.wrap(
  render({
    root: viewDir,
    autoescape: true,
    cache: <'memory' | false>memoryFlag,
    writeBody: false,
    ext: 'html',
  })
);
app.use(serve(staticDir));
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
ErrorHandler.error(app, logger);

app.use(historyApiFallback({ index: '/', whiteList: ['/api'] }));

app.use(loadControllers(`${__dirname}/routers/*.ts`));

app.listen(port, () => {
  console.log('京程一灯Server BFF启动成功');
});
