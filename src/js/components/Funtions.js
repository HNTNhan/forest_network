import axios from "axios";
import {decode} from "../transaction";
import moment from 'moment';

export async function getData(web, pk) {
    let data = [];
    let pages = 0;
    let per_page = 100;
    await axios.get(web + "/tx_search?query=%22account=%27" + pk + "%27%22")
        .then(res => {
            if(res.data.result.total_count === 0) return "Not exist";
            pages = Math.floor(res.data.result.total_count / 100);
            if (res.data.result.total_count % 100 > 0) pages = pages + 1;
        });
    for (let k = 1 ; k <= pages; k++) {
        await axios.get(web + "/tx_search?query=%22account=%27" + pk + "%27%22&per_page=100&page=" + k)
            .then(res => {
                data = data.concat(res.data.result.txs);
            });
    }
    return data;
}

export async function getName(web, pk) {
    let name = "No Name";
    let pages = 0;
    let per_page = 100;
    await axios.get(web + "/tx_search?query=%22account=%27" + pk + "%27%22")
        .then(res => {
            pages = Math.floor(res.data.result.total_count / 100);
            if (res.data.result.total_count % 100 > 0) pages = pages + 1;
        });
    for (let k = pages; k >= 1; k--) {
        await axios.get(web + "/tx_search?query=%22account=%27" + pk + "%27%22&per_page=100&page=" + k)
            .then(res => {
                for(let i=res.data.result.txs.length-1; i>=0; i--) {
                    let tx = Buffer.from(res.data.result.txs[i].tx, "base64");
                    try {
                        tx = decode(tx);
                    }
                    catch(error) {
                        continue;
                    }
                    if(tx.operation === "update_account" && tx.params.key === "name") {
                        name = tx.params.value;
                        break;
                    }
                }
            });
        if(name !== "No Name") break;
    }
    return name;
}

export async function convertName(pk, list_pk,  list_name, user_name, user_pk) {
    if(list_pk !== null) {
        for(let i=0; i<list_pk.addresses.length; i++) {
            if(pk === list_pk.addresses[i]) {
                return list_name[i];
            }
        }
    }
    if(pk !== user_pk) return pk;
    return user_name
}

export async function getTime(web, height) {
    let time = "No Name";
    await axios.get(web + "/commit?height=" + height)
        .then(res => {
            time = res.data.result.signed_header.header.time;
        });

    time = new Date(time);
    //time = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(time);
    return time;
}

export async function getLatestBlockTime(web) {
    await axios.get(web + "/status")
        .then(res => {
            return res.data.result.sync_info.latest_block_time;
        });
}

export async function getEnergy(balance, bandwidthTime, bandwidth, txSize, currentBlockTime) {
    const BANDWIDTH_PERIOD = 86400; // chu kỳ biến đổi
    const MAX_BLOCK_SIZE = 22020096; // kích thước block tối đa
    const RESERVE_RATIO = 1; // hệ số dự trữ
    const MAX_CELLULOSE = Number.MAX_SAFE_INTEGER; //9007199254740991 số cel tối đa

    // năng lượng hệ thống (1.902.536.294.400)
    const NETWORK_BANDWIDTH = RESERVE_RATIO * MAX_BLOCK_SIZE * BANDWIDTH_PERIOD;

    // năng lượng tài khoản tối đa (52805.9266) balance = 249999700
    const bandwidthLimit = balance / MAX_CELLULOSE * NETWORK_BANDWIDTH;

    // tính khoảng thời gian giữa 2 lần giao dịch
    const diff = bandwidthTime
        ? moment(currentBlockTime).unix() - moment(bandwidthTime).unix()
        : BANDWIDTH_PERIOD;

    // năng lượng đã sử dụng trong chu kỳ biến đổi
    bandwidth = Math.ceil(Math.max(0, (BANDWIDTH_PERIOD - diff) / BANDWIDTH_PERIOD) * bandwidth + txSize);

    return { energy: (bandwidthLimit-bandwidth).toFixed(0), bandwidth: bandwidth};
}

export async function FindFollowerInfor(tx) {
    let url = 'https://komodo.forest.network/';
    let temp = [];
    let result = await getData(url, tx.params.value.addresses[0]);
    result.map(dt => {
        let tx = Buffer(dt.tx, 'base64');
        try {
            tx = decode(tx);
            temp.push(tx);
        }
        catch (err) {
            console.log(err);
        }
    })
    let username;
    temp.map( ts =>{
        if(ts.operation === 'update_account' && ts.params.key ==="name" ){
          username =  ts.params.value;
        }
    })
    return username;
    
    
}  