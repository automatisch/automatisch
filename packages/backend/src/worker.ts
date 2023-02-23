import './config/orm';
import './helpers/check-worker-readiness';
import './workers/flow';
import './workers/trigger';
import './workers/action';
import './workers/email';
import telemetry from './helpers/telemetry';

telemetry.setServiceType('worker');
