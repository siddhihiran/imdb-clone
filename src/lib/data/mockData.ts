export interface MovieItem {
  id: number;
  title: string;
  rating: number;
  year: number;
  duration?: string;
  genre: string[];
  director?: string;
  description: string;
  image: string;
  backdrop?: string;
  cast?: {
    id: number;
    name: string;
    role: string;
    image: string;
    bio: string;
  }[];
  trailer?: string;
  awards?: string[];
  boxOffice?: string;
  language?: string;
  productionCompany?: string;
  releaseDate?: string;
  metacriticScore?: number;
  rottenTomatoesScore?: number;
  votes?: string;
  rank?: number;
}

export interface ActorItem {
  id: number;
  name: string;
  birthDate: string;
  birthPlace: string;
  nationality: string;
  height: string;
  biography: string;
  image: string;
  coverImage?: string;
  awards: {
    name: string;
    year: number;
    category: string;
    film: string;
  }[];
  socialMedia: {
    instagram: string;
    twitter: string;
    imdb: string;
  };
  knownFor: {
    id: number;
    title: string;
    role: string;
    year: number;
    rating: number;
    image: string;
  }[];
  stats: {
    moviesCount: number;
    totalAwards: number;
    avgRating: number;
    yearsActive: string;
  };
  filmography?: {
    id: number | string;
    title: string;
    role: string;
    roleCategory: "Lead" | "Supporting" | "Voice / Cameo" | "Director / Producer";
    year: number;
    rating: number;
    genre: string[];
    character: string;
    image?: string;
  }[];
  upcomingProjects: {
    title: string;
    role: string;
    status: string;
    expectedRelease: string;
  }[];
}

export const moviesData: MovieItem[] = [
  {
    id: 1,
    title: "Dune: Part Two",
    rating: 8.8,
    year: 2024,
    duration: "166 min",
    genre: ["Action", "Adventure", "Drama", "Sci-Fi"],
    director: "Denis Villeneuve",
    description:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.",
    image:
      "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?auto=format&fit=crop&w=2000&q=80",
    backdrop:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=2000&q=80",
    cast: [
      {
        id: 1,
        name: "Timothée Chalamet",
        role: "Paul Atreides",
        image:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
        bio: "Rising star known for his compelling performances",
      },
      {
        id: 2,
        name: "Zendaya",
        role: "Chani",
        image:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        bio: "Multi-talented actress and fashion icon",
      },
    ],
    trailer: "https://www.youtube.com/watch?v=Way9Dexny3w",
    awards: ["Academy Award Nominee", "Golden Globe Nominee"],
    boxOffice: "$494.7M",
    language: "English",
    productionCompany: "Legendary Entertainment",
    releaseDate: "2024-03-01",
    metacriticScore: 81,
    rottenTomatoesScore: 94,
  },
  {
    id: 2,
    title: "Oppenheimer",
    rating: 8.9,
    year: 2023,
    duration: "180 min",
    genre: ["Biography", "Drama", "History"],
    director: "Christopher Nolan",
    description:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, exploring the moral complexities and consequences of scientific discovery.",
    image:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=2000&q=80",
    backdrop:
      "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?auto=format&fit=crop&w=2000&q=80",
    cast: [
      {
        id: 3,
        name: "Cillian Murphy",
        role: "J. Robert Oppenheimer",
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        bio: "Versatile actor known for intense performances",
      },
      {
        id: 4,
        name: "Emily Blunt",
        role: "Katherine Oppenheimer",
        image:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
        bio: "Acclaimed actress with numerous awards",
      },
    ],
    trailer: "https://www.youtube.com/watch?v=uYPbbksJxIg",
    awards: ["Academy Award Winner", "BAFTA Winner", "Golden Globe Winner"],
    boxOffice: "$957.8M",
    language: "English",
    productionCompany: "Universal Pictures",
    releaseDate: "2023-07-21",
    metacriticScore: 89,
    rottenTomatoesScore: 93,
  },
  {
    id: 3,
    title: "Poor Things",
    rating: 8.4,
    year: 2023,
    duration: "141 min",
    genre: ["Comedy", "Drama", "Romance", "Sci-Fi"],
    director: "Yorgos Lanthimos",
    description:
      "The incredible tale of Bella Baxter, a young woman brought back to life by the brilliant and unorthodox scientist Dr. Godwin Baxter. Under his protection, Bella is eager to learn.",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=2000&q=80",
    backdrop:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=2000&q=80",
    cast: [
      {
        id: 5,
        name: "Emma Stone",
        role: "Bella Baxter",
        image:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
        bio: "Academy Award-winning actress",
      },
      {
        id: 6,
        name: "Willem Dafoe",
        role: "Dr. Godwin Baxter",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        bio: "Legendary actor with diverse roles",
      },
    ],
    trailer: "https://www.youtube.com/watch?v=RlbR5N6veqw",
    awards: ["Academy Award Winner", "Venice Film Festival Winner"],
    boxOffice: "$102.3M",
    language: "English",
    productionCompany: "Searchlight Pictures",
    releaseDate: "2023-12-08",
    metacriticScore: 87,
    rottenTomatoesScore: 92,
  },
  {
    id: 4,
    title: "The Batman",
    rating: 8.5,
    year: 2024,
    duration: "176 min",
    genre: ["Action", "Crime", "Drama"],
    director: "Matt Reeves",
    description:
      "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
    image:
      "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=800&q=80",
    backdrop:
      "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=2000&q=80",
    cast: [
      {
        id: 9,
        name: "Robert Pattinson",
        role: "Bruce Wayne / Batman",
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        bio: "Acclaimed British actor",
      },
    ],
    trailer: "https://www.youtube.com/watch?v=mqqft2x_Aa4",
    awards: ["Oscar Nominee"],
    boxOffice: "$772.2M",
    language: "English",
    productionCompany: "Warner Bros.",
    releaseDate: "2022-03-04",
    metacriticScore: 72,
    rottenTomatoesScore: 85,
  },
  {
    id: 5,
    title: "Killers of the Flower Moon",
    rating: 8.7,
    year: 2023,
    duration: "206 min",
    genre: ["Crime", "Drama", "History"],
    director: "Martin Scorsese",
    description:
      "When oil is discovered in 1920s Oklahoma under Osage Nation land, the Osage people are murdered one by one until the FBI steps in to unravel the mystery.",
    image:
      "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&w=800&q=80",
    backdrop:
      "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&w=2000&q=80",
    cast: [
      {
        id: 10,
        name: "Leonardo DiCaprio",
        role: "Ernest Burkhart",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        bio: "Oscar winning actor",
      },
    ],
    trailer: "https://www.youtube.com/watch?v=EP34Yoxs3FQ",
    awards: ["Academy Award Nominee", "Cannes Film Festival Honoree"],
    boxOffice: "$157M",
    language: "English",
    productionCompany: "Apple Studios",
    releaseDate: "2023-10-20",
    metacriticScore: 89,
    rottenTomatoesScore: 93,
  },
];

export const actorsData: ActorItem[] = [
  {
    id: 1,
    name: "Timothée Chalamet",
    birthDate: "December 27, 1995",
    birthPlace: "New York City, New York, USA",
    nationality: "American-French",
    height: "5' 10\" (1.78 m)",
    biography:
      "Timothée Hal Chalamet is an American actor. He has received various accolades, including nominations for an Academy Award, two Golden Globe Awards, and three BAFTA Film Awards. Born and raised in New York City, he began his career on the stage and in television productions, appearing in the drama series Homeland in 2012.",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1492446845049-9c50cc313f00?auto=format&fit=crop&w=2000&q=80",
    awards: [
      {
        name: "Academy Award Nomination",
        year: 2018,
        category: "Best Actor",
        film: "Call Me by Your Name",
      },
      {
        name: "Golden Globe Nomination",
        year: 2018,
        category: "Best Actor - Drama",
        film: "Call Me by Your Name",
      },
      {
        name: "BAFTA Nomination",
        year: 2018,
        category: "Best Actor",
        film: "Call Me by Your Name",
      },
    ],
    socialMedia: {
      instagram: "https://instagram.com/tchalamet",
      twitter: "https://twitter.com/realchalamet",
      imdb: "https://www.imdb.com/name/nm3154303/",
    },
    knownFor: [
      {
        id: 1,
        title: "Dune: Part Two",
        role: "Paul Atreides",
        year: 2024,
        rating: 8.8,
        image:
          "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 2,
        title: "Wonka",
        role: "Willy Wonka",
        year: 2023,
        rating: 7.2,
        image:
          "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 3,
        title: "Dune",
        role: "Paul Atreides",
        year: 2021,
        rating: 8.0,
        image:
          "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80",
      },
    ],
    stats: {
      moviesCount: 18,
      totalAwards: 12,
      avgRating: 8.4,
      yearsActive: "2012-present",
    },
    filmography: [
      { id: 1, title: "Dune: Part Two", role: "Paul Atreides", roleCategory: "Lead", year: 2024, rating: 8.8, genre: ["Sci-Fi", "Adventure", "Action"], character: "Paul Atreides", image: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?auto=format&fit=crop&w=400&q=80" },
      { id: 2, title: "Wonka", role: "Willy Wonka", roleCategory: "Lead", year: 2023, rating: 7.2, genre: ["Comedy", "Adventure", "Musical"], character: "Willy Wonka", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80" },
      { id: 3, title: "Bones and All", role: "Lee", roleCategory: "Lead", year: 2022, rating: 6.9, genre: ["Drama", "Romance", "Horror"], character: "Lee", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&q=80" },
      { id: 4, title: "Dune", role: "Paul Atreides", roleCategory: "Lead", year: 2021, rating: 8.0, genre: ["Sci-Fi", "Adventure", "Drama"], character: "Paul Atreides", image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=400&q=80" },
      { id: 5, title: "The French Dispatch", role: "Zeffirelli", roleCategory: "Supporting", year: 2021, rating: 7.1, genre: ["Comedy", "Drama", "Romance"], character: "Student Revolutionary Zeffirelli", image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=400&q=80" },
      { id: 6, title: "Don't Look Up", role: "Yule", roleCategory: "Supporting", year: 2021, rating: 7.2, genre: ["Comedy", "Sci-Fi", "Drama"], character: "Yule", image: "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&w=400&q=80" },
      { id: 7, title: "Little Women", role: "Theodore 'Laurie' Laurence", roleCategory: "Lead", year: 2019, rating: 7.8, genre: ["Drama", "Romance"], character: "Laurie Laurence", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" },
      { id: 8, title: "The King", role: "King Henry V", roleCategory: "Lead", year: 2019, rating: 7.3, genre: ["Biography", "Drama", "History"], character: "Hal / Henry V", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80" },
      { id: 9, title: "A Rainy Day in New York", role: "Gatsby Welles", roleCategory: "Lead", year: 2019, rating: 6.5, genre: ["Comedy", "Romance"], character: "Gatsby", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" },
      { id: 10, title: "Beautiful Boy", role: "Nic Sheff", roleCategory: "Lead", year: 2018, rating: 7.4, genre: ["Biography", "Drama"], character: "Nic Sheff", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80" },
      { id: 11, title: "Call Me by Your Name", role: "Elio Perlman", roleCategory: "Lead", year: 2017, rating: 7.8, genre: ["Drama", "Romance"], character: "Elio Perlman", image: "https://images.unsplash.com/photo-1492446845049-9c50cc313f00?auto=format&fit=crop&w=400&q=80" },
      { id: 12, title: "Lady Bird", role: "Kyle Scheible", roleCategory: "Supporting", year: 2017, rating: 7.4, genre: ["Comedy", "Drama"], character: "Kyle", image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=400&q=80" },
      { id: 13, title: "Hostiles", role: "Private Philippe DeJardin", roleCategory: "Supporting", year: 2017, rating: 7.2, genre: ["Drama", "Western"], character: "Pvt. DeJardin", image: "https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?auto=format&fit=crop&w=400&q=80" },
      { id: 14, title: "Interstellar", role: "Young Tom", roleCategory: "Supporting", year: 2014, rating: 8.7, genre: ["Sci-Fi", "Adventure", "Drama"], character: "Tom Cooper (young)", image: "https://images.unsplash.com/photo-1533073526757-2c8ca1df9f1c?auto=format&fit=crop&w=400&q=80" },
      { id: 15, title: "Homeland", role: "Finn Walden", roleCategory: "Supporting", year: 2012, rating: 8.3, genre: ["Drama", "Mystery", "Thriller"], character: "Finn Walden", image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=400&q=80" }
    ],
    upcomingProjects: [
      {
        title: "Bob Dylan Biopic",
        role: "Bob Dylan",
        status: "Pre-production",
        expectedRelease: "2025",
      },
    ],
  },
  {
    id: 2,
    name: "Zendaya",
    birthDate: "September 1, 1996",
    birthPlace: "Oakland, California, USA",
    nationality: "American",
    height: "5' 10\" (1.78 m)",
    biography:
      "Zendaya is an American actress and singer. She began her career as a child model and backup dancer before gaining prominence for her role as Rocky Blue on the Disney Channel sitcom Shake It Up. She has gone on to star in numerous acclaimed films and television series.",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?auto=format&fit=crop&w=2000&q=80",
    awards: [
      {
        name: "Emmy Award",
        year: 2020,
        category: "Outstanding Lead Actress",
        film: "Euphoria",
      },
      {
        name: "Emmy Award",
        year: 2022,
        category: "Outstanding Lead Actress",
        film: "Euphoria",
      },
    ],
    socialMedia: {
      instagram: "https://instagram.com/zendaya",
      twitter: "https://twitter.com/zendaya",
      imdb: "https://www.imdb.com/name/nm3918035/",
    },
    knownFor: [
      {
        id: 1,
        title: "Dune: Part Two",
        role: "Chani",
        year: 2024,
        rating: 8.8,
        image:
          "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 4,
        title: "Spider-Man: No Way Home",
        role: "MJ",
        year: 2021,
        rating: 8.2,
        image:
          "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80",
      },
    ],
    stats: {
      moviesCount: 15,
      totalAwards: 14,
      avgRating: 8.2,
      yearsActive: "2010-present",
    },
    filmography: [
      { id: 101, title: "Challengers", role: "Tashi Duncan", roleCategory: "Lead", year: 2024, rating: 7.7, genre: ["Drama", "Romance", "Sport"], character: "Tashi Duncan", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" },
      { id: 1, title: "Dune: Part Two", role: "Chani", roleCategory: "Lead", year: 2024, rating: 8.8, genre: ["Sci-Fi", "Adventure", "Action"], character: "Chani", image: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?auto=format&fit=crop&w=400&q=80" },
      { id: 102, title: "Euphoria", role: "Rue Bennett", roleCategory: "Lead", year: 2022, rating: 8.3, genre: ["Drama"], character: "Rue Bennett", image: "https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?auto=format&fit=crop&w=400&q=80" },
      { id: 4, title: "Spider-Man: No Way Home", role: "MJ", roleCategory: "Lead", year: 2021, rating: 8.2, genre: ["Action", "Adventure", "Sci-Fi"], character: "Michelle 'MJ' Jones", image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=400&q=80" },
      { id: 103, title: "Dune", role: "Chani", roleCategory: "Supporting", year: 2021, rating: 8.0, genre: ["Sci-Fi", "Adventure", "Drama"], character: "Chani", image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=400&q=80" },
      { id: 104, title: "Malcolm & Marie", role: "Marie", roleCategory: "Lead", year: 2021, rating: 6.7, genre: ["Drama", "Romance"], character: "Marie Jones", image: "https://images.unsplash.com/photo-1492446845049-9c50cc313f00?auto=format&fit=crop&w=400&q=80" },
      { id: 105, title: "Space Jam: A New Legacy", role: "Lola Bunny", roleCategory: "Voice / Cameo", year: 2021, rating: 4.5, genre: ["Animation", "Comedy", "Family"], character: "Lola Bunny (voice)", image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=400&q=80" },
      { id: 106, title: "Spider-Man: Far From Home", role: "MJ", roleCategory: "Lead", year: 2019, rating: 7.4, genre: ["Action", "Adventure", "Sci-Fi"], character: "Michelle 'MJ' Jones", image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=400&q=80" },
      { id: 107, title: "The Greatest Showman", role: "Anne Wheeler", roleCategory: "Lead", year: 2017, rating: 7.5, genre: ["Biography", "Drama", "Musical"], character: "Anne Wheeler", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80" },
      { id: 108, title: "Spider-Man: Homecoming", role: "Michelle", roleCategory: "Supporting", year: 2017, rating: 7.4, genre: ["Action", "Adventure", "Sci-Fi"], character: "Michelle", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80" },
      { id: 109, title: "K.C. Undercover", role: "K.C. Cooper", roleCategory: "Lead", year: 2015, rating: 6.3, genre: ["Action", "Comedy", "Family"], character: "K.C. Cooper", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80" }
    ],
    upcomingProjects: [
      {
        title: "Challengers",
        role: "Tashi Donaldson",
        status: "Post-production",
        expectedRelease: "2024",
      },
    ],
  },
];
