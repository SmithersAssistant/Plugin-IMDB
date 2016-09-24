import { shell } from 'electron'
import styles from './styles'

const IMDB_COMPONENT = 'com.robinmalfait.imdb';

export default robot => {
  const { React } = robot.dependencies
  const { Blank } = robot.cards;
  const { Icon, Button } = robot.UI
  const { enhance, restorableComponent, withStyles } = robot

  const Imdb = React.createClass({
    getInitialState() {
      const { q } = this.props

      return {
        q: q.trim(),
        searching: true,
        result: ''
      }
    },
    componentDidMount() {
      this.search(this.state.q);
    },
    search(data) {
      const url = `http://www.omdbapi.com/?t=${encodeURI(data)}&plot=full&r=json`

      robot.fetchJson(url).then(result => {
        if (result.Response == 'True') {
          this.setState({
            result: {
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
            }, searching: false
          })
        } else {
          this.props.removeCard()
          robot.notify(`No movies found that match ${this.state.q}`)
        }
      })
    },
    render() {
      const { styles, q, ...other } = this.props
      const { searching, result } = this.state
      const { imdbID, title, year, plot, director, score, votes, writers = [], actors = [], genres = [], img } = result

      return searching ? (
        <Blank {...other} title={`IMDB`}>
          Searching for {q}
        </Blank>
      ) : (
        <Blank {...other} title={`IMDB (${q})`}>
          <h1 className="clearfix">
            {title}
            <small className={styles.year}>({year})</small>
            <small className={styles.rating}>
              <div className={styles.ratingWrapper}>
                <Icon className={styles.star} icon="star"/>

                <div>
                  <span className={styles.largerFont}>{score}</span>
                  <span className={styles.xSmallFont}>/10</span>
                  <span className={styles.votes}>{votes}</span>
                </div>
              </div>
            </small>
          </h1>
          <hr/>

          <div className={`clearfix ${styles.mainContent}`}>
            {img && (
              <div className={styles.imageWrapper}>
                <img className={styles.image} src={img}/>
              </div>
            )}
            <div className={styles.plot}>
              <p>{plot}</p>

              <Button onClick={() => shell.openExternal(`http://www.imdb.com/title/${imdbID}`)}>
                More Info
              </Button>
            </div>
          </div>

          <hr/>

          <ul className={styles.footer}>
            <li><strong>Director:</strong> {director}</li>
            <li><strong>{`Writer${writers.length > 1 ? 's' : ''}:`}</strong> {writers.join(', ')}</li>
            <li><strong>{`Actor${actors.length > 1 ? 's' : ''}:`}</strong> {actors.join(', ')}</li>
            <li><strong>{`Genre${genres.length > 1 ? 's' : ''}:`}</strong> {genres.join(', ')}</li>
          </ul>
        </Blank>
      )
    }
  })

  robot.registerComponent(enhance(Imdb, [
    restorableComponent,
    withStyles(styles)
  ]), IMDB_COMPONENT);

  robot.listen(/^imdb (.*)$/, {
    description: "Search for a movie",
    usage: 'imdb <movie>'
  }, (res) => {
    robot.addCard(IMDB_COMPONENT, {
      q: res.matches[ 1 ] || ''
    })
  })
}
