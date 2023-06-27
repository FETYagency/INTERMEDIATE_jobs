const jobContainer = document.querySelector(".jobs_listing")

const selects = new Map();

function selectedAttr(text){
    const span = document.createElement(`span`)
    span.className="attrFilted"

    span.innerHTML=
    `     
    <p>${text}</p>     
    <span class="remove">
      <img class="remove isImg" src="images/icon-remove.svg" alt="">
    </span>
    `;

    selects.set(`${text}`, span)
}

function jobListEle(img, corp, newState, featureState, since, type, to, position, role, level) {

    const li = document.createElement("li")
    li.className=`job ${featureState}`
    li.dataset.score = 0;
    li.innerHTML=
    `
        <img class="image" src="${img}">

        <div class="jobData">

          <!-- sec one -->

          <div class="jobHeader">

            <h3 class="corpName">${corp}</h3>
            
            <div class="aboutJob">
              <span class="isNew ${newState}">NEW!</span>
              <span class="isFeatured ${featureState}">FEATURED</span>
            </div>

          </div>


          <!-- sec two -->

          <a href="#" class="jobName">${position}</a>

          <!-- sec three -->

          <div class="jobDesc">
            <p>${since}</p>
            <span class="dot"></span>
            <p>${type}</p>
            <span class="dot"></span>
            <p>${to}</p>
          </div>

        </div>

        <div class="attrs" data-selected="">
        <span class="attr">${role}</span>
        <span class="attr">${level}</span>
        </div>
    
    `;

    jobContainer.insertAdjacentElement("beforeend", li)
    
}

async function jobList(){
    const request = new Request("https://api.jsonbin.io/v3/b/649984b39d312622a375db0a")
    const response = await fetch(request)
    const data = await response.json()
    let record;
    ({record}=data)
    for (const job of record) {
        jobListEle(job.logo, job.company, job.new, job.featured, job.postedAt, job.contract, job.location, job.position, job.role, job.level)
    }
    
    const attrsContainer = document.querySelectorAll(".attrs")

    function createAttrLang(parent ,int, languages){
        for(let i = 0; i<int; i++){
            const span = document.createElement("span")
            span.className="attr"
            span.innerHTML=`${languages[i]}`;
            parent.insertAdjacentElement("beforeend", span)
        }
    }

    function createAttrTool(parent ,int, tool){
        for(let i = 0; i<int; i++){
            const span = document.createElement("span")
            span.className="attr"
            span.innerHTML=`${tool[i]}`;
            parent.insertAdjacentElement("beforeend", span)
        }
    }
    for (let i = 0; i < attrsContainer.length; i++) {
        const e = attrsContainer[i];
        createAttrTool(e, record[i].tools.length, record[i].tools)
    }

    for (let i = 0 ; i<attrsContainer.length ; i++) {
        const e = attrsContainer[i];
        createAttrLang(e, record[i].languages.length, record[i].languages)
    }

    const filterBar = document.querySelector(".filter");
    const selectedAttrs = document.querySelector(".selected")
    const clearBtn = document.querySelector(".clear")
    const attrs = document.querySelectorAll(".attr");
    
    let register = new Set()
    let score = 0;
    for (let i = 0; i < attrs.length; i++) {
        const e = attrs[i];
        e.addEventListener("click", function (s) {
            filterBar.dataset.show==="hidden"
            ?filterBar.dataset.show="visisble"
            :null;
            selectedAttr(e.textContent)
            if(filterBar.classList.contains(e.textContent)===false){
                filterBar.classList.add(e.textContent)
                selectedAttrs.insertAdjacentElement("afterbegin", selects.get(e.textContent))
            }


            const ele = [...selectedAttrs.children]
            ele.forEach(e=>{
                register.add(e.querySelector("p").textContent)
            })

            for (let i = 0; i < attrsContainer.length; i++) {
                const e = attrsContainer[i];
                const childs = [...e.children]
                e.parentElement.dataset.score= 0 ;
                for (const key of register) {
                    childs.forEach(x=>{
                        if(x.textContent===key) {
                            e.parentElement.dataset.score++
                        }                       
                    })
                }
                
                if(Number(e.parentElement.dataset.score)>score){
                    score=Number(e.parentElement.dataset.score)
                }
                
            }
            
            for (let i = 0; i < attrsContainer.length; i++) {
                const e = attrsContainer[i];
                e.parentElement.dataset.score==score
                ?e.parentElement.style.display="grid"
                :e.parentElement.style.display="none";
            }
        })
    }


    document.body.addEventListener("click", function(e){
        if(e.target.matches(".remove")){
            let option = e.target.parentElement.className==="remove"
            ?e.target.parentElement.parentElement
            :e.target.parentElement
            filterBar.classList.remove(option.querySelector("p").textContent)
            option.remove()

            score=0
            register.delete(option.querySelector("p").textContent)



            for (let i = 0; i < attrsContainer.length; i++) {
                const e = attrsContainer[i];
                const childs = [...e.children]
                e.parentElement.dataset.score= 0 ;
                for (const key of register) {
                    childs.forEach(x=>{
                        if(x.textContent===key) {
                            e.parentElement.dataset.score++
                        }                       
                    })
                }
                
                if(Number(e.parentElement.dataset.score)>score){
                    score=Number(e.parentElement.dataset.score)
                }
            }

            for (let i = 0; i < attrsContainer.length; i++) {
                const e = attrsContainer[i];
                e.parentElement.dataset.score==score
                ?e.parentElement.style.display="grid"
                :e.parentElement.style.display="none";
            }
            
        }

        if(selectedAttrs.childElementCount===0){
            filterBar.dataset.show="hidden"
            filterBar.className="filter"
            score=0
            register.clear()
            for (let i = 0; i < attrsContainer.length; i++) {
                const e = attrsContainer[i];
                e.parentElement.dataset.score=0
                e.parentElement.style.display="grid"
            }
        }
    })

    clearBtn.addEventListener("click",function(){
        const ele = [...selectedAttrs.children]
        ele.forEach(e=>e.remove())
        filterBar.dataset.show="hidden"
        filterBar.className="filter"

        score=0
        register.clear()
        for (let i = 0; i < attrsContainer.length; i++) {
            const e = attrsContainer[i];
            e.parentElement.dataset.score=0
            e.parentElement.style.display="grid"
        }
    })
    
    
}

jobList()   