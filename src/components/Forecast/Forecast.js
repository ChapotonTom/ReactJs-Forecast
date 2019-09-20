import React from 'react';
import './Forecast.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


class Forecast extends React.Component {

	constructor(props) {
        super(props);
        this.state = {
            all_forecasts: [],
            currentForecast: {
                restaurant:     "Restaurant Courtepaille",
                date:           new Date(),
                dateString:     "",
                m_forecast:     0,
                ds_forecast:    0,
                last_forecast:  0,
                weather_max:    50,
                weather_min:    -20,
            },
          };
    }

    componentDidMount() {
        this.setState({
            currentForecast: {
                ...this.state.currentForecast,
                dateString: this.getDateString(this.state.currentForecast.date)
            }
          }, () => this.generateForecast());
    }

    generateForecast() {
        let wMax = Math.floor(Math.random() * 40) - 10;
        let wMin = Math.floor(Math.random() * wMax) - 5;
        this.setState({
            currentForecast: {
                ...this.state.currentForecast,
                m_forecast:     80,
                ds_forecast:    Math.floor(Math.random() * 300),
                last_forecast:  Math.floor(Math.random() * 300),
                weather_max:    wMax,
                weather_min:    wMin
            }
          }, () => {
            this.state.all_forecasts.push(this.state.currentForecast);
          });
    }

    checkIfExists() {
        // On cherche un objet ayant le meme nom de restaurant et la meme date
        if (this.state.all_forecasts != null) {
            var cur_rest = this.state.currentForecast.restaurant;
            var cur_date = this.state.currentForecast.dateString;

            for(var i = 0; i < this.state.all_forecasts.length; i++) {
                if (this.state.all_forecasts[i].restaurant === cur_rest
                    && this.state.all_forecasts[i].dateString === cur_date) {
                    return i;
                }
            }
        }
        return -1;
    }

    handleRestaurantChange(event) {
        this.setState({
            currentForecast: {
                ...this.state.currentForecast,
                restaurant: event.target.value
            }
          }, () => {
            // Là où on ferait normalement un call API pour mettre a jour les données,
            // Je cherche dans mon objet si les données existent déjà. Sinon je les génère aléatoiremenr
            var exists = this.checkIfExists();
            if (exists >= 0)
                this.setState({
                    currentForecast: this.state.all_forecasts[exists]
                });
            else {
                this.generateForecast();
            }
          });
    };
    
    capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    getDateString(date) {
        // toLocaleDateString ne met pas de majuscule en fr, je formate donc la date a la main
        let day = this.capitalize(date.toLocaleDateString('fr-FR', { weekday: 'long'}));
        let month = this.capitalize(date.toLocaleDateString('fr-FR', { month: 'long'}));
        let fulldate = day + ' ' + date.getDate() + ' ' + month + ' ' + date.getFullYear();
        return fulldate;
    }

	handleDateChange = date => {
        this.setState({
          currentForecast: {
            ...this.state.currentForecast,
            date: date,
            dateString: this.getDateString(date)
          }
        }, () => {
            // Là où on ferait normalement un call API pour mettre a jour les données,
            // Je cherche dans mon objet si les données existent déjà. Sinon je les génère aléatoiremenr
            var exists = this.checkIfExists();
            if (exists >= 0)
                this.setState({
                    currentForecast: this.state.all_forecasts[exists]
                });
            else {
                this.generateForecast();
            }
        });
    };

    handleForecastChange = forecast => {
        if (forecast.target.value < 10000) {
            this.setState({
                currentForecast: {
                    ...this.state.currentForecast,
                    m_forecast: parseInt(forecast.target.value)
                }
            });
        }
    };

    validateForecast = () => {

        // Remplacer la prévision
        var index = this.checkIfExists();
        this.state.all_forecasts.splice(index, 1);
        this.state.all_forecasts.push(this.state.currentForecast);

        // On passe au jour suivant
        var newDate = new Date(this.state.currentForecast.date.getTime());
        newDate.setDate(newDate.getDate() + 1);
        this.handleDateChange(newDate);
    }
	
	render() {
		return (
        <div className="content">
            <div className="head">
                <h1 className="headTitle">{this.state.currentForecast.dateString}</h1>
            </div>
            <div className="container container_inputs">
                <div className="row">

                    {/* RESTAURANT SELECTOR */}
                    <div className="col">
                        <div className="selection">
                            <i className="fas fa-map-marker-alt fa-2x"></i>
                            <select className="form-control rest_input select"
                                    onChange={this.handleRestaurantChange.bind(this)}>
                                <option>Restaurant Courtepaille</option>
                                <option>Restaurant Hippopotamus</option>
                                <option>Restaurant Mcdonal</option>
                            </select>
                        </div>
                    </div>

                    {/* DATE SELECTOR */}
                    <div className="col">

                        <div className="form-control selection date">
                            <i className="far fa-calendar fa-lg"></i>
                            <DatePicker
                                dateFormat="dd/MM/yyyy"
                                selected={this.state.currentForecast.date}
                                onChange={this.handleDateChange}
                                minDate={new Date()}
                                maxDate={new Date().setFullYear(new Date().getFullYear() + 1)}
                                placeholderText="Select a date between today and 5 days in the future"
                                className="date_input"
                            />
                        </div>
                    </div>
                </div>


                <div className="row">

                    {/* FORECAST BLOCK */}
                    <div className="col">
                        <div className="container container_block">
                            <div className="row row_f">
                                <div className="col col_f">
                                <img className="logo" src={ require('../../assets/cloudy.png')} alt="logo" style={{ width: '50px' }} />
                                </div>
                                <div className="col col_f disp_line gray">
                                    {this.state.currentForecast.weather_max}
                                </div>
                                <div className="col- col_f lightgray">|</div>
                                <div className="col col_f lightgray">
                                    {this.state.currentForecast.weather_min}
                                </div>
                            </div>
                            <div className="row row_f"><div className="col col_f"><h3 className="m_f">{this.state.currentForecast.m_forecast}</h3></div></div>
                            <div className="row row_f">
                                <div className="col col_f disp_line blue">
                                    {this.state.currentForecast.ds_forecast}
                                </div>
                                <div className="col- col_f lightgray">|</div>
                                <div className="col col_f lightgray">
                                    {this.state.currentForecast.last_forecast}
                                </div>
                            </div>
                            </div>
                        </div>

                    {/* FORECAST INPUT */}
                    <div className="col">
                        <input type="number"
                            className="form-control forecast"
                            value={this.state.currentForecast.m_forecast}
                            onChange={this.handleForecastChange} />
                            <div className="validation">
                                <button type="button" className="btn btn-dark forecast" onClick={this.validateForecast}>Confirmer</button>
                            </div>
                    </div>
                </div>
            </div>
		</div>);
	}
}


export default Forecast;
