import './config/orm';
import './workers/flow';
import './workers/trigger';
import './workers/action';
import telemetry from './helpers/telemetry';

telemetry.setServiceType('worker');
