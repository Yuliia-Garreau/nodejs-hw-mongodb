import { sortList } from '../constants/index.js';
import { SORT_ORDER } from '../constants/index.js';

// export const parseSortParams = ({ sortBy, sortOrder, sortFields }) => {
//   const parsedSortOrder = sortList.includes(sortOrder)
//     ? sortOrder
//     : sortList[0];
//   const parsedSortBy = sortFields.includes(sortBy) ? sortBy : '_id';

//   return { sortBy: parsedSortBy, sortOrder: parsedSortOrder };
// };
const parseSortOrder = (sortOrder) => {
  const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);
  if (isKnownOrder) return sortOrder;
  return SORT_ORDER.ASC;
};

const parseSortBy = (sortBy) => {
  const keysOfContact = [
    '_id',
    'name',
    'phoneNumber',
    'email',
    'isFavourite',
    'contactType',
    'createdAt',
    'updatedAt',
    'isFavorite',
  ];

  if (keysOfContact.includes(sortBy)) {
    return sortBy;
  }

  return '_id';
};

export const parseSortParams = (query) => {
  const { sortOrder, sortBy } = query;

  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);

  return {
    sortOrder: parsedSortOrder,
    sortBy: parsedSortBy,
  };
};
