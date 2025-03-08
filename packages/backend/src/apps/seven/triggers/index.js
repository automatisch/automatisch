import receiveRcs from './receive-rcs/index.js';
import receiveSms from './receive-sms/index.js';
import statusSms from './status-sms/index.js';
import tracking from './tracking/index.js';
import voiceCall from './voice-call/index.js';
import voiceDtmf from './voice-dtmf/index.js';
import voiceStatus from './voice-status/index.js';

export default [receiveRcs, receiveSms, statusSms, tracking, voiceCall, voiceDtmf, voiceStatus];
