import { IGlobalVariable } from '@automatisch/types';

const verifyCredentials = async ($: IGlobalVariable) => {
	const findKey = new RegExp(/vk1.a.[a-zA-Z0-9\-_]{214}/gm);
	const findID = new RegExp(/[0123456789]{9}/gm);
	const userKeyStr = ($.auth.data.userKey as string).match(findKey);
	const groupIdStr = ($.auth.data.groupId as string).match(findID);
	if(userKeyStr?.length != 1 || groupIdStr?.length != 1){
		throw new Error ("User key or group id is incorrect!");
	}
	$.auth.set({userKey: userKeyStr[0], groupId: groupIdStr[0]});
};

export default verifyCredentials;