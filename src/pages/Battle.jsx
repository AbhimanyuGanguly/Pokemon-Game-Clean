import { useLocation, useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useState, useEffect } from 'react';
import "../Battle.css";

export default function Battle() {
  const location = useLocation();
  const navigate = useNavigate();
  const { team1, team2 } = location.state || { team1: [], team2: [] };
  const [index1, setIndex1] = useState(0);
  const [index2, setIndex2] = useState(0);
  const [pokemon1, setPokemon1] = useState(team1[0]);
  const [pokemon2, setPokemon2] = useState(team2[0]);
  const [hp1, setHp1] = useState(100);
  const [hp2, setHp2] = useState(100);
  const [count, setCount] = useState(0);

  const getMovePower = async (moveUrl) => {
    try {
      const res = await axios.get(moveUrl);
      return res.data.power ?? 0;
    } catch {
      return 0;
    }
  };

  const attack1 = async (pokemon, moveUrl) => {
    const power = await getMovePower(moveUrl);
    let damage = power - Math.floor(pokemon.defense / 10);
    if (damage < 0) damage = 0;
    setHp2(prev => Math.max(prev - damage, 0));
    setCount(1);
  };

  const attack2 = async (pokemon, moveUrl) => {
    const power = await getMovePower(moveUrl);
    let damage = power - Math.floor(pokemon.defense / 10);
    if (damage < 0) damage = 0;
    setHp1(prev => Math.max(prev - damage, 0));
    setCount(0);
  };

  useEffect(() => {
    if (hp1 === 0 && index1 < team1.length - 1) {
      const next = index1 + 1;
      setIndex1(next);
      setPokemon1(team1[next]);
      setHp1(100);
    }
  }, [hp1, index1, team1]);

  useEffect(() => {
    if (hp2 === 0 && index2 < team2.length - 1) {
      const next = index2 + 1;
      setIndex2(next);
      setPokemon2(team2[next]);
      setHp2(100);
    }
  }, [hp2, index2, team2]);

  const battleEnded = (index1 === team1.length - 1 && hp1 === 0) || (index2 === team2.length - 1 && hp2 === 0);

  useEffect(() => {
    if (battleEnded) {
      const timer = setTimeout(() => navigate('/'), 5000);
      return () => clearTimeout(timer);
    }
  }, [battleEnded, navigate]);

  return (
    <>
      {(hp1 > 0 && hp2 > 0) &&
        <div className="battle-container">
          {/* Player 1 */}
          <div className="player-card">
            <img className="player-label" src="https://fontmeme.com/permalink/250521/df3127a99d94b9bcd891686b2607e3a6.png" alt="player1" />
            <img
              className="pokemon-img"
              src={pokemon1.image2 || pokemon1.image}
              alt={pokemon1.name}
            />
            <Card className="stat-card">
              <CardActionArea>
                <CardContent>
                  <Typography variant="h5" className="pokemon-name">{pokemon1.name}</Typography>
                  <Typography className="pokemon-stat">HP: {hp1} | DEF: {pokemon1.defense}</Typography>
                  <div className="hp-bar-container">
                    <div className="hp-bar-fill" style={{ width: `${hp1}%` }} />
                  </div>
                </CardContent>
              </CardActionArea>
            </Card>
            {count % 2 === 0 &&
              <div className="attack-options">
                <p>Choose an attack:</p>
                {pokemon1.moves.slice(0, 4).map((move, i) => (
                  <Button key={i} variant="contained" onClick={() => attack1(pokemon2, move.move.url)}>
                    {move.move.name}
                  </Button>
                ))}
              </div>
            }
          </div>

          {/* VS */}
          <div className="vs-text">
            <h1 style={{fontFamily:'Pokemon Solid, sans-serif'}}>V/S</h1>
          </div>

          {/* Player 2 */}
          <div className="player-card">
            <img className="player-label" src="https://fontmeme.com/permalink/250521/7850ffa96c7785053ea17fe4d47193a6.png" alt="player2" />
            <img className="pokemon-img" src={pokemon2.image} alt={pokemon2.name} />
            <Card className="stat-card">
              <CardActionArea>
                <CardContent>
                  <Typography variant="h5" className="pokemon-name">{pokemon2.name}</Typography>
                  <Typography className="pokemon-stat">HP: {hp2} | DEF: {pokemon2.defense}</Typography>
                  <div className="hp-bar-container">
                    <div className="hp-bar-fill" style={{ width: `${hp2}%` }} />
                  </div>
                </CardContent>
              </CardActionArea>
            </Card>
            {count % 2 !== 0 &&
              <div className="attack-options">
                <p>Choose an attack:</p>
                {pokemon2.moves.slice(0, 4).map((move, i) => (
                  <Button key={i} variant="contained" onClick={() => attack2(pokemon1, move.move.url)}>
                    {move.move.name}
                  </Button>
                ))}
              </div>
            }
          </div>
        </div>
      }

      {/* Win Screens */}
      {index1 === team1.length - 1 && hp1 === 0 &&
        <div className="win-screen">
          <img src="https://fontmeme.com/permalink/250521/8aaf1411f71a9e642314c6e8e5cff622.png" alt="Team 2 Wins" />
          <div>{team2.map((p, i) => <img key={i} src={p.image} alt={p.name} className="pokemon-img" />)}</div>
        </div>}
      {index2 === team2.length - 1 && hp2 === 0 &&
        <div className="win-screen">
          <img src="https://fontmeme.com/permalink/250521/000cc63ff1cc4f25bff614b9fbb6ab2f.png" alt="Team 1 Wins" />
          <div>{team1.map((p, i) => <img key={i} src={p.image} alt={p.name} className="pokemon-img" />)}</div>
        </div>}
    </>
  );
}
