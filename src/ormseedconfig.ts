import { ConnectionOptions } from "typeorm";
import ormconfig from "@app/ormconfig";

const config: ConnectionOptions = {
  ...ormconfig,
  migrations: [__dirname + '/seeds/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/seeds',
  },
}

export default config;