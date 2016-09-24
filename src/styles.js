export default ({ color }) => ({
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
})
