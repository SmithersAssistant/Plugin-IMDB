import {shell} from 'electron'

const IMDB_COMPONENT = 'com.robinmalfait.imdb';

export default robot => {
  const {React} = robot.dependencies
  const {Blank} = robot.cards;
  const {StyleSheet, css, color, Icon, Button} = robot.UI

  const Imdb = React.createClass({
    getInitialState() {
      const {q} = this.props

      return {
        q: q.trim(),
        searching: true,
        result: ''
      }
    },
    componentDidMount() {
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
    search(data) {
      const url = `http://www.omdbapi.com/?t=${encodeURI(data)}&plot=full&r=json`

      robot.fetchJson(url).then(result => {
        if (result.Response == 'True') {
          this.setState({ result: {
            title: result.Title,
            year: result.Year,
            genres: result.Genre.split(',').map(i => i.trim()),
            img: result.Poster == 'N/A' ? null : result.Poster,
            plot: result.Plot,
            director: result.Director,
            writers: result.Writer.split(',').map(i => i.trim()) || [],
            actors: result.Actors.split(',').map(i => i.trim()) || [],
            score: result.imdbRating,
            votes: result.imdbVotes,
            imdbID: result.imdbID
          }, searching: false })
        } else {
          this.props.removeCard()
          robot.notify(`No movies found that match ${this.state.q}`)
        }
      })
    },
    render() {
      const {q, ...other} = this.props
      const {searching, result} = this.state
      const {imdbID, title, year, plot, director, score, votes, writers = [], actors = [], genres = [], img} = result

      return searching ? (
        <Blank {...other} title={`IMDB`}>
          Searching for {q}
        </Blank>
      ) : (
        <Blank {...other} title={`IMDB (${q})`}>
          <h1 className="clearfix">
            {title} <small className={css(this.styles.year)}>({year})</small>
            <small className={css(this.styles.rating)}>
              <div className={css(this.styles.ratingWrapper)}>
                <Icon className={css(this.styles.star)} icon="star"/>

                <div>
                  <span className={css(this.styles.largerFont)}>{score}</span>
                  <span className={css(this.styles.xSmallFont)}>/10</span>
                  <span className={css(this.styles.votes)}>{votes}</span>
                </div>
              </div>
            </small>
          </h1>
          <hr/>

          <div className={`clearfix ${css(this.styles.mainContent)}`}>
            {img && (
              <div className={css(this.styles.imageWrapper)}>
                <img className={css(this.styles.image)} src={img}/>
              </div>
            )}
            <div className={css(this.styles.plot)}>
              <p>{plot}</p>

              <Button onClick={() => shell.openExternal(`http://www.imdb.com/title/${imdbID}`)}>
                More Info
              </Button>
            </div>
          </div>

          <hr/>

          <ul className={css(this.styles.footer)}>
            <li><strong>Director:</strong> {director}</li>
            <li><strong>{`Writer${writers.length > 1 ? 's' : ''}:`}</strong> {writers.join(', ')}</li>
            <li><strong>{`Actor${actors.length > 1 ? 's' : ''}:`}</strong> {actors.join(', ')}</li>
            <li><strong>{`Genre${genres.length > 1 ? 's' : ''}:`}</strong> {genres.join(', ')}</li>
          </ul>
        </Blank>
      )
    }
  })

  robot.registerComponent(Imdb, IMDB_COMPONENT);

  robot.listen(/^imdb (.*)$/, {
    description: "Search for a movie",
    usage: 'imdb <movie>'
  }, (res) => {
    robot.addCard(IMDB_COMPONENT, {
      q: res.matches[1] || ''
    })
  })
}
