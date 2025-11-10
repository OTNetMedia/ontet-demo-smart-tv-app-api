const mongoose = require('mongoose');
const Organization = require('./api/models/Organization');
const Team = require('./api/models/Team');
const Personnel = require('./api/models/Personnel');
const Game = require('./api/models/Game');
const Genre = require('./api/models/Genre');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/basketball-db');
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

const clearDatabase = async () => {
    await Organization.deleteMany({});
    await Team.deleteMany({});
    await Personnel.deleteMany({});
    await Game.deleteMany({});
    await Genre.deleteMany({});
    console.log('✅ Database cleared');
};

const getRandomElements = (arr, num) => {
    if (num > arr.length) return arr;
    return arr.sort(() => 0.5 - Math.random()).slice(0, num);
};

// Populate database
const populateDatabase = async () => {
    await clearDatabase();

    // Create organizations
    const nba = await Organization.create({ name: 'NBA', location: 'USA' });

    // Create teams
    const teams = await Team.insertMany([
        { name: 'LA Lakers', organization: nba._id },
        { name: 'Chicago Bulls', organization: nba._id },
        { name: 'Miami Heat', organization: nba._id },
        { name: 'Boston Celtics', organization: nba._id },
        { name: 'Golden State Warriors', organization: nba._id },
        { name: 'New York Knicks', organization: nba._id },
        { name: 'Phoenix Suns', organization: nba._id },
        { name: 'San Antonio Spurs', organization: nba._id },
    ]);

    // Create genres
    const genres = await Genre.insertMany([
        { name: 'Playoff' },
        { name: 'Regular Season' },
        { name: 'Finals' },
    ]);

    // Create players
    const players = await Personnel.insertMany([
        {
            first_name: 'LeBron',
            last_name: 'James',
            role: 'Player',
            team: teams[0]._id,
        },
        {
            first_name: 'Michael',
            last_name: 'Jordan',
            role: 'Player',
            team: teams[1]._id,
        },
        {
            first_name: 'Dwyane',
            last_name: 'Wade',
            role: 'Player',
            team: teams[2]._id,
        },
        {
            first_name: 'Larry',
            last_name: 'Bird',
            role: 'Player',
            team: teams[3]._id,
        },
        {
            first_name: 'Stephen',
            last_name: 'Curry',
            role: 'Player',
            team: teams[4]._id,
        },
        {
            first_name: 'Kevin',
            last_name: 'Durant',
            role: 'Player',
            team: teams[5]._id,
        },
    ]);

    // Create coaches
    const coaches = await Personnel.insertMany([
        {
            first_name: 'Phil',
            last_name: 'Jackson',
            role: 'Coach',
            team: teams[1]._id,
        },
        {
            first_name: 'Pat',
            last_name: 'Riley',
            role: 'Coach',
            team: teams[2]._id,
        },
        {
            first_name: 'Gregg',
            last_name: 'Popovich',
            role: 'Coach',
            team: teams[7]._id,
        },
    ]);

    // Create referees
    const referees = await Personnel.insertMany([
        { first_name: 'Scott', last_name: 'Foster', role: 'Referee' },
        { first_name: 'Joey', last_name: 'Crawford', role: 'Referee' },
    ]);

    // Generate 20 random games
    const games = [];
    for (let i = 1; i <= 20; i++) {
        const homeTeam = teams[Math.floor(Math.random() * teams.length)];
        let awayTeam;
        do {
            awayTeam = teams[Math.floor(Math.random() * teams.length)];
        } while (awayTeam._id.toString() === homeTeam._id.toString());

        const gameGenres = getRandomElements(genres, 1);
        const gamePersonnel = getRandomElements([...players, ...coaches, ...referees], 4);

        games.push({
            title: `${homeTeam.name} vs ${awayTeam.name}`,
            video: Math.random() > 0.5,
            media_type: 'basketball',
            original_language: 'en',
            original_title: `${homeTeam.name} vs ${awayTeam.name}`,
            overview: `Game between ${homeTeam.name} and ${awayTeam.name}`,
            popularity: (Math.random() * 100).toFixed(1),
            poster_path: `/${homeTeam.name.toLowerCase()}-${awayTeam.name.toLowerCase()}.jpg`,
            backdrop_path: `/${homeTeam.name.toLowerCase()}-${awayTeam.name.toLowerCase()}-bg.jpg`,
            vote_average: (Math.random() * 5 + 5).toFixed(1), // Between 5 and 10
            vote_count: Math.floor(Math.random() * 5000 + 500),
            home_team: homeTeam._id,
            away_team: awayTeam._id,
            genres: gameGenres.map((g) => g._id),
            date_played: `2024-04-${String(i % 30).padStart(2, '0')}`,
            home_score: Math.floor(Math.random() * 120),
            away_score: Math.floor(Math.random() * 120),
            played: Math.random() > 0.5,
            personnel: gamePersonnel.map((p) => p._id),
        });
    }

    await Game.insertMany(games);

    console.log('✅ Database populated with organizations, teams, personnel, and 20 games!');
    mongoose.connection.close();
};

// Run script
connectDB().then(populateDatabase);
