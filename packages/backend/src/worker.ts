import './config/orm';
import './helpers/check-worker-readiness';
import './workers/flow';
import './workers/trigger';
import './workers/action';
import './workers/email';
import './workers/delete-user.ee';
import telemetry from './helpers/telemetry';

telemetry.setServiceType('worker');
