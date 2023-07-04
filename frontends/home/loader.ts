export const loader = function () {

    new EventSource('/api/events/coinCourse').addEventListener('message', ({ data }) => {
        console.log('=8dafac=', data)
        let ttt = JSON.parse(data)
        console.log('=8cc75a=', ttt)
        this.Static.text = ttt.t1
        this.init()
    })

    this.Static.text = "Framework CemJS";
}