import { faker } from "@faker-js/faker";

import { prisma } from "./lib/prisma";

async function main() {
    // 1. Create Publisher
  const publisher = await prisma.publisher.create({
    data: {
      name: faker.company.name(),
    },
  });

  // 2. Create Genres
  const genre1 = await prisma.genre.create({
    data: { name: "Fantasy" },
  });

  const genre2 = await prisma.genre.create({
    data: { name: "Adventure" },
  });

  // 3. Create Author + Book
  const author = await prisma.author.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),

      books: {
        create: {
          title: faker.book.title(),

          // connect publisher
          publisher: {
            connect: { id: publisher.id },
          },

          // connect genres (many-to-many)
          genres: {
            connect: [
              { id: genre1.id },
              { id: genre2.id },
            ],
          },
        },
      },
    },
    include: {
      books: true,
    },
  });


  console.log("Created author:", author);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);});
