import React, {  useEffect, useState } from 'react';


// function Practice() {
//     // const fruits = [
//     //     'Apple', 'Banana', 'Apricot', 'Strawberry', 'Orange', 'Mango', 'Melon'
//     // ]
//     // const [input, setInput] = useState('')
//     // const [target, setTarget] = useState([])
//     // function onChange(e){
//     //     setInput(e.target.value)
//     //     const matches = fruits.filter(item => item.startsWith(e.target.value))
        
//     //     setTarget(matches.length >= 0 ? matches: fruits)
//     //     console.log(target)
//     // }

//     const [input, setInput] = useState('')
//     // const finalValue = useDebouncer(input, 2000)
//     // function useDebouncer(value, delay){
//     //   const [output, setOutput] = useState('')
//     //     useEffect(()=>{
//     //         const timer = setTimeout(()=>{
//     //             setOutput(value)
               
//     //         }, delay)

//     //         return ()=> clearTimeout(timer)
//     //     }, [value, delay])
//     //     return output
//     // }
//    function onChange(e) {
//   // Remove anything that's not 0-9
//   const digits = e.target.value.replace(/\D/g, '');

//   const formatted =
//     '(' + digits.slice(0, 3) + ')' +
//     digits.slice(3, 6) +
//     (digits.length > 6 ? '-' + digits.slice(6) : '');

//   setInput(formatted);
// }
//   return (
//     <div className='flex justify-center items-center flex-col gap-6'>
//       {/* <input value={input}  onChange={onChange} className=' p-4'type='text' placeholder='Search here...'/>
//       <div>{target.map(item =><p>{item}</p> )}</div> */}

//         <input value={ input} maxLength={12} onChange={onChange} className=' p-4'type='text' placeholder='Search here...'/>
//     </div>
//   );
// }

// export default Practice;


// function Practice() {
//     const [grids, setGrids] = useState(
//         Array.from({length:3}, () => Array(3).fill(''))
//     )
//     const [click, setClick] = useState(false)
//     const [winner, setWinner] = useState('')
   
//    function findWinner(matrix){
//     for (let row of matrix){


//     if (row.every(item => item === "X" )){
//         setWinner ('X')
//     }
//      if (row.every(item => item === "Y" )){
//         setWinner ('Y')
//     }
//     }

//     for (let i = 0; i < matrix.length; i++){
//         if (matrix[0][i] === matrix[1][i] &&  matrix[1][i]===matrix[2][i]){
//             setWinner(matrix[0][i])
//         } 

       
//     }

//      if(matrix[0][0] === matrix[1][1] &&  matrix[1][1] ===  matrix[2][2]){
//             setWinner(matrix[0][0])
//         }

//          if(matrix[0][2] === matrix[1][1] &&  matrix[1][1] ===  matrix[2][0]){
//             setWinner(matrix[0][0])
//         }
// return ''
//    }
 
        
//       function updateGrid(innerIndx, outterIndx){
//           const newGrid = grids.map(row => [...row]);
//           click ? newGrid[outterIndx][innerIndx] = 'X': newGrid[outterIndx][innerIndx] = 'Y'
//           setGrids(newGrid)
//           setClick(!click)
//           console.log(newGrid)
          
//         findWinner(newGrid)
       
             
//     }      
  
//   return (
//     <div  className='flex justify-center items-center'>
//         {grids.map((item, outterIndx) => <div className=' flex  flex-col'>
//           <div  className=''>
//           {item.map((innerItem, innerIndx) => 
//           <span onClick={()=> updateGrid(innerIndx, outterIndx)}
//            className='flex w-[3rem] h-[3rem] border border-black'>{innerItem}</span>)}
//            </div>


//          </div>)}
//          <p>Winner is {winner}</p>
//     </div>
//   );
// }

// import words from 'an-array-of-english-words';
const words = ["HELLO", "WORLD", "CAT", "DOG"];

function Practice() {

   const letters = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 
  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 
  'U', 'V', 'W', 'X', 'Y', 'Z'
];

const [word, updateWord]= useState('')
const [finalWord, setFinalWord] = useState(false)
const [guessed, setGuessesd] = useState([])



function checkWord(word){
    for (let i=0; i < words.length; i++ ){
        if (words[i] === word){
          setFinalWord(true)
        
           setGuessesd((prev)=> [...prev, words[i]])
           updateWord('')
         
        }
    }
}
function handleUpdate(i){ 
         updateWord((prev)=> prev + letters[i])
  
}

useEffect(()=>{
        checkWord(word)

}, [word])
  console.log(guessed)

  return (
    <div className='flex flex-col justify-center items-center gap-4'>
    <div className='flex p-2 gap-2 justify-center' >
      {letters.map((letter, i) => 
      <div className='py-2 px-4 cursor-pointer bg-emerald-300 flex gap-2 justify-center' onClick={()=> handleUpdate(i)}>
        <p>{letter}</p>
      </div>)}
    </div>

       <p className='text-4xl'>{word}</p>
       {finalWord && <p>Well done! Keep going...</p>}
       <div className='flex px-8 flex-col self-start'>
        <p>Guesses words:</p>
        {guessed.map(word=> <p>{word}</p>)}
       </div>
    </div>
  );
}

export default Practice;
