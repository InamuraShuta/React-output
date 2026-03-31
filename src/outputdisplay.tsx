// MUIのコンポーネントをインポート
import './style.css'
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box'
import type { TimeEntry } from './Outputmain';

interface OutputdisplayProps{
    list:TimeEntry[]
    formatTime:(time:number)=>string
    deletedata:(id:string)=>void
    onCheck:(id:string)=>void
    UserName: string
    disch:boolean
    setD:(c:boolean)=>void
}

export default function Outputdisplay({list,formatTime,deletedata,onCheck,UserName,disch,setD}:OutputdisplayProps){

    const display = (displaykey:boolean) =>{
        if (displaykey===false){
            const activeList = list.filter(item => !item.delete);
            return <ul className="output-list">{dislist(activeList)}</ul>
        }else{
            const importantList = list.filter(item => item.check && !item.delete);
            return <ul className="output-list">{dislist(importantList)}</ul>
        }
    }

    const dislist = (tlist:TimeEntry[])=>{
        const ddlist = tlist.map((item) => {

        const ischecked = item.check
        const namecheck = UserName === item.userName

        return (
        <li key={item.id} className="output-list-item">
            <div>
                <Checkbox
                  checked={ischecked}
                  onChange={()=>onCheck(item.id)}
                  className="output-checkbox"
                />
            </div>
            <Box className={`output-icon-box ${item.time <= 5}`}>
            {item.time <= 5 && (
                <ReportProblemIcon
                    color="warning"
                    data-testid="warningicon"
                />
            )}
            </Box>
            <Box className={`output-text-box ${ischecked ? 'checked' : 'normal'}`}>
                        {formatTime(item.time)} ({item.userName})
            </Box>

            <div className="output-delete-btn-wrapper">
            <IconButton
              aria-label="deletedata"
              onClick={()=>deletedata(item.id)}
              disabled={!namecheck}
            >
                <DeleteIcon data-testid="deleteicon"/>
            </IconButton>
            </div>
        </li>
      )
    })
    return (
        <div>{ddlist}</div>
    )
}
    return (
        <>
        <FormGroup>
            <FormControlLabel control={<Checkbox checked={disch} onChange={()=>setD(!disch)}/>} label="重要出退勤記録のみ表示" />
        </FormGroup>
        <div>{display(disch)}</div>
        </>
    );
}