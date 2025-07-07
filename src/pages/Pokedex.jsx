// Pokedex.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Button from '@mui/material/Button';
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import "../Battle.css";
import "../Pokedex.css"; 

export default function Pokedex() {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [team1, setTeam1] = useState([]);
  const [team2, setTeam2] = useState([]);
  const [allPokemonNames, setAllPokemonNames] = useState([]);
  const [suggestions1, setSuggestions1] = useState([]);
  const [suggestions2, setSuggestions2] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllPokemonNames = async () => {
      try {
        const res = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=10000');
        const names = res.data.results.map(p => p.name);
        setAllPokemonNames(names);
      } catch (err) {
        console.error('Failed to load Pokémon names');
      }
    };
    fetchAllPokemonNames();
  }, []);

  const handleBattle = () => {
    navigate('/battle', { state: { team1, team2 } });
  };

  const handleAdd = async (team, setTeam, input, setInput, setSuggestions) => {
    if (!input || team.length >= 3) return;
    try {
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${input.toLowerCase()}`);
      const data = res.data;
      const newPokemon = {
        name: data.name,
        image: data.sprites.front_default,
        image2: data.sprites.back_default,
        abilities: data.abilities,
        defense: data.stats.find(stat => stat.stat.name === "defense").base_stat,
        moves: data.moves,
      };
      setTeam([...team, newPokemon]);
      setInput('');
      setSuggestions([]);
    } catch {
      alert('Pokémon not found!');
    }
  };

  const renderSuggestions = (suggestions, setInput, setSuggestions) => (
    <div className="suggestion-box">
      {suggestions.map((name, idx) => (
        <div
          key={idx}
          onClick={() => {
            setInput(name);
            setSuggestions([]);
          }}
          className="suggestion-item"
        >
          {name}
        </div>
      ))}
    </div>
  );

  const renderCard = (p) => (
    <div key={p.name} className="pokemon-card">
      <img src={p.image} alt={p.name} className="pokemon-img" />
      <Card className="card-box">
        <CardActionArea>
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              style={{
                textTransform: 'uppercase',
                fontFamily: "'Pokemon Solid', sans-serif",
                fontSize: p.name.length > 10 ? '14px' : '18px',
                wordBreak: 'break-word',
                lineHeight: '1.2',
              }}
            >
              {p.name}
            </Typography>
            <Typography
              variant="body2"
              style={{
                textTransform: 'uppercase',
                fontFamily: "'Pokemon Solid', sans-serif"
              }}
            >
              Defense: {p.defense}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );

  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <img src="https://fontmeme.com/permalink/250520/fd5a7fbba7a9bcd4829a7f5acbfb2ae4.png" alt="pokemon-font" />
      </div>

      <div className="pokedex-container">
        {/* Team 1 */}
        <div className="team-container">
          <h1 className="team-heading">TEAM 1</h1>
          <p className="team-subheading">Choose your 3 Pokémons</p>
          {team1.length < 3 && (
            <div>
              <div className="input-wrapper">
                <TextField
                  variant="outlined"
                  placeholder="Enter Pokémon name"
                  value={input1}
                  onChange={(e) => {
                    const val = e.target.value.toLowerCase();
                    setInput1(val);
                    setSuggestions1(allPokemonNames.filter(name => name.startsWith(val)).slice(0, 5));
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd(team1, setTeam1, input1, setInput1, setSuggestions1)}
                />
                {suggestions1.length > 0 && renderSuggestions(suggestions1, setInput1, setSuggestions1)}
              </div>
              <Button variant="contained" style={{ marginTop: '10px' }} endIcon={<SearchIcon />}
                onClick={() => handleAdd(team1, setTeam1, input1, setInput1, setSuggestions1)}>
                Choose
              </Button>
            </div>
          )}
          <div className="card-list">{team1.map(renderCard)}</div>
        </div>

        {/* Team 2 */}
        <div className="team-container">
          <h1 className="team-heading">TEAM 2</h1>
          <p className="team-subheading">Choose your 3 Pokémons</p>
          {team2.length < 3 && (
            <div>
              <div className="input-wrapper">
                <TextField
                  variant="outlined"
                  placeholder="Enter Pokémon name"
                  value={input2}
                  onChange={(e) => {
                    const val = e.target.value.toLowerCase();
                    setInput2(val);
                    setSuggestions2(allPokemonNames.filter(name => name.startsWith(val)).slice(0, 5));
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd(team2, setTeam2, input2, setInput2, setSuggestions2)}
                />
                {suggestions2.length > 0 && renderSuggestions(suggestions2, setInput2, setSuggestions2)}
              </div>
              <Button variant="contained" style={{ marginTop: '10px' }} endIcon={<SearchIcon />}
                onClick={() => handleAdd(team2, setTeam2, input2, setInput2, setSuggestions2)}>
                Choose
              </Button>
            </div>
          )}
          <div className="card-list">{team2.map(renderCard)}</div>
        </div>
      </div>

      {(team1.length === 3 && team2.length === 3) && (
        <div className="battle-btn-container">
          <Button variant="outlined" color="error"
            style={{ fontSize: '70px', fontFamily: "Pokemon Solid, sans-serif"}}
            startIcon={<CatchingPokemonIcon style={{ fontSize: '70px' }} />}
            onClick={handleBattle}>
            BATTLE
          </Button>
        </div>
      )}
    </>
  );
}
