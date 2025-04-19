import axios from 'axios';

export default async function isStillVerified($) {
  try {
    const { accessToken } = $.auth.data;
    
    if (!accessToken) {
      return false;
    }
    
    await axios.get(`https://graph.facebook.com/v19.0/me?access_token=${accessToken}`);
    return true;
  } catch (error) {
    return false;
  }
} 