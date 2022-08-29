// banner, minicard, card, medium, small, icon, sqaure, round,
import { wp } from '@styles';
import { ObjectType } from '@types';

export const objectSizes: ObjectType = {
  banner: {
    width: wp(90),
    aspectRatio: 0.83,
    minColumns: 1,
    multiColumns: {
      width: wp(90),
    },
  },
  minicard: {
    width: wp(42),
    aspectRatio: 0.83,
    borderRadius: 5,
    minColumns: 2,
    multiColumns: {
      width: wp(42),
    },
  },
  card: {
    width: wp(90),
    aspectRatio: 0.8131,
    borderRadius: 12,
    minColumns: 1,
    multiColumns: {
      width: wp(90),
    },
    justifyContent: 'center',
  },
  medium: {
    width: wp(90),
    aspectRatio: 1.38,
    borderRadius: 0,
    minColumns: 1,
    multiColumns: {
      width: wp(90),
    },
  },
  small: {
    width: wp(40),
    aspectRatio: 1,
    borderRadius: 5,
    minColumns: 2,
    multiColumns: {
      width: wp(42),
    },
  },
  icon: {
    width: wp(27),
    aspectRatio: 1,
    borderRadius: 5,
    minColumns: 3,
    multiColumns: {
      width: wp(27),
    },
  },
  square: {
    width: wp(40),
    aspectRatio: 1,
    minColumns: 2,
    multiColumns: {
      width: wp(42),
    },
  },
  round: {
    width: wp(40),
    aspectRatio: 1,
    borderRadius: 180,
    minColumns: 2,
    multiColumns: {
      width: wp(42),
    },
  },
  'round carousal': {
    width: wp(40),
    aspectRatio: 1,
    borderRadius: 180,
    minColumns: 2,
    multiColumns: {
      width: wp(42),
    },
  },
  'image collage': {
    width: wp(28),
    aspectRatio: 1,
    minimumItems: 3,
    marginBottom: 15,
    minColumns: 3,
    multiColumns: {
      width: wp(28),
    },
  },
  'minicard carousal': {
    width: wp(38),
    aspectRatio: 0.8,
    borderRadius: 0,
    minColumns: 1,
    multiColumns: {
      width: wp(38),
    },
  },
  'medium carousal': {
    width: wp(90),
    aspectRatio: 1.38,
    borderRadius: 0,
    minColumns: 1,
    multiColumns: {
      width: wp(90),
    },
  },
  'banner carousal': {
    width: wp(90),
    aspectRatio: 0.83,
    borderRadius: 0,
    minColumns: 1,
    multiColumns: {
      width: wp(90),
    },
  },
  'square carousal': {
    width: wp(55),
    aspectRatio: 1,
    borderRadius: 0,
    minColumns: 2,
    multiColumns: {
      width: wp(55),
    },
  },
  default: {
    width: wp(40),
    aspectRatio: 1.38,
    borderRadius: 0,
    minColumns: 2,
    multiColumns: {
      width: wp(42),
    },
  },
};

export const objectKeys: ObjectType = {
  blog: 'Blog',
  post: 'Post',
  podcast: 'Podcast',
  video: 'Video',
  book: 'Book',
  shop: 'Product',
  movie: 'Movie',
  music: 'Music',
  recipe: 'Recipe',
  tvShow: 'TvShow',
  liveShow: 'LiveShow',
  image: 'Image',
  story: 'Stories',
  link: 'Link',
  nft: 'Nft',
  channel: 'Channel',
  guide: 'Guide',
  event: 'Experience',
  campaign: 'Campaign',
  place: 'Place',
  user: 'User',
  social: 'AllPosts',
  banner: 'Banner',
  about: 'About',
  membership: 'Membership',
  collections: 'Collections',
  drop: 'Drop',
  search: 'Search',
};

export const PostTypes = [
  objectKeys.blog,
  objectKeys.post,
  objectKeys.podcast,
  objectKeys.video,
  objectKeys.book,
  objectKeys.shop,
  objectKeys.movie,
  objectKeys.music,
  objectKeys.recipe,
  objectKeys.tvShow,
  objectKeys.liveShow,
  objectKeys.image,
  objectKeys.story,
  objectKeys.link,
  objectKeys.nft,
];
export const isWideUiPosts = [
  objectKeys.video,
  objectKeys.recipe,
  objectKeys.post,
];

export const ObjectCategories: ObjectType = {
  [objectKeys.blog]: {
    display: 'Blogs',
    type: 'Blog',
    appCollectionCatId: '16398',
    collectionCatName: 'Explore Blog Selection',
    listProperties: {
      vertical: {},
      horizontal: {},
    },
    itemProperties: {
      ...objectSizes,
      minicard: {
        width: wp(50),
        aspectRatio: 3 / 2,
        minColumns: 2,
        multiColumns: {
          width: wp(43),
        },
        multipleRowItemNumber: 2,
      },
    },
  },
  [objectKeys.post]: {
    display: 'Articles',
    type: 'Post',
    appCollectionCatId: '16397',
    collectionCatName: 'Explore Article Selection',
    itemProperties: {
      ...objectSizes,
      minicard: {
        width: wp(50),
        aspectRatio: 3 / 2,
        minColumns: 2,
        multiColumns: {
          width: wp(43),
        },
        multipleRowItemNumber: 2,
      },
    },
  },
  [objectKeys.podcast]: {
    display: 'Podcasts',
    type: 'Podcast',
    appCollectionCatId: '16396',
    collectionCatName: 'Explore Podcast Selection',
    itemProperties: {
      ...objectSizes,
      minicard: {
        width: wp(40),
        aspectRatio: 1,
        minColumns: 2,
        multiColumns: {
          width: wp(42),
        },
      },
    },
  },
  [objectKeys.video]: {
    display: 'Videos',
    type: 'Video',
    appCollectionCatId: '16394',
    collectionCatName: 'Explore Video Selection',
    itemProperties: {
      ...objectSizes,
      minicard: {
        width: wp(50),
        aspectRatio: 3 / 2,
        minColumns: 2,
        multiColumns: {
          width: wp(43),
        },
      },
    },
  },
  [objectKeys.book]: {
    display: 'Books',
    type: 'Book',
    appCollectionCatId: '16395',
    collectionCatName: 'Explore Book Selection',
    itemProperties: {
      ...objectSizes,
      minicard: {
        width: wp(32),
        aspectRatio: 0.85,
        minColumns: 3,
        multiColumns: {
          width: wp(28),
        },
      },
    },
  },
  [objectKeys.shop]: {
    display: 'Shop',
    type: 'Product',
    appCollectionCatId: '16399',
    collectionCatName: 'Explore Product Selection',
    emptyListText: 'There are no items in the Shop right now.',
    itemProperties: {
      ...objectSizes,
      minicard: {
        width: wp(32),
        aspectRatio: 2 / 3,
        minColumns: 3,
        multiColumns: {
          width: wp(28),
        },
      },
    },
  },
  [objectKeys.movie]: {
    display: 'Movies',
    type: 'Movie',
    appCollectionCatId: '16400',
    collectionCatName: 'Explore Movie Selection',
    emptyListText: 'There are no items in the Shop right now.',
    itemProperties: {
      ...objectSizes,
      minicard: {
        width: wp(32),
        aspectRatio: 2 / 3,
        minColumns: 3,
        multiColumns: {
          width: wp(28),
        },
      },
    },
  },
  [objectKeys.music]: {
    display: 'Music',
    type: 'Music',
    appCollectionCatId: '16403',
    collectionCatName: 'Explore Music Selection',
    emptyListText: '',
    itemProperties: {
      ...objectSizes,
      minicard: {
        width: wp(32),
        aspectRatio: 1,
        minColumns: 3,
        multiColumns: {
          width: wp(32),
        },
      },
    },
  },
  [objectKeys.recipe]: {
    display: 'Recipes',
    type: 'Recipe',
    appCollectionCatId: '16404',
    collectionCatName: 'Explore Recipe Selection',
    emptyListText: '',
    itemProperties: {
      ...objectSizes,
      minicard: {
        width: wp(50),
        aspectRatio: 3 / 2,
        minColumns: 2,
        multiColumns: {
          width: wp(43),
        },
      },
    },
  },
  [objectKeys.tvShow]: {
    display: 'TV Shows',
    type: 'TV Show',
    appCollectionCatId: '16401',
    collectionCatName: 'Explore TV Show Selection',
    emptyListText: '',
    itemProperties: {
      ...objectSizes,
      minicard: {
        width: wp(32),
        aspectRatio: 0.63,
        minColumns: 3,
        multiColumns: {
          width: wp(28),
        },
      },
    },
  },
  [objectKeys.liveShow]: {
    display: 'Live Shows',
    type: 'Live Show',
    appCollectionCatId: '16402',
    collectionCatName: 'Explore Live Show Selection',
    emptyListText: '',
    itemProperties: {
      ...objectSizes,
      minicard: {
        width: wp(32),
        aspectRatio: 0.63,
        minColumns: 3,
        multiColumns: {
          width: wp(28),
        },
      },
    },
  },
  [objectKeys.image]: {
    display: 'Images',
    type: 'Image',
    appCollectionCatId: '24684',
    collectionCatName: 'Explore Image Selection',
    emptyListText: '',
    itemProperties: {
      ...objectSizes,
      minicard: {
        width: wp(38),
        aspectRatio: 0.8,
        minColumns: 2,
        multiColumns: {
          width: wp(38),
        },
      },
    },
  },
  [objectKeys.story]: {
    display: 'Stories',
    type: 'Stories',
    appCollectionCatId: '',
    collectionCatName: '',
    emptyListText: '',
    itemProperties: {
      ...objectSizes,
    },
  },
  [objectKeys.link]: {
    display: 'Links',
    type: 'Link',
    appCollectionCatId: '24681',
    collectionCatName: 'Explore Link Selection',
    emptyListText: '',
    itemProperties: {
      ...objectSizes,
      minicard: {
        width: wp(50),
        aspectRatio: 3 / 2,
        minColumns: 2,
        multiColumns: {
          width: wp(43),
        },
      },
      medium: {
        width: wp(35),
        aspectRatio: 0.77,
        minColumns: 3,
        multiColumns: {
          width: wp(27),
        },
      },
    },
  },
  [objectKeys.nft]: {
    type: 'NFT',
    display: 'NFTs',
    appCollectionCatId: '24656',
    collectionCatName: 'Explore NFT Selection',
    itemProperties: {
      ...objectSizes,
      minicard: {
        width: wp(40),
        aspectRatio: 1,
        minColumns: 2,
        multiColumns: {
          width: wp(42),
        },
        // multipleRowItemWidth: wp(42),
      },
    },
  },
  [objectKeys.guide]: {
    display: 'Guides',
    type: 'List',
    appCollectionCatId: '16388',
    collectionCatName: 'Explore Guide Selection',
    emptyListText: '',
    itemProperties: {
      ...objectSizes,
      minicard: {
        width: wp(26),
        aspectRatio: 2 / 3,
        borderRadius: 9,
        minColumns: 3,
        multiColumns: {
          width: wp(28),
        },
      },
    },
  },
  [objectKeys.channel]: {
    display: 'Channel',
    type: 'Channel',
    appCollectionCatId: '16385',
    collectionCatName: 'Explore Channel Selection',
    emptyListText: '',
    itemProperties: { ...objectSizes },
  },
  [objectKeys.event]: {
    display: 'Experiences',
    type: 'Event',
    appCollectionCatId: '16387',
    collectionCatName: 'Explore Experience Selection',
    emptyListText: '',
    itemProperties: {
      ...objectSizes,
      minicard: {
        width: wp(35),
        aspectRatio: 0.77,
        borderRadius: 15,
        minColumns: 3,
        multiColumns: {
          width: wp(27),
        },
      },
    },
  },
  [objectKeys.campaign]: {
    display: 'Campaign',
    type: 'Campaign',
    appCollectionCatId: '16386',
    collectionCatName: 'Explore Campaign Selection',
    emptyListText: '',
    itemProperties: {
      ...objectSizes,
    },
  },
  [objectKeys.place]: {
    display: 'Places',
    type: 'Place',
    appCollectionCatId: '16390',
    collectionCatName: 'Explore Place Selection',
    emptyListText: '',
    itemProperties: {
      ...objectSizes,
      minicard: {
        width: wp(30),
        aspectRatio: 1,
        borderRadius: 5,
        minColumns: 3,
        multiColumns: {
          width: wp(35),
        },
      },
    },
  },
  [objectKeys.user]: {
    type: 'Profile',
    display: 'Profiles',
    appCollectionCatId: '16391',
    collectionCatName: 'Explore People Selection',
    emptyListText: '',
    itemProperties: {
      ...objectSizes,
      minicard: {
        width: wp(27),
        aspectRatio: 1,
        borderRadius: 180,
        minColumns: 3,
        multiColumns: {
          width: wp(28),
        },
      },
    },
  },
  [objectKeys.social]: {
    display: 'Posts',
    type: 'AllPost',
    appCollectionCatId: '16405',
    collectionCatName: 'Explore Social Selection',
    emptyListText: '',
    itemProperties: { ...objectSizes },
  },
  [objectKeys.banner]: {
    type: 'Banner',
    display: 'Banner',
    appCollectionCatId: '16384',
    collectionCatName: 'Explore Banner',
    itemProperties: { ...objectSizes },
  },
  [objectKeys.about]: {
    display: 'About',
    type: 'About',
    appCollectionCatId: '16392',
    collectionCatName: 'Explore About Selection',
    itemProperties: {},
  },
  [objectKeys.membership]: {
    display: 'Members-Only',
    type: 'Members',
    appCollectionCatId: '24657',
    collectionCatName: 'Explore Membership Selection',
    itemProperties: {
      ...objectSizes,
      minicard: {
        ...objectSizes.medium,
        borderRadius: 15,
        minColumns: 1,
        multiColumns: {
          width: wp(90),
        },
      },
    },
  },
  [objectKeys.collections]: {
    display: 'Collections',
    type: 'Collection',
    appCollectionCatId: '24678',
    collectionCatName: 'Explore Collection Selection',
    itemProperties: {
      ...objectSizes,
      minicard: { ...objectSizes.small, borderRadius: 15 },
      medium: {
        ...objectSizes.medium,
        width: wp(65),
        minColumns: 2,
        multiColumns: {
          width: wp(42),
        },
      },
    },
  },
  [objectKeys.drop]: {
    display: 'Drop',
    type: 'Drop',
    appCollectionCatId: '24671',
    collectionCatName: 'Explore ProductService Selection',
    itemProperties: { ...objectSizes },
  },
  [objectKeys.search]: {
    key: 'search',
    display: 'Search',
    type: 'Search',
    appCollectionCatId: '24639',
    collectionCatName: 'Explore Search Selection',
  },

};
