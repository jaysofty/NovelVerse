import {
  PrismaClient,
  UserRole,
  NovelStatus,
  NovelVisibility,
} from "../generated/prisma/client.ts";

import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

function getGenreId(genreMap: Record<string, string>, name: string): string {
  const id = genreMap[name];

  if (!id) {
    throw new Error(`Genre "${name}" was not found`);
  }

  return id;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Starting database seed...");

  // --------------------------------------------------
  // 1. Clear existing development data
  // --------------------------------------------------

  await prisma.readingProgress.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.like.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.novelGenre.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.novel.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // --------------------------------------------------
  // 2. Create users
  // --------------------------------------------------

  const admin = await prisma.user.create({
    data: {
      email: "admin@novelverse.com",
      passwordHash: "seed-password",
      role: UserRole.ADMIN,

      profile: {
        create: {
          username: "admin",
          displayName: "NovelVerse Admin",
          bio: "Platform administrator",
        },
      },
    },
  });

  const amara = await prisma.user.create({
    data: {
      email: "amara@example.com",
      passwordHash: "seed-password",
      role: UserRole.AUTHOR,

      profile: {
        create: {
          username: "amara_writes",
          displayName: "Amara Okafor",
          bio: "Fantasy and African fiction writer.",
        },
      },
    },
  });

  const david = await prisma.user.create({
    data: {
      email: "david@example.com",
      passwordHash: "seed-password",
      role: UserRole.AUTHOR,

      profile: {
        create: {
          username: "david_stories",
          displayName: "David Williams",
          bio: "Science fiction and adventure author.",
        },
      },
    },
  });

  const sophia = await prisma.user.create({
    data: {
      email: "sophia@example.com",
      passwordHash: "seed-password",
      role: UserRole.AUTHOR,

      profile: {
        create: {
          username: "sophia_reads",
          displayName: "Sophia Bennett",
          bio: "Romance writer and lifelong reader.",
        },
      },
    },
  });

  const kunle = await prisma.user.create({
    data: {
      email: "kunle@example.com",
      passwordHash: "seed-password",
      role: UserRole.USER,

      profile: {
        create: {
          username: "kunle_reads",
          displayName: "Kunle",
          bio: "Book lover and explorer of new worlds.",
        },
      },
    },
  });

  // --------------------------------------------------
  // 3. Genres
  // --------------------------------------------------

  const genreNames = [
    "Fantasy",
    "Science Fiction",
    "Romance",
    "Mystery",
    "Thriller",
    "Adventure",
    "Horror",
    "Historical Fiction",
  ];

  const genres = await Promise.all(
    genreNames.map((name) =>
      prisma.genre.create({
        data: {
          name,
          slug: name.toLowerCase().replace(/\s+/g, "-"),
        },
      }),
    ),
  );

  const genreMap = Object.fromEntries(
    genres.map((genre) => [genre.name, genre.id]),
  );
  // --------------------------------------------------
  // 4. Create novels
  // --------------------------------------------------

  // =========================
  // The Last Kingdom
  // =========================

  const lastKingdom = await prisma.novel.create({
    data: {
      authorId: amara.id,
      title: "The Last Kingdom",
      slug: "the-last-kingdom",
      description:
        "A young woman discovers an ancient power buried beneath her family's forgotten history.",
      creationType: "ORIGINAL",
      contentType: "TEXT",
      status: NovelStatus.PUBLISHED,
      visibility: NovelVisibility.PUBLIC,
      publishedAt: new Date(),

      genres: {
        create: [
          {
            genreId: getGenreId(genreMap, "Fantasy"),
          },
          {
            genreId: getGenreId(genreMap, "Adventure"),
          },
        ],
      },
    },
  });

  const lastKingdomChapter1 = await prisma.chapter.create({
    data: {
      novelId: lastKingdom.id,
      title: "The Beginning",
      chapterNumber: 1,
      content:
        "The rain had fallen for seven days when Amara discovered the hidden door beneath her grandmother's house.",
      publishedAt: new Date(),
    },
  });

  const lastKingdomChapter2 = await prisma.chapter.create({
    data: {
      novelId: lastKingdom.id,
      title: "The Stranger",
      chapterNumber: 2,
      content:
        "A stranger arrived at the village carrying a silver staff and a warning about the kingdom beyond the mountains.",
      publishedAt: new Date(),
    },
  });

  await prisma.chapter.create({
    data: {
      novelId: lastKingdom.id,
      title: "The Prophecy",
      chapterNumber: 3,
      content:
        "The ancient prophecy revealed that the kingdom's final heir was closer than anyone had imagined.",
      publishedAt: new Date(),
    },
  });

  // =========================
  // Echoes of Lagos
  // =========================

  const echoesOfLagos = await prisma.novel.create({
    data: {
      authorId: amara.id,
      title: "Echoes of Lagos",
      slug: "echoes-of-lagos",
      description:
        "A mysterious story connecting modern Lagos to a forgotten world beneath the city.",
      creationType: "AI_ASSISTED",
      contentType: "TEXT",
      status: NovelStatus.PUBLISHED,
      visibility: NovelVisibility.PUBLIC,
      publishedAt: new Date(),

      genres: {
        create: [
          {
            genreId: getGenreId(genreMap, "Mystery"),
          },
          {
            genreId: getGenreId(genreMap, "Fantasy"),
          },
        ],
      },
    },
  });

  const echoesOfLagosChapter1 = await prisma.chapter.create({
    data: {
      novelId: echoesOfLagos.id,
      title: "The Sound Beneath",
      chapterNumber: 1,
      content:
        "Every night at exactly midnight, Tobi heard music coming from beneath the streets.",
      publishedAt: new Date(),
    },
  });

  await prisma.chapter.create({
    data: {
      novelId: echoesOfLagos.id,
      title: "The Hidden Passage",
      chapterNumber: 2,
      content:
        "Following the mysterious sound, Tobi discovered a passage that should not have existed.",
      publishedAt: new Date(),
    },
  });

  // =========================
  // Children of Mars
  // =========================

  const childrenOfMars = await prisma.novel.create({
    data: {
      authorId: david.id,
      title: "Children of Mars",
      slug: "children-of-mars",
      description:
        "Humanity's first generation born on Mars must decide whether Earth still has a place in their future.",
      creationType: "AI_GENERATED",
      contentType: "TEXT",
      status: NovelStatus.PUBLISHED,
      visibility: NovelVisibility.PUBLIC,
      publishedAt: new Date(),

      genres: {
        create: [
          {
            genreId: getGenreId(genreMap, "Science Fiction"),
          },
          {
            genreId: getGenreId(genreMap, "Adventure"),
          },
        ],
      },
    },
  });

  const childrenOfMarsChapter1 = await prisma.chapter.create({
    data: {
      novelId: childrenOfMars.id,
      title: "Red Dawn",
      chapterNumber: 1,
      content:
        "The first sunrise of the Martian year painted the colony in shades of red and gold.",
      publishedAt: new Date(),
    },
  });

  await prisma.chapter.create({
    data: {
      novelId: childrenOfMars.id,
      title: "The Signal",
      chapterNumber: 2,
      content: "A signal from Earth arrived after seventy years of silence.",
      publishedAt: new Date(),
    },
  });

  // =========================
  // The Midnight Rose
  // =========================

  const midnightRose = await prisma.novel.create({
    data: {
      authorId: sophia.id,
      title: "The Midnight Rose",
      slug: "the-midnight-rose",
      description:
        "Two strangers meet every night in a mysterious garden that disappears at sunrise.",
      creationType: "ORIGINAL",
      contentType: "TEXT",
      status: NovelStatus.PUBLISHED,
      visibility: NovelVisibility.PUBLIC,
      publishedAt: new Date(),

      genres: {
        create: [
          {
            genreId: getGenreId(genreMap, "Romance"),
          },
          {
            genreId: getGenreId(genreMap, "Mystery"),
          },
        ],
      },
    },
  });

  await prisma.chapter.create({
    data: {
      novelId: midnightRose.id,
      title: "The Garden",
      chapterNumber: 1,
      content:
        "Sophia had never seen the garden during daylight. Somehow, it only appeared after midnight.",
      publishedAt: new Date(),
    },
  });

  await prisma.chapter.create({
    data: {
      novelId: midnightRose.id,
      title: "The Stranger",
      chapterNumber: 2,
      content:
        "On the third night, someone else was waiting beside the fountain.",
      publishedAt: new Date(),
    },
  });

  // =========================
  // The House Without Windows
  // =========================

  const darkHouse = await prisma.novel.create({
    data: {
      authorId: david.id,
      title: "The House Without Windows",
      slug: "the-house-without-windows",
      description:
        "A detective investigates a house where nobody enters and nobody ever leaves.",
      creationType: "AI_ASSISTED",
      contentType: "TEXT",
      status: NovelStatus.PUBLISHED,
      visibility: NovelVisibility.PUBLIC,
      publishedAt: new Date(),

      genres: {
        create: [
          {
            genreId: getGenreId(genreMap, "Horror"),
          },
          {
            genreId: getGenreId(genreMap, "Thriller"),
          },
        ],
      },
    },
  });

  await prisma.chapter.create({
    data: {
      novelId: darkHouse.id,
      title: "The Invitation",
      chapterNumber: 1,
      content:
        "The envelope contained no name, only an address and a single sentence: Come before midnight.",
      publishedAt: new Date(),
    },
  });

  // =========================
  // Letters From Tomorrow
  // =========================

  const unfinished = await prisma.novel.create({
    data: {
      authorId: sophia.id,
      title: "Letters From Tomorrow",
      slug: "letters-from-tomorrow",
      description:
        "A collection of mysterious letters that seem to arrive one day before they are written.",
      creationType: "ORIGINAL",
      contentType: "TEXT",
      status: NovelStatus.DRAFT,
      visibility: NovelVisibility.PRIVATE,

      genres: {
        create: [
          {
            genreId: getGenreId(genreMap, "Historical Fiction"),
          },
        ],
      },
    },
  });

  await prisma.chapter.create({
    data: {
      novelId: unfinished.id,
      title: "The First Letter",
      chapterNumber: 1,
      content:
        "The letter was dated tomorrow, but the handwriting belonged to someone who had been dead for ten years.",
    },
  });

  // --------------------------------------------------
// 5. Media assets
// --------------------------------------------------

await prisma.mediaAsset.createMany({
  data: [
    {
      novelId: lastKingdom.id,
      type: "IMAGE",
      url: "https://example.com/covers/last-kingdom.jpg",
      mimeType: "image/jpeg",
      fileName: "last-kingdom.jpg",
    },

    {
      novelId: lastKingdom.id,
      type: "PDF",
      url: "https://example.com/books/last-kingdom.pdf",
      mimeType: "application/pdf",
      fileName: "last-kingdom.pdf",
    },

    {
      novelId: childrenOfMars.id,
      type: "AUDIO",
      url: "https://example.com/audio/children-of-mars.mp3",
      mimeType: "audio/mpeg",
      fileName: "children-of-mars.mp3",
      duration: 3600,
    },

    {
      novelId: echoesOfLagos.id,
      type: "VIDEO",
      url: "https://example.com/video/echoes-of-lagos.mp4",
      mimeType: "video/mp4",
      fileName: "echoes-of-lagos.mp4",
      duration: 1800,
    },
  ],
});

// --------------------------------------------------
// 6. AI generations
// --------------------------------------------------

await prisma.aIGeneration.createMany({
  data: [
    {
      userId: amara.id,
      novelId: echoesOfLagos.id,
      type: "NOVEL",
      status: "COMPLETED",
      prompt:
        "Create a mysterious fantasy story set beneath modern Lagos.",
      model: "development-placeholder",
      completedAt: new Date(),
    },

    {
      userId: david.id,
      novelId: childrenOfMars.id,
      type: "NOVEL",
      status: "COMPLETED",
      prompt:
        "Create a science fiction story about humans born on Mars.",
      model: "development-placeholder",
      completedAt: new Date(),
    },

    {
      userId: amara.id,
      novelId: lastKingdom.id,
      type: "COVER",
      status: "PROCESSING",
      prompt:
        "Create a cinematic fantasy cover for The Last Kingdom.",
      model: "development-placeholder",
    },

    {
      userId: sophia.id,
      type: "NOVEL",
      status: "FAILED",
      prompt:
        "Create a romantic mystery set in a disappearing garden.",
      model: "development-placeholder",
      error: "Development test generation failure",
    },
  ],
});

  // --------------------------------------------------
  // 7. Likes
  // --------------------------------------------------

  await prisma.like.createMany({
    data: [
      {
        userId: kunle.id,
        novelId: lastKingdom.id,
      },
      {
        userId: david.id,
        novelId: lastKingdom.id,
      },
      {
        userId: sophia.id,
        novelId: echoesOfLagos.id,
      },
      {
        userId: kunle.id,
        novelId: childrenOfMars.id,
      },
      {
        userId: amara.id,
        novelId: midnightRose.id,
      },
    ],
  });

  // --------------------------------------------------
  // 8. Bookmarks
  // --------------------------------------------------

  await prisma.bookmark.createMany({
    data: [
      {
        userId: kunle.id,
        novelId: lastKingdom.id,
      },
      {
        userId: kunle.id,
        novelId: childrenOfMars.id,
      },
      {
        userId: sophia.id,
        novelId: echoesOfLagos.id,
      },
    ],
  });

  // --------------------------------------------------
  // 9. Follows
  // --------------------------------------------------

  await prisma.follow.createMany({
    data: [
      {
        followerId: kunle.id,
        followingId: amara.id,
      },
      {
        followerId: kunle.id,
        followingId: david.id,
      },
      {
        followerId: sophia.id,
        followingId: amara.id,
      },
    ],
  });

  // --------------------------------------------------
  // 10. Comments
  // --------------------------------------------------

  const firstComment = await prisma.comment.create({
    data: {
      userId: kunle.id,
      chapterId: lastKingdomChapter1.id,
      content:
        "This opening is really interesting. I need to know what is behind that door!",
    },
  });

  await prisma.comment.create({
    data: {
      userId: sophia.id,
      chapterId: lastKingdomChapter1.id,
      content: "Same! The atmosphere in this chapter is amazing.",
      parentId: firstComment.id,
    },
  });

  await prisma.comment.create({
    data: {
      userId: kunle.id,
      chapterId: echoesOfLagosChapter1.id,
      content: "This feels like something I'd actually watch as a series.",
    },
  });

  // --------------------------------------------------
  // 11. Reading progress
  // --------------------------------------------------

  await prisma.readingProgress.create({
    data: {
      userId: kunle.id,
      novelId: lastKingdom.id,
      chapterId: lastKingdomChapter2.id,
      progress: 0.63,
    },
  });

  await prisma.readingProgress.create({
    data: {
      userId: kunle.id,
      novelId: childrenOfMars.id,
      chapterId: childrenOfMarsChapter1.id,
      progress: 0.25,
    },
  });

  // --------------------------------------------------
  // Done
  // --------------------------------------------------

  console.log("✅ Database seed completed!");
  console.log("");
  console.log("Created:");
  console.log(`👤 Users: 5`);
  console.log(`📚 Novels: 6`);
  console.log(`📖 Genres: ${genres.length}`);
  console.log(`📑 Chapters: 11`);
  console.log(`❤️ Likes: 5`);
  console.log(`🔖 Bookmarks: 3`);
  console.log(`👥 Follows: 3`);
  console.log(`💬 Comments: 3`);
  console.log(`📈 Reading progress: 2`);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
