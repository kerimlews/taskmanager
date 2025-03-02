import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  # A custom scalar to represent a date as a number (milliseconds since epoch)
  scalar DateNumber

  type Comment {
    text: String!
    createdAt: DateNumber!
    userId: ID!
  }

  type Task {
    _id: ID!
    title: String!
    description: String
    status: String!
    priority: String!
    dueDate: DateNumber
    createdBy: ID!
    category: String
    comments: [Comment]
    createdAt: DateNumber!
    updatedAt: DateNumber!
  }

  # Input for filtering tasks
  input TaskFilterInput {
    status: String
    priority: String
    dueDateGte: DateNumber
  }

  type Query {
    tasks(filter: TaskFilterInput, sortBy: String): [Task]
    task(id: ID!): Task
  }
`;
