// Available communities in the Local Roots Commerce platform
export const communitiesData = [
  {
    id: 'kendem',
    name: 'Kendem',
    displayName: 'Kendem',
    description: 'Discover unique products and support local artisans.',
    slug: 'kendem'
  },
  {
    id: 'mamfe',
    name: 'Mamfe',
    displayName: 'Mamfe',
    description: 'Discover unique products and support local artisans.',
    slug: 'mamfe'
  },
  {
    id: 'fonjo',
    name: 'Fonjo',
    displayName: 'Fonjo',
    description: 'Discover unique products and support local artisans.',
    slug: 'fonjo'
  },
  {
    id: 'moshie',
    name: 'Moshie',
    displayName: 'Moshie',
    description: 'Discover unique products and support local artisans.',
    slug: 'moshie'
  },
  {
    id: 'membe',
    name: 'Membe',
    displayName: 'Membe',
    description: 'Discover unique products and support local artisans.',
    slug: 'membe'
  },
  {
    id: 'moshie-kekpoti',
    name: 'Moshie-Kekpoti',
    displayName: 'Moshie-Kekpoti',
    description: 'Discover unique products and support local artisans.',
    slug: 'moshie-kekpoti'
  }
];

// Legacy array for backward compatibility
export const communities = communitiesData.map(community => community.name);

// Helper functions
export const getCommunityById = (id) => {
  return communitiesData.find(community => community.id === id);
};

export const getCommunityByName = (name) => {
  return communitiesData.find(community => community.name === name);
};

export const getCommunityNames = () => {
  return communitiesData.map(community => community.name);
};

export const getCommunityDisplayNames = () => {
  return communitiesData.map(community => community.displayName);
};

export default communitiesData;
