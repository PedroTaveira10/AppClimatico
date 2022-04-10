import { useEffect, useState } from 'react';
import './App.css';

/** interfaces / types */
export interface Weather {
  name: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

function App() {
  const [cardList, setCardList] = useState<Weather[]>([]);
  const [searchCity, setSearchCity] = useState<string>('Americana');
  const [searchBtnDisabled, setSearchBtnDisabled] = useState<boolean>(true);
  const [clearBtnDisabled, setClearBtnDisabled] = useState<boolean>(true);

  useEffect(() => {
    // código a ser executado no inicio do componente
  }, []);

  /** weather api methods */
  const getWeatherData = (city: string): Promise<Weather> => {
    const apiKey = '9549337491471c9a69c70f3d1ef5c1fb';
    return new Promise((resolve, reject) => {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.cod === '404') throw new Error(data);

          resolve(data);
        })
        .catch(reject);
    });
  };

  const handleSearchChange = (event: any) => {
    const value = event.target.value.trim();
    setSearchCity(value);
    const disableSearchButton = !value;
    setSearchBtnDisabled(disableSearchButton);
  };

  const removeCard = (index: number) => {
    const cardListWithoutRemovedCard = cardList.filter((el, i) => i !== index);
    setCardList(cardListWithoutRemovedCard);
  };

  const clearHandler = (): void => {
    setCardList([]);
    setClearBtnDisabled(true);
  };

  const searchHandler = (): void => {
    const city = searchCity.trim();
    if (!city) {
      return;
    }

    getWeatherData(city)
      .then((data: Weather) => {
        setCardList((state) => [...state, data]);
        setClearBtnDisabled(false);
      })
      .catch(() => alert('Cidade não encontrada, tente novamente'));
  };

  return (
    <div className="App">
      <h1>App Climatico</h1>
      <div className="row">
        <div className="col s12">
          Digite sua cidade:
          <div className="input-field inline">
            <input
              id="city"
              type="text"
              className="validate"
              onChange={handleSearchChange}
            />
            <label>Cidade</label>
          </div>
          <button
            disabled={searchBtnDisabled}
            id="search"
            className="waves-effect waves-light btn"
            onClick={searchHandler}
          >
            Search
          </button>
          <button
            disabled={clearBtnDisabled}
            id="clear"
            className="waves-effect waves-light btn"
            onClick={clearHandler}
          >
            Clear
          </button>
        </div>
      </div>
      
      <div className="row">
        {
          // if (mostrar ou não)
          cardList.length > 0 && (
            <div className="col s12 m6" id="result">
              {
                // for (iterar elementos)
                cardList.map((card, index) => (
                  <div className="card blue-grey darken-1" key={index}>
                    <div className="card-content white-text">
                      <span className="card-title">Cidade: {card.name}</span>
                      <p>
                        Temperatura: {card.main.temp}º
                        <img
                          src={`https://openweathermap.org/img/wn/${card.weather[0].icon}.png`}
                        />
                      </p>
                      <p>{card.weather[0].description}</p>
                    </div>
                    <div className="card-action">
                      <a href="#" onClick={() => removeCard(index)}>
                        Remove card
                      </a>
                    </div>
                  </div>
                ))
              }
            </div>
          )
        }
      </div>
    </div>
  );
}

export default App;