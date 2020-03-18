const fetchData = async (searchData) => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: '581e689b',
            s: searchData
        }
    });

    if (response.data.Error) {
        return [];
    }

    return response.data.Search
};

const autoCompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
        <img src="${imgSrc}" />
        <h1>${movie.Title} (${movie.Year})</h1>
            `
    },
    inputValue(movie) {
        return movie.Title
    },

    async fetchData(searchData) {
        const response = await axios.get("http://www.omdbapi.com/", {
            params: {
                apikey: '581e689b',
                s: searchData
            }
        });

        if (response.data.Error) {
            return [];
        }

        return response.data.Search
    }
}

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector(".tutorial").classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left')
    },

})

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right')
    },
})

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: '581e689b',
            i: movie.imdbID
        }
    });
    summaryElement.innerHTML = movieTemplate(response.data);
    if (side === 'left') {
        leftMovie = response.data
    } else {
        rightMovie = response.data
    }

    if (leftMovie && rightMovie) {
        runComparison();
    }
}

const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat, index) => {
        rightStat = rightSideStats[index];

        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);
        console.log(leftSideValue)
        console.log(rightSideValue)

        if (rightSideValue > leftSideValue) {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        } else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
    })
}

const movieTemplate = (movieDetail) => {

    const boxOffice = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    const metaScore = parseInt(movieDetail.Metascore);
    const rottenTomatoes = parseInt(movieDetail.Ratings[1].Value.replace(/%/g, ''));
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
    const award = movieDetail.Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word);

        if (isNaN(value)) {
            return prev
        } else {
            return prev + value;
        }
    }, 0)

    return `
    <article class="media">
        <figure class="media-left">
            <p class="image">
            <img src="${movieDetail.Poster}">
            </p>
        </figure>
        <div class="media-content">
            <div class="content">
                <h1>${movieDetail.Title} <span>(${movieDetail.Year})</span></h1>
                <h4>${movieDetail.Genre}</h4>
                <p>${movieDetail.Plot}</p>  
            </div>
        </div>
    </article>
    <article data-value =${award} class="notification is-primary">
        <p class="title">${movieDetail.Awards}</p>
        <p class="subtitle">Award</p>
    </article>
    <article data-value =${boxOffice} class="notification is-primary">
        <p class="title">${movieDetail.BoxOffice}</p>
        <p class="subtitle">Box Office</p>
    </article>
    <article data-value =${metaScore} class="notification is-primary">
        <p class="title">${movieDetail.Metascore}</p>
        <p class="subtitle">Meta Score</p>
    </article>
    <article data-value =${rottenTomatoes} class="notification is-primary">
        <p class="title">${movieDetail.Ratings[1].Value}</p>
        <p class="subtitle">Rotten Tomatoes</p>
    </article>
    <article data-value =${imdbRating} class="notification is-primary">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value =${imdbVotes} class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDB votes</p>
    </article>
    `
}