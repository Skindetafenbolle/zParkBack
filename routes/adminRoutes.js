import express from 'express';
import AdminJS from 'adminjs';
import AdminJSSequelize from '@adminjs/sequelize';
import AdminJSExpress from '@adminjs/express';
import { adminJsOptions } from '../adminOptions.js';

export function configureAdminRoutes() {
  AdminJS.registerAdapter(AdminJSSequelize);
  const adminJs = new AdminJS(adminJsOptions);
  const adminRouter = AdminJSExpress.buildRouter(adminJs);

  const router = express.Router();
  router.use(adminJs.options.rootPath, adminRouter);

  return router;
}
