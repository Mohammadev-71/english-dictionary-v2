const inputEl = document.getElementById("input");
const pageEl = document.querySelectorAll(".page");
const resPageEl = document.getElementById("text-area");

inputEl.addEventListener("keydown", (event)=>{
    if(event.key === "Enter"){
        inputEl.blur()
        const inputContainerEl = document.querySelector(".input-container");
        inputContainerEl.style.transition = "all 2s ease";
        inputContainerEl.style.top = "-250px";
        inputContainerEl.style.opacity = "0"
        const book = document.querySelector(".book");
        book.style.display =  "block";
        setTimeout(()=>{
            book.style.transition = "all 3s ease";
            book.style.top = "-20px";
            setTimeout(() => {
                book.style.right =  "-12%";
            }, 1600);
        }, 1500);
        setTimeout(() => {
            getData(inputEl, resPageEl);
        }, 7500);
        setTimeout(()=>{
            bookAnimation(book)
        }, 4000);
    }
})


async function getData(inputEl, resPageEl){
    try {
        resPageEl.textContent = "Loading...";
        const data = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(inputEl.value)}`).then((resulte)=>resulte.json());        
        const textOfData = `${data[0].word}:  
                            \n${data[0].phonetics[1].text}
                            \nPart of speech: ${data[0].meanings[0].partOfSpeech} 
                            \nMeaning: ${data[0].meanings[0].definitions[0].definition}
                            `;
        textAnimation(textOfData, resPageEl, data);
        console.log(data)
    } catch (error) {
        console.log(error);
        const currentPageEl = document.getElementById("audio-area")
        const errorBtn = document.createElement("button");
        errorBtn.innerHTML = `<i class="fa-solid fa-rotate-right"></i>`;
        errorBtn.id = "error-btn";
        currentPageEl.appendChild(errorBtn);
        resPageEl.textContent = "An error happened try again later";
        errorBtn.addEventListener("click", ()=>{
            location.reload();
        })
    }
}



function bookAnimation(book){
    let index = 0;
    const flipPage = pageEl.length-2;
    const fliped = setInterval(()=>{
        pageEl[index].classList.add("fliped");
        index++;
        if(index === flipPage){
            clearInterval(fliped)
        }
    }, 100);
}



function textAnimation(textOfData, resPageEl, data){
    let char = 0;
    resPageEl.textContent = "";
    const textAnime = setInterval(()=>{
        resPageEl.textContent += textOfData[char];
        char++;
        if (char === textOfData.length){
            console.log(data)
            clearInterval(textAnime);
            const currentPageEl = document.getElementById("audio-area");
            const audioEl = document.createElement("audio");
            audioEl.src = data[0].phonetics[0].audio   
            audioEl.controls = true;
            audioEl.style.margin = "20px 50% 0 50%";
            audioEl.style.transform = "translateX(-50%)";
            currentPageEl.appendChild(audioEl);
            nextWord(currentPageEl, data, audioEl);
        }
    },50);
}




function nextWord(currentPageEl, data, audioEl){
    const newInput = document.createElement("input");
    newInput.classList.add("new-word");
    newInput.type = "text";
    newInput.placeholder = "next word";
    newInput.style.opacity = "1";
    currentPageEl.appendChild(newInput);
    nextPage(newInput, data, audioEl);
}


function nextPage(newInput, data, audioEl){
    newInput.addEventListener("keydown", (e)=>{
        if (e.key === "Enter"){
            newInput.blur()
            const book = document.querySelector(".book");
            newInput.style.opacity = "0";
            audioEl.style.opacity = "0";
            pageEl[pageEl.length-2].classList.add("fliped");
            pageEl[pageEl.length-2].removeAttribute("id");
            pageEl[pageEl.length-2].innerHTML = `<div class="page pages">
                <div class="front"></div>
                <div class="back"></div>
            </div>`;
            const newPageEl = document.createElement("div");
            newPageEl.id = "new-page";
            newPageEl.classList.add("page", "pages")
            newPageEl.innerHTML = `<div class="front" id="res-page">
                                        <div id="text-area"></div>
                                        <div id="audio-area"></div>
                                    </div>
                                    <div class="back"></div>`;
            const oldPage = document.querySelector("#new-page");
            const lastPage = document.getElementById("last-page");
            if (oldPage){
                oldPage.classList.add("fliped");
                setTimeout(() => {
                    oldPage.remove();
                }, 3000);
            }
            book.insertBefore(newPageEl,lastPage );
            const resPageEl = newPageEl.querySelector("#text-area");
            setTimeout(() => {
                getData(newInput, resPageEl);
                newInput.style.opacity = "1";
                audioEl.style.opacity = "1";
                audioEl.src = data[0].phonetics[0].audio;
            }, 2000);
            
        }
})
}
