import { getEnv } from '~/utils/EnvUtils';
import NodeEnv from './NodeEnv'

const BaseURLConfig = {
  API: {
    [NodeEnv.DEV]: 'http://192.168.0.101:8080', // 'http://localhost:8080',
    [NodeEnv.PROD]: 'https://api.example.com',
  },
}

const BaseEnvURLConfig = Object.entries(BaseURLConfig).reduce((acc, [key, value]) => {
    acc[key] = value[getEnv()];
    return acc;
  }, {} as Record<string, string>);

export { BaseEnvURLConfig };