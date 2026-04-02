import { useState } from "react"
import './style.css';
import Clock from "./Clock"
import Outputdisplay from './outputdisplay';
import Outputdeletedisplay from './outputdeletedisplay';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
//プルダウン機能
import { Select, type SelectChangeEvent } from '@mui/material';

//サインアウトようimport
import { useAuthenticator} from "@aws-amplify/ui-react";

//データの形を定義（複数のコンポーネントで使うためexport推奨）
export interface TimeEntry {
  id: string
  time: number
  userName: string
  check:boolean
  delete:boolean
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tab${index}`}
      aria-labelledby={`tab${index}`}
      {...other}
    >
      {value === index && <Box className="tab-panel-padding">{children}</Box>}
    </div>
  );
}

export default function Outputmain(){

    const [stime,setStime] = useState<string>('')
    const [shtime,setSHtime]= useState<number>(0)
    const [gtime,setGtime] = useState<string>('')
    const [gtflg,setGtflg] = useState(false)
    const [nonamemess,setNonamemess] = useState('')
    //課題で追加
    const [totallist,setTotallist] = useState<TimeEntry[]>([])
    const [disch,setDisch] = useState(false)

    //サインアウト用
    const {signOut} = useAuthenticator()

    //ユーザー取得
    const [users,setUsers] = useState<string[]>([])

    const fetchusers = async () => {
      const userresponse = await fetch('https://6ub4o9npq3.execute-api.ap-northeast-1.amazonaws.com/testuserget/user')
      const userdata = await userresponse.json()
      setUsers(userdata)
    }


    // 秒数を「〇時間〇分〇秒」に変換する関数
    const formatTime = (seconds:number) => {
      if (seconds === null || seconds === undefined) return "";
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;

      // 0の時間や分を表示したくない場合は条件分岐を加えます
      return `${h > 0 ? h + "時間" : ""}${m > 0 ? m + "分" : ""}${s}秒`;
    };

    //出勤ボタン押下時の処理
    const startTime =()=>{
      const now = Date.now()
      setStime(new Date().toLocaleTimeString())
      setSHtime(now)
      setGtflg(true)

      if (gtime){
        setGtime('')
      }
    }

    //退勤ボタン押下時の処理
    const goalTime =()=>{
      const now = Date.now()
      setGtime(new Date().toLocaleTimeString())
      const diffSec = Math.floor((now-shtime) / 1000)
      setGtflg(false)

      const newEntry:TimeEntry = {
        id: crypto.randomUUID(), // ユニークなIDを生成
        time: diffSec,
        userName: userLabels[Number(userId)],
        check:false,
        delete:false
      };
      addTotal(newEntry)
    }

    //退勤ボタン押下時に実行される出退勤履歴のリストへのリスト新規追加処理
    const addTotal = (newTotal:TimeEntry) => {
      setTotallist([...totallist,newTotal])
    }

    //削除ボタン押下時の処理
    const deletedata = (id:string) =>{
        const newlist = totallist.map((item)=>{
            if(item.id===id){
                const newdata = {...item}
                newdata.delete=true
                return newdata
            }
            return item
        })
        setTotallist(newlist)
    }

    //指定したIDの真偽値のみを変更するための処理。前の状態をコピーすることで実現している
    const onCheck = (id:string) => {
        const newlist = totallist.map((item)=>{
            if(item.id===id){
                const newdata = {...item}
                newdata.check=!item.check
                return newdata
            }
            return item
        })
        setTotallist(newlist)
    };

    const [value, setValue] = useState(0);

    //タブ機能実装のため（出退勤リストと削除リストの切り替え）
    const tabChange  = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    // const [name, setName] = useState<string>('');
    const [userId, setUserId] = useState<string>("");

    //プルダウン機能実装のため
    const pullChange = (event: SelectChangeEvent<string>) => {
        setUserId(event.target.value)
    }

    //オブジェクトの型を簡単に作るためのテンプレート
    const userLabels: Record<number, string> = {
    1: "ユーザー1",
    2: "ユーザー2",
    3: "ユーザー3"
};

    //ユーザー未選択時に出勤が押されないようにしている
    const startdis = ()=>{

      const noname = () =>{
        setNonamemess('ユーザーを選択してください')
      }

      if (!userLabels[Number(userId)]){
        return (
          <>
          <div>
            <button onClick={noname}>出勤</button>
            <span>{nonamemess}</span>
          </div>
          <div>
            <button disabled={!gtflg} onClick={goalTime}>退勤</button>
            <span>{gtime}</span>
          </div>
          </>
        )
      }else{
        return (
          <>
          <div>
            <button onClick={startTime}>出勤</button>
            <span>{stime}</span>
          </div>
          <div>
            <button disabled={!gtflg} onClick={goalTime}>退勤</button>
            <span>{gtime}</span>
          </div>
          </>
        )
      }
    }

    return(
      <>
        <div>
          {/* <span>ログインユーザー: {user?.signInDetails?.loginId}</span> */}
          <button onClick={signOut}>
            サインアウト
          </button>
        </div>
        <h2 data-testid="title">出退勤アプリ（テスト）</h2>

          <Box className="main-user-select-container">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">ユーザー選択</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={userId}
                  label="Name"
                  onChange={pullChange}
                  onOpen={fetchusers}
                >
                {users.map((name,index) => (
                  <MenuItem key={index} value={name}>{name}</MenuItem>
                ))}
                {/* <MenuItem value={1}>{userLabels[1]}</MenuItem>
                <MenuItem value={2}>{userLabels[2]}</MenuItem>
                <MenuItem value={3}>{userLabels[3]}</MenuItem> */}
              </Select>
            </FormControl>
          </Box>

          <Clock />

          <div>
            {startdis()}
          </div>

          <br/>

          <Box>
          <Box className="main-tabs-border">
            <Tabs value={value} onChange={tabChange} aria-label="basic tabs example">
              <Tab label="出退勤リスト表示" id='tab0'/>
              <Tab label="出退勤削除リスト表示" id='tab1'/>
            </Tabs>
          </Box>

          <CustomTabPanel value={value} index={0}>
            <Outputdisplay list={totallist} formatTime={formatTime} deletedata={deletedata} onCheck={onCheck} UserName={userLabels[Number(userId)]} disch={disch} setD={setDisch}/>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Outputdeletedisplay deletelist={totallist} formatTime={formatTime}/>
          </CustomTabPanel>
          </Box>
      </>
    )
}