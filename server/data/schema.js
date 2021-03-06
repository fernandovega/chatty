import { addMockFunctionsToSchema, makeExecutableSchema } from 'graphql-tools';

import { Mocks } from './mocks';
import { Resolvers } from './resolvers';

export const Schema = [`
  # declare custom scalars
  scalar Date

  # input for file types
  input File {
    name: String!
    type: String!
    size: Int!
    path: String!
  }

  # input for creating messages
  input MessageInput {
    groupId: Int!
    text: String!
  }

  # input for creating groups
  input GroupInput {
    id: Int # optional input for use with updateGroup
    name: String!
    userIds: [Int!]
    lastRead: Int # optional input for use with updateGroup
    icon: File # group icon image
  }

  # input for creating users or logging in
  input UserInput {
    email: String!
    password: String!
    username: String
    registrationId: String
  }

  # a group chat entity
  type Group {
    id: Int! # unique id for the group
    name: String # name of the group
    users: [User]! # users in the group
    messages(limit: Int, offset: Int): [Message] # messages sent to the group
    lastRead: Message # message last read by user
    unreadCount: Int # number of unread messages by user
    icon: String # url for icon image
  }

  # a user -- keep type really simple for now
  type User {
    id: Int! # unique id for the user
    badgeCount: Int # number of unread notifications
    email: String! # we will also require a unique email per user
    username: String # this is the name we'll show other users
    messages: [Message] # messages sent by user
    groups: [Group] # groups the user belongs to
    friends: [User] # user's friends/contacts
    jwt: String # json web token for access
    registrationId: String
    avatar: String # url for avatar image
  }

  # a message sent from a user to a group
  type Message {
    id: Int! # unique id for message
    to: Group! # group message was sent in
    from: User! # user who sent the message
    text: String! # message text
    createdAt: Date! # when message was created
  }

  # query for types
  type Query {
    # Return a user by their email or id
    user(email: String, id: Int): User

    # Return messages sent by a user via userId
    # Return messages sent to a group via groupId
    messages(groupId: Int, userId: Int): [Message]

    # Return a group by its id
    group(id: Int!): Group
  }

  type Mutation {
    # send a message to a group
    createMessage(message: MessageInput!): Message
    createGroup(group: GroupInput!): Group
    deleteGroup(id: Int!): Group
    leaveGroup(id: Int!): Group # let user leave group
    updateGroup(group: GroupInput!): Group
    updateUser(registrationId: String, badgeCount: Int, avatar: File): User
    login(user: UserInput!): User
    signup(user: UserInput!): User
  }

  type Subscription {
    # Subscription fires on every message added
    # for any of the groups with one of these groupIds
    messageAdded(groupIds: [Int]): Message
    groupAdded(userId: Int): Group
  }
  
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`];

export const executableSchema = makeExecutableSchema({
  typeDefs: Schema,
  resolvers: Resolvers,
});

// addMockFunctionsToSchema({
//   schema: executableSchema,
//   mocks: Mocks,
//   preserveResolvers: true,
// });

export default executableSchema;
