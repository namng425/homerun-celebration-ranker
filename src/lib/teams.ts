import type { Team } from "./types";

export const teams: Team[] = [
  { id: "baltimore-orioles", city: "Baltimore", nickname: "Orioles", name: "Baltimore Orioles", abbreviation: "BAL", league: "AL", division: "East" },
  { id: "boston-red-sox", city: "Boston", nickname: "Red Sox", name: "Boston Red Sox", abbreviation: "BOS", league: "AL", division: "East" },
  { id: "new-york-yankees", city: "New York", nickname: "Yankees", name: "New York Yankees", abbreviation: "NYY", league: "AL", division: "East" },
  { id: "tampa-bay-rays", city: "Tampa Bay", nickname: "Rays", name: "Tampa Bay Rays", abbreviation: "TB", league: "AL", division: "East" },
  { id: "toronto-blue-jays", city: "Toronto", nickname: "Blue Jays", name: "Toronto Blue Jays", abbreviation: "TOR", league: "AL", division: "East" },
  { id: "chicago-white-sox", city: "Chicago", nickname: "White Sox", name: "Chicago White Sox", abbreviation: "CWS", league: "AL", division: "Central" },
  { id: "cleveland-guardians", city: "Cleveland", nickname: "Guardians", name: "Cleveland Guardians", abbreviation: "CLE", league: "AL", division: "Central" },
  { id: "detroit-tigers", city: "Detroit", nickname: "Tigers", name: "Detroit Tigers", abbreviation: "DET", league: "AL", division: "Central" },
  { id: "kansas-city-royals", city: "Kansas City", nickname: "Royals", name: "Kansas City Royals", abbreviation: "KC", league: "AL", division: "Central" },
  { id: "minnesota-twins", city: "Minnesota", nickname: "Twins", name: "Minnesota Twins", abbreviation: "MIN", league: "AL", division: "Central" },
  { id: "houston-astros", city: "Houston", nickname: "Astros", name: "Houston Astros", abbreviation: "HOU", league: "AL", division: "West" },
  { id: "los-angeles-angels", city: "Los Angeles", nickname: "Angels", name: "Los Angeles Angels", abbreviation: "LAA", league: "AL", division: "West" },
  { id: "athletics", city: "Athletics", nickname: "Athletics", name: "Athletics", abbreviation: "ATH", league: "AL", division: "West" },
  { id: "seattle-mariners", city: "Seattle", nickname: "Mariners", name: "Seattle Mariners", abbreviation: "SEA", league: "AL", division: "West" },
  { id: "texas-rangers", city: "Texas", nickname: "Rangers", name: "Texas Rangers", abbreviation: "TEX", league: "AL", division: "West" },
  { id: "atlanta-braves", city: "Atlanta", nickname: "Braves", name: "Atlanta Braves", abbreviation: "ATL", league: "NL", division: "East" },
  { id: "miami-marlins", city: "Miami", nickname: "Marlins", name: "Miami Marlins", abbreviation: "MIA", league: "NL", division: "East" },
  { id: "new-york-mets", city: "New York", nickname: "Mets", name: "New York Mets", abbreviation: "NYM", league: "NL", division: "East" },
  { id: "philadelphia-phillies", city: "Philadelphia", nickname: "Phillies", name: "Philadelphia Phillies", abbreviation: "PHI", league: "NL", division: "East" },
  { id: "washington-nationals", city: "Washington", nickname: "Nationals", name: "Washington Nationals", abbreviation: "WSH", league: "NL", division: "East" },
  { id: "chicago-cubs", city: "Chicago", nickname: "Cubs", name: "Chicago Cubs", abbreviation: "CHC", league: "NL", division: "Central" },
  { id: "cincinnati-reds", city: "Cincinnati", nickname: "Reds", name: "Cincinnati Reds", abbreviation: "CIN", league: "NL", division: "Central" },
  { id: "milwaukee-brewers", city: "Milwaukee", nickname: "Brewers", name: "Milwaukee Brewers", abbreviation: "MIL", league: "NL", division: "Central" },
  { id: "pittsburgh-pirates", city: "Pittsburgh", nickname: "Pirates", name: "Pittsburgh Pirates", abbreviation: "PIT", league: "NL", division: "Central" },
  { id: "st-louis-cardinals", city: "St. Louis", nickname: "Cardinals", name: "St. Louis Cardinals", abbreviation: "STL", league: "NL", division: "Central" },
  { id: "arizona-diamondbacks", city: "Arizona", nickname: "Diamondbacks", name: "Arizona Diamondbacks", abbreviation: "AZ", league: "NL", division: "West" },
  { id: "colorado-rockies", city: "Colorado", nickname: "Rockies", name: "Colorado Rockies", abbreviation: "COL", league: "NL", division: "West" },
  { id: "los-angeles-dodgers", city: "Los Angeles", nickname: "Dodgers", name: "Los Angeles Dodgers", abbreviation: "LAD", league: "NL", division: "West" },
  { id: "san-diego-padres", city: "San Diego", nickname: "Padres", name: "San Diego Padres", abbreviation: "SD", league: "NL", division: "West" },
  { id: "san-francisco-giants", city: "San Francisco", nickname: "Giants", name: "San Francisco Giants", abbreviation: "SF", league: "NL", division: "West" },
];

export const teamIds = new Set(teams.map((team) => team.id));

