export default async function getDynamicData(key, _, auth) {
  switch (key) {
    case 'listPages':
      return await listPages(auth);
    default:
      return [];
  }
}

async function listPages(auth) {
  const { accessToken, pages } = auth;

  // Check if we already have pages from auth
  if (pages && Array.isArray(pages) && pages.length > 0) {
    return pages.map((page) => ({
      value: page.id,
      name: page.name,
    }));
  }

  // Otherwise fetch pages directly from the API
  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}&fields=id,name,access_token`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch pages: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return (data.data || []).map((page) => ({
      value: page.id,
      name: page.name,
    }));
  } catch (error) {
    console.error('Error fetching Facebook pages:', error);
    return [];
  }
} 