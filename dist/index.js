'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _electron = require('electron');

var _styles = require('./styles');

var _styles2 = _interopRequireDefault(_styles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var IMDB_COMPONENT = 'com.robinmalfait.imdb';

exports.default = function (robot) {
  var React = robot.dependencies.React;
  var Blank = robot.cards.Blank;
  var _robot$UI = robot.UI;
  var Icon = _robot$UI.Icon;
  var Button = _robot$UI.Button;
  var enhance = robot.enhance;
  var restorableComponent = robot.restorableComponent;
  var withStyles = robot.withStyles;


  var Imdb = React.createClass({
    displayName: 'Imdb',
    getInitialState: function getInitialState() {
      var q = this.props.q;


      return {
        q: q.trim(),
        searching: true,
        result: ''
      };
    },
    componentDidMount: function componentDidMount() {
      this.search(this.state.q);
    },
    search: function search(data) {
      var _this = this;

      var url = 'http://www.omdbapi.com/?t=' + encodeURI(data) + '&plot=full&r=json';

      robot.fetchJson(url).then(function (result) {
        if (result.Response == 'True') {
          _this.setState({
            result: {
              title: result.Title,
              year: result.Year,
              genres: result.Genre.split(',').map(function (i) {
                return i.trim();
              }),
              img: result.Poster == 'N/A' ? null : result.Poster,
              plot: result.Plot,
              director: result.Director,
              writers: result.Writer.split(',').map(function (i) {
                return i.trim();
              }) || [],
              actors: result.Actors.split(',').map(function (i) {
                return i.trim();
              }) || [],
              score: result.imdbRating,
              votes: result.imdbVotes,
              imdbID: result.imdbID
            }, searching: false
          });
        } else {
          _this.props.removeCard();
          robot.notify('No movies found that match ' + _this.state.q);
        }
      });
    },
    render: function render() {
      var _props = this.props;
      var styles = _props.styles;
      var q = _props.q;

      var other = _objectWithoutProperties(_props, ['styles', 'q']);

      var _state = this.state;
      var searching = _state.searching;
      var result = _state.result;
      var imdbID = result.imdbID;
      var title = result.title;
      var year = result.year;
      var plot = result.plot;
      var director = result.director;
      var score = result.score;
      var votes = result.votes;
      var _result$writers = result.writers;
      var writers = _result$writers === undefined ? [] : _result$writers;
      var _result$actors = result.actors;
      var actors = _result$actors === undefined ? [] : _result$actors;
      var _result$genres = result.genres;
      var genres = _result$genres === undefined ? [] : _result$genres;
      var img = result.img;


      return searching ? React.createElement(
        Blank,
        _extends({}, other, { title: 'IMDB' }),
        'Searching for ',
        q
      ) : React.createElement(
        Blank,
        _extends({}, other, { title: 'IMDB (' + q + ')' }),
        React.createElement(
          'h1',
          { className: 'clearfix' },
          title,
          React.createElement(
            'small',
            { className: styles.year },
            '(',
            year,
            ')'
          ),
          React.createElement(
            'small',
            { className: styles.rating },
            React.createElement(
              'div',
              { className: styles.ratingWrapper },
              React.createElement(Icon, { className: styles.star, icon: 'star' }),
              React.createElement(
                'div',
                null,
                React.createElement(
                  'span',
                  { className: styles.largerFont },
                  score
                ),
                React.createElement(
                  'span',
                  { className: styles.xSmallFont },
                  '/10'
                ),
                React.createElement(
                  'span',
                  { className: styles.votes },
                  votes
                )
              )
            )
          )
        ),
        React.createElement('hr', null),
        React.createElement(
          'div',
          { className: 'clearfix ' + styles.mainContent },
          img && React.createElement(
            'div',
            { className: styles.imageWrapper },
            React.createElement('img', { className: styles.image, src: img })
          ),
          React.createElement(
            'div',
            { className: styles.plot },
            React.createElement(
              'p',
              null,
              plot
            ),
            React.createElement(
              Button,
              { onClick: function onClick() {
                  return _electron.shell.openExternal('http://www.imdb.com/title/' + imdbID);
                } },
              'More Info'
            )
          )
        ),
        React.createElement('hr', null),
        React.createElement(
          'ul',
          { className: styles.footer },
          React.createElement(
            'li',
            null,
            React.createElement(
              'strong',
              null,
              'Director:'
            ),
            ' ',
            director
          ),
          React.createElement(
            'li',
            null,
            React.createElement(
              'strong',
              null,
              'Writer' + (writers.length > 1 ? 's' : '') + ':'
            ),
            ' ',
            writers.join(', ')
          ),
          React.createElement(
            'li',
            null,
            React.createElement(
              'strong',
              null,
              'Actor' + (actors.length > 1 ? 's' : '') + ':'
            ),
            ' ',
            actors.join(', ')
          ),
          React.createElement(
            'li',
            null,
            React.createElement(
              'strong',
              null,
              'Genre' + (genres.length > 1 ? 's' : '') + ':'
            ),
            ' ',
            genres.join(', ')
          )
        )
      );
    }
  });

  robot.registerComponent(enhance(Imdb, [restorableComponent, withStyles(_styles2.default)]), IMDB_COMPONENT);

  robot.listen(/^imdb (.*)$/, {
    description: "Search for a movie",
    usage: 'imdb <movie>'
  }, function (res) {
    robot.addCard(IMDB_COMPONENT, {
      q: res.matches[1] || ''
    });
  });
};