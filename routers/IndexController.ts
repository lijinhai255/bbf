import { GET, route } from 'awilix-koa';
// import { Context } from '@interfaces/IKoa';

@route('/')
class IndexController {
  @route('/')
  @GET()
  async actionList(ctx: {
    body: any;
    render: (arg0: string) => any;
  }): Promise<void> {
    ctx.body = {
      data: 'IndexController',
    };
  }
}
export default IndexController;
