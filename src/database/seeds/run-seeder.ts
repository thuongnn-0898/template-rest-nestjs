import { runSeeders } from 'typeorm-extension';

import dataSource from '../../datasource';

(async () => {
  await dataSource.initialize();
  await runSeeders(dataSource);
})();
