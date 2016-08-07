'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _electron = require('electron');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var IMDB_COMPONENT = 'com.robinmalfait.imdb';

exports.default = function (robot) {
  var Blank = robot.cards.Blank;
  var _robot$UI = robot.UI;
  var StyleSheet = _robot$UI.StyleSheet;
  var css = _robot$UI.css;
  var color = _robot$UI.color;
  var Icon = _robot$UI.Icon;
  var Button = _robot$UI.Button;


  var Imdb = _react2.default.createClass({
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
      this.styles = StyleSheet.create({
        year: {
          color: '#ccc',
          fontSize: 16
        },
        rating: {
          float: 'right',
          color: '#ccc',
          fontWeight: 100,
          fontSize: '16px',
          verticalAlign: 'bottom'
        },
        ratingWrapper: {
          display: 'flex',
          alignItems: 'center'
        },
        star: {
          color: color('yellow', 700),
          marginRight: 6
        },
        largerFont: {
          fontSize: 'larger'
        },
        xSmallFont: {
          fontSize: 'x-small'
        },
        votes: {
          display: 'flex',
          fontWeight: 100,
          justifyContent: 'flex-end'
        },
        mainContent: {
          display: 'flex'
        },
        imageWrapper: {
          minWidth: 150,
          maxWidth: 300,
          width: '100%',
          padding: 15
        },
        image: {
          width: '100%'
        },
        plot: {
          padding: 15
        },
        footer: {
          margin: 0,
          padding: 0,
          listStyleType: 'none'
        }
      });
    },
    search: function search(data) {
      var _this = this;

      var url = 'http://www.omdbapi.com/?t=' + encodeURI(data) + '&plot=full&r=json';

      robot.fetchJson(url).then(function (result) {
        if (result.Response == 'True') {
          _this.setState({ result: {
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
            }, searching: false });
        } else {
          _this.props.removeCard();
          robot.notify('No movies found that match ' + _this.state.q);
        }
      });
    },
    render: function render() {
      var _props = this.props;
      var q = _props.q;

      var other = _objectWithoutProperties(_props, ['q']);

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


      return searching ? _react2.default.createElement(
        Blank,
        _extends({}, other, { title: 'IMDB' }),
        'Searching for ',
        q
      ) : _react2.default.createElement(
        Blank,
        _extends({}, other, { title: 'IMDB (' + q + ')' }),
        _react2.default.createElement(
          'h1',
          { className: 'clearfix' },
          title,
          ' ',
          _react2.default.createElement(
            'small',
            { className: css(this.styles.year) },
            '(',
            year,
            ')'
          ),
          _react2.default.createElement(
            'small',
            { className: css(this.styles.rating) },
            _react2.default.createElement(
              'div',
              { className: css(this.styles.ratingWrapper) },
              _react2.default.createElement(Icon, { className: css(this.styles.star), icon: 'star' }),
              _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                  'span',
                  { className: css(this.styles.largerFont) },
                  score
                ),
                _react2.default.createElement(
                  'span',
                  { className: css(this.styles.xSmallFont) },
                  '/10'
                ),
                _react2.default.createElement(
                  'span',
                  { className: css(this.styles.votes) },
                  votes
                )
              )
            )
          )
        ),
        _react2.default.createElement('hr', null),
        _react2.default.createElement(
          'div',
          { className: 'clearfix ' + css(this.styles.mainContent) },
          img && _react2.default.createElement(
            'div',
            { className: css(this.styles.imageWrapper) },
            _react2.default.createElement('img', { className: css(this.styles.image), src: img })
          ),
          _react2.default.createElement(
            'div',
            { className: css(this.styles.plot) },
            _react2.default.createElement(
              'p',
              null,
              plot
            ),
            _react2.default.createElement(
              Button,
              { onClick: function onClick() {
                  return _electron.shell.openExternal('http://www.imdb.com/title/' + imdbID);
                } },
              'More Info'
            )
          )
        ),
        _react2.default.createElement('hr', null),
        _react2.default.createElement(
          'ul',
          { className: css(this.styles.footer) },
          _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement(
              'strong',
              null,
              'Director:'
            ),
            ' ',
            director
          ),
          _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement(
              'strong',
              null,
              'Writer' + (writers.length > 1 ? 's' : '') + ':'
            ),
            ' ',
            writers.join(', ')
          ),
          _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement(
              'strong',
              null,
              'Actor' + (actors.length > 1 ? 's' : '') + ':'
            ),
            ' ',
            actors.join(', ')
          ),
          _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement(
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

  robot.registerComponent(Imdb, IMDB_COMPONENT);

  robot.listen(/^imdb (.*)$/, {
    description: "Search for a movie",
    usage: 'imdb <movie>'
  }, function (res) {
    robot.addCard(IMDB_COMPONENT, {
      q: res.matches[1] || ''
    });
  });
};