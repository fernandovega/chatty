import gql from 'graphql-tag';

import GROUP_FRAGMENT from './group.fragment';

const GROUP_ADDED_SUBSCRIPTION = gql`
  subscription onGroupAdded($userId: Int, $limit: Int = 1, $offset: Int = 0){
    groupAdded(userId: $userId){
      ... GroupFragment
    }
  }
  ${GROUP_FRAGMENT}
`;

export default GROUP_ADDED_SUBSCRIPTION;
