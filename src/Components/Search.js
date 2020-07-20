import React,{ useState, useEffect } from 'react';
import './../style/Search.scss';
import axios from 'axios';

export const Search = () => {


    const [search, setSearch] = useState([]);

    const [loadingState, setLoadingState] = useState('result'); // global pointer


    const inputChanged = async (e) => {
        
        // check input length
        if(e.target.value.length >= 3 ) {
            e.persist();

            setLoadingState('loading')

            // get repos
            await axios.get(`https://api.github.com/search/repositories?&q=${e.target.value}&per_page=25`)
                .then(good=>{
                    setSearch(good.data.items);
                }).catch(err => {
                    setLoadingState('fail')
                })
            
            // get users
            await axios.get(`https://api.github.com/search/users?&q=${e.target.value}&per_page=25`)
                .then(good=>{
                    // set new state with the result of both request sorted by name (login or name) of the repos/users
                    setSearch(search => [...search, ...good.data.items].sort((a, b) => ((a.login || a.name).toLowerCase() > (b.login || b.name).toLowerCase() ? 1 : -1)));
                
                    //document.querySelector('.lds-default').style.display = 'none'
                    setLoadingState('result')
                }).catch(err => {
                    setLoadingState('fail')
                })

        } else {
            setLoadingState('result')
            setSearch([])
        }
    }
    let tabIndex = 0;
   
    useEffect(()=>{

        document.addEventListener('keydown',(e)=> {
            
            let allTabs = document.querySelectorAll(`[tabindex='-1']`)
            if(e.key === 'ArrowDown') {
                e.preventDefault();
                if(tabIndex === allTabs.length-1)return;
                tabIndex++;
                allTabs[tabIndex].focus();
            } else if(e.key === 'ArrowUp') {
                e.preventDefault();
                if(tabIndex === 0)return;
                tabIndex--;
                allTabs[tabIndex].focus();
            } else if(e.key === 'Enter') {
                console.log(allTabs[tabIndex])
                allTabs[tabIndex].click()
            }
        })
    },[])

    return(
        <div className='Search' data-testid='Search-test'>
            <div className='inputDiv'>
                <label> Github repos / users search</label>
                <input 
                    onChange={inputChanged}
                    defaultValue=''
                    placeholder='Type name to search'
                    tabIndex='-1'
                    autoFocus
                    data-testid='search-input-test'
                />
            </div>
            <div 
                className='resultsDiv'                    
                data-testid='search-results-test'
            >
                {loadingState === 'result' ? 
                    search.length ? search.map((one,index ) => 
                        <a 
                            href={one.html_url} 
                            target='_blank' 
                            rel="noopener noreferrer" 
                            key={index} 
                            className='singleResult'
                            tabIndex='-1'
                        >
                            <div className='resultName'>
                                {index+1}: {one.login || one.name}
                            </div>
                        </a>
                    ): 
                    <div className='messageDiv'>No search result</div> : 
                        loadingState === 'fail' && 
                            <div className='messageDiv'>error while loading</div>
                }

                {loadingState === 'loading' &&
                    <div className="lds-default" data-testid='loader-test'>
                        <div className='lds-container'>
                        <div></div><div></div><div></div><div></div><div></div><div>
                        </div><div></div>
                        <div></div><div></div><div></div><div></div><div></div></div>
                    </div>
                }
            </div>
        </div>
    )
}