import { render, screen,within ,fireEvent,act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Outputdeletedisplay from './outputdeletedisplay'
import type { TimeEntry } from './Outputmain'

describe('outputdeletedisplay', () => {

    // テスト用のダミーデータを作成
    const mockList: TimeEntry[] = [
        {
            id: '1',
            time: 5,
            userName: 'ユーザー1',
            check: false,
            delete: true
        },
        {
            id: '2',
            time: 6,
            userName: 'ユーザー2',
            check: true,
            delete: false
        }
    ]

    //ダミーのformatTime関数
    const mockFormatTime = (time: number) => `${time}秒`

    it('#22:出退勤記録が表示されているか',async()=>{
        render(
            <Outputdeletedisplay
                deletelist={mockList}
                formatTime={mockFormatTime}
            />
        )

        //mockFormatTimeが返した文字列が画面に存在するか
        expect(screen.getByText('5秒 (ユーザー1)')).toBeInTheDocument()
    })
})