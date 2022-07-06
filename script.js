const visualizacaoFilmes = document.querySelector('.movies');
const highlightDoDia = document.querySelector('.highlight');
const input = document.querySelector('input');
const btnleft = document.querySelector('.btn-prev');
const btnright = document.querySelector('.btn-next');
const modal = document.querySelector('.modal');

let paginacao = 0;
let inicio = 0;
let fim = 5;

let buscaFilmes = [];


btnleft.addEventListener('click', ()=>{
    paginacao--
    if(paginacao < 0){
        paginacao = 3;
    };

     if (paginacao === 0){
        inicio = 0;
        fim = 5;
    };

    if (paginacao === 1){
        inicio = 5;
        fim = 10;
    };

     if (paginacao === 2){
        inicio = 10;
        fim = 15;
    };

     if (paginacao === 3){
        inicio = 15;
        fim = 20;
    };
    removerFilmes();
    for(i = inicio; i < fim; i++){
        criarFilme(buscaFilmes[i]);
    };
}); 

btnright.addEventListener('click', ()=>{
    paginacao++
    if(paginacao > 3){
        paginacao = 0;
    };

    if (paginacao === 0){
        inicio = 0;
        fim = 5;
    };

    if (paginacao === 1){
        inicio = 5;
        fim = 10;
    };

     if (paginacao === 2){
        inicio = 10;
        fim = 15;
    };

     if (paginacao === 3){
        inicio = 15;
        fim = 20;
    };
    removerFilmes();
    for(i = inicio; i < fim; i++){
        criarFilme(buscaFilmes[i]);
    };
});


pegarFilmes();


function removerFilmes(){
    while(visualizacaoFilmes.firstChild){
        visualizacaoFilmes.removeChild(visualizacaoFilmes.firstChild);
    };
};

function criarFilme(movie) {
                const div = document.createElement('div');
                div.classList.add('movie');
                div.style.backgroundImage = `url(${movie.poster_path})`;

                const divInfo = document.createElement('div');            
                divInfo.classList.add('movie__info');

                const estrelaRating = document.createElement('img');
                estrelaRating.src = "./assets/estrela.svg";

                const title = document.createElement('span');
                title.classList.add('movie__title');
                title.textContent = movie.title;

                const vote_average = document.createElement('span');
                vote_average.classList.add('movie__rating');
                vote_average.textContent = movie.vote_average;
                
                vote_average.append(estrelaRating);
                divInfo.append(title, vote_average);
                div.append(divInfo);            
                visualizacaoFilmes.append(div);

                div.addEventListener('click', () =>{
                    modal.classList.remove('hidden');

                    fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${movie.id}?language=pt-BR`).then(function (respostaModal) {
                        const promiseModal = respostaModal.json();

                        promiseModal.then(function (body){
                            const tituloModal = document.querySelector('.modal__title');
                            tituloModal.textContent = body.title;

                            const backdropModal = document.querySelector('.modal__img');
                            backdropModal.src = body.backdrop_path;

                            const descricaoModal = document.querySelector('.modal__description');
                            descricaoModal.textContent = body.overview;

                            const averageModal = document.querySelector('.modal__average');
                            averageModal.textContent = body.vote_average;
                        });
                    });
                });
                
};

modal.addEventListener('click', ()=>{
    modal.classList.add('hidden');
});

function pegarFilmes(){
        fetch ('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false').then(function (respostaVisualizacaoFilmes) {
        const promiseBody = respostaVisualizacaoFilmes.json();

        promiseBody.then(function (body){
            let filmesExibidos = body.results.slice(inicio,fim);
            buscaFilmes = body.results;

            filmesExibidos.forEach(function (movie) {
                criarFilme(movie);                
            });
        });
    });
};


input.addEventListener('keydown', function (event) {
    if(event.key !== 'Enter') { 
        return; 
    } else if (input.value === '') {
        removerFilmes();
        paginacao = 0;
        inicio = 0;
        fim = 5;
        pegarFilmes();
    } else {
        let buscaInput = input.value

        fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${buscaInput}`).then((resultadoBusca) => {
            const promiseBusca = resultadoBusca.json();

            promiseBusca.then(function (params) {
                if(params.results.length < 1){
                    removerFilmes();
                    paginacao = 0;
                    inicio = 0;
                    fim = 5;
                    pegarFilmes();
                } else {
                    removerFilmes();
                    buscaFilmes = params.results;
                    paginacao = 0;
                    inicio = 0;
                    fim = 5;
                    
                    let filmesExibidos = params.results.slice(inicio,fim);

                    filmesExibidos.forEach(function (movie) {
                        criarFilme(movie); 
                    });                
                };
            });
        });
    }; 
    input.value = '';           
});


fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR').then(function (respostaHighlight) {
    const promiseHighlight = respostaHighlight.json();

    promiseHighlight.then(function(body){

            const backdrop_path = highlightDoDia.querySelector('.highlight__video');
            backdrop_path.style.backgroundImage = `url('${body.backdrop_path}')`

            const highlightTitle = highlightDoDia.querySelector('.highlight__title');
            highlightTitle.textContent = body.title;

            const highlightVoteAverage = highlightDoDia.querySelector('.highlight__rating');
            highlightVoteAverage.textContent = body.vote_average;
            
            const genres = highlightDoDia.querySelector('.highlight__genres');
            genres.textContent = `${body.genres[0].name}, ${body.genres[1].name} , ${body.genres[2].name}`;

            const release_date = highlightDoDia.querySelector('.highlight__launch');
            release_date.textContent = body.release_date;

            const overview = highlightDoDia.querySelector('.highlight__description');
            overview.textContent = body.overview;

            fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR').then(function (videoHighlight){
                const promiseVideoHighlight = videoHighlight.json();

                promiseVideoHighlight.then(function (video){
                    video.results.forEach((trailer) => {
                        const highlightVideo = document.querySelector('.highlight__video-link');

                        highlightVideo.href = `https://www.youtube.com/watch?v=${trailer.key}`;
                    });
                });
            });
    });
});

