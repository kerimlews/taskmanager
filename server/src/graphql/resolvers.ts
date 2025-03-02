import { GraphQLScalarType, Kind } from 'graphql';
import Task from '../models/task.model';

export const resolvers = {
  DateNumber: new GraphQLScalarType({
    name: 'DateNumber',
    description: 'Date represented as milliseconds since epoch',
    parseValue(value) {
      return Number(value);
    },
    serialize(value) {
      return Number(value);
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT || ast.kind === Kind.STRING) {
        return Number(ast.value);
      }
      return null;
    },
  }),
  Query: {
    tasks: async (_: any, args: { filter?: any; sortBy?: string }) => {
      let filter: any = {};
      if (args.filter) {
        if (args.filter.status) filter.status = args.filter.status;
        if (args.filter.priority) filter.priority = args.filter.priority;
        if (args.filter.dueDateGte) {
          filter.dueDate = { $gte: args.filter.dueDateGte };
        }
      }
      let sort: any = {};
      if (args.sortBy) {
        if (args.sortBy.startsWith('-')) {
          sort[args.sortBy.substring(1)] = -1;
        } else {
          sort[args.sortBy] = 1;
        }
      } else {
        sort = { createdAt: -1 };
      }
      const tasks = await Task.find(filter).sort(sort);
      return tasks;
    },
    task: async (_: any, args: { id: string }) => {
      const task = await Task.findById(args.id);
      return task;
    },
  },
};
