const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type Book {
    title: String
    author: String
    description: String
  }
  type Query {
    books: [Book]
  }
  type Mutation {
    createBook(title: String, author: String, description: String): Book
    removeBookByTitle(title: String!): Book
  }
  schema {
    query: Query
    mutation: Mutation
  }
`;

const books = [
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
    description: 'testing shit',
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
    description: 'Shit is getting real',
  },
  {
    title: 'test book',
    author: 'Moses west',
    description: 'This is a demo graphQL project',
  },
  {
    title: 'Awesome book',
    author: 'Alex Kislov',
    description: 'This is a demo graphQL project',
  },
];

function save({ title, author, description }) {
  const id = books.length + 1;
  let item = { id, title, author, description };
  books.push(item);
  return item;
}

function remove({ title }) {
  const indx = books.findIndex(
    book => book.title.toLowerCase().trim() === title.toLowerCase().trim()
  );
  const removingBook = {
    title: books[indx].title,
    author: books[indx].author,
    description: books[indx].description,
  };
  books.splice(indx, 1);

  return removingBook;
}

const resolvers = {
  Query: {
    books: () => books,
  },
  Mutation: {
    createBook: async (_, { title, author, description }) => {
      return await save({ title, author, description });
    },
    removeBookByTitle: async (_, { title }) => {
      return await remove({ title });
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
