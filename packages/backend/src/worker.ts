import './config/orm';
export { worker } from './workers/processor';
import telemetry from './helpers/telemetry';

telemetry.setServiceType('worker');
