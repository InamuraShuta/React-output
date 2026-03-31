import type { TimeEntry } from './Outputmain';

//親から渡されるProps全体の型を定義
interface OutputdeletedisplayProps{
    //TimeEntryの配列であることを示す
    deletelist:TimeEntry[]
    //引数に数値を取り、文字列を返す関数
    formatTime:(time:number)=>string
}

export default function Outputdeletedisplay({deletelist,formatTime}:OutputdeletedisplayProps){
    const dislist = deletelist.map((item) =>{
        if (item.delete===true){
            return <li key={item.id}>{formatTime(item.time)} ({item.userName})</li>
        }
    })
    return (
    <>
     <ul>{dislist}</ul>
    </>
    );
}