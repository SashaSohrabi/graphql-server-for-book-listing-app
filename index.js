const { ApolloServer, gql } = require('apollo-server');
const { v4: uuidv4 } = require('uuid');

const typeDefs = gql`
  type Book {
    id: ID
    title: String
    author: String
    description: String
  }
  type Query {
    books: [Book]
  }
  type Mutation {
    createBook(
      id: ID!
      title: String!
      author: String!
      description: String!
    ): Book
    removeBookById(id: ID!): [Book]
    updateBook(
      id: ID!
      title: String!
      author: String!
      description: String!
    ): [Book]
  }
  schema {
    query: Query
    mutation: Mutation
  }
`;

const books = [
  {
    id: uuidv4(),
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, fuga quas debitis aliquam quidem esse facere cupiditate, aspernatur, laboriosam ex alias optio maiores.',
  },
  {
    id: uuidv4(),
    title: 'Jurassic Park',
    author: 'Michael Crichton',
    description:
      'Praesentium est nemo quidem, dicta obcaecati libero optio. At eum libero aperiam iste eligendi dignissimos incidunt, laboriosam culpa vitae reiciendis, in perspiciatis.',
  },
  {
    id: uuidv4(),
    title: 'Awesome book',
    author: 'Moses west',
    description:
      'Doloribus dignissimos ad soluta ut possimus corporis alias unde facere! Quisquam officiis mollitia velit at soluta maxime non, labore voluptas optio recusandae.',
  },
];

function save({ id, title, author, description }) {
  let item = { id, title, author, description };
  books.push(item);
  return item;
}

function remove({ id }) {
  const indx = books.findIndex(book => book.id === id);
  if (indx < 0) {
    return;
  }

  books.splice(indx, 1);

  return books;
}

function update({ id, title, author, description }) {
  const indx = books.findIndex(book => book.id === id);
  if (indx < 0) {
    return;
  }
  books[indx].title = title;
  books[indx].author = author;
  books[indx].description = description;
  return books;
}

const resolvers = {
  Query: {
    books: () => books,
  },
  Mutation: {
    createBook: async (_, { id, title, author, description }) => {
      return await save({ id, title, author, description });
    },
    removeBookById: async (_, { id }) => {
      return await remove({ id });
    },
    updateBook: async (_, { id, title, author, description }) => {
      return await update({ id, title, author, description });
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
