import axios from "axios";
import {decode} from "../transaction";
import moment from 'moment';

export async function getData(web, pk) {
    let data = [];
    let pages = 0;
    let per_page = 30;
    await axios.get(web + "/tx_search?query=%22account=%27" + pk + "%27%22")
        .then(res => {
            if(res.data.result.total_count === 0) return "Not exist";
            pages = Math.floor(res.data.result.total_count / 30);
            if (res.data.result.total_count % 30 > 0) pages = pages + 1;
        });
    for (let k = 1 ; k <= pages; k++) {
        await axios.get(web + "/tx_search?query=%22account=%27" + pk + "%27%22&page=" + k)
            .then(res => {
                data = data.concat(res.data.result.txs);
            });
    }
    return data;
}

export async function getName(web, pk) {
    let name = "No Name";
    let pages = 0;
    let per_page = 30;
    await axios.get(web + "/tx_search?query=%22account=%27" + pk + "%27%22")
        .then(res => {
            pages = Math.floor(res.data.result.total_count / 30);
            if (res.data.result.total_count % 30 > 0) pages = pages + 1;
        });
    for (let k = pages; k >= 1; k--) {
        await axios.get(web + "/tx_search?query=%22account=%27" + pk + "%27%22&page=" + k)
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

export async function convertName(pk, list_pk,  list_name, user_name) {
    if(list_pk !== null) {
        for(let i=0; i<list_pk.addresses.length; i++) {
            if(pk === list_pk.addresses[i]) {
                return list_name[i];
            }
        }
    }
    return user_name
}

export async function getTime(web, height) {
    let time = null;
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

// async function FindFollowingInfors (website, tx)  {
//     var numOfFollower = await tx.params.value.addresses.length;
//     let arrayUser = [];
//     for(let i = 0 ; i < numOfFollower; i++ ){
//         let temp = [];
//         console.log(tx.params.value.addresses[i]);
//         let result = await getData(website, tx.params.value.addresses[i]);
//         result.map(dt => {
//             let tx = Buffer(dt.tx, 'base64');
//             try {
//                 tx = decode(tx);
//                 temp.push(tx);
//             }
//             catch (err) {
//                 console.log(err);
//             }
//         })
//         let username;
//         let picture;
//         console.log(temp);
//         temp.map( ts =>{
//             if(ts.operation === 'update_account' && ts.params.key ==="name" ){
//                 console.log(ts);
//               username =  ts.params.value;
//             }
//             if(ts.operation === 'update_account' && ts.params.key === 'picture') {
                
//                 picture = ts.params.value;
//             }
//         })
//        arrayUser.push({username, picture});
//     }
//    return arrayUser;

// }
export async function FindFollowingInfor(website, tx) {
    var numOfFollower = await tx.params.value.addresses.length;
    if(numOfFollower > 1) {
        let arrayUser = [];
        for(let i = 0 ; i < numOfFollower; i++ ){
            let temp = [];
            let result = await getData(website, tx.params.value.addresses[i]);
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
            let picture;
            var address;
            temp.map( ts =>{
                if(ts.operation === 'update_account' && ts.params.key ==="name" ){
                    username =  ts.params.value;
                }
                if(ts.operation === 'update_account' && ts.params.key === 'picture') {

                    picture = ts.params.value;
                }

            })
            address = temp[0].account;
            if(username === undefined) {
                username = address;
            }

            arrayUser.push({username, picture});
        }

        return arrayUser;

    } else {

        let temp = [];
        let result = await getData(website, tx.params.value.addresses[0]);
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
        let picture;
        temp.map( ts =>{
            if(ts.operation === 'update_account' && ts.params.key ==="name" ){
                console.log(ts);
                username =  ts.params.value;
            }
            if(ts.operation === 'update_account' && ts.params.key === 'picture') {

                picture = ts.params.value;
            }
        })

        return {
            username,
            picture
        };
    }


}

export const getArrayLength = (arr) =>  {
    let count = 0;
    arr.map(element => {
        if(element !== undefined) {
            count ++;
        }
    })
    return count;
}
//remove duplicate following.
export const  removeDuplicate = (array) => {
    let set = new Set();
    let unique = []
    array.map((v, index) => {
        console.log(v);
        if(set.has(v.username) || v.username === undefined) {
            return false;
        } else {
            set.add(v.username);
            unique.push(v);
        }
    })
    return unique;
}

export const removeDuplicateFollower = (array) => {
    let set = new Set();
    let unique = []
    array.map((v, index) => {
        console.log(v);
        if(set.has(v)){
            return false;
        } else {
            set.add(v);
            unique.push(v);
        }
    })
    return unique;
}

export async function getFollower(website, motherAddress, currentUserAddress) {
    //get all mother transaction.
    let data = await getData(website, motherAddress);
    var allAccount = [];
    for(let i=0; i<data.length; i++) {
        let tx = Buffer(data[i].tx, "base64");
        try {
            tx = decode(tx);
            if(tx.account === motherAddress) {
                allAccount.push(tx);
            }
        }
        catch(error) {
            continue;
        }
    }

    //get all account created account by mother account
    let allUserAccout = [];
    allAccount.map(tx => {
        if(tx.operation === 'create_account') {
            allUserAccout.push(tx.params.address);
        }
    })
    //with each accout read and decode all transaction for each account.
    let allAccountTx = []

    for(let i = 0 ; i < allUserAccout.length; i ++) {
        let result = await getData(website, allUserAccout[i]);
        allAccountTx.push(result)
    }
    var followMethod = [];
    for(let i = 0 ; i < allAccountTx.length; i++) {
        allAccountTx[i].map(tx => {
            let txs = Buffer(tx.tx, "base64");
            try {
                txs = decode(txs);
                if(txs.operation === 'update_account' && txs.params.key === 'followings'){
                    let address = txs.account;
                    let followingAddess = txs.params.value.addresses
                    let obj = {
                        address,
                        followingAddess
                    }
                    followMethod.push(obj)
                }
            }
            catch(error) {
                console.log(error);;
            }
        })
    }
    console.log(currentUserAddress);
    let followingAddress = [];
    followMethod.map(tx => {
        tx.followingAddess.map(address => {

            if(address === currentUserAddress){
                console.log(true);
                followingAddress.push(tx.address)

            }
        })
    })
    return followingAddress;
}

export async function FindFollowerInfor(website, address) {
        let temp = [];
        let result = await getData(website, address);
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
        let picture;
        let addresss;
        temp.map( ts =>{
            if(ts.operation === 'update_account' && ts.params.key ==="name" ){
              username =  ts.params.value;
            }
            if(ts.operation === 'update_account' && ts.params.key === 'picture') {
                
                picture = ts.params.value;
            }
            addresss = ts.account;
        })
        if(username === undefined) {
            username =  addresss;
        }
         
        return {
            username,
            picture
        };
}  