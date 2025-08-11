const fs = require('fs');

/**
 * Converts NFL schedule from diff_format to old format
 * Usage: node scripts/convert_schedule_format.js [input_file] [output_file]
 */

// Original format: https://fixturedownload.com/feed/json/nfl-2025
// or https://fixturedownload.com/results/nfl-2025

function convertScheduleFormat(inputFile, outputFile) {
  try {
    console.log('Reading file...');
    // Read the input file
    const diffFormatData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    console.log('File read successfully');
    console.log('File structure:', Object.keys(diffFormatData));
    
    if (diffFormatData.games) {
      console.log('Number of games:', diffFormatData.games.length);
    } else {
      console.log('No games property found. Available properties:', Object.keys(diffFormatData));
      console.log('First few lines of data:', JSON.stringify(diffFormatData).substring(0, 500));
    }

    // Check if the file is already in the old format
    if (diffFormatData.season && diffFormatData.weeks) {
      console.log('File is already in the old format!');
      console.log(`Total weeks: ${diffFormatData.weeks.length}`);
      console.log(`Total games: ${diffFormatData.weeks.reduce((sum, week) => sum + week.games.length, 0)}`);
      return;
    }

    // Convert to the old format
    const convertedData = {
      season: 2025,
      weeks: []
    };

    // Group games by RoundNumber (week)
    const gamesByWeek = {};
    diffFormatData.games.forEach(game => {
      const weekNumber = game.RoundNumber;
      if (!gamesByWeek[weekNumber]) {
        gamesByWeek[weekNumber] = [];
      }
      
      // Convert UTC date to local date and time
      const utcDate = new Date(game.DateUtc);
      const localDate = utcDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      const localTime = utcDate.toTimeString().slice(0, 5); // HH:MM format
      
      // Determine channel based on time (this is a simplified mapping)
      let channel = "CBS"; // default
      const hour = utcDate.getUTCHours();
      const dayOfWeek = utcDate.getUTCDay();
      
      if (dayOfWeek === 4) { // Thursday
        channel = "Prime Video";
      } else if (dayOfWeek === 0) { // Sunday
        if (hour >= 0 && hour < 2) { // 8-10 PM ET
          channel = "NBC";
        } else if (hour >= 2 && hour < 4) { // 10 PM - 12 AM ET
          channel = "ABC/ESPN";
        } else if (hour >= 17 && hour < 19) { // 1-3 PM ET
          channel = "CBS";
        } else if (hour >= 19 && hour < 21) { // 3-5 PM ET
          channel = "FOX";
        } else if (hour >= 21 && hour < 23) { // 5-7 PM ET
          channel = "CBS";
        } else if (hour >= 23) { // 7-9 PM ET
          channel = "NBC";
        }
      } else if (dayOfWeek === 1) { // Monday
        if (hour >= 0 && hour < 2) { // 8-10 PM ET
          channel = "ABC/ESPN";
        } else if (hour >= 2) { // 10 PM+ ET
          channel = "ESPN";
        }
      }
      
      gamesByWeek[weekNumber].push({
        date: localDate,
        time: localTime,
        awayTeam: game.AwayTeam,
        homeTeam: game.HomeTeam,
        channel: channel
      });
    });

    console.log('Games grouped by week. Number of weeks:', Object.keys(gamesByWeek).length);

    // Convert to weeks array
    Object.keys(gamesByWeek).sort((a, b) => parseInt(a) - parseInt(b)).forEach(weekNumber => {
      convertedData.weeks.push({
        weekNumber: parseInt(weekNumber),
        games: gamesByWeek[weekNumber]
      });
    });

    console.log('Writing converted data...');
    // Write the converted data to the output file
    fs.writeFileSync(outputFile, JSON.stringify(convertedData, null, 2));

    console.log('Schedule format converted successfully!');
    console.log(`Total weeks: ${convertedData.weeks.length}`);
    console.log(`Total games: ${convertedData.weeks.reduce((sum, week) => sum + week.games.length, 0)}`);
    console.log(`Output written to: ${outputFile}`);
  } catch (error) {
    console.error('Error during conversion:', error);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
const inputFile = args[0] || 'frontend/src/assets/nfl-schedule-2025-diff_format.json';
const outputFile = args[1] || 'frontend/src/assets/nfl-schedule-2025-converted.json';

console.log(`Converting ${inputFile} to ${outputFile}...`);
convertScheduleFormat(inputFile, outputFile);
